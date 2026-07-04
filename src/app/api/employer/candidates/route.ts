import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";

export async function GET(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = getSupabase();

  // Verify employer role
  const { data: user } = await sb
    .from("users")
    .select("role, organization_id")
    .eq("clerk_id", clerkId)
    .single();
  if (!user || user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const organizationId = user.organization_id as string | null;
  // No organization → no candidate pool. Never expose all reports.
  if (!organizationId) {
    return NextResponse.json({ candidates: [], total: 0 });
  }

  const url = new URL(req.url);
  const tier = url.searchParams.get("tier");
  const minScore = Number(url.searchParams.get("minScore") ?? 0);
  const limit = Number(url.searchParams.get("limit") ?? 50);

  // Scope: students belonging to this employer's organization.
  const { data: orgStudents } = await sb
    .from("users")
    .select("id")
    .eq("role", "STUDENT")
    .eq("organization_id", organizationId);

  const studentIds = (orgStudents ?? []).map((s) => s.id as string);
  if (studentIds.length === 0) {
    return NextResponse.json({ candidates: [], total: 0 });
  }

  // Sessions owned by those students only.
  const { data: sessions } = await sb
    .from("assessment_sessions")
    .select("id")
    .in("user_id", studentIds);

  const sessionIds = (sessions ?? []).map((s) => s.id as string);
  if (sessionIds.length === 0) {
    return NextResponse.json({ candidates: [], total: 0 });
  }

  let query = sb
    .from("reports")
    .select(
      "slug, composite_score, tier_startup, tier_tech, tier_consultant, tier_team, commitment_flag, generated_at",
    )
    .in("session_id", sessionIds)
    .gte("composite_score", minScore)
    .order("composite_score", { ascending: false })
    .limit(limit);

  if (tier) {
    query = query.eq("tier_startup", tier);
  }

  const { data: candidates, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ candidates: candidates ?? [], total: candidates?.length ?? 0 });
}
