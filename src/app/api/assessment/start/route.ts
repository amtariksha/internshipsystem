import { createHash } from "node:crypto";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";
import {
  assembleSession,
  IncompleteCoverageError,
  REQUIRED_DIMENSION_COUNT,
} from "@/lib/assessment/session-assembler";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { locale = "en", weightProfile = "STARTUP_FOUNDER" } = body;
  const sb = getSupabase();

  // Find user. Also fetch age/date_of_birth and guardian_consent_at so the
  // under-18 parental-consent gate (DPDP Act 2023) can run before any session
  // is created.
  const { data: user, error: userErr } = await sb
    .from("users")
    .select("id, age, date_of_birth, guardian_consent_at")
    .eq("clerk_id", clerkId)
    .single();

  if (userErr || !user) {
    return NextResponse.json({ error: "User not found. Complete onboarding first." }, { status: 404 });
  }

  // Guardian-consent gate: under-18 users may not start an assessment until a
  // guardian has recorded consent. Prefer the stored `age`; fall back to
  // computing from date_of_birth. Adults (>=18) and consented minors proceed.
  const userAge = computeUserAge(user.age, user.date_of_birth);
  const isMinor = userAge != null && userAge < 18;
  if (isMinor && !user.guardian_consent_at) {
    return NextResponse.json(
      {
        error:
          "A parent or guardian must approve this assessment before you can begin. Please check the consent email sent to your guardian.",
        code: "GUARDIAN_CONSENT_REQUIRED",
      },
      { status: 403 }
    );
  }

  // Check for existing in-progress session
  const { data: existing } = await sb
    .from("assessment_sessions")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "IN_PROGRESS")
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({ error: "You have an active session", sessionId: existing[0].id }, { status: 409 });
  }

  // P1c: 30-day retake cooldown
  const { data: lastCompleted } = await sb
    .from("assessment_sessions")
    .select("completed_at")
    .eq("user_id", user.id)
    .eq("status", "COMPLETED")
    .order("completed_at", { ascending: false })
    .limit(1);

  if (lastCompleted && lastCompleted.length > 0) {
    const lastDate = new Date(lastCompleted[0].completed_at);
    const cooldownEnd = new Date(lastDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    if (cooldownEnd > new Date()) {
      return NextResponse.json({
        error: "Retake cooldown active. You can retake after 30 days.",
        retakeAvailableAt: cooldownEnd.toISOString(),
        lastCompletedAt: lastDate.toISOString(),
      }, { status: 429 });
    }
  }

  // Get active questions with variants in the requested locale
  const { data: questionVariants } = await sb
    .from("question_variants")
    .select("question_id")
    .eq("locale", locale);

  const variantQuestionIds = (questionVariants ?? []).map((qv) => qv.question_id);

  const { data: questions } = await sb
    .from("questions")
    .select("id, dimension_id, difficulty")
    .eq("is_active", true)
    .in("id", variantQuestionIds.length > 0 ? variantQuestionIds : ["__none__"]);

  // Get all dimensions (id + code) up front so pool validation can report
  // exactly which dimensions lack questions in the requested locale.
  const { data: dimensions } = await sb.from("dimensions").select("id, code");
  const dimensionIds = (dimensions ?? []).map((d) => d.id);
  const codeByDimensionId = new Map<string, string>(
    (dimensions ?? []).map((d) => [d.id, d.code])
  );

  // Per-dimension pool validation. The locale variant filter above can starve
  // the pool (e.g. te/ta/kn have no seeded question_variants → 0 questions).
  // Validate (a) enough total questions AND (b) every dimension has >=1
  // question available, and return a diagnosable error instead of crashing.
  const availableQuestions = (questions ?? []).map((q) => ({
    id: q.id,
    dimensionId: q.dimension_id,
    difficulty: q.difficulty,
  }));

  const coveredDimensionIds = new Set(availableQuestions.map((q) => q.dimensionId));
  const missingDimensionIds = dimensionIds.filter((id) => !coveredDimensionIds.has(id));
  const missingDimensions = missingDimensionIds.map(
    (id) => codeByDimensionId.get(id) ?? id
  );

  const hasEnoughTotal = availableQuestions.length >= REQUIRED_DIMENSION_COUNT;
  const allDimensionsCovered = missingDimensions.length === 0;

  if (!hasEnoughTotal || !allDimensionsCovered) {
    return NextResponse.json(
      {
        error: "Insufficient question pool for the requested locale.",
        code: "INSUFFICIENT_POOL",
        locale,
        ...(missingDimensions.length > 0 ? { missingDimensions } : {}),
      },
      { status: 503 }
    );
  }

  // Create session
  const { data: session, error: sessionErr } = await sb
    .from("assessment_sessions")
    .insert({ user_id: user.id, locale, weight_profile: weightProfile, status: "IN_PROGRESS" })
    .select("id")
    .single();

  if (sessionErr || !session) {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
  const sessionId = session.id;

  // Assemble questions. assembleSession re-validates 12-dimension coverage on
  // the assembled set and throws IncompleteCoverageError if any dimension slot
  // could not be filled. Clean up the just-created session and report the gap.
  let assembled;
  try {
    assembled = assembleSession(availableQuestions, dimensionIds, sessionId);
  } catch (err) {
    if (err instanceof IncompleteCoverageError) {
      await sb.from("assessment_sessions").delete().eq("id", sessionId);
      return NextResponse.json(
        {
          error: "Insufficient question pool for the requested locale.",
          code: "INSUFFICIENT_POOL",
          locale,
          missingDimensions: err.missingDimensionIds.map(
            (id) => codeByDimensionId.get(id) ?? id
          ),
        },
        { status: 503 }
      );
    }
    throw err;
  }

  // Insert session questions. Each row carries a per-question watermark_hash — a
  // stable leak-tracing fingerprint of (question_id + ":" + sessionId). Computing
  // it is best-effort: a hashing failure must never block session creation, so it
  // is wrapped and falls back to null (watermark_hash is nullable).
  const sessionQuestionRows = assembled.map((aq) => ({
    session_id: sessionId,
    question_id: aq.questionId,
    position: aq.position,
    type: aq.type,
    watermark_hash: computeWatermarkHash(aq.questionId, sessionId),
  }));

  const { error: sqErr } = await sb.from("session_questions").insert(sessionQuestionRows);
  if (sqErr) {
    return NextResponse.json({ error: "Failed to assemble questions" }, { status: 500 });
  }

  // Get first question with variant and options via RPC
  const { data: firstQ } = await sb.rpc("get_first_session_question", {
    p_session_id: sessionId,
    p_locale: locale,
  });

  const { data: firstOptions } = await sb.rpc("get_session_question_options", {
    p_session_id: sessionId,
    p_position: 1,
    p_locale: locale,
  });

  return NextResponse.json({
    sessionId,
    totalQuestions: assembled.length,
    currentPosition: 1,
    question: firstQ && firstQ.length > 0 ? {
      id: firstQ[0].sq_id,
      type: firstQ[0].type,
      scenario: firstQ[0].scenario,
      prompt: firstQ[0].prompt,
      options: (firstOptions ?? []).map((o: { position: number; text: string }) => ({
        position: o.position,
        text: o.text,
      })),
      dimensionName: firstQ[0].dimension_name,
      timeGuideSeconds: 90,
    } : null,
  });
}

/**
 * Resolve a user's age for the consent gate. Prefers the stored integer `age`
 * column; falls back to computing whole years from `date_of_birth`. Returns
 * null when neither is usable so callers can fail open (treat as adult) rather
 * than incorrectly blocking a legitimate assessment.
 */
function computeUserAge(
  storedAge: number | null | undefined,
  dateOfBirth: string | null | undefined
): number | null {
  if (typeof storedAge === "number" && Number.isFinite(storedAge)) {
    return storedAge;
  }
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;
  const years = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  return Number.isFinite(years) ? years : null;
}

/**
 * Per-question leak-tracing watermark: a stable, truncated SHA-256 of
 * (questionId + ":" + sessionId). Best-effort — returns null on any failure so
 * session creation never breaks over a watermark.
 */
function computeWatermarkHash(questionId: string, sessionId: string): string | null {
  try {
    return createHash("sha256")
      .update(`${questionId}:${sessionId}`)
      .digest("hex")
      .slice(0, 16);
  } catch (err) {
    console.error("[assessment/start] watermark hashing failed", { sessionId, err });
    return null;
  }
}
