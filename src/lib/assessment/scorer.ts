/**
 * Score an SJT response based on expert weights.
 *
 * Each option has weights like: {"grit_perseverance": 4, "risk_tolerance": 2, ...}
 * The score for the selected option's target dimension weight (1-5 scale).
 */
export function scoreSjtResponse(
  selectedPosition: number,
  optionWeights: Record<string, Record<string, number>>[],
  targetDimensionCode: string
): { score: number; allDimensionScores: Record<string, number> } {
  const selectedWeights = optionWeights[selectedPosition - 1];
  if (!selectedWeights) {
    return { score: 0, allDimensionScores: {} };
  }

  const weights = selectedWeights as unknown as Record<string, number>;
  const targetScore = weights[targetDimensionCode] ?? 0;

  return {
    score: targetScore,
    allDimensionScores: weights,
  };
}

/**
 * Compute composite score for a single dimension.
 * Blend: 60% SJT average + 40% AI analysis average, weighted by confidence.
 */
export function computeDimensionScore(
  sjtScores: { score: number; confidence: number }[],
  aiScores: { score: number; confidence: number }[]
): { rawScore: number; confidence: number; normalized: number } {
  const SJT_WEIGHT = 0.6;
  const AI_WEIGHT = 0.4;

  const avgSjt = average(sjtScores.map((s) => s.score));
  const avgAi = average(aiScores.map((s) => s.score));
  const avgSjtConf = average(sjtScores.map((s) => s.confidence));
  const avgAiConf = average(aiScores.map((s) => s.confidence));

  const rawScore =
    sjtScores.length > 0 && aiScores.length > 0
      ? avgSjt * SJT_WEIGHT + avgAi * AI_WEIGHT
      : sjtScores.length > 0
        ? avgSjt
        : avgAi;

  const confidence =
    sjtScores.length > 0 && aiScores.length > 0
      ? avgSjtConf * SJT_WEIGHT + avgAiConf * AI_WEIGHT
      : sjtScores.length > 0
        ? avgSjtConf
        : avgAiConf;

  // Normalize from 0-5 scale to 0-100
  const normalized = Math.round((rawScore / 5) * 100);

  return { rawScore, confidence, normalized: Math.min(100, Math.max(0, normalized)) };
}

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
