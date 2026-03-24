import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { getSupabase } from "@/lib/db/supabase";
import { updateAbilityEstimate, selectNextQuestion, thetaToDifficulty } from "@/lib/assessment/domain-engine";
import { buildDomainFollowUpPrompt } from "@/lib/ai/prompts/domain-followup";
import { buildDomainProbeScoringPrompt } from "@/lib/ai/prompts/domain-scoring";
import { domainProbeScoringSchema } from "@/lib/ai/schemas/domain-scoring";
import { MODEL } from "@/lib/ai/client";
import { DOMAIN_ASSESSMENT_CONFIG } from "@/lib/utils/domain-constants";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { sessionId, questionId, selectedOption, startedAt, completedAt, freeText } = body;

  const sb = getSupabase();

  // Validate session
  const { data: sessionRow } = await sb
    .from("domain_sessions")
    .select("id, user_id, domain, locale, ability_estimate, standard_error, questions_answered, correct_count, current_difficulty")
    .eq("id", sessionId)
    .eq("status", "IN_PROGRESS")
    .single();

  if (!sessionRow) {
    return NextResponse.json({ error: "Invalid session" }, { status: 404 });
  }

  // Verify user owns this session
  const { data: user } = await sb.from("users").select("id").eq("clerk_id", clerkId).single();
  if (!user || user.id !== sessionRow.user_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const durationMs = new Date(completedAt).getTime() - new Date(startedAt).getTime();
  const locale = sessionRow.locale;

  // Get question details
  const { data: question } = await sb
    .from("domain_questions")
    .select("id, domain, subdomain, difficulty")
    .eq("id", questionId)
    .single();

  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  // Check correctness
  const { data: correctOption } = await sb
    .from("domain_question_options")
    .select("position")
    .eq("question_id", questionId)
    .eq("locale", locale)
    .eq("is_correct", true)
    .single();

  const isCorrect = correctOption?.position === selectedOption;

  // Handle AI probe response (if this is a follow-up submission)
  if (freeText) {
    // This is a probe response — find the existing domain_response and update it
    const { data: existingResp } = await sb
      .from("domain_responses")
      .select("id, ai_followup_prompt")
      .eq("session_id", sessionId)
      .eq("question_id", questionId)
      .single();

    if (existingResp?.ai_followup_prompt) {
      // Get question text for scoring
      const { data: variant } = await sb
        .from("domain_question_variants")
        .select("question_text")
        .eq("question_id", questionId)
        .eq("locale", locale)
        .single();

      let aiScore: number | null = null;
      let aiAnalysis: object | null = null;

      try {
        const result = await generateText({
          model: MODEL,
          output: Output.object({ schema: domainProbeScoringSchema }),
          prompt: buildDomainProbeScoringPrompt({
            questionText: variant?.question_text ?? "",
            aiProbe: existingResp.ai_followup_prompt,
            studentResponse: freeText,
            domain: question.domain,
            subdomain: question.subdomain,
            locale,
          }),
        });
        if (result.output) {
          aiAnalysis = result.output;
          aiScore = result.output.score;
        }
      } catch {
        aiScore = 2.5;
      }

      await sb
        .from("domain_responses")
        .update({
          ai_followup_response: freeText,
          ai_followup_score: aiScore,
          ai_followup_analysis: aiAnalysis,
        })
        .eq("id", existingResp.id);
    }

    // Continue to next question (fall through below)
  } else {
    // This is an MCQ answer — record the response
    const position = sessionRow.questions_answered + 1;

    // Update IRT
    const { theta, se } = updateAbilityEstimate(
      sessionRow.ability_estimate,
      sessionRow.standard_error,
      question.difficulty,
      isCorrect
    );

    // Decide if AI probe needed
    const selection = selectNextQuestion(
      {
        questionsAnswered: sessionRow.questions_answered,
        abilityEstimate: sessionRow.ability_estimate,
        standardError: sessionRow.standard_error,
        currentDifficulty: sessionRow.current_difficulty,
      },
      isCorrect,
      question.difficulty
    );

    // Save response
    await sb.from("domain_responses").insert({
      session_id: sessionId,
      question_id: questionId,
      position,
      selected_option: selectedOption,
      is_correct: isCorrect,
      difficulty: question.difficulty,
      started_at: startedAt,
      completed_at: completedAt,
      duration_ms: durationMs,
    });

    // Update session state
    await sb
      .from("domain_sessions")
      .update({
        ability_estimate: theta,
        standard_error: se,
        questions_answered: position,
        correct_count: sessionRow.correct_count + (isCorrect ? 1 : 0),
        current_difficulty: thetaToDifficulty(theta),
        confidence_met: se < DOMAIN_ASSESSMENT_CONFIG.CONFIDENCE_THRESHOLD,
      })
      .eq("id", sessionId);

    // Generate AI probe if needed
    if (selection.shouldProbeWithAI) {
      const { data: variant } = await sb
        .from("domain_question_variants")
        .select("question_text")
        .eq("question_id", questionId)
        .eq("locale", locale)
        .single();

      const { data: selectedOpt } = await sb
        .from("domain_question_options")
        .select("text")
        .eq("question_id", questionId)
        .eq("position", selectedOption)
        .eq("locale", locale)
        .single();

      const { data: correctOpt } = await sb
        .from("domain_question_options")
        .select("text")
        .eq("question_id", questionId)
        .eq("position", correctOption?.position ?? 1)
        .eq("locale", locale)
        .single();

      try {
        const probe = await generateText({
          model: MODEL,
          prompt: buildDomainFollowUpPrompt({
            questionText: variant?.question_text ?? "",
            selectedAnswer: selectedOpt?.text ?? "",
            correctAnswer: correctOpt?.text ?? "",
            isCorrect,
            domain: question.domain,
            subdomain: question.subdomain,
            difficulty: question.difficulty,
            locale,
          }),
        });

        // Update response with probe
        await sb
          .from("domain_responses")
          .update({ ai_followup_prompt: probe.text })
          .eq("session_id", sessionId)
          .eq("question_id", questionId);

        return NextResponse.json({
          complete: false,
          isCorrect,
          needsProbe: true,
          aiPrompt: probe.text,
          questionId,
          timeGuideSeconds: DOMAIN_ASSESSMENT_CONFIG.AI_PROBE_TIME_GUIDE_SECONDS,
        });
      } catch {
        // AI failed — skip probe, continue to next question
      }
    }

    // Check if we should stop
    if (selection.shouldStop) {
      await sb
        .from("domain_sessions")
        .update({ status: "COMPLETED", completed_at: new Date().toISOString() })
        .eq("id", sessionId);

      return NextResponse.json({ complete: true, isCorrect, sessionId });
    }
  }

  // Fetch next question — get updated session state
  const { data: updatedSession } = await sb
    .from("domain_sessions")
    .select("ability_estimate, standard_error, questions_answered, current_difficulty")
    .eq("id", sessionId)
    .single();

  if (!updatedSession) {
    return NextResponse.json({ error: "Session state error" }, { status: 500 });
  }

  // Check stopping after probe
  if (
    updatedSession.questions_answered >= DOMAIN_ASSESSMENT_CONFIG.MAX_QUESTIONS ||
    (updatedSession.questions_answered >= DOMAIN_ASSESSMENT_CONFIG.MIN_QUESTIONS &&
      updatedSession.standard_error < DOMAIN_ASSESSMENT_CONFIG.CONFIDENCE_THRESHOLD)
  ) {
    await sb
      .from("domain_sessions")
      .update({ status: "COMPLETED", completed_at: new Date().toISOString() })
      .eq("id", sessionId);

    return NextResponse.json({ complete: true, sessionId });
  }

  // Get already-answered question IDs
  const { data: answered } = await sb
    .from("domain_responses")
    .select("question_id")
    .eq("session_id", sessionId);

  const excludeIds = (answered ?? []).map((r) => r.question_id);

  // Get next question at current difficulty
  let { data: nextQuestions } = await sb.rpc("get_domain_questions_by_difficulty", {
    p_domain: sessionRow.domain,
    p_difficulty: updatedSession.current_difficulty,
    p_locale: locale,
    p_exclude_ids: excludeIds,
  });

  // Try adjacent difficulties if none found
  if (!nextQuestions || nextQuestions.length === 0) {
    for (const offset of [1, -1, 2, -2]) {
      const tryDiff = Math.max(1, Math.min(5, updatedSession.current_difficulty + offset));
      const { data: fallback } = await sb.rpc("get_domain_questions_by_difficulty", {
        p_domain: sessionRow.domain,
        p_difficulty: tryDiff,
        p_locale: locale,
        p_exclude_ids: excludeIds,
      });
      if (fallback && fallback.length > 0) {
        nextQuestions = fallback;
        break;
      }
    }
  }

  if (!nextQuestions || nextQuestions.length === 0) {
    // No more questions — complete
    await sb
      .from("domain_sessions")
      .update({ status: "COMPLETED", completed_at: new Date().toISOString() })
      .eq("id", sessionId);

    return NextResponse.json({ complete: true, sessionId });
  }

  const nextQ = nextQuestions[0];
  const { data: nextOpts } = await sb
    .from("domain_question_options")
    .select("position, text")
    .eq("question_id", nextQ.question_id)
    .eq("locale", locale)
    .order("position");

  return NextResponse.json({
    complete: false,
    isCorrect: freeText ? undefined : isCorrect,
    needsProbe: false,
    currentPosition: updatedSession.questions_answered + 1,
    question: {
      id: nextQ.question_id,
      code: nextQ.code,
      text: nextQ.question_text,
      subdomain: nextQ.subdomain,
      difficulty: nextQ.difficulty,
      options: (nextOpts ?? []).map((o) => ({ position: o.position, text: o.text })),
      timeGuideSeconds: DOMAIN_ASSESSMENT_CONFIG.MCQ_TIME_GUIDE_SECONDS,
    },
  });
}
