import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";
import { AI_COLLAB_CONFIG } from "@/lib/utils/ai-collab-constants";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { challengeId, domain, locale = "en" } = await req.json();
  const sb = getSupabase();

  const { data: user } = await sb
    .from("users")
    .select("id, educational_stage")
    .eq("clerk_id", clerkId)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.educational_stage !== "GRADUATE") {
    return NextResponse.json({ error: "AI collaboration assessment is available for graduates" }, { status: 403 });
  }

  // Check for existing in-progress session
  const { data: existing } = await sb
    .from("ai_collab_sessions")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "IN_PROGRESS")
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({ error: "Active session exists", sessionId: existing[0].id }, { status: 409 });
  }

  // Get challenge
  let challenge;
  if (challengeId) {
    const { data } = await sb
      .from("ai_challenges")
      .select("*")
      .eq("id", challengeId)
      .eq("is_active", true)
      .single();
    challenge = data;
  } else {
    // Auto-select based on domain
    const { data } = await sb
      .from("ai_challenges")
      .select("*")
      .eq("domain", domain ?? "computer_science")
      .eq("is_active", true)
      .eq("target_role", "STUDENT")
      .order("difficulty")
      .limit(1);
    challenge = data?.[0];
  }

  if (!challenge) {
    return NextResponse.json({ error: "No challenges available" }, { status: 503 });
  }

  const timeLimit = AI_COLLAB_CONFIG.TIME_LIMITS[challenge.difficulty as keyof typeof AI_COLLAB_CONFIG.TIME_LIMITS] ?? 30;

  // Create session
  const { data: session, error: sessionErr } = await sb
    .from("ai_collab_sessions")
    .insert({
      user_id: user.id,
      challenge_id: challenge.id,
      locale,
      status: "IN_PROGRESS",
      time_limit_minutes: timeLimit,
    })
    .select("id")
    .single();

  if (sessionErr || !session) {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }

  return NextResponse.json({
    sessionId: session.id,
    challenge: {
      id: challenge.id,
      title: challenge.title,
      description: locale === "hi" ? challenge.description_hi : challenge.description_en,
      starterContext: challenge.starter_context,
      difficulty: challenge.difficulty,
      timeLimitMinutes: timeLimit,
    },
  });
}
