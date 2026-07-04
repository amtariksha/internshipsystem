import { auth } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { getSupabase } from "@/lib/db/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, redirect } from "@/lib/i18n/navigation";

interface EmployerDashboardProps {
  params: Promise<{ locale: string }>;
}

export default async function EmployerDashboard({ params }: EmployerDashboardProps) {
  const { locale } = await params;

  const { userId: clerkId } = await auth();
  if (!clerkId) {
    redirect({ href: "/sign-in", locale });
  }

  const sb = getSupabase();

  const { data: caller } = await sb
    .from("users")
    .select("role, organization_id")
    .eq("clerk_id", clerkId)
    .single();
  if (!caller || caller.role !== "EMPLOYER") {
    redirect({ href: "/", locale });
  }

  const t = await getTranslations({ locale, namespace: "dashboardEmployer" });

  const organizationId = caller!.organization_id as string | null;

  // Scope: candidates are students in this employer's organization.
  const { data: orgStudents } = organizationId
    ? await sb
        .from("users")
        .select("id")
        .eq("role", "STUDENT")
        .eq("organization_id", organizationId)
    : { data: [] };
  const studentIds = (orgStudents ?? []).map((s) => s.id as string);

  const { data: scopedSessions } = studentIds.length
    ? await sb.from("assessment_sessions").select("id").in("user_id", studentIds)
    : { data: [] };
  const sessionIds = (scopedSessions ?? []).map((s) => s.id as string);

  // Recent completed reports for org candidates only.
  const { data: reports } = sessionIds.length
    ? await sb
        .from("reports")
        .select("slug, composite_score, tier_startup, tier_tech, generated_at, locale")
        .in("session_id", sessionIds)
        .order("generated_at", { ascending: false })
        .limit(20)
    : { data: [] };

  // Summary stat — total candidate reports in this organization.
  const totalCandidates = sessionIds.length
    ? (
        await sb
          .from("reports")
          .select("id", { count: "exact", head: true })
          .in("session_id", sessionIds)
      ).count
    : 0;

  const tierColors: Record<string, string> = {
    READY_TO_LEAD: "bg-green-500/20 text-green-400",
    READY_TO_BUILD: "bg-blue-500/20 text-blue-400",
    READY_TO_CONTRIBUTE: "bg-yellow-500/20 text-yellow-400",
    GROWING_FOUNDATION: "bg-muted text-muted-foreground",
  };

  const tierLabels: Record<string, string> = {
    READY_TO_LEAD: t("tierReadyToLead"),
    READY_TO_BUILD: t("tierReadyToBuild"),
    READY_TO_CONTRIBUTE: t("tierReadyToContribute"),
    GROWING_FOUNDATION: t("tierGrowingFoundation"),
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{totalCandidates ?? 0}</p>
            <p className="text-sm text-muted-foreground">{t("totalCandidates")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">
              {(reports ?? []).filter((r) => r.tier_startup === "READY_TO_LEAD" || r.tier_startup === "READY_TO_BUILD").length}
            </p>
            <p className="text-sm text-muted-foreground">{t("startupReady")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">
              {(reports ?? []).filter((r) => r.tier_tech === "READY_TO_LEAD" || r.tier_tech === "READY_TO_BUILD").length}
            </p>
            <p className="text-sm text-muted-foreground">{t("techReady")}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>{t("candidates")}</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(reports ?? []).map((r) => (
              <Link
                key={r.slug}
                href={`/reports/${r.slug}`}
                className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-bold">{r.composite_score}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(r.generated_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Badge className={tierColors[r.tier_startup] ?? ""}>
                    {tierLabels[r.tier_startup] ?? r.tier_startup}
                  </Badge>
                  <Badge variant="outline" className={tierColors[r.tier_tech] ?? ""}>
                    {tierLabels[r.tier_tech] ?? r.tier_tech}
                  </Badge>
                </div>
              </Link>
            ))}
            {(!reports || reports.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-8">{t("noCandidates")}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
