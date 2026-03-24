export const AI_COLLAB_DIMENSIONS = [
  { code: "ai_decomposition", nameKey: "aiCollab.dimensions.decomposition", weight: 0.15, description: "Breaking complex problems into AI-solvable chunks" },
  { code: "ai_first_principles", nameKey: "aiCollab.dimensions.firstPrinciples", weight: 0.15, description: "Grounding prompts in fundamental understanding" },
  { code: "ai_debugging", nameKey: "aiCollab.dimensions.debugging", weight: 0.15, description: "Identifying and fixing AI-generated errors" },
  { code: "ai_communication", nameKey: "aiCollab.dimensions.communication", weight: 0.15, description: "How effectively they prompt the AI" },
  { code: "ai_efficiency", nameKey: "aiCollab.dimensions.efficiency", weight: 0.10, description: "Getting results with fewer iterations" },
  { code: "ai_quality", nameKey: "aiCollab.dimensions.quality", weight: 0.10, description: "Quality of the final output guided by the candidate" },
  { code: "ai_iteration", nameKey: "aiCollab.dimensions.iteration", weight: 0.10, description: "How they refine AI outputs toward better solutions" },
  { code: "ai_creativity", nameKey: "aiCollab.dimensions.creativity", weight: 0.10, description: "Novel approaches and unexpected uses of AI" },
] as const;

export type AiCollabDimensionCode = (typeof AI_COLLAB_DIMENSIONS)[number]["code"];

export const AI_COLLAB_CONFIG = {
  /** Default time limit in minutes per challenge difficulty */
  TIME_LIMITS: {
    1: 15,
    2: 20,
    3: 30,
    4: 40,
    5: 45,
  } as Record<number, number>,

  /** Max messages a candidate can send before forced completion */
  MAX_PROMPTS: 50,

  /** Minimum prompts before allowing completion */
  MIN_PROMPTS: 3,

  /** Score scale for each dimension */
  SCORE_MIN: 0,
  SCORE_MAX: 5,

  /** Proficiency thresholds (composite out of 100) */
  PROFICIENCY: {
    EXPERT: { min: 80, label: "Expert" },
    ADVANCED: { min: 60, label: "Advanced" },
    INTERMEDIATE: { min: 40, label: "Intermediate" },
    BEGINNER: { min: 0, label: "Beginner" },
  },

  /** Target roles for challenge difficulty calibration */
  TARGET_ROLES: ["STUDENT", "EXPERIENCED"] as const,
} as const;

export type AiCollabTargetRole = (typeof AI_COLLAB_CONFIG.TARGET_ROLES)[number];

export function getAiCollabProficiency(compositeScore: number): string {
  const { PROFICIENCY } = AI_COLLAB_CONFIG;
  if (compositeScore >= PROFICIENCY.EXPERT.min) return "EXPERT";
  if (compositeScore >= PROFICIENCY.ADVANCED.min) return "ADVANCED";
  if (compositeScore >= PROFICIENCY.INTERMEDIATE.min) return "INTERMEDIATE";
  return "BEGINNER";
}

/** Compute weighted composite from 8 dimension scores (each 0-5) */
export function computeAiCollabComposite(scores: Record<string, number>): number {
  let totalWeight = 0;
  let weightedSum = 0;

  for (const dim of AI_COLLAB_DIMENSIONS) {
    const score = scores[dim.code] ?? 0;
    weightedSum += score * dim.weight;
    totalWeight += dim.weight;
  }

  const avgWeighted = totalWeight > 0 ? weightedSum / totalWeight : 0;
  return Math.round((avgWeighted / 5) * 100);
}
