import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { getSupabase } from "@/lib/db/supabase";
import { computeDimensionScore } from "@/lib/assessment/scorer";
import { classifyTiers } from "@/lib/assessment/tier-classifier";
import { buildReportPrompt } from "@/lib/ai/prompts/report";
import { reportNarrativeSchema, type ReportNarrative } from "@/lib/ai/schemas/report";
import { MODEL } from "@/lib/ai/client";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { sendReportReadyEmail } from "@/lib/email";
import { routing } from "@/lib/i18n/routing";

const SUPPORTED_LOCALES = routing.locales as readonly string[];

function isSupportedLocale(value: unknown): value is string {
  return typeof value === "string" && SUPPORTED_LOCALES.includes(value);
}

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success: withinLimit } = await checkRateLimit(`score:${clerkId}`, 5, 60);
  if (!withinLimit) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json();
  const sessionId = body.sessionId as string;
  // Optional: request the narrative in a specific language. Only honored when it
  // is one of the supported locales; otherwise ignored.
  const reportLocale = isSupportedLocale(body.reportLocale) ? body.reportLocale : undefined;
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
    .select("id, slug, locale")
    .eq("session_id", sessionId)
    .single();

  if (existingReport) {
    // Idempotent: dimension scores + report already computed. If a specific
    // (uncached) reportLocale was requested, generate + cache just that
    // translation without recomputing any scores.
    if (reportLocale && reportLocale !== existingReport.locale) {
      const { data: cached } = await sb
        .from("report_narratives")
        .select("id")
        .eq("report_id", existingReport.id)
        .eq("locale", reportLocale)
        .single();

      if (!cached) {
        const localizedNarrative = await generateNarrativeForLocale(sb, existingReport.id, session, reportLocale);
        if (localizedNarrative) {
          await sb
            .from("report_narratives")
            .upsert(
              { report_id: existingReport.id, locale: reportLocale, narrative: localizedNarrative },
              { onConflict: "report_id,locale" }
            );
        }
      }
    }
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

  // Generate AI narrative in the session's locale
  let narrative: ReportNarrative = { summary: "Report generated.", strengths: [], growthAreas: [], careerPaths: [], personalitySnapshot: "" };

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
    console.error("Report narrative failed", { sessionId, err: e });
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
    .select("id, slug")
    .single();

  // Seed the per-locale cache with the default narrative so lookups for the
  // session's own locale hit report_narratives consistently.
  if (report) {
    await sb
      .from("report_narratives")
      .upsert(
        { report_id: report.id, locale: session.locale, narrative },
        { onConflict: "report_id,locale" }
      );

    // Notify the report owner (fail-safe; must never block the response).
    // On first scoring the caller is the owner (validate_session matched clerk_id).
    await notifyReportReady(sb, clerkId, session.locale, req, report.slug);
  }

  return NextResponse.json({ reportSlug: report?.slug });
}

/**
 * Generate a narrative in `targetLocale` for an already-scored report.
 * Reuses the persisted dimension scores + tiers so scores are never recomputed.
 * Returns null if generation fails (caller should skip caching).
 */
async function generateNarrativeForLocale(
  sb: ReturnType<typeof getSupabase>,
  reportId: string,
  session: { locale: string; user_age?: number },
  targetLocale: string
): Promise<ReportNarrative | null> {
  const { data: report } = await sb
    .from("reports")
    .select("composite_score, tier_startup, tier_tech, tier_consultant, tier_team, commitment_flag, session_id")
    .eq("id", reportId)
    .single();
  if (!report) return null;

  const { data: dimScores } = await sb.rpc("get_dimension_scores", {
    p_session_id: report.session_id,
  });

  const dimensionScores = (dimScores ?? []).map((ds: { name_key: string; normalized: number; confidence: number }) => ({
    name: String(ds.name_key),
    normalized: Number(ds.normalized),
    confidence: Number(ds.confidence),
  }));

  try {
    const result = await generateText({
      model: MODEL,
      output: Output.object({ schema: reportNarrativeSchema }),
      prompt: buildReportPrompt({
        dimensionScores,
        compositeScore: Number(report.composite_score),
        tierStartup: report.tier_startup,
        tierTech: report.tier_tech,
        tierConsultant: report.tier_consultant,
        tierTeam: report.tier_team,
        commitmentFlag: Boolean(report.commitment_flag),
        locale: targetLocale,
        userAge: session.user_age,
      }),
    });
    return result.output ?? null;
  } catch (e) {
    console.error("Localized report narrative failed", { reportId, targetLocale, err: e });
    return null;
  }
}

/**
 * Look up the owner's email + name and send the report-ready email.
 * Fail-safe: any error is logged and swallowed so it can't block report delivery.
 */
async function notifyReportReady(
  sb: ReturnType<typeof getSupabase>,
  clerkId: string,
  locale: string,
  req: Request,
  slug: string
): Promise<void> {
  try {
    const { data: owner } = await sb
      .from("users")
      .select("email, name")
      .eq("clerk_id", clerkId)
      .single();
    if (!owner?.email) return;

    const origin = new URL(req.url).origin;
    await sendReportReadyEmail({
      to: owner.email,
      name: owner.name ?? "",
      reportUrl: `${origin}/${locale}/reports/${slug}`,
      locale,
    });
  } catch (e) {
    console.error("Report-ready email failed", { clerkId, err: e });
  }
}
