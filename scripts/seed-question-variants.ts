/**
 * seed-question-variants.ts
 *
 * Purpose: the te/ta/kn (and hi) locales have NO rows in `question_variants`,
 * so behavioural assessments cannot render questions in those languages and
 * fail. This script back-fills the missing locales by AI-translating the
 * English (`en`) `question_variants` + their `question_options` into each
 * target locale, with cultural adaptation of startup scenarios.
 *
 * Run:
 *   npx tsx scripts/seed-question-variants.ts            # writes to Supabase
 *   npx tsx scripts/seed-question-variants.ts --dry-run  # logs, writes nothing
 *
 * Required env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (service role — bypasses RLS)
 *   AI_GATEWAY_API_KEY          (or Vercel OIDC in a Vercel runtime) for the
 *                               AI SDK gateway used by generateText().
 *
 * Schema notes (see src/lib/db/schema.sql):
 *   question_variants(id, question_id, locale, scenario, prompt)
 *     UNIQUE(question_id, locale)
 *   question_options(id, question_id, position, locale, text, weights jsonb)
 *     UNIQUE(question_id, position, locale)
 *   There is NO `needs_review`/`notes` column on question_variants, so AI-
 *   generated rows are flagged for human review by (a) logging every inserted
 *   (question_id, locale) pair and (b) writing them to scripts/seed-output.json.
 *   `question_options.weights` is scoring data and is locale-independent, so it
 *   is copied verbatim from the English row — only `text` is translated.
 *
 * Idempotent: a (question_id, locale) pair that already exists is skipped, so
 * the script can be re-run safely (e.g. after adding new English questions).
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { generateText, Output } from "ai";
import { z } from "zod";

const SOURCE_LOCALE = "en";
const TARGET_LOCALES = ["hi", "te", "ta", "kn"] as const;
type TargetLocale = (typeof TARGET_LOCALES)[number];

const MODEL = "anthropic/claude-sonnet-4.6";

const OUTPUT_PATH = resolve(process.cwd(), "scripts/seed-output.json");

const LOCALE_LABELS: Record<TargetLocale, string> = {
  hi: "Hindi",
  te: "Telugu",
  ta: "Tamil",
  kn: "Kannada",
};

interface EnglishVariant {
  question_id: string;
  scenario: string;
  prompt: string;
}

interface EnglishOption {
  question_id: string;
  position: number;
  text: string;
  weights: unknown;
}

interface TranslatedRow {
  question_id: string;
  locale: TargetLocale;
}

const translationSchema = z.object({
  scenario: z.string().min(1),
  prompt: z.string().min(1),
  options: z.array(z.object({ position: z.number().int(), text: z.string().min(1) })),
});

type Translation = z.infer<typeof translationSchema>;

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

function buildTranslationPrompt(
  localeLabel: string,
  variant: EnglishVariant,
  options: EnglishOption[]
): string {
  const optionLines = options
    .map((o) => `  ${o.position}: ${o.text}`)
    .join("\n");

  return [
    `You are localising a situational-judgement assessment question into ${localeLabel}.`,
    `Translate the scenario, the prompt, and every option below into natural, fluent ${localeLabel}.`,
    ``,
    `This is a CULTURAL ADAPTATION, not a literal translation:`,
    `- Adapt startup / business scenarios so they feel locally relevant to a ${localeLabel}-speaking`,
    `  audience in India (names, cities, products, market context), while keeping the underlying`,
    `  decision, difficulty, and what each option signals EXACTLY the same.`,
    `- Do NOT change the number of options, their order, or their meaning — option N in your output`,
    `  must correspond to option N in the input so the scoring weights still apply.`,
    `- Keep it concise and professional. Use the ${localeLabel} script (not transliteration).`,
    ``,
    `SCENARIO:`,
    variant.scenario,
    ``,
    `PROMPT:`,
    variant.prompt,
    ``,
    `OPTIONS (position: text):`,
    optionLines,
  ].join("\n");
}

async function translateVariant(
  localeLabel: string,
  variant: EnglishVariant,
  options: EnglishOption[]
): Promise<Translation> {
  const result = await generateText({
    model: MODEL,
    output: Output.object({ schema: translationSchema }),
    prompt: buildTranslationPrompt(localeLabel, variant, options),
  });

  if (!result.output) {
    throw new Error("AI translation returned no structured output");
  }
  return result.output;
}

async function fetchEnglishVariants(sb: SupabaseClient): Promise<EnglishVariant[]> {
  const { data, error } = await sb
    .from("question_variants")
    .select("question_id, scenario, prompt")
    .eq("locale", SOURCE_LOCALE);
  if (error) {
    throw new Error(`Failed to fetch ${SOURCE_LOCALE} variants: ${error.message}`);
  }
  return (data ?? []) as EnglishVariant[];
}

async function fetchEnglishOptions(
  sb: SupabaseClient,
  questionId: string
): Promise<EnglishOption[]> {
  const { data, error } = await sb
    .from("question_options")
    .select("question_id, position, text, weights")
    .eq("locale", SOURCE_LOCALE)
    .eq("question_id", questionId)
    .order("position");
  if (error) {
    throw new Error(
      `Failed to fetch ${SOURCE_LOCALE} options for ${questionId}: ${error.message}`
    );
  }
  return (data ?? []) as EnglishOption[];
}

async function fetchExistingPairs(
  sb: SupabaseClient
): Promise<Set<string>> {
  const { data, error } = await sb
    .from("question_variants")
    .select("question_id, locale")
    .in("locale", [...TARGET_LOCALES]);
  if (error) {
    throw new Error(`Failed to fetch existing variant pairs: ${error.message}`);
  }
  const set = new Set<string>();
  for (const row of (data ?? []) as { question_id: string; locale: string }[]) {
    set.add(`${row.question_id}:${row.locale}`);
  }
  return set;
}

async function insertVariant(
  sb: SupabaseClient,
  questionId: string,
  locale: TargetLocale,
  translation: Translation,
  englishOptions: EnglishOption[]
): Promise<void> {
  const { error: variantError } = await sb.from("question_variants").insert({
    question_id: questionId,
    locale,
    scenario: translation.scenario,
    prompt: translation.prompt,
  });
  if (variantError) {
    throw new Error(
      `Insert question_variant failed (${questionId}, ${locale}): ${variantError.message}`
    );
  }

  // Map translated text back onto the English option's position + weights.
  const weightsByPosition = new Map(
    englishOptions.map((o) => [o.position, o.weights])
  );

  const optionRows = translation.options
    .filter((o) => weightsByPosition.has(o.position))
    .map((o) => ({
      question_id: questionId,
      position: o.position,
      locale,
      text: o.text,
      weights: weightsByPosition.get(o.position),
    }));

  if (optionRows.length !== englishOptions.length) {
    throw new Error(
      `Option count mismatch for (${questionId}, ${locale}): ` +
        `expected ${englishOptions.length}, got ${optionRows.length}. Aborting to avoid partial rows.`
    );
  }

  const { error: optionsError } = await sb.from("question_options").insert(optionRows);
  if (optionsError) {
    throw new Error(
      `Insert question_options failed (${questionId}, ${locale}): ${optionsError.message}`
    );
  }
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  const sb = getServiceRoleClient();

  console.log(
    `seed-question-variants: source=${SOURCE_LOCALE} targets=[${TARGET_LOCALES.join(
      ", "
    )}]${dryRun ? " (DRY RUN — no writes)" : ""}`
  );

  const englishVariants = await fetchEnglishVariants(sb);
  if (englishVariants.length === 0) {
    console.error(
      `No '${SOURCE_LOCALE}' question_variants found. Seed the English variants first.`
    );
    process.exit(1);
  }
  const existingPairs = await fetchExistingPairs(sb);

  console.log(`Found ${englishVariants.length} English variants to consider.\n`);

  const inserted: TranslatedRow[] = [];
  const perLocaleInserted: Record<TargetLocale, number> = { hi: 0, te: 0, ta: 0, kn: 0 };
  const perLocaleSkipped: Record<TargetLocale, number> = { hi: 0, te: 0, ta: 0, kn: 0 };
  let failures = 0;

  for (const locale of TARGET_LOCALES) {
    const localeLabel = LOCALE_LABELS[locale];
    for (const variant of englishVariants) {
      const pairKey = `${variant.question_id}:${locale}`;
      if (existingPairs.has(pairKey)) {
        perLocaleSkipped[locale] += 1;
        continue;
      }

      const englishOptions = await fetchEnglishOptions(sb, variant.question_id);
      if (englishOptions.length === 0) {
        console.warn(
          `  [skip] ${variant.question_id} ${locale}: no ${SOURCE_LOCALE} options found`
        );
        continue;
      }

      try {
        if (dryRun) {
          console.log(
            `  [would insert] ${variant.question_id} -> ${locale} ` +
              `(${englishOptions.length} options)`
          );
          inserted.push({ question_id: variant.question_id, locale });
          perLocaleInserted[locale] += 1;
          continue;
        }

        const translation = await translateVariant(localeLabel, variant, englishOptions);
        await insertVariant(sb, variant.question_id, locale, translation, englishOptions);

        inserted.push({ question_id: variant.question_id, locale });
        perLocaleInserted[locale] += 1;
        console.log(`  [inserted] ${variant.question_id} -> ${locale}`);
      } catch (err) {
        failures += 1;
        const message = err instanceof Error ? err.message : String(err);
        console.error(`  [FAIL] ${variant.question_id} -> ${locale}: ${message}`);
      }
    }
  }

  console.log(`\n── Summary ─────────────────────────────`);
  for (const locale of TARGET_LOCALES) {
    console.log(
      `  ${locale}: inserted=${perLocaleInserted[locale]} skipped=${perLocaleSkipped[locale]}`
    );
  }
  console.log(`  total inserted=${inserted.length} failures=${failures}`);

  // Persist the list of AI-generated (question_id, locale) pairs so a human can
  // review the translated rows (there is no needs_review column to flag in-DB).
  const report = {
    generatedAt: new Date().toISOString(),
    dryRun,
    model: MODEL,
    inserted,
    counts: { inserted: perLocaleInserted, skipped: perLocaleSkipped, failures },
  };
  writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2));
  console.log(
    `\nWrote review list of ${inserted.length} AI-generated rows to ${OUTPUT_PATH}` +
      ` — please human-review these before relying on them.`
  );

  if (failures > 0) process.exit(1);
}

main().catch((err) => {
  console.error("seed-question-variants failed:", err);
  process.exit(1);
});
