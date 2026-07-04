-- Migration 003: Guardian (parental) consent for under-18 users.
--
-- DPDP Act 2023 (India) requires verifiable parental consent before processing
-- the personal data of a child (under 18). These columns capture the guardian's
-- email, the token used to verify their consent link, and the timestamp at which
-- consent was granted.
--
-- SENSITIVE PII: guardian_email and guardian_consent_token are sensitive.
-- Never log these values. They are protected by the same RLS / service-role
-- boundary as the rest of the users table.
--
-- Depends on: users table (defined in src/lib/db/schema.sql).

ALTER TABLE users ADD COLUMN IF NOT EXISTS guardian_email text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS guardian_consent_at timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS guardian_consent_token text;

COMMENT ON COLUMN users.guardian_email IS
  'DPDP Act 2023: guardian/parent email for under-18 parental consent. Sensitive PII.';
COMMENT ON COLUMN users.guardian_consent_at IS
  'DPDP Act 2023: timestamp when guardian consent was granted (NULL = not yet consented).';
COMMENT ON COLUMN users.guardian_consent_token IS
  'DPDP Act 2023: one-time token embedded in the guardian consent link. Sensitive PII.';
