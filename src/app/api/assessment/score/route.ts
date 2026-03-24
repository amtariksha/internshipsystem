import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { getSupabase } from "@/lib/db/supabase";
import { computeDimensionScore } from "@/lib/assessment/scorer";
import { classifyTiers } from "@/lib/assessment/tier-classifier";
import { buildReportPrompt } from "@/lib/ai/prompts/report";
import { reportNarrativeSchema } from "@/lib/ai/schemas/report";
import { MODEL } from "@/lib/ai/client";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await req.json();
  const sb = getSupabase();

  // Validate session
  const { data: sessions } = await sb.rpc("validate_session", {
    p_session_id: sessionId,
    p_clerk_id: clerkId,
    p_status: "COMPLETED",
  });

  if (!sessions || sessions.length === 0) {
    return NextResponse.json({ error: "Session not found or not completed" }, { status: 404 });
  }
  const session = sessions[0];

  // Check existing report
  const { data: existingReport } = await sb
    .from("reports")
    .select("slug")
    .eq("session_id", sessionId)
    .single();

  if (existingReport) {
    return NextResponse.json({ reportSlug: existingReport.slug });
  }

  // Get all responses with dimension info via RPC
  const { data: responses } = await sb.rpc("get_session_responses", {
    p_session_id: sessionId,
  });
  const allResponses = responses ?? [];

  // Get all dimensions
  const { data: dimensions } = await sb
    .from("dimensions")
    .select("id, code, name_key")
    .order("sort_order");

  // Compute per-dimension scores
  const dimScores: { dimId: string; dimCode: string; dimName: string; rawScore: number; confidence: number; normalized: number }[] = [];

  for (const dim of dimensions ?? []) {
    const dimResponses = allResponses.filter((r: { dim_id: string }) => r.dim_id === dim.id);
    const sjtScores = dimResponses
      .filter((r: { type: string; sjt_score: number | null }) => r.type === "SJT" && r.sjt_score != null)
      .map((r: { sjt_score: number; confidence: number }) => ({ score: r.sjt_score, confidence: r.confidence ?? 1 }));
    const aiScores = dimResponses
      .filter((r: { type: string; ai_score: number | null }) => r.type === "AI_FOLLOWUP" && r.ai_score != null)
      .map((r: { ai_score: number; confidence: number }) => ({ score: r.ai_score, confidence: r.confidence ?? 1 }));

    const computed = computeDimensionScore(sjtScores, aiScores);
    dimScores.push({ dimId: dim.id, dimCode: dim.code, dimName: dim.name_key, ...computed });
  }

  // Save dimension scores (upsert)
  for (const ds of dimScores) {
    await sb
      .from("dimension_scores")
      .upsert(
        { session_id: sessionId, dimension_id: ds.dimId, raw_score: ds.rawScore, confidence: ds.confidence, normalized: ds.normalized },
        { onConflict: "session_id,dimension_id" }
      );
  }

  // Classify tiers
  const tierResult = classifyTiers(
    dimScores.map((ds) => ({ dimensionCode: ds.dimCode, normalized: ds.normalized })),
    session.weight_profile as "STARTUP_FOUNDER" | "GENERAL_EMPLOYABILITY"
  );

  // Generate AI narrative
  let narrative = { summary: "Report generated.", strengths: [] as string[], growthAreas: [] as string[], careerPaths: [] as { path: string; fit: number; reasoning: string }[], personalitySnapshot: "" };

  try {
    const result = await generateText({
      model: MODEL,
      output: Output.object({ schema: reportNarrativeSchema }),
      prompt: buildReportPrompt({
        dimensionScores: dimScores.map((ds) => ({ name: ds.dimName, normalized: ds.normalized, confidence: ds.confidence })),
        compositeScore: tierResult.compositeScore,
        tierStartup: tierResult.startup, tierTech: tierResult.tech,
        tierConsultant: tierResult.consultant, tierTeam: tierResult.team,
        commitmentFlag: tierResult.commitmentFlag,
        locale: session.locale, userAge: session.user_age,
      }),
    });
    if (result.output) narrative = result.output;
  } catch (e) {
    console.error("Report narrative failed:", e);
  }

  // Compute integrity
  let integrityScore = 1.0;
  if (session.tab_switch_count > 5) integrityScore -= 0.3;
  else if (session.tab_switch_count > 2) integrityScore -= 0.15;
  if (session.copy_paste_count > 0) integrityScore -= 0.2;
  const avgConf = allResponses.length > 0
    ? allResponses.reduce((s: number, r: { confidence: number }) => s + (r.confidence ?? 1), 0) / allResponses.length
    : 1;
  integrityScore = Math.max(0, Math.min(1, integrityScore * avgConf));

  await sb
    .from("assessment_sessions")
    .update({ integrity_score: integrityScore, flagged: integrityScore < 0.5 })
    .eq("id", sessionId);

  // Create report
  const { data: report } = await sb
    .from("reports")
    .insert({
      session_id: sessionId,
      composite_score: tierResult.compositeScore,
      tier_startup: tierResult.startup,
      tier_tech: tierResult.tech,
      tier_consultant: tierResult.consultant,
      tier_team: tierResult.team,
      commitment_flag: tierResult.commitmentFlag,
      narrative,
      locale: session.locale,
    })
    .select("slug")
    .single();

  return NextResponse.json({ reportSlug: report?.slug });
}
