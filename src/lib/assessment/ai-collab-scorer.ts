import { computeAiCollabComposite, getAiCollabProficiency } from "@/lib/utils/ai-collab-constants";

interface AiCollabDimensionScores {
  ai_decomposition: number;
  ai_first_principles: number;
  ai_debugging: number;
  ai_communication: number;
  ai_efficiency: number;
  ai_quality: number;
  ai_iteration: number;
  ai_creativity: number;
}

interface AiCollabScoreResult {
  dimensions: AiCollabDimensionScores;
  compositeScore: number;
  proficiencyLevel: string;
}

/**
 * Compute AI collaboration composite score from 8 dimension scores (each 0-5).
 */
export function computeAiCollabScore(dimensions: AiCollabDimensionScores): AiCollabScoreResult {
  const compositeScore = computeAiCollabComposite(dimensions as unknown as Record<string, number>);
  const proficiencyLevel = getAiCollabProficiency(compositeScore);

  return { dimensions, compositeScore, proficiencyLevel };
}
