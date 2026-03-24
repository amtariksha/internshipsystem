import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { getSupabase } from "@/lib/db/supabase";
import { computeAiCollabScore } from "@/lib/assessment/ai-collab-scorer";
import { buildSessionScoringPrompt } from "@/lib/ai/prompts/ai-collab-session-scorer";
import { sessionScoringSchema } from "@/lib/ai/schemas/ai-collab-scoring";
import { MODEL } from "@/lib/ai/client";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await req.json();
  const sb = getSupabase();

  // Get session
  const { data: session } = await sb
    .from("ai_collab_sessions")
    .select("id, user_id, challenge_id, locale, total_prompts, started_at, completed_at, status")
    .eq("id", sessionId)
    .single();

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  // Verify ownership
  const { data: user } = await sb.from("users").select("id").eq("clerk_id", clerkId).single();
  if (!user || user.id !== session.user_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Mark as completed if not already
  if (session.status === "IN_PROGRESS") {
    await sb
      .from("ai_collab_sessions")
      .update({ status: "COMPLETED", completed_at: new Date().toISOString() })
      .eq("id", sessionId);
  }

  // Check existing score
  const { data: existingScore } = await sb
    .from("ai_collab_scores")
    .select("*")
    .eq("session_id", sessionId)
    .single();

  if (existingScore) {
    return NextResponse.json(existingScore);
  }

  // Get challenge
  const { data: challenge } = await sb
    .from("ai_challenges")
    .select("title, description_en, expected_output_criteria")
    .eq("id", session.challenge_id)
    .single();

  // Get all messages
  const { data: messages } = await sb
    .from("ai_collab_messages")
    .select("role, content, prompt_complexity")
    .eq("session_id", sessionId)
    .order("position");

  const durationMinutes = session.completed_at
    ? Math.ceil((new Date(session.completed_at).getTime() - new Date(session.started_at).getTime()) / 60000)
    : 0;

  // AI scoring
  let scoring;
  try {
    const result = await generateText({
      model: MODEL,
      output: Output.object({ schema: sessionScoringSchema }),
      prompt: buildSessionScoringPrompt({
        challengeTitle: challenge?.title ?? "",
        challengeDescription: challenge?.description_en ?? "",
        expectedCriteria: (challenge?.expected_output_criteria as string[]) ?? [],
        messages: (messages ?? []).map((m) => ({
          role: m.role,
          content: m.content,
          promptComplexity: m.prompt_complexity ?? undefined,
        })),
        totalPrompts: session.total_prompts,
        durationMinutes,
        locale: session.locale,
      }),
    });
    scoring = result.output;
  } catch (e) {
    console.error("AI collab scoring failed:", e);
    // Fallback scores
    scoring = {
      ai_decomposition: { score: 2.5, reason: "Unable to evaluate" },
      ai_first_principles: { score: 2.5, reason: "Unable to evaluate" },
      ai_debugging: { score: 2.5, reason: "Unable to evaluate" },
      ai_communication: { score: 2.5, reason: "Unable to evaluate" },
      ai_efficiency: { score: 2.5, reason: "Unable to evaluate" },
      ai_quality: { score: 2.5, reason: "Unable to evaluate" },
      ai_iteration: { score: 2.5, reason: "Unable to evaluate" },
      ai_creativity: { score: 2.5, reason: "Unable to evaluate" },
      summary: "Scoring was unavailable. Default scores applied.",
      strengths: [],
      improvements: [],
    };
  }

  if (!scoring) {
    return NextResponse.json({ error: "Scoring failed" }, { status: 500 });
  }

  const dimensionScores = {
    ai_decomposition: scoring.ai_decomposition.score,
    ai_first_principles: scoring.ai_first_principles.score,
    ai_debugging: scoring.ai_debugging.score,
    ai_communication: scoring.ai_communication.score,
    ai_efficiency: scoring.ai_efficiency.score,
    ai_quality: scoring.ai_quality.score,
    ai_iteration: scoring.ai_iteration.score,
    ai_creativity: scoring.ai_creativity.score,
  };

  const scoreResult = computeAiCollabScore(dimensionScores);

  // Save score
  const { data: savedScore } = await sb
    .from("ai_collab_scores")
    .insert({
      session_id: sessionId,
      challenge_id: session.challenge_id,
      ...dimensionScores,
      decomposition_score: dimensionScores.ai_decomposition,
      first_principles_score: dimensionScores.ai_first_principles,
      debugging_score: dimensionScores.ai_debugging,
      communication_score: dimensionScores.ai_communication,
      efficiency_score: dimensionScores.ai_efficiency,
      quality_score: dimensionScores.ai_quality,
      iteration_score: dimensionScores.ai_iteration,
      creativity_score: dimensionScores.ai_creativity,
      composite_score: scoreResult.compositeScore,
      proficiency_level: scoreResult.proficiencyLevel,
      ai_analysis: scoring,
    })
    .select("*")
    .single();

  return NextResponse.json(savedScore);
}
