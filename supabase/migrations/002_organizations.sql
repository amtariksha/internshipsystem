-- Migration 002: Organizations (COLLEGE / EMPLOYER) + user membership.
--
-- Phase 5 feature: institutional accounts. A college or employer creates an
-- organization with a shareable invite_code; users join by entering that code,
-- which sets users.organization_id. Enables org-scoped dashboards / cohort
-- reporting downstream.
--
-- Depends on: generate_cuid() (defined in src/lib/db/schema.sql).

CREATE TABLE IF NOT EXISTS organizations (
  id            text PRIMARY KEY DEFAULT generate_cuid(),
  name          text NOT NULL,
  type          text NOT NULL CHECK (type IN ('COLLEGE', 'EMPLOYER')),
  invite_code   text UNIQUE NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_organizations_invite_code ON organizations(invite_code);

-- Link users to an organization (nullable: individual users have no org).
ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_id text REFERENCES organizations(id);

CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);
