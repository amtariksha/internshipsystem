-- Migration 004: Multi-locale report narratives cache.
--
-- Phase 5 feature: a user's report can be rendered in a language different from
-- the language the assessment was taken in. Generating a narrative in another
-- language is expensive (LLM call), so cache each generated narrative per locale.
--
-- The existing reports.narrative / reports.locale remain the default (first)
-- language; report_narratives holds additional on-demand translations.
--
-- Depends on: reports table + generate_cuid() (defined in src/lib/db/schema.sql).

CREATE TABLE IF NOT EXISTS report_narratives (
  id            text PRIMARY KEY DEFAULT generate_cuid(),
  report_id     text NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  locale        text NOT NULL,
  narrative     jsonb NOT NULL,
  generated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(report_id, locale)
);

CREATE INDEX IF NOT EXISTS idx_report_narratives_lookup ON report_narratives(report_id, locale);
