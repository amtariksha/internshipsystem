import { z } from "zod";

const dimensionScoreSchema = z.object({
  score: z.number().min(0).max(5),
  reason: z.string(),
});

export const promptComplexitySchema = z.object({
  complexity: z.number().min(0).max(5),
  note: z.string(),
});

export const sessionScoringSchema = z.object({
  ai_decomposition: dimensionScoreSchema,
  ai_first_principles: dimensionScoreSchema,
  ai_debugging: dimensionScoreSchema,
  ai_communication: dimensionScoreSchema,
  ai_efficiency: dimensionScoreSchema,
  ai_quality: dimensionScoreSchema,
  ai_iteration: dimensionScoreSchema,
  ai_creativity: dimensionScoreSchema,
  summary: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
});

export type PromptComplexity = z.infer<typeof promptComplexitySchema>;
export type SessionScoring = z.infer<typeof sessionScoringSchema>;
