import { ASSESSMENT_CONFIG } from "@/lib/utils/constants";

interface QuestionForAssembly {
  id: string;
  dimensionId: string;
  difficulty: number;
}

interface AssembledQuestion {
  questionId: string;
  position: number;
  type: "SJT" | "AI_FOLLOWUP";
}

/**
 * Stratified random selection of SJTs from the pool.
 * Ensures every dimension is covered (1-2 SJTs per dimension),
 * then interleaves AI follow-up slots after each SJT.
 *
 * The selection is seeded by sessionId for reproducibility.
 */
export function assembleSession(
  questions: QuestionForAssembly[],
  dimensionIds: string[],
  sessionId: string
): AssembledQuestion[] {
  const rng = seedRandom(sessionId);

  // Group questions by dimension
  const byDimension = new Map<string, QuestionForAssembly[]>();
  for (const q of questions) {
    const existing = byDimension.get(q.dimensionId) ?? [];
    existing.push(q);
    byDimension.set(q.dimensionId, existing);
  }

  const selectedSjts: QuestionForAssembly[] = [];

  // Phase 1: Ensure at least 1 SJT per dimension
  for (const dimId of dimensionIds) {
    const pool = byDimension.get(dimId) ?? [];
    if (pool.length === 0) continue;

    const idx = Math.floor(rng() * pool.length);
    selectedSjts.push(pool[idx]);
    pool.splice(idx, 1); // Remove from pool so we don't double-pick
  }

  // Phase 1.5 (Consistency Traps): Ensure at least 2 SJTs per dimension for cross-checking
  const dimCounts = new Map<string, number>();
  for (const sjt of selectedSjts) {
    dimCounts.set(sjt.dimensionId, (dimCounts.get(sjt.dimensionId) ?? 0) + 1);
  }
  for (const dimId of dimensionIds) {
    if ((dimCounts.get(dimId) ?? 0) < 2) {
      const pool = byDimension.get(dimId) ?? [];
      if (pool.length > 0) {
        const idx = Math.floor(rng() * pool.length);
        selectedSjts.push(pool[idx]);
        pool.splice(idx, 1);
        dimCounts.set(dimId, (dimCounts.get(dimId) ?? 0) + 1);
      }
    }
  }

  // Phase 2: Fill remaining slots up to max
  const remaining = ASSESSMENT_CONFIG.MAX_SJT_QUESTIONS - selectedSjts.length;
  const allRemaining: QuestionForAssembly[] = [];
  for (const pool of byDimension.values()) {
    allRemaining.push(...pool);
  }

  // Shuffle remaining and pick up to `remaining` more
  shuffleArray(allRemaining, rng);
  for (let i = 0; i < Math.min(remaining, allRemaining.length); i++) {
    // Don't add duplicates
    if (!selectedSjts.some((s) => s.id === allRemaining[i].id)) {
      selectedSjts.push(allRemaining[i]);
    }
  }

  // Phase 3: Interleave SJT + AI_FOLLOWUP
  shuffleArray(selectedSjts, rng);

  const assembled: AssembledQuestion[] = [];
  let position = 1;

  for (const sjt of selectedSjts) {
    assembled.push({
      questionId: sjt.id,
      position: position++,
      type: "SJT",
    });
    // AI follow-up slot after each SJT
    assembled.push({
      questionId: sjt.id, // Links to the SJT it follows up on
      position: position++,
      type: "AI_FOLLOWUP",
    });
  }

  return assembled;
}

// Simple seeded PRNG (mulberry32)
function seedRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return function () {
    h |= 0;
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleArray<T>(arr: T[], rng: () => number): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
