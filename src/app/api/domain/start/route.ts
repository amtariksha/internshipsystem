import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";
import { DOMAIN_ASSESSMENT_CONFIG } from "@/lib/utils/domain-constants";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { domain, locale = "en" } = await req.json();
  if (!domain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  const sb = getSupabase();

  // Get user
  const { data: user } = await sb
    .from("users")
    .select("id, educational_stage")
    .eq("clerk_id", clerkId)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.educational_stage !== "COLLEGE" && user.educational_stage !== "GRADUATE") {
    return NextResponse.json({ error: "Domain assessment not available for your profile" }, { status: 403 });
  }

  // Check for existing in-progress session
  const { data: existing } = await sb
    .from("domain_sessions")
    .select("id")
    .eq("user_id", user.id)
    .eq("domain", domain)
    .eq("status", "IN_PROGRESS")
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({ error: "Active domain session exists", sessionId: existing[0].id }, { status: 409 });
  }

  // Get first question at starting difficulty
  const { data: questions } = await sb.rpc("get_domain_questions_by_difficulty", {
    p_domain: domain,
    p_difficulty: DOMAIN_ASSESSMENT_CONFIG.START_DIFFICULTY,
    p_locale: locale,
    p_exclude_ids: null,
  });

  if (!questions || questions.length === 0) {
    return NextResponse.json({ error: "No questions available for this domain" }, { status: 503 });
  }

  // Create session
  const { data: session, error: sessionErr } = await sb
    .from("domain_sessions")
    .insert({
      user_id: user.id,
      domain,
      locale,
      status: "IN_PROGRESS",
      current_difficulty: DOMAIN_ASSESSMENT_CONFIG.START_DIFFICULTY,
      ability_estimate: 0.0,
      standard_error: 1.0,
    })
    .select("id")
    .single();

  if (sessionErr || !session) {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }

  // Get options for first question
  const firstQ = questions[0];
  const { data: options } = await sb
    .from("domain_question_options")
    .select("position, text")
    .eq("question_id", firstQ.question_id)
    .eq("locale", locale)
    .order("position");

  return NextResponse.json({
    sessionId: session.id,
    estimatedQuestions: `${DOMAIN_ASSESSMENT_CONFIG.MIN_QUESTIONS}-${DOMAIN_ASSESSMENT_CONFIG.MAX_QUESTIONS}`,
    currentPosition: 1,
    question: {
      id: firstQ.question_id,
      code: firstQ.code,
      text: firstQ.question_text,
      subdomain: firstQ.subdomain,
      difficulty: firstQ.difficulty,
      options: (options ?? []).map((o) => ({ position: o.position, text: o.text })),
      timeGuideSeconds: DOMAIN_ASSESSMENT_CONFIG.MCQ_TIME_GUIDE_SECONDS,
    },
  });
}
