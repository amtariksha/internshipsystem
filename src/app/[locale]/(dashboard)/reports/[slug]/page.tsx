import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "@/lib/i18n/navigation";
import { getSupabase } from "@/lib/db/supabase";
import { DimensionRadar } from "@/components/reports/dimension-radar";
import { TierBadge } from "@/components/reports/tier-badge";
import { ScoreBreakdown } from "@/components/reports/score-breakdown";
import { CommitmentFlag } from "@/components/reports/commitment-flag";
import { DomainScoreCard } from "@/components/domain/domain-score-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { REQUIRED_DIMENSION_COUNT } from "@/lib/assessment/session-assembler";

interface ReportPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { slug, locale } = await params;

  const { userId: clerkId } = await auth();
  if (!clerkId) {
    redirect({ href: "/sign-in", locale });
  }

  const sb = getSupabase();

  // Get report with user name via RPC
  const { data: reports } = await sb.rpc("get_report_by_slug", { p_slug: slug });

  if (!reports || reports.length === 0) notFound();
  const report = reports[0];

  // Ownership check: the report's session must belong to the signed-in user.
  // Queries run with the service role (bypasses RLS), so this check is the
  // authorization boundary. notFound() avoids leaking report existence.
  const [{ data: caller }, { data: owningSession }] = await Promise.all([
    sb.from("users").select("id").eq("clerk_id", clerkId).single(),
    sb.from("assessment_sessions").select("user_id").eq("id", report.session_id).single(),
  ]);

  if (!caller || !owningSession || owningSession.user_id !== caller.id) {
    notFound();
  }

  // Get dimension scores via RPC
  const { data: dimScores } = await sb.rpc("get_dimension_scores", {
    p_session_id: report.session_id,
  });

  const narrative = report.narrative as {
    summary: string;
    strengths: string[];
    growthAreas: string[];
    careerPaths: { path: string; fit: number; reasoning: string }[];
    personalitySnapshot: string;
  };

  const dimensionScores = (dimScores ?? []) as {
    name_key: string;
    normalized: number;
    confidence: number;
  }[];

  const radarData = dimensionScores.map((ds) => ({
    name: String(ds.name_key).replace("dimensions.", ""),
    score: Number(ds.normalized),
    fullMark: 100,
  }));

  // Flag insufficient data: fewer than the required 12 dimensions were scored,
  // or a dimension has no signal (normalized 0 AND confidence 0 — the shape a
  // dimension with zero SJT and zero AI responses produces). This keeps a
  // no-data 0 from being read as a genuine low score on the radar.
  const hasInsufficientData =
    dimensionScores.length < REQUIRED_DIMENSION_COUNT ||
    dimensionScores.some(
      (ds) => Number(ds.normalized) === 0 && Number(ds.confidence) === 0
    );

  const breakdownData = dimensionScores.map((ds) => ({
    name: String(ds.name_key).replace("dimensions.", ""),
    score: Number(ds.normalized),
    confidence: Number(ds.confidence),
  }));

  const tierMap: Record<string, string> = {
    READY_TO_LEAD: "Ready to Lead",
    READY_TO_BUILD: "Ready to Build",
    READY_TO_CONTRIBUTE: "Ready to Contribute",
    GROWING_FOUNDATION: "Growing Foundation",
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Assessment Report</h1>
        <p className="mt-1 text-muted-foreground">
          {report.user_name} &middot; {new Date(report.generated_at).toLocaleDateString()}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
          <span className="text-sm text-muted-foreground">Composite Score</span>
          <span className="text-2xl font-bold">{report.composite_score}</span>
          <span className="text-sm text-muted-foreground">/ 100</span>
        </div>
      </div>

      {report.commitment_flag && (
        <CommitmentFlag
          title="Commitment Gap Detected"
          description="Your stated ambitions score high, but behavioral indicators suggest follow-through may be a challenge. This is an area for focused development."
        />
      )}

      <Card>
        <CardHeader><CardTitle>Dimension Profile</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {hasInsufficientData && (
            <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-500">
              Some dimensions had insufficient data, so this profile may be incomplete.
            </div>
          )}
          <DimensionRadar data={radarData} hasInsufficientData={hasInsufficientData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Talent Tier Classifications</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <TierBadge tier={report.tier_startup} label={tierMap[report.tier_startup]} context="Startup Co-founder" />
          <TierBadge tier={report.tier_tech} label={tierMap[report.tier_tech]} context="Structured Tech Role" />
          <TierBadge tier={report.tier_consultant} label={tierMap[report.tier_consultant]} context="Independent Consultant" />
          <TierBadge tier={report.tier_team} label={tierMap[report.tier_team]} context="Team (Amtariksha)" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Dimension Scores</CardTitle></CardHeader>
        <CardContent><ScoreBreakdown scores={breakdownData} /></CardContent>
      </Card>

      {narrative.summary && (
        <>
          <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent><p className="text-sm leading-relaxed">{narrative.summary}</p></CardContent>
          </Card>

          {narrative.strengths.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Key Strengths</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {narrative.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 text-green-400">+</span>{s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {narrative.growthAreas.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Growth Areas</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {narrative.growthAreas.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 text-yellow-400">&#8599;</span>{g}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {narrative.careerPaths.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Suggested Career Paths</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {narrative.careerPaths.map((cp, i) => (
                  <div key={i} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{cp.path}</span>
                      <span className="font-mono text-xs text-primary">{cp.fit}% fit</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{cp.reasoning}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {narrative.personalitySnapshot && (
            <Card>
              <CardHeader><CardTitle>Personality Snapshot</CardTitle></CardHeader>
              <CardContent><p className="text-sm leading-relaxed">{narrative.personalitySnapshot}</p></CardContent>
            </Card>
          )}
        </>
      )}

      {/* Domain Knowledge Score (if available) */}
      {report.domain_score && (() => {
        const ds = report.domain_score as {
          domain: string; compositeScore: number; proficiencyLevel: string;
          mcqScore: number; aiProbeScore: number | null;
          questionsTotal: number; questionsCorrect: number; backlogCount: number;
        };
        return (
          <DomainScoreCard
            data={{
              domain: ds.domain,
              compositeScore: ds.compositeScore,
              proficiencyLevel: ds.proficiencyLevel,
              mcqScore: ds.mcqScore,
              aiProbeScore: ds.aiProbeScore,
              questionsTotal: ds.questionsTotal,
              questionsCorrect: ds.questionsCorrect,
              backlogCount: ds.backlogCount,
            }}
            labels={{
              title: "Domain Proficiency",
              mcqAccuracy: "MCQ Accuracy",
              aiProbeScore: "Conceptual Depth",
              compositeScore: "Overall Score",
              backlogs: "Academic Backlogs",
              proficiencyLabel: ds.proficiencyLevel,
            }}
          />
        );
      })()}

      {/* AI Collaboration Score (if available) */}
      {report.ai_collab_score && (() => {
        const ac = report.ai_collab_score as {
          compositeScore: number; proficiencyLevel: string;
          dimensions: Record<string, number>;
        };
        return (
          <Card>
            <CardHeader><CardTitle>AI Collaboration</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Composite Score</span>
                <span className="text-lg font-bold">{ac.compositeScore}/100</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${ac.compositeScore}%` }} />
              </div>
              {ac.dimensions && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {Object.entries(ac.dimensions).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between rounded border border-border px-2 py-1 text-xs">
                      <span className="text-muted-foreground">{key.replace("ai_", "").replace(/_/g, " ")}</span>
                      <span className="font-mono">{(value as number).toFixed(1)}/5</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })()}

      <Separator />
      <p className="text-center text-xs text-muted-foreground pb-8">
        This assessment provides insights for self-reflection and development.
      </p>
    </div>
  );
}
