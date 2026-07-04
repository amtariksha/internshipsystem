# AEDHAS

AEDHAS is an AI-powered personality and entrepreneurial readiness assessment platform. It evaluates candidates across 12 psychological and entrepreneurial dimensions using situational judgment tests (SJT) combined with AI-adaptive follow-up questions that probe deeper based on each response. Assessments are available in five languages — English, Hindi, Telugu, Tamil, and Kannada — making the platform accessible across India.

## Features

- **12-dimension assessment** — a structured personality and entrepreneurial readiness model scored from SJT responses and adaptive AI follow-ups
- **AI-adaptive questioning** — follow-up prompts generated in real time to clarify and validate candidate answers
- **Multilingual** — full assessment experience in en, hi, te, ta, and kn via `next-intl`
- **AstroCareer module** — an optional Vedic astrology and numerology career-insight layer
- **College dashboard** — cohort-level analytics, candidate tracking, and result exports for institutions
- **Employer dashboard** — candidate screening, readiness scores, and comparison views for recruiters
- **Anti-cheat safeguards** — response-integrity checks built into the assessment flow

## Tech Stack

- **Next.js 16** (App Router) with React 19
- **Clerk** — authentication and user management
- **Supabase** — PostgreSQL database (Mumbai region for DPDP Act compliance)
- **Upstash Redis** — rate limiting
- **Vercel AI SDK** — AI question generation and scoring via AI Gateway
- **next-intl** — internationalization across the five supported locales

## Local Development

```bash
cp .env.example .env.local   # fill in Clerk, Supabase, and Redis credentials
npm install
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full production setup on Vercel, including Supabase, Upstash Redis, Clerk webhooks, and AI Gateway configuration.
