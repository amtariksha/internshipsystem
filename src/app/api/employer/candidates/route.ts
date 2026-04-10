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
  const { data: user } = await sb.from("users").select("role").eq("clerk_id", clerkId).single();
  if (!user || user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const tier = url.searchParams.get("tier");
  const minScore = Number(url.searchParams.get("minScore") ?? 0);
  const limit = Number(url.searchParams.get("limit") ?? 50);

  let query = sb
    .from("reports")
    .select("slug, composite_score, tier_startup, tier_tech, tier_consultant, tier_team, commitment_flag, generated_at")
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
