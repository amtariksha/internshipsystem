-- AEDHAS Database Schema (Supabase)
-- Run this in Supabase SQL Editor (Mumbai region for DPDP Act compliance)

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Helper function for cuid-like IDs
CREATE OR REPLACE FUNCTION generate_cuid() RETURNS text AS $$
  SELECT encode(gen_random_bytes(16), 'hex')
$$ LANGUAGE sql;

-- ─── USERS ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id              text PRIMARY KEY DEFAULT generate_cuid(),
  clerk_id        text UNIQUE NOT NULL,
  email           text UNIQUE NOT NULL,
  name            text NOT NULL,
  date_of_birth   date NOT NULL,
  age             integer NOT NULL,
  preferred_locale text NOT NULL DEFAULT 'en',
  age_verified    boolean NOT NULL DEFAULT false,
  role            text NOT NULL DEFAULT 'STUDENT',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- ─── DIMENSIONS ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS dimensions (
  id              text PRIMARY KEY DEFAULT generate_cuid(),
  code            text UNIQUE NOT NULL,
  name_key        text NOT NULL,
  description     text NOT NULL DEFAULT '',
  category        text NOT NULL,
  max_score       real NOT NULL DEFAULT 5.0,
  startup_weight  real NOT NULL DEFAULT 1.0,
  general_weight  real NOT NULL DEFAULT 1.0,
  sort_order      integer NOT NULL DEFAULT 0
);

-- ─── QUESTIONS (SJT Pool) ────────────────────────────────────

CREATE TABLE IF NOT EXISTS questions (
  id              text PRIMARY KEY DEFAULT generate_cuid(),
  code            text UNIQUE NOT NULL,
  dimension_id    text NOT NULL REFERENCES dimensions(id),
  scenario_type   text NOT NULL,
  difficulty      integer NOT NULL DEFAULT 3,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_questions_dimension ON questions(dimension_id, is_active);

CREATE TABLE IF NOT EXISTS question_variants (
  id              text PRIMARY KEY DEFAULT generate_cuid(),
  question_id     text NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  locale          text NOT NULL,
  scenario        text NOT NULL,
  prompt          text NOT NULL,
  UNIQUE(question_id, locale)
);

CREATE INDEX IF NOT EXISTS idx_question_variants_lookup ON question_variants(question_id, locale);

CREATE TABLE IF NOT EXISTS question_options (
  id              text PRIMARY KEY DEFAULT generate_cuid(),
  question_id     text NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  position        integer NOT NULL,
  locale          text NOT NULL,
  text            text NOT NULL,
  weights         jsonb NOT NULL,
  UNIQUE(question_id, position, locale)
);

CREATE INDEX IF NOT EXISTS idx_question_options_lookup ON question_options(question_id, locale);

-- ─── ASSESSMENT SESSIONS ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS assessment_sessions (
  id              text PRIMARY KEY DEFAULT generate_cuid(),
  user_id         text NOT NULL REFERENCES users(id),
  locale          text NOT NULL,
  weight_profile  text NOT NULL DEFAULT 'STARTUP_FOUNDER',
  status          text NOT NULL DEFAULT 'IN_PROGRESS',
  started_at      timestamptz NOT NULL DEFAULT now(),
  completed_at    timestamptz,
  integrity_score real,
  tab_switch_count integer NOT NULL DEFAULT 0,
  copy_paste_count integer NOT NULL DEFAULT 0,
  flagged         boolean NOT NULL DEFAULT false,
  flag_reasons    jsonb
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON assessment_sessions(user_id, status);

CREATE TABLE IF NOT EXISTS session_questions (
  id              text PRIMARY KEY DEFAULT generate_cuid(),
  session_id      text NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  question_id     text NOT NULL REFERENCES questions(id),
  position        integer NOT NULL,
  type            text NOT NULL,
  ai_prompt       text,
  UNIQUE(session_id, position)
);

CREATE INDEX IF NOT EXISTS idx_session_questions_session ON session_questions(session_id);

-- ─── RESPONSES ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS responses (
  id                  text PRIMARY KEY DEFAULT generate_cuid(),
  session_id          text NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  session_question_id text UNIQUE NOT NULL REFERENCES session_questions(id),
  selected_option     integer,
  option_ranking      jsonb,
  sjt_score           real,
  free_text           text,
  ai_analysis         jsonb,
  ai_score            real,
  started_at          timestamptz NOT NULL,
  completed_at        timestamptz NOT NULL,
  duration_ms         integer NOT NULL,
  confidence          real,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_responses_session ON responses(session_id);

-- ─── SCORES & REPORTS ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS dimension_scores (
  id              text PRIMARY KEY DEFAULT generate_cuid(),
  session_id      text NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  dimension_id    text NOT NULL REFERENCES dimensions(id),
  raw_score       real NOT NULL,
  confidence      real NOT NULL,
  normalized      real NOT NULL,
  UNIQUE(session_id, dimension_id)
);

CREATE TABLE IF NOT EXISTS reports (
  id              text PRIMARY KEY DEFAULT generate_cuid(),
  session_id      text UNIQUE NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  composite_score real NOT NULL,
  tier_startup    text NOT NULL,
  tier_tech       text NOT NULL,
  tier_consultant text NOT NULL,
  tier_team       text NOT NULL,
  commitment_flag boolean NOT NULL DEFAULT false,
  narrative       jsonb NOT NULL,
  astro_insights  jsonb,
  locale          text NOT NULL,
  slug            text UNIQUE NOT NULL DEFAULT generate_cuid(),
  generated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reports_slug ON reports(slug);

-- ─── ASTROCAREER ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS astro_profiles (
  id              text PRIMARY KEY DEFAULT generate_cuid(),
  user_id         text NOT NULL REFERENCES users(id),
  mode            text NOT NULL,
  name            text NOT NULL,
  name_script     text NOT NULL DEFAULT 'latin',
  date_of_birth   date NOT NULL,
  birth_time      time,
  birth_place     text,
  latitude        real,
  longitude       real,
  destiny_number  integer,
  soul_number     integer,
  personality_num integer,
  sun_sign        text,
  moon_sign       text,
  ascendant       text,
  planetary_data  jsonb,
  house_data      jsonb,
  dasha_data      jsonb,
  top_careers     jsonb NOT NULL,
  locale          text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_astro_profiles_user ON astro_profiles(user_id);

-- ─── RPC FUNCTIONS (for complex JOINs used by API routes) ────

-- Get session question with dimension info
CREATE OR REPLACE FUNCTION get_session_question_detail(
  p_session_question_id text,
  p_session_id text
) RETURNS TABLE (
  id text, position integer, type text, question_id text,
  dim_code text, dim_name text, dim_desc text
) LANGUAGE sql STABLE AS $$
  SELECT sq.id, sq.position, sq.type, sq.question_id,
         d.code, d.name_key, d.description
  FROM session_questions sq
  JOIN questions q ON q.id = sq.question_id
  JOIN dimensions d ON d.id = q.dimension_id
  WHERE sq.id = p_session_question_id AND sq.session_id = p_session_id;
$$;

-- Get next session question with dimension info
CREATE OR REPLACE FUNCTION get_next_session_question(
  p_session_id text,
  p_position integer
) RETURNS TABLE (
  sq_id text, type text, position integer, question_id text,
  dim_name text, dim_desc text
) LANGUAGE sql STABLE AS $$
  SELECT sq.id, sq.type, sq.position, sq.question_id,
         d.name_key, d.description
  FROM session_questions sq
  JOIN questions q ON q.id = sq.question_id
  JOIN dimensions d ON d.id = q.dimension_id
  WHERE sq.session_id = p_session_id AND sq.position = p_position;
$$;

-- Get first question of a session with variant and dimension
CREATE OR REPLACE FUNCTION get_first_session_question(
  p_session_id text,
  p_locale text
) RETURNS TABLE (
  sq_id text, type text, position integer,
  scenario text, prompt text, dimension_name text
) LANGUAGE sql STABLE AS $$
  SELECT sq.id, sq.type, sq.position,
         qv.scenario, qv.prompt, d.name_key
  FROM session_questions sq
  JOIN question_variants qv ON qv.question_id = sq.question_id AND qv.locale = p_locale
  JOIN questions q ON q.id = sq.question_id
  JOIN dimensions d ON d.id = q.dimension_id
  WHERE sq.session_id = p_session_id AND sq.position = 1
  LIMIT 1;
$$;

-- Get first question options
CREATE OR REPLACE FUNCTION get_session_question_options(
  p_session_id text,
  p_position integer,
  p_locale text
) RETURNS TABLE (position integer, text text) LANGUAGE sql STABLE AS $$
  SELECT qo.position, qo.text
  FROM question_options qo
  JOIN session_questions sq ON sq.question_id = qo.question_id
  WHERE sq.session_id = p_session_id AND sq.position = p_position AND qo.locale = p_locale
  ORDER BY qo.position;
$$;

-- Validate session belongs to clerk user and is in given status
CREATE OR REPLACE FUNCTION validate_session(
  p_session_id text,
  p_clerk_id text,
  p_status text
) RETURNS TABLE (
  id text, locale text, weight_profile text,
  tab_switch_count integer, copy_paste_count integer, user_age integer
) LANGUAGE sql STABLE AS $$
  SELECT s.id, s.locale, s.weight_profile,
         s.tab_switch_count, s.copy_paste_count, u.age
  FROM assessment_sessions s
  JOIN users u ON u.id = s.user_id
  WHERE s.id = p_session_id AND s.status = p_status AND u.clerk_id = p_clerk_id;
$$;

-- Get all responses with dimension info for scoring
CREATE OR REPLACE FUNCTION get_session_responses(
  p_session_id text
) RETURNS TABLE (
  sjt_score real, ai_score real, confidence real, duration_ms integer,
  type text, dim_id text, dim_code text, dim_name text
) LANGUAGE sql STABLE AS $$
  SELECT r.sjt_score, r.ai_score, r.confidence, r.duration_ms,
         sq.type, d.id, d.code, d.name_key
  FROM responses r
  JOIN session_questions sq ON sq.id = r.session_question_id
  JOIN questions q ON q.id = sq.question_id
  JOIN dimensions d ON d.id = q.dimension_id
  WHERE r.session_id = p_session_id;
$$;

-- Get report with user name
CREATE OR REPLACE FUNCTION get_report_by_slug(
  p_slug text
) RETURNS TABLE (
  id text, session_id text, composite_score real,
  tier_startup text, tier_tech text, tier_consultant text, tier_team text,
  commitment_flag boolean, narrative jsonb, locale text,
  slug text, generated_at timestamptz, user_name text
) LANGUAGE sql STABLE AS $$
  SELECT r.id, r.session_id, r.composite_score,
         r.tier_startup, r.tier_tech, r.tier_consultant, r.tier_team,
         r.commitment_flag, r.narrative, r.locale,
         r.slug, r.generated_at, u.name
  FROM reports r
  JOIN assessment_sessions s ON s.id = r.session_id
  JOIN users u ON u.id = s.user_id
  WHERE r.slug = p_slug;
$$;

-- Get dimension scores for a session
CREATE OR REPLACE FUNCTION get_dimension_scores(
  p_session_id text
) RETURNS TABLE (
  normalized real, confidence real, name_key text, code text
) LANGUAGE sql STABLE AS $$
  SELECT ds.normalized, ds.confidence, d.name_key, d.code
  FROM dimension_scores ds
  JOIN dimensions d ON d.id = ds.dimension_id
  WHERE ds.session_id = p_session_id
  ORDER BY d.sort_order;
$$;

-- Upsert user from Clerk webhook
CREATE OR REPLACE FUNCTION upsert_user_from_clerk(
  p_clerk_id text, p_email text, p_name text,
  p_dob date, p_age integer, p_locale text, p_age_verified boolean
) RETURNS void LANGUAGE sql AS $$
  INSERT INTO users (clerk_id, email, name, date_of_birth, age, preferred_locale, age_verified)
  VALUES (p_clerk_id, p_email, p_name, p_dob, p_age, p_locale, p_age_verified)
  ON CONFLICT (clerk_id) DO UPDATE SET
    email = p_email, name = p_name, date_of_birth = p_dob,
    age = p_age, preferred_locale = p_locale, age_verified = p_age_verified,
    updated_at = now();
$$;

-- Increment anti-cheat counters
CREATE OR REPLACE FUNCTION increment_anti_cheat(
  p_session_id text,
  p_tab_delta integer,
  p_paste_delta integer
) RETURNS void LANGUAGE sql AS $$
  UPDATE assessment_sessions SET
    tab_switch_count = tab_switch_count + p_tab_delta,
    copy_paste_count = copy_paste_count + p_paste_delta
  WHERE id = p_session_id;
$$;

-- ─── USER EDUCATION COLUMNS (Phase 1) ────────────────────────

ALTER TABLE users ADD COLUMN IF NOT EXISTS educational_stage text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS field_of_study text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS year_of_study integer;
ALTER TABLE users ADD COLUMN IF NOT EXISTS year_of_graduation integer;
ALTER TABLE users ADD COLUMN IF NOT EXISTS backlog_count integer NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS employment_status text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_complete boolean NOT NULL DEFAULT false;

-- ─── DOMAIN KNOWLEDGE TABLES ─────────────────────────────────

CREATE TABLE IF NOT EXISTS domain_questions (
  id              text PRIMARY KEY DEFAULT generate_cuid(),
  code            text UNIQUE NOT NULL,
  domain          text NOT NULL,
  subdomain       text,
  difficulty      integer NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_domain_questions_domain_diff ON domain_questions(domain, difficulty, is_active);

CREATE TABLE IF NOT EXISTS domain_question_variants (
  id              text PRIMARY KEY DEFAULT generate_cuid(),
  question_id     text NOT NULL REFERENCES domain_questions(id) ON DELETE CASCADE,
  locale          text NOT NULL,
  question_text   text NOT NULL,
  explanation     text,
  UNIQUE(question_id, locale)
);

CREATE INDEX IF NOT EXISTS idx_domain_qv_lookup ON domain_question_variants(question_id, locale);

CREATE TABLE IF NOT EXISTS domain_question_options (
  id              text PRIMARY KEY DEFAULT generate_cuid(),
  question_id     text NOT NULL REFERENCES domain_questions(id) ON DELETE CASCADE,
  position        integer NOT NULL,
  locale          text NOT NULL,
  text            text NOT NULL,
  is_correct      boolean NOT NULL DEFAULT false,
  UNIQUE(question_id, position, locale)
);

CREATE INDEX IF NOT EXISTS idx_domain_qo_lookup ON domain_question_options(question_id, locale);

CREATE TABLE IF NOT EXISTS domain_sessions (
  id                text PRIMARY KEY DEFAULT generate_cuid(),
  user_id           text NOT NULL REFERENCES users(id),
  domain            text NOT NULL,
  locale            text NOT NULL,
  status            text NOT NULL DEFAULT 'IN_PROGRESS',
  current_difficulty integer NOT NULL DEFAULT 3,
  questions_answered integer NOT NULL DEFAULT 0,
  correct_count     integer NOT NULL DEFAULT 0,
  confidence_met    boolean NOT NULL DEFAULT false,
  started_at        timestamptz NOT NULL DEFAULT now(),
  completed_at      timestamptz,
  ability_estimate  real NOT NULL DEFAULT 0.0,
  standard_error    real NOT NULL DEFAULT 1.0
);

CREATE INDEX IF NOT EXISTS idx_domain_sessions_user ON domain_sessions(user_id, domain, status);

CREATE TABLE IF NOT EXISTS domain_responses (
  id                    text PRIMARY KEY DEFAULT generate_cuid(),
  session_id            text NOT NULL REFERENCES domain_sessions(id) ON DELETE CASCADE,
  question_id           text NOT NULL REFERENCES domain_questions(id),
  position              integer NOT NULL,
  selected_option       integer,
  is_correct            boolean,
  difficulty            integer NOT NULL,
  ai_followup_prompt    text,
  ai_followup_response  text,
  ai_followup_score     real,
  ai_followup_analysis  jsonb,
  started_at            timestamptz NOT NULL,
  completed_at          timestamptz NOT NULL,
  duration_ms           integer NOT NULL,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_domain_responses_session ON domain_responses(session_id);

CREATE TABLE IF NOT EXISTS domain_scores (
  id                text PRIMARY KEY DEFAULT generate_cuid(),
  session_id        text UNIQUE NOT NULL REFERENCES domain_sessions(id) ON DELETE CASCADE,
  domain            text NOT NULL,
  mcq_score         real NOT NULL,
  ai_probe_score    real,
  composite_score   real NOT NULL,
  proficiency_level text NOT NULL,
  ability_estimate  real NOT NULL,
  questions_total   integer NOT NULL,
  questions_correct integer NOT NULL,
  backlog_count     integer NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ─── AI COLLABORATION TABLES ─────────────────────────────────

CREATE TABLE IF NOT EXISTS ai_challenges (
  id                      text PRIMARY KEY DEFAULT generate_cuid(),
  code                    text UNIQUE NOT NULL,
  domain                  text NOT NULL,
  difficulty              integer NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  target_role             text NOT NULL DEFAULT 'STUDENT',
  title                   text NOT NULL,
  description_en          text NOT NULL,
  description_hi          text NOT NULL,
  starter_context         text NOT NULL DEFAULT '',
  expected_output_criteria jsonb NOT NULL DEFAULT '[]'::jsonb,
  time_limit_minutes      integer NOT NULL DEFAULT 30,
  is_active               boolean NOT NULL DEFAULT true,
  created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_challenges_domain ON ai_challenges(domain, difficulty, target_role, is_active);

CREATE TABLE IF NOT EXISTS ai_collab_sessions (
  id                  text PRIMARY KEY DEFAULT generate_cuid(),
  user_id             text NOT NULL REFERENCES users(id),
  challenge_id        text NOT NULL REFERENCES ai_challenges(id),
  locale              text NOT NULL,
  status              text NOT NULL DEFAULT 'IN_PROGRESS',
  started_at          timestamptz NOT NULL DEFAULT now(),
  completed_at        timestamptz,
  time_limit_minutes  integer NOT NULL DEFAULT 30,
  total_prompts       integer NOT NULL DEFAULT 0,
  total_iterations    integer NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_ai_collab_sessions_user ON ai_collab_sessions(user_id, status);

CREATE TABLE IF NOT EXISTS ai_collab_messages (
  id                text PRIMARY KEY DEFAULT generate_cuid(),
  session_id        text NOT NULL REFERENCES ai_collab_sessions(id) ON DELETE CASCADE,
  position          integer NOT NULL,
  role              text NOT NULL,
  content           text NOT NULL,
  timestamp         timestamptz NOT NULL DEFAULT now(),
  prompt_complexity real,
  token_count       integer
);

CREATE INDEX IF NOT EXISTS idx_ai_collab_messages_session ON ai_collab_messages(session_id, position);

CREATE TABLE IF NOT EXISTS ai_collab_scores (
  id                    text PRIMARY KEY DEFAULT generate_cuid(),
  session_id            text UNIQUE NOT NULL REFERENCES ai_collab_sessions(id) ON DELETE CASCADE,
  challenge_id          text NOT NULL REFERENCES ai_challenges(id),
  decomposition_score   real NOT NULL DEFAULT 0,
  first_principles_score real NOT NULL DEFAULT 0,
  debugging_score       real NOT NULL DEFAULT 0,
  communication_score   real NOT NULL DEFAULT 0,
  efficiency_score      real NOT NULL DEFAULT 0,
  quality_score         real NOT NULL DEFAULT 0,
  iteration_score       real NOT NULL DEFAULT 0,
  creativity_score      real NOT NULL DEFAULT 0,
  composite_score       real NOT NULL DEFAULT 0,
  proficiency_level     text NOT NULL DEFAULT 'BEGINNER',
  ai_analysis           jsonb,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- ─── EXTEND REPORTS TABLE ────────────────────────────────────

ALTER TABLE reports ADD COLUMN IF NOT EXISTS domain_session_id text REFERENCES domain_sessions(id);
ALTER TABLE reports ADD COLUMN IF NOT EXISTS domain_score jsonb;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS ai_collab_session_id text REFERENCES ai_collab_sessions(id);
ALTER TABLE reports ADD COLUMN IF NOT EXISTS ai_collab_score jsonb;

-- ─── DOMAIN KNOWLEDGE RPC FUNCTIONS ──────────────────────────

CREATE OR REPLACE FUNCTION get_domain_questions_by_difficulty(
  p_domain text,
  p_difficulty integer,
  p_locale text,
  p_exclude_ids text[]
) RETURNS TABLE (
  question_id text, code text, difficulty integer, subdomain text,
  question_text text, explanation text
) LANGUAGE sql STABLE AS $$
  SELECT dq.id, dq.code, dq.difficulty, dq.subdomain,
         dqv.question_text, dqv.explanation
  FROM domain_questions dq
  JOIN domain_question_variants dqv ON dqv.question_id = dq.id AND dqv.locale = p_locale
  WHERE dq.domain = p_domain
    AND dq.difficulty = p_difficulty
    AND dq.is_active = true
    AND (p_exclude_ids IS NULL OR dq.id != ALL(p_exclude_ids))
  ORDER BY random()
  LIMIT 5;
$$;

CREATE OR REPLACE FUNCTION update_user_education(
  p_clerk_id text,
  p_educational_stage text,
  p_field_of_study text,
  p_year_of_study integer,
  p_year_of_graduation integer,
  p_backlog_count integer,
  p_employment_status text
) RETURNS void LANGUAGE sql AS $$
  UPDATE users SET
    educational_stage = p_educational_stage,
    field_of_study = p_field_of_study,
    year_of_study = p_year_of_study,
    year_of_graduation = p_year_of_graduation,
    backlog_count = COALESCE(p_backlog_count, 0),
    employment_status = p_employment_status,
    onboarding_complete = true,
    updated_at = now()
  WHERE clerk_id = p_clerk_id;
$$;

CREATE OR REPLACE FUNCTION get_user_profile(
  p_clerk_id text
) RETURNS TABLE (
  id text, name text, age integer, educational_stage text,
  field_of_study text, year_of_study integer, year_of_graduation integer,
  backlog_count integer, employment_status text, preferred_locale text,
  onboarding_complete boolean
) LANGUAGE sql STABLE AS $$
  SELECT id, name, age, educational_stage,
         field_of_study, year_of_study, year_of_graduation,
         backlog_count, employment_status, preferred_locale,
         onboarding_complete
  FROM users WHERE clerk_id = p_clerk_id;
$$;

-- Get report with user name (extended with domain + AI collab)
CREATE OR REPLACE FUNCTION get_report_by_slug(
  p_slug text
) RETURNS TABLE (
  id text, session_id text, composite_score real,
  tier_startup text, tier_tech text, tier_consultant text, tier_team text,
  commitment_flag boolean, narrative jsonb, locale text,
  slug text, generated_at timestamptz, user_name text,
  domain_session_id text, domain_score jsonb,
  ai_collab_session_id text, ai_collab_score jsonb
) LANGUAGE sql STABLE AS $$
  SELECT r.id, r.session_id, r.composite_score,
         r.tier_startup, r.tier_tech, r.tier_consultant, r.tier_team,
         r.commitment_flag, r.narrative, r.locale,
         r.slug, r.generated_at, u.name,
         r.domain_session_id, r.domain_score,
         r.ai_collab_session_id, r.ai_collab_score
  FROM reports r
  JOIN assessment_sessions s ON s.id = r.session_id
  JOIN users u ON u.id = s.user_id
  WHERE r.slug = p_slug;
$$;

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dimensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE dimension_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE astro_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_question_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_collab_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_collab_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_collab_scores ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically.
CREATE POLICY IF NOT EXISTS "dimensions_read_all" ON dimensions FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "reports_read_by_slug" ON reports FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "domain_questions_read_all" ON domain_questions FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "domain_qv_read_all" ON domain_question_variants FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "domain_qo_read_all" ON domain_question_options FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "ai_challenges_read_all" ON ai_challenges FOR SELECT USING (true);
