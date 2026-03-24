import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { getSupabase } from "@/lib/db/supabase";
import { computeResponseConfidence } from "@/lib/assessment/confidence";
import { buildFollowUpPrompt } from "@/lib/ai/prompts/follow-up";
import { buildScoringPrompt } from "@/lib/ai/prompts/scoring";
import { freeTextScoringSchema } from "@/lib/ai/schemas/scoring";
import { MODEL } from "@/lib/ai/client";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    sessionId, sessionQuestionId, selectedOption, freeText,
    startedAt, completedAt, tabSwitchDelta = 0, copyPasteDelta = 0,
  } = body;

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

  if (sq.type === "SJT" && selectedOption != null) {
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
    } catch {
      aiScore = 2.5;
    }
  }

  const confidence = computeResponseConfidence({
    durationMs,
    type: sq.type as "SJT" | "AI_FOLLOWUP",
    freeTextLength: freeText?.length,
  });

  // Save response
  await sb.from("responses").insert({
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
    return NextResponse.json({ complete: true, sessionId });
  }

  const next = nextRows[0];

  if (next.type === "AI_FOLLOWUP") {
    const { data: variant } = await sb
      .from("question_variants")
      .select("scenario")
      .eq("question_id", next.question_id)
      .eq("locale", locale)
      .single();

    const { data: optText } = selectedOption ? await sb
      .from("question_options")
      .select("text")
      .eq("question_id", next.question_id)
      .eq("position", selectedOption)
      .eq("locale", locale)
      .single() : { data: null };

    try {
      const followUp = await generateText({
        model: MODEL,
        prompt: buildFollowUpPrompt({
          scenario: variant?.scenario ?? "",
          selectedOptionText: optText?.text ?? "their choice",
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
        return NextResponse.json({ complete: true, sessionId });
      }
      return NextResponse.json({ complete: false, currentPosition: fallback[0].position, question: { id: fallback[0].id, type: "SJT", scenario: "", prompt: "", options: [], dimensionName: "", timeGuideSeconds: 90 } });
    }
  }

  // Next is SJT
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

  return NextResponse.json({
    complete: false,
    currentPosition: nextPos,
    question: {
      id: next.sq_id, type: "SJT",
      scenario: nextVariant?.scenario ?? "", prompt: nextVariant?.prompt ?? "",
      options: (nextOpts ?? []).map((o) => ({ position: o.position, text: o.text })),
      dimensionName: next.dim_name, timeGuideSeconds: 90,
    },
  });
}
