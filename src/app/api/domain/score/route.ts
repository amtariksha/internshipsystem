import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";
import { computeDomainScore } from "@/lib/assessment/domain-scorer";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await req.json();
  const sb = getSupabase();

  // Validate session
  const { data: session } = await sb
    .from("domain_sessions")
    .select("id, user_id, domain, ability_estimate, questions_answered, correct_count, status")
    .eq("id", sessionId)
    .eq("status", "COMPLETED")
    .single();

  if (!session) {
    return NextResponse.json({ error: "Session not found or not completed" }, { status: 404 });
  }

  // Verify ownership
  const { data: user } = await sb.from("users").select("id, backlog_count").eq("clerk_id", clerkId).single();
  if (!user || user.id !== session.user_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Check existing score
  const { data: existingScore } = await sb
    .from("domain_scores")
    .select("id, composite_score, proficiency_level")
    .eq("session_id", sessionId)
    .single();

  if (existingScore) {
    return NextResponse.json(existingScore);
  }

  // Get all responses
  const { data: responses } = await sb
    .from("domain_responses")
    .select("is_correct, difficulty, ai_followup_score")
    .eq("session_id", sessionId);

  const scoreResult = computeDomainScore(
    (responses ?? []).map((r) => ({
      isCorrect: r.is_correct ?? false,
      difficulty: r.difficulty,
      aiProbeScore: r.ai_followup_score,
    }))
  );

  // Save score
  const { data: savedScore } = await sb
    .from("domain_scores")
    .insert({
      session_id: sessionId,
      domain: session.domain,
      mcq_score: scoreResult.mcqScore,
      ai_probe_score: scoreResult.aiProbeScore,
      composite_score: scoreResult.compositeScore,
      proficiency_level: scoreResult.proficiencyLevel,
      ability_estimate: session.ability_estimate,
      questions_total: session.questions_answered,
      questions_correct: session.correct_count,
      backlog_count: user.backlog_count ?? 0,
    })
    .select("id, composite_score, proficiency_level, mcq_score, ai_probe_score, questions_total, questions_correct")
    .single();

  return NextResponse.json(savedScore);
}
