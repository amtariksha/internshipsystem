import { z } from "zod";

export const domainProbeScoringSchema = z.object({
  conceptualUnderstanding: z.number().min(0).max(5).describe("Understanding of the underlying concept (0-5)"),
  applicationAbility: z.number().min(0).max(5).describe("Ability to apply the concept (0-5)"),
  score: z.number().min(0).max(5).describe("Overall domain competence score (0-5)"),
  reasoning: z.string().describe("Brief explanation of the score"),
});

export type DomainProbeScore = z.infer<typeof domainProbeScoringSchema>;
