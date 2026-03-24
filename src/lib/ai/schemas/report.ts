import { z } from "zod";

export const reportNarrativeSchema = z.object({
  summary: z.string().describe("2-3 sentence executive summary of the candidate"),
  strengths: z.array(z.string()).describe("Top 3-5 key strengths with brief explanations"),
  growthAreas: z.array(z.string()).describe("Top 2-4 areas for development with actionable advice"),
  careerPaths: z.array(z.object({
    path: z.string().describe("Career path name"),
    fit: z.number().min(0).max(100).describe("Fit percentage"),
    reasoning: z.string().describe("Why this path suits the candidate"),
  })).describe("Top 3-5 suggested career paths with fit scores"),
  personalitySnapshot: z.string().describe("1-2 paragraph personality description"),
});

export type ReportNarrative = z.infer<typeof reportNarrativeSchema>;
