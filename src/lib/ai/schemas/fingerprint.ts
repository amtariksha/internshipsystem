import { z } from "zod";

export const llmFingerprintSchema = z.object({
  isLikelyAI: z.boolean().describe("Whether the response appears AI-generated"),
  confidence: z.number().min(0).max(1).describe("Confidence in the AI detection (0-1)"),
  indicators: z.array(z.string()).describe("Specific indicators found"),
  languageSpecificNotes: z.string().describe("Notes specific to the response language"),
});

export type LLMFingerprint = z.infer<typeof llmFingerprintSchema>;
