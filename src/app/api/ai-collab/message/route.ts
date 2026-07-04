import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { getSupabase } from "@/lib/db/supabase";
import { canSendMore, isSessionExpired, getRemainingTime } from "@/lib/assessment/ai-collab-engine";
import { buildAiCollabSystemPrompt } from "@/lib/ai/prompts/ai-collab-assistant";
import { buildPromptComplexityPrompt } from "@/lib/ai/prompts/ai-collab-prompt-scorer";
import { promptComplexitySchema } from "@/lib/ai/schemas/ai-collab-scoring";
import { MODEL } from "@/lib/ai/client";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { runLlmFingerprint } from "@/lib/assessment/fingerprint";
import { aiCollabMessageSchema } from "@/lib/validation/ai-collab-schemas";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success: withinLimit } = await checkRateLimit(`aic-msg:${clerkId}`, 20, 60);
  if (!withinLimit) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = aiCollabMessageSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }

  const { sessionId, message } = parsed.data;

  const sb = getSupabase();

  // Get session with challenge
  const { data: session } = await sb
    .from("ai_collab_sessions")
    .select("id, user_id, challenge_id, locale, status, started_at, time_limit_minutes, total_prompts")
    .eq("id", sessionId)
    .eq("status", "IN_PROGRESS")
    .single();

  if (!session) {
    return NextResponse.json({ error: "Invalid session" }, { status: 404 });
  }

  // Verify ownership
  const { data: user } = await sb.from("users").select("id").eq("clerk_id", clerkId).single();
  if (!user || user.id !== session.user_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (!canSendMore(session)) {
    return NextResponse.json({ error: "Session limit reached", expired: isSessionExpired(session) }, { status: 429 });
  }

  // Get challenge details
  const { data: challenge } = await sb
    .from("ai_challenges")
    .select("title, description_en, description_hi, starter_context, difficulty, target_role, expected_output_criteria")
    .eq("id", session.challenge_id)
    .single();

  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 500 });
  }

  // Get conversation history
  const { data: history } = await sb
    .from("ai_collab_messages")
    .select("role, content")
    .eq("session_id", sessionId)
    .order("position");

  const conversationHistory = (history ?? []).map((m) => ({
    role: m.role === "USER" ? "user" as const : "assistant" as const,
    content: m.content,
  }));

  const nextPosition = (history?.length ?? 0) + 1;

  // Score prompt complexity (fire-and-forget, non-blocking)
  let promptComplexity: number | null = null;
  try {
    const complexityResult = await generateText({
      model: MODEL,
      output: Output.object({ schema: promptComplexitySchema }),
      prompt: buildPromptComplexityPrompt(message),
    });
    promptComplexity = complexityResult.output?.complexity ?? null;
  } catch {
    // Non-critical — skip
  }

  // Anti-cheat parity: fingerprint long user messages for AI-generated content.
  // NOTE: ai_collab_sessions has no flag columns in schema.sql (unlike
  // assessment_sessions), so we log a warning instead of persisting a flag.
  if (message.length > 30) {
    const fingerprint = await runLlmFingerprint({ freeText: message, locale: session.locale });
    if (fingerprint?.isLikelyAI && fingerprint.confidence > 0.7) {
      console.warn("[ai-collab/message] likely AI-generated user message", {
        sessionId,
        confidence: fingerprint.confidence,
      });
    }
  }

  // Save user message
  await sb.from("ai_collab_messages").insert({
    session_id: sessionId,
    position: nextPosition,
    role: "USER",
    content: message,
    prompt_complexity: promptComplexity,
    token_count: message.length,
  });

  // Generate AI assistant response
  const systemPrompt = buildAiCollabSystemPrompt({
    challengeTitle: challenge.title,
    challengeDescription: session.locale === "hi" ? challenge.description_hi : challenge.description_en,
    starterContext: challenge.starter_context,
    difficulty: challenge.difficulty,
    targetRole: challenge.target_role,
    locale: session.locale,
  });

  let assistantResponse: string;
  try {
    const result = await generateText({
      model: MODEL,
      system: systemPrompt,
      messages: [
        ...conversationHistory,
        { role: "user", content: message },
      ],
    });
    assistantResponse = result.text;
  } catch {
    assistantResponse = "I apologize, I encountered an error. Could you rephrase your question?";
  }

  // Save assistant message
  await sb.from("ai_collab_messages").insert({
    session_id: sessionId,
    position: nextPosition + 1,
    role: "ASSISTANT",
    content: assistantResponse,
    token_count: assistantResponse.length,
  });

  // Update session counters
  await sb
    .from("ai_collab_sessions")
    .update({
      total_prompts: session.total_prompts + 1,
      total_iterations: (history?.length ?? 0) / 2 + 1,
    })
    .eq("id", sessionId);

  return NextResponse.json({
    assistantResponse,
    promptComplexity,
    promptsUsed: session.total_prompts + 1,
    timeRemainingMinutes: getRemainingTime(session),
  });
}
