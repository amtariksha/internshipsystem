import { TIER_THRESHOLDS, DIMENSIONS } from "@/lib/utils/constants";

type TierName = "READY_TO_LEAD" | "READY_TO_BUILD" | "READY_TO_CONTRIBUTE" | "GROWING_FOUNDATION";

interface DimensionScoreInput {
  dimensionCode: string;
  normalized: number; // 0-100
}

/**
 * Classify a candidate into talent tiers for each role context.
 * Uses weighted composite scores with context-specific dimension weights.
 */
export function classifyTiers(
  scores: DimensionScoreInput[],
  weightProfile: "STARTUP_FOUNDER" | "GENERAL_EMPLOYABILITY"
): {
  startup: TierName;
  tech: TierName;
  consultant: TierName;
  team: TierName;
  compositeScore: number;
  commitmentFlag: boolean;
} {
  const scoreMap = new Map(scores.map((s) => [s.dimensionCode, s.normalized]));

  // Compute weighted composite
  const weights = DIMENSIONS.map((d) => ({
    code: d.code,
    weight: weightProfile === "STARTUP_FOUNDER" ? d.startupWeight : d.generalWeight,
  }));

  let compositeScore = 0;
  for (const { code, weight } of weights) {
    compositeScore += (scoreMap.get(code) ?? 0) * weight;
  }
  compositeScore = Math.round(compositeScore);

  // Classify per context
  const startup = classifyForContext(compositeScore, "STARTUP_COFOUNDER");
  const tech = classifyForContext(compositeScore, "STRUCTURED_TECH");
  const consultant = classifyForContext(compositeScore, "INDEPENDENT_CONSULTANT");
  const team = classifyForContext(compositeScore, "TEAM_AMTARIKSHA");

  // Commitment flag
  const integrity = scoreMap.get("integrity") ?? 0;
  const vision = scoreMap.get("strategic_thinking") ?? 0;
  const risk = scoreMap.get("risk_tolerance") ?? 0;
  const gritPerseverance = scoreMap.get("grit_perseverance") ?? 0;
  const action = scoreMap.get("action_orientation") ?? 0;

  const commitmentFlag =
    integrity > 70 && vision > 70 && risk > 60 &&
    (gritPerseverance < 40 || action < 40);

  return { startup, tech, consultant, team, compositeScore, commitmentFlag };
}

function classifyForContext(
  score: number,
  context: keyof typeof TIER_THRESHOLDS
): TierName {
  const thresholds = TIER_THRESHOLDS[context];
  if (score >= thresholds.READY_TO_LEAD.min) return "READY_TO_LEAD";
  if (score >= thresholds.READY_TO_BUILD.min) return "READY_TO_BUILD";
  if (score >= thresholds.READY_TO_CONTRIBUTE.min) return "READY_TO_CONTRIBUTE";
  return "GROWING_FOUNDATION";
}
