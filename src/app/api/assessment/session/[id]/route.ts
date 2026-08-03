import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabase, describeDbError } from "@/lib/db/supabase";

/**
 * Resume an in-progress assessment.
 *
 * The session page previously hydrated only from sessionStorage (which the
 * start page wrote and the session page then deleted), so a refresh, a new tab,
 * or opening the session URL directly left the page with no question and it
 * spun on "Loading assessment" forever. This endpoint lets the client recover
 * its position from the server instead.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: sessionId } = await params;
  const sb = getSupabase();

  const { data: user, error: userErr } = await sb
    .from("users")
    .select("id")
    .eq("clerk_id", clerkId)
    .maybeSingle();
  if (userErr) {
    console.error("[assessment/session] user lookup failed", { sessionId, userErr });
    return NextResponse.json(
      { error: "Failed to load session", detail: describeDbError(userErr) },
      { status: 500 },
    );
  }
  if (!user) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const { data: session, error: sessionErr } = await sb
    .from("assessment_sessions")
    .select("id, status, user_id, locale")
    .eq("id", sessionId)
    .maybeSingle();
  if (sessionErr) {
    console.error("[assessment/session] session lookup failed", { sessionId, sessionErr });
    return NextResponse.json(
      { error: "Failed to load session", detail: describeDbError(sessionErr) },
      { status: 500 },
    );
  }
  // 404 rather than 403 on a mismatch so we don't confirm the session exists.
  if (!session || session.user_id !== user.id) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.status === "COMPLETED") {
    return NextResponse.json({ complete: true, sessionId });
  }

  const locale = session.locale;

  const { data: allQuestions } = await sb
    .from("session_questions")
    .select("id, position")
    .eq("session_id", sessionId)
    .order("position");

  const totalQuestions = allQuestions?.length ?? 0;
  if (totalQuestions === 0) {
    return NextResponse.json({ error: "Session has no questions" }, { status: 500 });
  }

  const { data: answered } = await sb
    .from("responses")
    .select("session_question_id")
    .eq("session_id", sessionId);

  const answeredIds = new Set((answered ?? []).map((r) => r.session_question_id));
  const pending = (allQuestions ?? []).find((q) => !answeredIds.has(q.id));

  // Every question answered but the session was never marked complete — let the
  // client move on to scoring rather than hang.
  if (!pending) {
    return NextResponse.json({ complete: true, sessionId });
  }

  const { data: sqRows } = await sb.rpc("get_session_question_detail", {
    p_session_question_id: pending.id,
    p_session_id: sessionId,
  });
  if (!sqRows || sqRows.length === 0) {
    return NextResponse.json({ error: "Question not found" }, { status: 500 });
  }
  const sq = sqRows[0];

  const { data: variant } = await sb
    .from("question_variants")
    .select("scenario, prompt")
    .eq("question_id", sq.question_id)
    .eq("locale", locale)
    .maybeSingle();

  // AI follow-ups carry their generated prompt on the session_question row.
  const { data: sqRow } = await sb
    .from("session_questions")
    .select("ai_prompt")
    .eq("id", pending.id)
    .maybeSingle();

  const { data: options } = await sb
    .from("question_options")
    .select("position, text")
    .eq("question_id", sq.question_id)
    .eq("locale", locale)
    .order("position");

  const isFollowUp = sq.type === "AI_FOLLOWUP";

  return NextResponse.json({
    sessionId,
    totalQuestions,
    currentPosition: pending.position,
    question: {
      id: pending.id,
      type: sq.type,
      scenario: variant?.scenario ?? "",
      prompt: variant?.prompt ?? "",
      aiPrompt: sqRow?.ai_prompt ?? undefined,
      options: isFollowUp
        ? []
        : (options ?? []).map((o: { position: number; text: string }) => ({
            position: o.position,
            text: o.text,
          })),
      dimensionName: sq.dim_name,
      timeGuideSeconds: sq.type === "RAPID_FIRE" ? 20 : isFollowUp ? 120 : 90,
    },
  });
}
