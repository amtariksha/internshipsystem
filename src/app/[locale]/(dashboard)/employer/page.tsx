import { getSupabase } from "@/lib/db/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/lib/i18n/navigation";

export default async function EmployerDashboard() {
  const sb = getSupabase();

  // Get recent completed reports with user info
  const { data: reports } = await sb
    .from("reports")
    .select("slug, composite_score, tier_startup, tier_tech, generated_at, locale")
    .order("generated_at", { ascending: false })
    .limit(20);

  // Get summary stats
  const { count: totalCandidates } = await sb
    .from("reports")
    .select("id", { count: "exact", head: true });

  const tierColors: Record<string, string> = {
    READY_TO_LEAD: "bg-green-500/20 text-green-400",
    READY_TO_BUILD: "bg-blue-500/20 text-blue-400",
    READY_TO_CONTRIBUTE: "bg-yellow-500/20 text-yellow-400",
    GROWING_FOUNDATION: "bg-muted text-muted-foreground",
  };

  const tierLabels: Record<string, string> = {
    READY_TO_LEAD: "Ready to Lead",
    READY_TO_BUILD: "Ready to Build",
    READY_TO_CONTRIBUTE: "Ready to Contribute",
    GROWING_FOUNDATION: "Growing Foundation",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Employer Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{totalCandidates ?? 0}</p>
            <p className="text-sm text-muted-foreground">Total Candidates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">
              {(reports ?? []).filter((r) => r.tier_startup === "READY_TO_LEAD" || r.tier_startup === "READY_TO_BUILD").length}
            </p>
            <p className="text-sm text-muted-foreground">Startup Ready</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">
              {(reports ?? []).filter((r) => r.tier_tech === "READY_TO_LEAD" || r.tier_tech === "READY_TO_BUILD").length}
            </p>
            <p className="text-sm text-muted-foreground">Tech Ready</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Candidates</CardTitle></CardHeader>
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
              <p className="text-sm text-muted-foreground text-center py-8">No candidates assessed yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
