import { AI_COLLAB_CONFIG } from "@/lib/utils/ai-collab-constants";

/** Accepts snake_case from Supabase rows directly */
interface CollabSessionState {
  total_prompts: number;
  started_at: string;
  time_limit_minutes: number;
}

export function isSessionExpired(session: CollabSessionState): boolean {
  const elapsed = Date.now() - new Date(session.started_at).getTime();
  const limitMs = session.time_limit_minutes * 60 * 1000;
  return elapsed >= limitMs;
}

export function canSendMore(session: CollabSessionState): boolean {
  return session.total_prompts < AI_COLLAB_CONFIG.MAX_PROMPTS && !isSessionExpired(session);
}

export function canComplete(session: CollabSessionState): boolean {
  return session.total_prompts >= AI_COLLAB_CONFIG.MIN_PROMPTS || isSessionExpired(session);
}

export function getRemainingTime(session: CollabSessionState): number {
  const elapsed = Date.now() - new Date(session.started_at).getTime();
  const limitMs = session.time_limit_minutes * 60 * 1000;
  return Math.max(0, Math.ceil((limitMs - elapsed) / 60000));
}
