/**
 * rotate-questions.ts
 *
 * Purpose: PRD question-pool rotation. To limit exposure/leakage of the SJT
 * question pool, retire ~20% of the active questions every 60–90 days. Retired
 * questions are set inactive (never deleted) so historical sessions/reports that
 * reference them stay intact.
 *
 * Rotation toggles the existing `questions.is_active` column — the same flag the
 * assessment pool query filters on (assessment/start route), so retiring a
 * question removes it from future sessions.
 *
 * Run:
 *   npx tsx scripts/rotate-questions.ts                 # retire ~20%
 *   npx tsx scripts/rotate-questions.ts --percent 25    # retire ~25%
 *   npx tsx scripts/rotate-questions.ts --dry-run       # log only, no writes
 *
 * Can be scheduled via cron (see DEPLOYMENT.md → Maintenance Scripts).
 *
 * Required env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (service role — bypasses RLS)
 *
 * Selection is deterministic: among currently-active questions, the OLDEST by
 * created_at (then id, as a stable tie-breaker) are retired first. This makes
 * runs reproducible and naturally rotates the pool over time.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_PERCENT = 20;

interface QuestionRow {
  id: string;
  code: string;
  created_at: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(
      `Missing required env var: ${name}. ` +
        `Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running.`
    );
    process.exit(1);
  }
  return value;
}

function getServiceRoleClient(): SupabaseClient {
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

function parsePercent(argv: string[]): number {
  const idx = argv.indexOf("--percent");
  if (idx === -1) return DEFAULT_PERCENT;

  const raw = argv[idx + 1];
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed >= 100) {
    console.error(
      `Invalid --percent value: ${raw ?? "(missing)"}. Must be a number in (0, 100).`
    );
    process.exit(1);
  }
  return parsed;
}

async function fetchActiveQuestions(sb: SupabaseClient): Promise<QuestionRow[]> {
  // Oldest first, id as a stable tie-breaker → deterministic selection.
  const { data, error } = await sb
    .from("questions")
    .select("id, code, created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });
  if (error) {
    throw new Error(`Failed to fetch active questions: ${error.message}`);
  }
  return (data ?? []) as QuestionRow[];
}

async function retire(sb: SupabaseClient, ids: string[]): Promise<void> {
  const { error } = await sb.from("questions").update({ is_active: false }).in("id", ids);
  if (error) {
    throw new Error(`Failed to retire questions: ${error.message}`);
  }
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  const percent = parsePercent(process.argv);
  const sb = getServiceRoleClient();

  const active = await fetchActiveQuestions(sb);
  const totalActive = active.length;

  if (totalActive === 0) {
    console.log("No active questions found — nothing to rotate.");
    return;
  }

  // Retire ~percent%, at least 1 question when any are active.
  const retireCount = Math.max(1, Math.floor((totalActive * percent) / 100));
  const toRetire = active.slice(0, retireCount);

  console.log(
    `rotate-questions: ${totalActive} active, retiring ${toRetire.length} (~${percent}%)` +
      `${dryRun ? " (DRY RUN — no writes)" : ""}`
  );
  for (const q of toRetire) {
    console.log(`  retire ${q.id} (${q.code}) created_at=${q.created_at}`);
  }

  if (dryRun) {
    console.log(`\nDRY RUN complete — no questions were modified.`);
    return;
  }

  await retire(
    sb,
    toRetire.map((q) => q.id)
  );

  console.log(
    `\nRetired ${toRetire.length} question(s). ${totalActive - toRetire.length} remain active. ` +
      `Nothing was deleted.`
  );
}

main().catch((err) => {
  console.error("rotate-questions failed:", err);
  process.exit(1);
});
