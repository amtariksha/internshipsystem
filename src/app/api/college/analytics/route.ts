import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";

const EMPTY_ANALYTICS = {
  totalStudents: 0,
  completedAssessments: 0,
  averageCompositeScore: 0,
  tierDistribution: {} as Record<string, number>,
  totalReports: 0,
};

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = getSupabase();

  const { data: user } = await sb
    .from("users")
    .select("role, organization_id")
    .eq("clerk_id", clerkId)
    .single();
  if (!user || user.role !== "COLLEGE_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const organizationId = user.organization_id as string | null;
  // No organization → the admin governs no students. Return empty, never all data.
  if (!organizationId) {
    return NextResponse.json(EMPTY_ANALYTICS);
  }

  // Scope: students that belong to this organization.
  const { data: orgStudents } = await sb
    .from("users")
    .select("id")
    .eq("role", "STUDENT")
    .eq("organization_id", organizationId);

  const studentIds = (orgStudents ?? []).map((s) => s.id as string);
  const totalStudents = studentIds.length;

  if (totalStudents === 0) {
    return NextResponse.json(EMPTY_ANALYTICS);
  }

  // Completed assessment sessions for these students only.
  const { data: sessions } = await sb
    .from("assessment_sessions")
    .select("id")
    .eq("status", "COMPLETED")
    .in("user_id", studentIds);

  const sessionIds = (sessions ?? []).map((s) => s.id as string);
  const completedAssessments = sessionIds.length;

  if (sessionIds.length === 0) {
    return NextResponse.json({ ...EMPTY_ANALYTICS, totalStudents });
  }

  // Reports derived from those sessions only.
  const { data: reports } = await sb
    .from("reports")
    .select("composite_score, tier_startup, tier_tech")
    .in("session_id", sessionIds);

  const avgScore =
    reports && reports.length > 0
      ? Math.round(
          reports.reduce((s, r) => s + (r.composite_score as number), 0) / reports.length,
        )
      : 0;

  const tierDistribution: Record<string, number> = {};
  for (const r of reports ?? []) {
    const tier = r.tier_startup as string;
    tierDistribution[tier] = (tierDistribution[tier] ?? 0) + 1;
  }

  return NextResponse.json({
    totalStudents,
    completedAssessments,
    averageCompositeScore: avgScore,
    tierDistribution,
    totalReports: reports?.length ?? 0,
  });
}
