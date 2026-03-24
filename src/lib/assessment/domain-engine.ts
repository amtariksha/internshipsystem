import { DOMAIN_ASSESSMENT_CONFIG } from "@/lib/utils/domain-constants";

const {
  MIN_QUESTIONS,
  MAX_QUESTIONS,
  START_DIFFICULTY,
  MIN_DIFFICULTY,
  MAX_DIFFICULTY,
  CONFIDENCE_THRESHOLD,
  AI_PROBE_PROBABILITY,
  AI_PROBE_ON_WRONG_MIN_DIFFICULTY,
} = DOMAIN_ASSESSMENT_CONFIG;

interface SessionState {
  questionsAnswered: number;
  abilityEstimate: number;
  standardError: number;
  currentDifficulty: number;
}

interface SelectionResult {
  shouldStop: boolean;
  nextDifficulty: number;
  shouldProbeWithAI: boolean;
}

/**
 * IRT-based adaptive question selection.
 * Updates ability estimate after each answer, determines next difficulty,
 * and decides when to stop.
 */
export function updateAbilityEstimate(
  currentTheta: number,
  currentSE: number,
  questionDifficulty: number,
  isCorrect: boolean
): { theta: number; se: number } {
  // P(correct) under 1PL IRT model
  const p = 1 / (1 + Math.exp(-(currentTheta - difficultyToTheta(questionDifficulty))));

  let theta: number;
  if (isCorrect) {
    theta = currentTheta + currentSE * currentSE * (1 - p);
  } else {
    theta = currentTheta - currentSE * currentSE * p;
  }

  // Shrink standard error
  const information = p * (1 - p);
  const se = currentSE * Math.sqrt(Math.max(0.01, 1 - currentSE * currentSE * information));

  return {
    theta: Math.max(-3, Math.min(3, theta)),
    se: Math.max(0.1, se),
  };
}

/**
 * Map difficulty level (1-5) to IRT theta scale (-3 to +3).
 */
function difficultyToTheta(difficulty: number): number {
  // 1 → -2, 2 → -1, 3 → 0, 4 → 1, 5 → 2
  return difficulty - 3;
}

/**
 * Map IRT theta back to difficulty level (1-5).
 */
export function thetaToDifficulty(theta: number): number {
  const raw = Math.round(theta + 3);
  return Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, raw));
}

/**
 * Determine next question parameters after an answer.
 */
export function selectNextQuestion(
  session: SessionState,
  lastAnswerCorrect: boolean,
  lastDifficulty: number
): SelectionResult {
  const { theta, se } = updateAbilityEstimate(
    session.abilityEstimate,
    session.standardError,
    lastDifficulty,
    lastAnswerCorrect
  );

  const questionsAfter = session.questionsAnswered + 1;

  // Stopping criteria
  const shouldStop =
    questionsAfter >= MAX_QUESTIONS ||
    (questionsAfter >= MIN_QUESTIONS && se < CONFIDENCE_THRESHOLD);

  const nextDifficulty = thetaToDifficulty(theta);

  // AI probe decision
  const shouldProbeWithAI =
    Math.random() < AI_PROBE_PROBABILITY ||
    (!lastAnswerCorrect && lastDifficulty >= AI_PROBE_ON_WRONG_MIN_DIFFICULTY);

  return {
    shouldStop,
    nextDifficulty,
    shouldProbeWithAI,
  };
}

/**
 * Get the initial session state for a new domain assessment.
 */
export function createInitialSessionState(): SessionState {
  return {
    questionsAnswered: 0,
    abilityEstimate: 0.0,
    standardError: 1.0,
    currentDifficulty: START_DIFFICULTY,
  };
}
