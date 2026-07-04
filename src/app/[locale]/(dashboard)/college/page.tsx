import { auth } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/lib/i18n/navigation";
import { getSupabase } from "@/lib/db/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CollegeDashboardProps {
  params: Promise<{ locale: string }>;
}

export default async function CollegeDashboard({ params }: CollegeDashboardProps) {
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
  if (!caller || caller.role !== "COLLEGE_ADMIN") {
    redirect({ href: "/", locale });
  }

  const t = await getTranslations({ locale, namespace: "dashboardCollege" });

  const organizationId = caller!.organization_id as string | null;

  // Scope everything to students in the admin's organization.
  const { data: orgStudents } = organizationId
    ? await sb
        .from("users")
        .select("id")
        .eq("role", "STUDENT")
        .eq("organization_id", organizationId)
    : { data: [] };

  const studentIds = (orgStudents ?? []).map((s) => s.id as string);
  const totalStudents = studentIds.length;

  const totalAssessments = studentIds.length
    ? (
        await sb
          .from("assessment_sessions")
          .select("id", { count: "exact", head: true })
          .eq("status", "COMPLETED")
          .in("user_id", studentIds)
      ).count
    : 0;

  const totalDomainTests = studentIds.length
    ? (
        await sb
          .from("domain_sessions")
          .select("id", { count: "exact", head: true })
          .eq("status", "COMPLETED")
          .in("user_id", studentIds)
      ).count
    : 0;

  // Sessions for these students → reports.
  const { data: scopedSessions } = studentIds.length
    ? await sb.from("assessment_sessions").select("id").in("user_id", studentIds)
    : { data: [] };
  const sessionIds = (scopedSessions ?? []).map((s) => s.id as string);

  // Tier distribution — reports for org students only.
  const { data: reports } = sessionIds.length
    ? await sb
        .from("reports")
        .select("tier_startup, tier_tech, composite_score")
        .in("session_id", sessionIds)
        .order("generated_at", { ascending: false })
        .limit(100)
    : { data: [] };

  const tierDist: Record<string, number> = {};
  for (const r of reports ?? []) {
    const tier = r.tier_startup as string;
    tierDist[tier] = (tierDist[tier] ?? 0) + 1;
  }

  const avgScore = reports && reports.length > 0
    ? Math.round(reports.reduce((s, r) => s + (r.composite_score as number), 0) / reports.length)
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{totalStudents ?? 0}</p>
            <p className="text-sm text-muted-foreground">{t("students")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{totalAssessments ?? 0}</p>
            <p className="text-sm text-muted-foreground">{t("behavioralAssessments")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{totalDomainTests ?? 0}</p>
            <p className="text-sm text-muted-foreground">{t("domainTests")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{avgScore}</p>
            <p className="text-sm text-muted-foreground">{t("avgCompositeScore")}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>{t("tierDistribution")}</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(tierDist).map(([tier, count]) => (
              <div key={tier} className="flex items-center justify-between">
                <span className="text-sm">{tier.replace(/_/g, " ")}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${(count / (reports?.length ?? 1)) * 200}px` }} />
                  <span className="font-mono text-xs">{count}</span>
                </div>
              </div>
            ))}
            {Object.keys(tierDist).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">{t("noData")}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
