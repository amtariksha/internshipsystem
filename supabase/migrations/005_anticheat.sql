-- Migration 005: Anti-cheat hardening + question-pool rotation + RAPID_FIRE.
--
-- Phase 5 anti-cheat features:
--   * session_questions.watermark_hash — per-question leak-tracing hash so a
--     leaked/screenshotted question can be traced back to a session.
--   * question-pool rotation reuses the existing questions.is_active column
--     (the pool queries already filter on is_active = true), so no new column
--     is added — rotate-questions.ts flips is_active.
--   * ai_collab_sessions.flagged / flag_reasons — integrity flags, mirroring the
--     columns already present on assessment_sessions and domain_sessions.
--   * domain_sessions.flagged / flag_reasons — added here too for parity; these
--     may already exist from a prior schema.sql edit, so the ADD ... IF NOT EXISTS
--     makes this safe either way.
--   * RAPID_FIRE — a new session_questions.type value (see note below).
--
-- Idempotent: safe to re-run.

-- Per-question leak-tracing watermark.
ALTER TABLE session_questions ADD COLUMN IF NOT EXISTS watermark_hash text;

-- Question-pool rotation reuses the existing questions.is_active column
-- (no new column needed — the assessment pool query filters on is_active).

-- AI collaboration session integrity flags.
ALTER TABLE ai_collab_sessions ADD COLUMN IF NOT EXISTS flagged boolean NOT NULL DEFAULT false;
ALTER TABLE ai_collab_sessions ADD COLUMN IF NOT EXISTS flag_reasons jsonb;

-- Domain session integrity flags (parity; may already exist from schema.sql).
ALTER TABLE domain_sessions ADD COLUMN IF NOT EXISTS flagged boolean NOT NULL DEFAULT false;
ALTER TABLE domain_sessions ADD COLUMN IF NOT EXISTS flag_reasons jsonb;

-- RAPID_FIRE question type.
--   session_questions.type is declared as free-text `text NOT NULL` with NO CHECK
--   constraint (see src/lib/db/schema.sql). No ALTER is therefore required to
--   allow the new 'RAPID_FIRE' value alongside existing types (e.g. 'SJT',
--   'AI_FOLLOWUP'); the application layer is responsible for validating it.
--   This block is a defensive no-op that also drops any future CHECK constraint
--   named session_questions_type_check should one be introduced later.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'session_questions_type_check'
      AND conrelid = 'session_questions'::regclass
  ) THEN
    ALTER TABLE session_questions DROP CONSTRAINT session_questions_type_check;
    ALTER TABLE session_questions ADD CONSTRAINT session_questions_type_check
      CHECK (type IN ('SJT', 'AI_FOLLOWUP', 'RAPID_FIRE'));
  END IF;
END $$;
