# AEDHAS — Deployment Guide

## Context

This guide covers deploying the AEDHAS assessment platform to Vercel with all required services: Supabase PostgreSQL (Mumbai region for DPDP Act compliance), Upstash Redis, Clerk auth, and AI Gateway. The codebase uses Next.js 16 + Supabase JS client.

---

## Prerequisites

Before deploying, ensure you have:
- Node.js 20+ installed
- Vercel CLI (`npm i -g vercel@latest`)
- A GitHub account with access to `amtariksha/internshipsystem`
- A Vercel account (team: Amtariksha)

---

## Step 1: Vercel Project Setup

```bash
# 1. Upgrade Vercel CLI
npm i -g vercel@latest

# 2. Link repo to Vercel
cd /mnt/work/projects/amtarikshadev-project4-aedhas
vercel link
# → Select "amtariksha" team
# → Link to existing repo OR create new project named "aedhas"
```

---

## Step 2: Provision Services

### 2a. Supabase (Database — Mumbai Region)

**Why Supabase over Neon:** Supabase offers a Mumbai (ap-south-1) region, ensuring Indian user data stays in India per the Digital Personal Data Protection (DPDP) Act 2023. Neon does not have Indian infrastructure.

1. Go to [supabase.com](https://supabase.com) → New Project
2. **Region: South Asia (Mumbai) — ap-south-1** (critical for DPDP compliance)
3. Name: `aedhas-prod`
4. Generate a strong database password → save it
5. After project creation, go to Settings → API:
   - Copy **Project URL** → this is `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **service_role key** (secret) → this is `SUPABASE_SERVICE_ROLE_KEY`
   - Copy **anon key** → this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Add these as env vars in Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

### 2b. Upstash Redis (Rate Limiting)
```bash
vercel integration add upstash
# → Follow browser prompts
# → Auto-provisions: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
```

### 2c. Clerk (Authentication)
```bash
vercel integration add clerk
# ⚠️ Requires manual terms acceptance in terminal
# → Complete setup in Vercel Dashboard after CLI install
```

After Clerk setup, manually add these env vars in Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

**Configure Clerk Webhook:**
1. Go to Clerk Dashboard → Webhooks → Add Endpoint
2. URL: `https://your-domain.vercel.app/api/webhooks/clerk`
3. Events: `user.created`, `user.updated`
4. Copy the signing secret → add as `CLERK_WEBHOOK_SECRET` env var in Vercel

### 2d. Enable AI Gateway
1. Go to `https://vercel.com/{team}/aedhas/settings`
2. Find "AI Gateway" → Enable
3. This auto-provisions OIDC credentials (no manual API keys needed)

---

## Step 3: Pull Environment Variables Locally

```bash
vercel env pull .env.local
```

Then manually add the Supabase vars to `.env.local` (since Supabase is not via Vercel Marketplace):
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

Verify `.env.local` contains ALL of these:
```
NEXT_PUBLIC_SUPABASE_URL=https://...     # Supabase
SUPABASE_SERVICE_ROLE_KEY=...            # Supabase (server-only)
NEXT_PUBLIC_SUPABASE_ANON_KEY=...        # Supabase (client)
UPSTASH_REDIS_REST_URL=https://...       # Upstash
UPSTASH_REDIS_REST_TOKEN=...             # Upstash
CLERK_SECRET_KEY=sk_live_...             # Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_... # Clerk
CLERK_WEBHOOK_SECRET=whsec_...           # Clerk webhook
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
VERCEL_OIDC_TOKEN=...                    # AI Gateway (auto-managed)
```

---

## Step 4: Initialize Database

### 4a. Run Schema
1. Go to Supabase Dashboard → SQL Editor
2. Copy-paste the entire contents of `src/lib/db/schema.sql`
3. Execute — this creates all 11 tables + indexes + 9 RPC functions + RLS policies

### 4b. Seed Dimensions
Run this SQL in Supabase SQL Editor to seed the 12 assessment dimensions:

```sql
INSERT INTO dimensions (code, name_key, description, category, max_score, startup_weight, general_weight, sort_order) VALUES
('grit_perseverance', 'dimensions.grit_perseverance', 'Sustained passion and effort toward long-term goals despite setbacks', 'ENTREPRENEURIAL', 5.0, 0.15, 0.10, 1),
('risk_tolerance', 'dimensions.risk_tolerance', 'Willingness to take calculated risks and handle uncertainty', 'ENTREPRENEURIAL', 5.0, 0.13, 0.07, 2),
('proactivity', 'dimensions.proactivity', 'Taking initiative and acting before being asked', 'ENTREPRENEURIAL', 5.0, 0.12, 0.10, 3),
('eq_self_regulation', 'dimensions.eq_self_regulation', 'Emotional intelligence and ability to manage emotions under pressure', 'PERSONALITY', 5.0, 0.09, 0.12, 4),
('growth_mindset', 'dimensions.growth_mindset', 'Belief that abilities can be developed through effort and learning', 'COGNITIVE', 5.0, 0.08, 0.10, 5),
('integrity', 'dimensions.integrity', 'Consistency between stated values and actual behavior', 'PERSONALITY', 5.0, 0.08, 0.11, 6),
('strategic_thinking', 'dimensions.strategic_thinking', 'Ability to plan ahead and see the bigger picture', 'COGNITIVE', 5.0, 0.09, 0.08, 7),
('collaboration', 'dimensions.collaboration', 'Working effectively with others and building relationships', 'INTERPERSONAL', 5.0, 0.06, 0.10, 8),
('self_efficacy', 'dimensions.self_efficacy', 'Confidence in own ability to execute and deliver results', 'PERSONALITY', 5.0, 0.08, 0.08, 9),
('innovativeness', 'dimensions.innovativeness', 'Creative problem-solving and generating novel solutions', 'COGNITIVE', 5.0, 0.06, 0.06, 10),
('action_orientation', 'dimensions.action_orientation', 'Bias toward action over analysis paralysis', 'ENTREPRENEURIAL', 5.0, 0.04, 0.05, 11),
('physical_mental_vitality', 'dimensions.physical_mental_vitality', 'Physical and mental energy management', 'PERSONALITY', 5.0, 0.02, 0.03, 12);
```

### 4c. Seed SJT Questions
The question pool needs to be seeded separately. A seed SQL file will be generated with 60+ SJT questions across all 12 dimensions, each with English and Hindi variants + option weights.

---

## Step 5: Push to GitHub

```bash
git remote add origin https://github.com/amtariksha/internshipsystem.git
git add -A
git commit -m "feat: AEDHAS assessment platform MVP"
git push -u origin main
```

---

## Step 6: Deploy to Vercel

### Option A: Auto-deploy (recommended)
Once the GitHub repo is linked to Vercel, every push to `main` auto-deploys to production.

### Option B: Manual deploy
```bash
# Preview deployment
vercel deploy

# Production deployment
vercel deploy --prod
```

---

## Step 7: Post-Deploy Verification

### 7a. Check deployment
```bash
vercel inspect <deployment-url>
vercel logs <deployment-url> --follow
```

### 7b. Verify each feature
1. **Landing page**: Visit `https://your-domain.vercel.app/en/` — should render hero + features
2. **Auth flow**: Click Sign Up → create account via Clerk → redirected to onboarding
3. **Locale switch**: Toggle `/en/` ↔ `/hi/` — UI strings change
4. **Clerk webhook**: After sign-up, check Supabase Table Editor → `users` table — user should appear
5. **Assessment start**: Navigate to dashboard → start assessment → first SJT loads
6. **AI follow-up**: Answer SJT → AI-generated follow-up appears in correct language
7. **Report**: Complete assessment → report generates with radar chart + tier badges
8. **AstroCareer**: Try quick numerology with a name + DOB

---

## Environment Variables Reference

| Variable | Source | Required | Notes |
|----------|--------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard | Yes | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard | Yes | Server-only, bypasses RLS |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard | Yes | Client-facing, respects RLS |
| `UPSTASH_REDIS_REST_URL` | Upstash (Marketplace) | Yes | Redis endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash (Marketplace) | Yes | Redis auth token |
| `CLERK_SECRET_KEY` | Clerk (Marketplace) | Yes | Server-only |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk (Marketplace) | Yes | Client-facing |
| `CLERK_WEBHOOK_SECRET` | Clerk Dashboard | Yes | Webhook signature validation |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Manual | Yes | Set to `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Manual | Yes | Set to `/sign-up` |
| `VERCEL_OIDC_TOKEN` | Auto (AI Gateway) | Yes | Auto-managed by Vercel |
| `VERCEL_URL` | Auto (Vercel) | — | Auto-set on deploy |

---

## AI Model Configuration

The app uses Vercel AI Gateway with OIDC auth (no manual API keys):

| Use Case | Model | Fallback |
|----------|-------|----------|
| Follow-up generation | `anthropic/claude-sonnet-4.6` | `openai/gpt-5.4` |
| Free-text scoring | `anthropic/claude-sonnet-4.6` | `openai/gpt-5.4` |
| Report narrative | `anthropic/claude-sonnet-4.6` | `openai/gpt-5.4` |

Config location: `src/lib/ai/client.ts`

---

## DPDP Act Compliance Notes

- **Data residency**: Supabase Mumbai (ap-south-1) ensures all Indian user PII stays in India
- **Data minimization**: Only essential PII collected (name, email, DOB)
- **Purpose limitation**: Data used solely for assessment and career guidance
- **Right to erasure**: Users can request account deletion via Clerk (cascades to Supabase via webhook)
- **Consent**: Assessment consent form collected before any data processing

---

## Troubleshooting

### "Clerk: auth() was called without middleware"
Ensure `src/proxy.ts` exists and calls `clerkMiddleware()`. It must be at `src/proxy.ts` (same level as `src/app/`).

### Supabase connection fails
Check `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel env vars. The service role key bypasses RLS — never expose it client-side.

### RPC function not found
Run `src/lib/db/schema.sql` in Supabase SQL Editor — it creates 9 RPC functions used by API routes. If you see "Could not find the function", the schema wasn't fully applied.

### AI Gateway returns 401
OIDC token may have expired locally. Run `vercel env pull .env.local` to refresh. On Vercel deployments, tokens auto-refresh.

### Python astro functions fail
Ensure `api/astro/requirements.txt` lists `pyswisseph==2.10.3.2`. Vercel auto-detects Python functions in `api/` directory.

---

## Architecture Overview

```
Browser → Vercel Edge → proxy.ts (Clerk auth + i18n)
                      → Next.js App Router
                          → API Routes (assessment/start, respond, score)
                              → Supabase PostgreSQL (Mumbai, @supabase/supabase-js)
                              → AI Gateway (Claude Sonnet 4.6 via OIDC)
                              → Upstash Redis (rate limiting)
                          → Python Functions (api/astro/)
                              → pyswisseph (Vedic calculations)
                          → Server Components (reports, dashboard)
                              → Supabase PostgreSQL (direct queries + RPC)
```
