import { z } from "zod";

export const SUPPORTED_LOCALES = ["en", "hi", "te", "ta", "kn"] as const;
export const localeSchema = z.enum(SUPPORTED_LOCALES);
export type Locale = z.infer<typeof localeSchema>;

/**
 * Request body for POST /api/assessment/start.
 * Mirrors the fields destructured in the start route:
 *   const { locale = "en", weightProfile = "STARTUP_FOUNDER" } = body;
 */
export const assessmentStartSchema = z.object({
  locale: localeSchema.optional(),
  weightProfile: z.string().min(1).optional(),
});
export type AssessmentStartInput = z.infer<typeof assessmentStartSchema>;

/**
 * selectedOption semantics:
 *   null  -> no option chosen (pure free-text / AI follow-up)
 *   0     -> "None of the above" (SJT), free-text expected
 *   1..5  -> chosen SJT option position
 */
const selectedOptionSchema = z
  .number()
  .int()
  .nullable()
  .optional()
  .refine(
    (value) => value == null || value === 0 || (value >= 1 && value <= 5),
    { message: "selectedOption must be null, 0, or an integer 1-5" }
  );

const nonNegativeIntDelta = z.number().int().nonnegative().optional().default(0);

/**
 * Request body for POST /api/assessment/respond.
 * Based on the fields destructured in the respond route.
 */
export const assessmentRespondSchema = z.object({
  sessionId: z.string().min(1),
  sessionQuestionId: z.string().min(1),
  selectedOption: selectedOptionSchema,
  freeText: z.string().optional(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime(),
  tabSwitchDelta: nonNegativeIntDelta,
  copyPasteDelta: nonNegativeIntDelta,
});
export type AssessmentRespondInput = z.infer<typeof assessmentRespondSchema>;

/**
 * selectedOption semantics for the DOMAIN engine (MCQ-based):
 *   null/undefined -> probe (free-text) response, no option chosen
 *   1..5           -> chosen MCQ option position
 * Probe responses omit selectedOption entirely, so it is nullable + optional.
 */
const domainSelectedOptionSchema = z.number().int().nullable().optional();

/**
 * Request body for POST /api/domain/start.
 * Mirrors the fields destructured in the start route:
 *   const { domain, locale = "en" } = await req.json();
 */
export const domainStartSchema = z.object({
  domain: z.string().min(1),
  locale: localeSchema.optional(),
});
export type DomainStartInput = z.infer<typeof domainStartSchema>;

/**
 * Request body for POST /api/domain/respond.
 * Based on the fields destructured in the respond route:
 *   const { sessionId, questionId, selectedOption, startedAt, completedAt, freeText } = body;
 */
export const domainRespondSchema = z.object({
  sessionId: z.string().min(1),
  questionId: z.string().min(1),
  selectedOption: domainSelectedOptionSchema,
  freeText: z.string().optional(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime(),
});
export type DomainRespondInput = z.infer<typeof domainRespondSchema>;

export interface ParseResult<T> {
  success: boolean;
  data?: T;
  error?: z.ZodError;
}

/**
 * Thin wrapper around schema.safeParse that returns a uniform shape.
 * Call sites may also use schema.safeParse directly — this is a convenience.
 */
export function parseBody<T>(
  schema: z.ZodType<T>,
  body: unknown
): ParseResult<T> {
  const result = schema.safeParse(body);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
