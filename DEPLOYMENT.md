# AEDHAS — Deployment Guide

## Context

Deploy the AEDHAS assessment platform to Vercel via GitHub integration (no CLI required). Services: Supabase PostgreSQL (Mumbai for DPDP Act), Upstash Redis, Clerk auth, and AI Gateway.

---

## Prerequisites

- A GitHub account with access to `amtariksha/internshipsystem`
- A Vercel account (team: Amtariksha)
- A Supabase account

---

## Step 1: Vercel Project Setup (Dashboard)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository** → select `amtariksha/internshipsystem`
3. Framework Preset: **Next.js** (auto-detected)
4. Root Directory: `.` (default)
5. Click **Deploy**

The first deploy will fail because env vars are missing — that's expected. Continue to Step 2.

---

## Step 2: Provision Services

### 2a. Supabase (Database — Mumbai Region)

**Why Supabase:** Mumbai (ap-south-1) region ensures Indian user data stays in India per the DPDP Act 2023.

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. **Region: South Asia (Mumbai) — ap-south-1** (critical for compliance)
3. Name: `aedhas-prod`
4. Generate a strong database password → save it
5. After creation, go to **Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`
   - **anon key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Add these in **Vercel Dashboard → your project → Settings → Environment Variables**:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

### 2b. Upstash Redis (Rate Limiting)

1. In **Vercel Dashboard → your project → Storage tab**
2. Click **Create Database** → select **Upstash Redis**
3. Name: `aedhas-redis`, region closest to Mumbai
4. Click **Create** — env vars (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) are auto-provisioned

### 2c. Clerk (Authentication)

1. In **Vercel Dashboard → your project → Integrations tab**
2. Click **Browse Marketplace** → search **Clerk** → **Add Integration**
3. Follow the setup wizard — this auto-provisions `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

Then **manually add** these env vars in Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

**Configure Clerk Webhook:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com) → Webhooks → **Add Endpoint**
2. URL: `https://your-domain.vercel.app/api/webhooks/clerk`
3. Events: `user.created`, `user.updated`
4. Copy the signing secret → add as `CLERK_WEBHOOK_SECRET` in Vercel env vars

### 2d. Enable AI Gateway

1. Go to **Vercel Dashboard → your project → Settings**
2. Find **AI Gateway** → **Enable**
3. OIDC credentials are auto-provisioned (no manual API keys needed)

---

## Step 3: Initialize Database

### 3a. Run Schema

1. Go to **Supabase Dashboard → SQL Editor**
2. Copy-paste the entire contents of `src/lib/db/schema.sql`
3. Click **Run** — creates 17 tables + 12 RPC functions + RLS policies

### 3b. Seed Dimensions

Run this SQL in Supabase SQL Editor:

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

### 3c. Seed Domain Questions

Run `src/lib/db/seed-domain-questions.sql` in Supabase SQL Editor — 60 MCQs across CS, Commerce, and Mechanical Engineering.

### 3d. Seed AI Challenges

Run `src/lib/db/seed-ai-challenges.sql` in Supabase SQL Editor — 8 AI collaboration challenges across domains.

---

## Step 4: Redeploy

After setting all env vars and seeding the database:

1. Go to **Vercel Dashboard → your project → Deployments**
2. Click the **...** menu on the latest deployment → **Redeploy**
3. Wait for build to complete (should succeed now with all env vars)

Every subsequent push to `main` auto-deploys to production.

---

## Step 5: Post-Deploy Verification

### 5a. Check deployment

Go to **Vercel Dashboard → Deployments → click latest** → check:
- Build logs (should complete without errors)
- Function logs (click **Logs** tab for runtime errors)

### 5b. Verify each feature

1. **Landing page**: Visit `https://your-domain.vercel.app/en/` — should render hero + features
2. **Auth flow**: Click Sign Up → create account via Clerk → redirected to onboarding
3. **Onboarding**: Select educational stage, field of study → saved to Supabase
4. **Dashboard routing**: PRE_COLLEGE sees AstroCareer only; GRADUATE sees all modules
5. **Locale switch**: Toggle `/en/` ↔ `/hi/` — UI strings change
6. **Clerk webhook**: After sign-up, check Supabase Table Editor → `users` table — user should appear
7. **Domain assessment**: Start domain test → MCQs load at difficulty 3 → adaptive difficulty
8. **AI collaboration**: Start AI challenge → chat interface loads → send prompts → get AI responses
9. **Behavioral assessment**: Start assessment → first SJT loads → AI follow-up appears
10. **Report**: Complete assessment → report generates with radar chart + tier badges + domain scores
11. **AstroCareer**: Try quick numerology with a name + DOB

---

## Environment Variables Reference

| Variable | Source | Required | Notes |
|----------|--------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API | Yes | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API | Yes | Server-only, bypasses RLS |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API | Yes | Client-facing, respects RLS |
| `UPSTASH_REDIS_REST_URL` | Auto (Vercel Storage) | Yes | Redis endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Auto (Vercel Storage) | Yes | Redis auth token |
| `CLERK_SECRET_KEY` | Auto (Clerk Integration) | Yes | Server-only |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Auto (Clerk Integration) | Yes | Client-facing |
| `CLERK_WEBHOOK_SECRET` | Clerk Dashboard → Webhooks | Yes | Webhook signature validation |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Manual | Yes | Set to `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Manual | Yes | Set to `/sign-up` |

---

## Local Development (Optional)

If you want to run locally, create `.env.local` manually with the same values from Vercel Dashboard:

```bash
# Copy values from Vercel Dashboard → Settings → Environment Variables
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
CLERK_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
EOF

npm install
npm run dev
```

---

## AI Model Configuration

The app uses Vercel AI Gateway with OIDC auth (no manual API keys):

| Use Case | Model | Fallback |
|----------|-------|----------|
| Follow-up generation | `anthropic/claude-sonnet-4.6` | `openai/gpt-5.4` |
| Free-text scoring | `anthropic/claude-sonnet-4.6` | `openai/gpt-5.4` |
| Report narrative | `anthropic/claude-sonnet-4.6` | `openai/gpt-5.4` |
| AI collaboration assistant | `anthropic/claude-sonnet-4.6` | `openai/gpt-5.4` |
| Domain probe scoring | `anthropic/claude-sonnet-4.6` | `openai/gpt-5.4` |

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
Check `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel env vars (Dashboard → Settings → Environment Variables). The service role key bypasses RLS — never expose it client-side.

### RPC function not found
Run `src/lib/db/schema.sql` in Supabase SQL Editor — it creates 12 RPC functions used by API routes. If you see "Could not find the function", the schema wasn't fully applied.

### AI Gateway returns 401
OIDC is auto-managed on Vercel deployments. If it fails, try redeploying: Vercel Dashboard → Deployments → Redeploy.

### Build fails
Check build logs in Vercel Dashboard → Deployments → click failed deploy → Build Logs.

### Python astro functions fail
Ensure `api/astro/requirements.txt` lists `pyswisseph==2.10.3.2`. Vercel auto-detects Python functions in `api/` directory.

---

## Architecture Overview

```
Browser → Vercel Edge → proxy.ts (Clerk auth + i18n)
                      → Next.js App Router
                          → API Routes
                              → /api/assessment/* (behavioral SJT + AI follow-ups)
                              → /api/domain/* (adaptive MCQ + AI probes)
                              → /api/ai-collab/* (simulated AI chat + scoring)
                              → /api/onboarding (multi-step onboarding)
                              → /api/webhooks/clerk (user sync)
                          → Supabase PostgreSQL (Mumbai, @supabase/supabase-js)
                          → AI Gateway (Claude Sonnet 4.6 via OIDC)
                          → Upstash Redis (rate limiting)
                          → Python Functions (api/astro/)
                              → pyswisseph (Vedic calculations)
                          → Server Components (reports, dashboard)
                              → Supabase PostgreSQL (direct queries + RPC)
```
