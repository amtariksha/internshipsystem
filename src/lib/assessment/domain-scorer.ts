import { DOMAIN_ASSESSMENT_CONFIG, getProficiencyLevel } from "@/lib/utils/domain-constants";
import type { ProficiencyLevel } from "@/lib/utils/domain-constants";

const { MCQ_SCORE_WEIGHT, AI_PROBE_WEIGHT } = DOMAIN_ASSESSMENT_CONFIG;

interface DomainResponse {
  isCorrect: boolean;
  difficulty: number;
  aiProbeScore?: number | null;
}

interface DomainScoreResult {
  mcqScore: number;
  aiProbeScore: number | null;
  compositeScore: number;
  proficiencyLevel: ProficiencyLevel;
}

/**
 * Compute domain knowledge score from responses.
 *
 * MCQ score: difficulty-weighted accuracy.
 * Each correct answer scores (difficulty / 5) * 100, averaged across all questions.
 *
 * AI probe score: average of AI follow-up scores, normalized 0-100.
 *
 * Composite: weighted blend of MCQ + AI probe.
 */
export function computeDomainScore(responses: DomainResponse[]): DomainScoreResult {
  if (responses.length === 0) {
    return { mcqScore: 0, aiProbeScore: null, compositeScore: 0, proficiencyLevel: "BEGINNER" };
  }

  // MCQ: difficulty-weighted accuracy
  let totalWeight = 0;
  let weightedCorrect = 0;

  for (const resp of responses) {
    const weight = resp.difficulty / 5;
    totalWeight += weight;
    if (resp.isCorrect) {
      weightedCorrect += weight;
    }
  }

  const mcqScore = totalWeight > 0 ? Math.round((weightedCorrect / totalWeight) * 100) : 0;

  // AI probe: average of available scores, normalized 0-100
  const probeScores = responses
    .filter((r) => r.aiProbeScore != null)
    .map((r) => r.aiProbeScore!);

  const aiProbeScore =
    probeScores.length > 0
      ? Math.round((probeScores.reduce((a, b) => a + b, 0) / probeScores.length / 5) * 100)
      : null;

  // Composite
  let compositeScore: number;
  if (aiProbeScore != null) {
    compositeScore = Math.round(MCQ_SCORE_WEIGHT * mcqScore + AI_PROBE_WEIGHT * aiProbeScore);
  } else {
    compositeScore = mcqScore;
  }

  const proficiencyLevel = getProficiencyLevel(compositeScore);

  return { mcqScore, aiProbeScore, compositeScore, proficiencyLevel };
}
