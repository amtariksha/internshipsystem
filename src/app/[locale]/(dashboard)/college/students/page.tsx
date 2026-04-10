import { getSupabase } from "@/lib/db/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function CollegeStudentsPage() {
  const sb = getSupabase();

  const { data: students } = await sb
    .from("users")
    .select("id, name, email, field_of_study, educational_stage, backlog_count, created_at")
    .eq("role", "STUDENT")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Students</h1>

      <Card>
        <CardHeader><CardTitle>Student Directory</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(students ?? []).map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {s.field_of_study && (
                    <Badge variant="outline">{String(s.field_of_study).replace(/_/g, " ")}</Badge>
                  )}
                  <Badge>{s.educational_stage ?? "N/A"}</Badge>
                  {Number(s.backlog_count) > 0 && (
                    <Badge variant="destructive">{s.backlog_count} backlogs</Badge>
                  )}
                </div>
              </div>
            ))}
            {(!students || students.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-8">No students registered yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
