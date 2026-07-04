-- Migration 001: Scope the reports SELECT policy to the report owner.
--
-- Context:
--   src/lib/db/schema.sql (RLS section) created a permissive policy:
--     CREATE POLICY "reports_read_by_slug" ON reports FOR SELECT USING (true);
--   which lets ANY role subject to RLS (anon / authenticated) read every row
--   in reports — the unguessable slug was the only protection.
--
-- Defense-in-depth note:
--   The app currently talks to Supabase exclusively with the SERVICE ROLE key
--   (src/lib/db/supabase.ts), and the service role BYPASSES RLS entirely.
--   The primary authorization boundary is therefore the app-level ownership
--   check in src/app/[locale]/(dashboard)/reports/[slug]/page.tsx.
--   This policy exists so that any future non-service-role access path
--   (e.g. a browser Supabase client authenticated with a Clerk-issued JWT)
--   is still restricted to the caller's own reports.

DROP POLICY IF EXISTS "reports_read_by_slug" ON reports;
-- Idempotent: drop the owner policy too so this migration is safe to re-run even
-- after schema.sql has already created reports_read_owner.
DROP POLICY IF EXISTS "reports_read_owner" ON reports;

-- A report is readable only by the user who owns the assessment session it
-- was generated from:
--   reports.session_id -> assessment_sessions.user_id -> users.id
-- The caller is identified by the JWT `sub` claim, which carries the Clerk
-- user id and is stored in users.clerk_id.
CREATE POLICY "reports_read_owner" ON reports
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM assessment_sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.id = reports.session_id
        AND u.clerk_id = auth.jwt() ->> 'sub'
    )
  );
