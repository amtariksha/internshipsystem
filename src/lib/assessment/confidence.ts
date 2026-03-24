import { ASSESSMENT_CONFIG } from "@/lib/utils/constants";

/**
 * Compute confidence score (0-1) for a single response.
 * Factors: timing, response length (for free-text), and consistency.
 */
export function computeResponseConfidence(params: {
  durationMs: number;
  type: "SJT" | "AI_FOLLOWUP";
  freeTextLength?: number;
}): number {
  const { durationMs, type, freeTextLength } = params;
  let confidence = 1.0;

  // Timing penalty: too fast or too slow
  if (durationMs < ASSESSMENT_CONFIG.MIN_RESPONSE_TIME_MS) {
    // Likely random clicking — severe penalty
    confidence *= 0.3;
  } else if (durationMs > ASSESSMENT_CONFIG.MAX_RESPONSE_TIME_MS) {
    // Likely external help — moderate penalty
    confidence *= 0.6;
  }

  // For free-text: length-based confidence
  if (type === "AI_FOLLOWUP" && freeTextLength !== undefined) {
    if (freeTextLength < 20) {
      // Very short response — low effort
      confidence *= 0.4;
    } else if (freeTextLength < 50) {
      confidence *= 0.7;
    } else if (freeTextLength > 2000) {
      // Suspiciously long — potential copy-paste from LLM
      confidence *= 0.7;
    }
  }

  return Math.round(confidence * 100) / 100;
}
