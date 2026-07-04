import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { getSupabase } from "@/lib/db/supabase";
import { computeResponseConfidence } from "@/lib/assessment/confidence";
import { runLlmFingerprint } from "@/lib/assessment/fingerprint";
import { buildFollowUpPrompt } from "@/lib/ai/prompts/follow-up";
import { buildScoringPrompt } from "@/lib/ai/prompts/scoring";
import { freeTextScoringSchema } from "@/lib/ai/schemas/scoring";
import { MODEL } from "@/lib/ai/client";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { assessmentRespondSchema } from "@/lib/validation/api-schemas";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success: withinLimit } = await checkRateLimit(`resp:${clerkId}`, 20, 60);
  if (!withinLimit) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const rawBody = await req.json();
  const parsed = assessmentRespondSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const {
    sessionId, sessionQuestionId, selectedOption, freeText,
    startedAt, completedAt, tabSwitchDelta, copyPasteDelta,
  } = parsed.data;

  const sb = getSupabase();

  // Validate session
  const { data: sessions } = await sb.rpc("validate_session", {
    p_session_id: sessionId,
    p_clerk_id: clerkId,
    p_status: "IN_PROGRESS",
  });

  if (!sessions || sessions.length === 0) {
    return NextResponse.json({ error: "Invalid session" }, { status: 404 });
  }
  const locale = sessions[0].locale;

  // Get session question with dimension info
  const { data: sqRows } = await sb.rpc("get_session_question_detail", {
    p_session_question_id: sessionQuestionId,
    p_session_id: sessionId,
  });

  if (!sqRows || sqRows.length === 0) {
    return NextResponse.json({ error: "Invalid question" }, { status: 404 });
  }
  const sq = sqRows[0];
  const durationMs = new Date(completedAt).getTime() - new Date(startedAt).getTime();

  // Update anti-cheat counters
  if (tabSwitchDelta > 0 || copyPasteDelta > 0) {
    await sb.rpc("increment_anti_cheat", {
      p_session_id: sessionId,
      p_tab_delta: tabSwitchDelta,
      p_paste_delta: copyPasteDelta,
    });
  }

  let sjtScore: number | null = null;
  let aiAnalysis: object | null = null;
  let aiScore: number | null = null;
  let aiScoringFailed = false;

  const isNoneOfAbove = sq.type === "SJT" && selectedOption === 0 && freeText;

  // RAPID_FIRE anti-cheat: a synthetic, mid-session gut-response question that
  // clones an SJT's content. Its ONLY signal is response *speed*, so it is
  // deliberately EXCLUDED from dimension scoring (lower-risk choice: it cannot
  // corrupt a dimension's score the way an SJT weight lookup would). We record
  // the response for timing only. An implausibly slow answer (> 30s) is a weak
  // authenticity signal and is recorded via the existing flag_reasons pattern.
  const RAPID_FIRE_SLOW_MS = 30_000;
  if (sq.type === "RAPID_FIRE") {
    if (durationMs > RAPID_FIRE_SLOW_MS) {
      await sb
        .from("assessment_sessions")
        .update({
          flagged: true,
          flag_reasons: { rapid_fire_slow: true, rapid_fire_ms: durationMs },
        })
        .eq("id", sessionId);
    }
  } else if (sq.type === "SJT" && selectedOption != null && selectedOption > 0) {
    // Standard SJT option — score from pre-defined weights
    const { data: weights } = await sb
      .from("question_options")
      .select("weights")
      .eq("question_id", sq.question_id)
      .eq("position", selectedOption)
      .eq("locale", locale)
      .single();

    if (weights) {
      const w = weights.weights as Record<string, number>;
      sjtScore = w[sq.dim_code] ?? 0;
    }
  } else if (isNoneOfAbove) {
    // "None of the above" — score the free-text response using AI
    const { data: variant } = await sb
      .from("question_variants")
      .select("scenario")
      .eq("question_id", sq.question_id)
      .eq("locale", locale)
      .single();

    try {
      const scoringResult = await generateText({
        model: MODEL,
        output: Output.object({ schema: freeTextScoringSchema }),
        prompt: buildScoringPrompt({
          scenario: variant?.scenario ?? "",
          selectedOptionText: "[User chose 'None of the above' and provided their own response]",
          freeText,
          dimensionName: sq.dim_name,
          dimensionDescription: sq.dim_desc,
          locale,
        }),
      });
      if (scoringResult.output) {
        aiAnalysis = scoringResult.output;
        aiScore = scoringResult.output.score;
        // For "none of the above", use AI score as the SJT score (normalized to 1-5 scale)
        sjtScore = Math.max(1, Math.min(5, aiScore));
      }
    } catch (err) {
      console.error("[assessment/respond] AI scoring failed", { sessionId, sessionQuestionId, err });
      // Fallback: neutral score when AI scoring fails
      sjtScore = 2.5;
      aiScoringFailed = true;
    }
  } else if (sq.type === "AI_FOLLOWUP" && freeText) {
    const { data: variant } = await sb
      .from("question_variants")
      .select("scenario")
      .eq("question_id", sq.question_id)
      .eq("locale", locale)
      .single();

    try {
      const scoringResult = await generateText({
        model: MODEL,
        output: Output.object({ schema: freeTextScoringSchema }),
        prompt: buildScoringPrompt({
          scenario: variant?.scenario ?? "",
          selectedOptionText: "",
          freeText,
          dimensionName: sq.dim_name,
          dimensionDescription: sq.dim_desc,
          locale,
        }),
      });
      if (scoringResult.output) {
        aiAnalysis = scoringResult.output;
        aiScore = scoringResult.output.score;
      }
    } catch (err) {
      console.error("[assessment/respond] AI scoring failed", { sessionId, sessionQuestionId, err });
      aiScore = 2.5;
      aiScoringFailed = true;
    }

    // P1b: LLM Fingerprint check on free-text responses
    if (freeText && freeText.length > 30) {
      const fingerprint = await runLlmFingerprint({ freeText, locale });
      if (fingerprint?.isLikelyAI && fingerprint.confidence > 0.7) {
        // Penalize confidence for likely AI-generated responses
        aiAnalysis = { ...((aiAnalysis ?? {}) as Record<string, unknown>), llmFingerprint: fingerprint };
      }
    }
  }

  // RAPID_FIRE has no free-text branch in confidence scoring; treat it as SJT
  // (timing-only). computeResponseConfidence only special-cases AI_FOLLOWUP.
  const confidenceType: "SJT" | "AI_FOLLOWUP" =
    sq.type === "AI_FOLLOWUP" ? "AI_FOLLOWUP" : "SJT";
  let confidence = computeResponseConfidence({
    durationMs,
    type: confidenceType,
    freeTextLength: freeText?.length,
  });

  // Apply LLM fingerprint penalty
  const fp = (aiAnalysis as Record<string, unknown> | null)?.llmFingerprint as { isLikelyAI?: boolean; confidence?: number } | undefined;
  if (fp?.isLikelyAI && (fp.confidence ?? 0) > 0.7) {
    confidence = confidence * 0.5; // 50% penalty for likely AI-generated
    // Flag the session
    await sb
      .from("assessment_sessions")
      .update({ flagged: true, flag_reasons: { llm_detected: true, fp_confidence: fp.confidence } })
      .eq("id", sessionId);
  }

  // Save response
  const { error: insertErr } = await sb.from("responses").insert({
    session_id: sessionId,
    session_question_id: sessionQuestionId,
    selected_option: selectedOption ?? null,
    sjt_score: sjtScore,
    free_text: freeText ?? null,
    ai_analysis: aiAnalysis,
    ai_score: aiScore,
    started_at: startedAt,
    completed_at: completedAt,
    duration_ms: durationMs,
    confidence,
  });

  if (insertErr) {
    if (insertErr.code === "23505") {
      // Unique-constraint conflict — response already submitted for this question.
      return NextResponse.json(
        { error: "Response already submitted", duplicate: true },
        { status: 409 }
      );
    }
    console.error("[assessment/respond] response insert failed", { sessionId, sessionQuestionId, insertErr });
    return NextResponse.json({ error: "Failed to save response" }, { status: 500 });
  }

  // Get next question
  const nextPos = sq.position + 1;
  const { data: nextRows } = await sb.rpc("get_next_session_question", {
    p_session_id: sessionId,
    p_position: nextPos,
  });

  if (!nextRows || nextRows.length === 0) {
    await sb
      .from("assessment_sessions")
      .update({ status: "COMPLETED", completed_at: new Date().toISOString() })
      .eq("id", sessionId);
    return NextResponse.json({ complete: true, sessionId, aiScoringFailed });
  }

  const next = nextRows[0];

  if (next.type === "AI_FOLLOWUP") {
    const { data: variant } = await sb
      .from("question_variants")
      .select("scenario")
      .eq("question_id", next.question_id)
      .eq("locale", locale)
      .single();

    // Resolve the text describing the user's choice for the follow-up prompt.
    // selectedOption === 0 is "None of the above" (falsy but valid) — use their
    // free text. selectedOption > 0 looks up the chosen option's text.
    let selectedOptionText = "their choice";
    if (selectedOption === 0) {
      selectedOptionText = `[User chose 'None of the above' and wrote: ${freeText ?? ""}]`;
    } else if (selectedOption != null && selectedOption > 0) {
      const { data: optText } = await sb
        .from("question_options")
        .select("text")
        .eq("question_id", next.question_id)
        .eq("position", selectedOption)
        .eq("locale", locale)
        .single();
      selectedOptionText = optText?.text ?? "their choice";
    }

    try {
      const followUp = await generateText({
        model: MODEL,
        prompt: buildFollowUpPrompt({
          scenario: variant?.scenario ?? "",
          selectedOptionText,
          dimensionName: next.dim_name,
          dimensionDescription: next.dim_desc,
          locale,
        }),
      });

      await sb
        .from("session_questions")
        .update({ ai_prompt: followUp.text })
        .eq("id", next.sq_id);

      return NextResponse.json({
        complete: false,
        currentPosition: nextPos,
        aiScoringFailed,
        question: { id: next.sq_id, type: "AI_FOLLOWUP", aiPrompt: followUp.text, dimensionName: next.dim_name, timeGuideSeconds: 120 },
      });
    } catch {
      // Skip to next SJT on AI failure
      const { data: fallback } = await sb
        .from("session_questions")
        .select("id, position")
        .eq("session_id", sessionId)
        .gt("position", nextPos)
        .eq("type", "SJT")
        .order("position")
        .limit(1);

      if (!fallback || fallback.length === 0) {
        await sb
          .from("assessment_sessions")
          .update({ status: "COMPLETED", completed_at: new Date().toISOString() })
          .eq("id", sessionId);
        return NextResponse.json({ complete: true, sessionId, aiScoringFailed });
      }
      return NextResponse.json({ complete: false, currentPosition: fallback[0].position, aiScoringFailed, question: { id: fallback[0].id, type: "SJT", scenario: "", prompt: "", options: [], dimensionName: "", timeGuideSeconds: 90 } });
    }
  }

  // Next is SJT or RAPID_FIRE. RAPID_FIRE clones an SJT's content, so it is
  // delivered through the same variant/options lookup; only the type flag and
  // the (much shorter) time guide differ, which drives the countdown UI.
  const { data: nextVariant } = await sb
    .from("question_variants")
    .select("scenario, prompt")
    .eq("question_id", next.question_id)
    .eq("locale", locale)
    .single();

  const { data: nextOpts } = await sb
    .from("question_options")
    .select("position, text")
    .eq("question_id", next.question_id)
    .eq("locale", locale)
    .order("position");

  const isRapidFire = next.type === "RAPID_FIRE";

  return NextResponse.json({
    complete: false,
    currentPosition: nextPos,
    aiScoringFailed,
    question: {
      id: next.sq_id, type: isRapidFire ? "RAPID_FIRE" : "SJT",
      scenario: nextVariant?.scenario ?? "", prompt: nextVariant?.prompt ?? "",
      options: (nextOpts ?? []).map((o) => ({ position: o.position, text: o.text })),
      dimensionName: next.dim_name, timeGuideSeconds: isRapidFire ? 20 : 90,
    },
  });
}
