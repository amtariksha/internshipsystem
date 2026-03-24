import { z } from "zod";

export const freeTextScoringSchema = z.object({
  specificity: z.number().min(0).max(5).describe("How specific and detailed the response is (0-5)"),
  consistency: z.number().min(0).max(5).describe("How consistent with the SJT choice (0-5)"),
  depth: z.number().min(0).max(5).describe("Depth of reasoning and self-awareness (0-5)"),
  authenticity: z.number().min(0).max(5).describe("How authentic vs rehearsed the response feels (0-5)"),
  score: z.number().min(0).max(5).describe("Overall dimension-relevant score (0-5)"),
  reasoning: z.string().describe("Brief explanation of the scoring rationale"),
});

export type FreeTextScoring = z.infer<typeof freeTextScoringSchema>;
