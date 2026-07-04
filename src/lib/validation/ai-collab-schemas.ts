import { z } from "zod";
import { localeSchema } from "@/lib/validation/api-schemas";

/**
 * Request body for POST /api/ai-collab/start.
 * Mirrors the fields destructured in the start route:
 *   const { challengeId, domain, locale = "en" } = body;
 * challengeId/domain are optional (challengeId selects a specific challenge,
 * domain drives auto-selection); locale falls back to "en".
 */
export const aiCollabStartSchema = z.object({
  challengeId: z.string().min(1).optional(),
  domain: z.string().min(1).optional(),
  locale: localeSchema.optional(),
});
export type AiCollabStartInput = z.infer<typeof aiCollabStartSchema>;

/**
 * Request body for POST /api/ai-collab/message.
 * Mirrors the fields destructured in the message route:
 *   const { sessionId, message } = body;
 * message must be a non-empty string once trimmed.
 */
export const aiCollabMessageSchema = z.object({
  sessionId: z.string().min(1),
  message: z
    .string()
    .refine((value) => value.trim().length >= 1, {
      message: "message must not be empty",
    }),
});
export type AiCollabMessageInput = z.infer<typeof aiCollabMessageSchema>;
