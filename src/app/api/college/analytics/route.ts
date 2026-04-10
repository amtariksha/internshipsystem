import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = getSupabase();

  const { data: user } = await sb.from("users").select("role").eq("clerk_id", clerkId).single();
  if (!user || user.role !== "COLLEGE_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { count: totalStudents } = await sb
    .from("users").select("id", { count: "exact", head: true }).eq("role", "STUDENT");

  const { count: completedAssessments } = await sb
    .from("assessment_sessions").select("id", { count: "exact", head: true }).eq("status", "COMPLETED");

  const { data: reports } = await sb
    .from("reports")
    .select("composite_score, tier_startup, tier_tech");

  const avgScore = reports && reports.length > 0
    ? Math.round(reports.reduce((s, r) => s + (r.composite_score as number), 0) / reports.length)
    : 0;

  const tierDistribution: Record<string, number> = {};
  for (const r of reports ?? []) {
    const tier = r.tier_startup as string;
    tierDistribution[tier] = (tierDistribution[tier] ?? 0) + 1;
  }

  return NextResponse.json({
    totalStudents: totalStudents ?? 0,
    completedAssessments: completedAssessments ?? 0,
    averageCompositeScore: avgScore,
    tierDistribution,
    totalReports: reports?.length ?? 0,
  });
}
