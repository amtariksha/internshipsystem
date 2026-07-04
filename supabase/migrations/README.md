# Migrations

These numbered files are **incremental deltas** applied on top of the base schema in
[`../../src/lib/db/schema.sql`](../../src/lib/db/schema.sql). They reference existing
tables (`reports`, `users`, `assessment_sessions`, …), so the base schema must exist
first — otherwise you get errors like `relation "reports" does not exist`.

## Fresh database

Run the **base schema only** — it is the complete, current source of truth and already
includes everything the migrations add (organizations, report_narratives, guardian-consent
columns, anti-cheat columns, and the owner-scoped `reports_read_owner` RLS policy). It is
idempotent (`CREATE TABLE IF NOT EXISTS`, guarded policies).

```
psql "$DATABASE_URL" -f src/lib/db/schema.sql
# or paste src/lib/db/schema.sql into the Supabase SQL editor
```

You do **not** need to run the numbered migrations on a fresh database.

## Existing database (already has the base schema)

Apply the deltas in order. All are idempotent, so re-running is safe:

```
001_reports_rls.sql        # owner-scoped reports SELECT policy (replaces permissive USING(true))
002_organizations.sql      # organizations table + users.organization_id
003_guardian_consent.sql   # users.guardian_email / guardian_consent_at / guardian_consent_token
004_report_locales.sql     # report_narratives table (per-locale narrative cache)
005_anticheat.sql          # session_questions.watermark_hash, ai_collab/domain flag columns
```

If a migration reports a table is missing, your database predates the base schema — apply
`src/lib/db/schema.sql` first (it will not clobber existing data).
