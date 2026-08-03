# Graph Report - .  (2026-08-03)

## Corpus Check
- 8 files · ~82,687 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 778 nodes · 1427 edges · 68 communities (50 shown, 18 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 58 edges (avg confidence: 0.82)
- Token cost: 99,258 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Assessment Input Components|Assessment Input Components]]
- [[_COMMUNITY_Vedic Astrology Python Functions|Vedic Astrology Python Functions]]
- [[_COMMUNITY_Email Notification Library|Email Notification Library]]
- [[_COMMUNITY_i18n Routing & Sitemap|i18n Routing & Sitemap]]
- [[_COMMUNITY_NPM Dependencies|NPM Dependencies]]
- [[_COMMUNITY_shadcn UI Primitives|shadcn UI Primitives]]
- [[_COMMUNITY_Onboarding & Locale Switcher|Onboarding & Locale Switcher]]
- [[_COMMUNITY_Behavioral Scoring & Tiers|Behavioral Scoring & Tiers]]
- [[_COMMUNITY_Dashboard API Routes|Dashboard API Routes]]
- [[_COMMUNITY_Domain IRT Engine|Domain IRT Engine]]
- [[_COMMUNITY_shadcn Component Config|shadcn Component Config]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_App Layout & Navigation|App Layout & Navigation]]
- [[_COMMUNITY_Question Variant Seeding|Question Variant Seeding]]
- [[_COMMUNITY_API Validation Schemas|API Validation Schemas]]
- [[_COMMUNITY_Deployment Guide|Deployment Guide]]
- [[_COMMUNITY_Session Assembly|Session Assembly]]
- [[_COMMUNITY_AI Collab Session Engine|AI Collab Session Engine]]
- [[_COMMUNITY_Response Confidence & Follow-ups|Response Confidence & Follow-ups]]
- [[_COMMUNITY_Assessment Progress UI|Assessment Progress UI]]
- [[_COMMUNITY_AI Collab Scoring Prompts|AI Collab Scoring Prompts]]
- [[_COMMUNITY_AI Collab Score Computation|AI Collab Score Computation]]
- [[_COMMUNITY_Redis Rate Limiting|Redis Rate Limiting]]
- [[_COMMUNITY_Assessment Consent & Start|Assessment Consent & Start]]
- [[_COMMUNITY_Platform Infrastructure Services|Platform Infrastructure Services]]
- [[_COMMUNITY_AI Client & LLM Fingerprint|AI Client & LLM Fingerprint]]
- [[_COMMUNITY_Domain Score Computation|Domain Score Computation]]
- [[_COMMUNITY_Question Pool Rotation|Question Pool Rotation]]
- [[_COMMUNITY_Database Migrations|Database Migrations]]
- [[_COMMUNITY_Deployment Troubleshooting|Deployment Troubleshooting]]
- [[_COMMUNITY_AstroCareer Quick Page|AstroCareer Quick Page]]
- [[_COMMUNITY_Project README|Project README]]
- [[_COMMUNITY_Database Initialization Steps|Database Initialization Steps]]
- [[_COMMUNITY_Next.js 16 Agent Rules|Next.js 16 Agent Rules]]
- [[_COMMUNITY_Service Provisioning Steps|Service Provisioning Steps]]
- [[_COMMUNITY_Maintenance Scripts Docs|Maintenance Scripts Docs]]
- [[_COMMUNITY_Migrations README|Migrations README]]
- [[_COMMUNITY_AI Gateway Config|AI Gateway Config]]
- [[_COMMUNITY_Post-Deploy Verification|Post-Deploy Verification]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_Privacy Page|Privacy Page]]
- [[_COMMUNITY_Terms Page|Terms Page]]
- [[_COMMUNITY_AGENTS.md Notice|AGENTS.md Notice]]
- [[_COMMUNITY_CLAUDE.md Graphify Rules|CLAUDE.md Graphify Rules]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Secrets Warning|Secrets Warning]]
- [[_COMMUNITY_Vercel Config|Vercel Config]]
- [[_COMMUNITY_AGENTS Project Rules|AGENTS Project Rules]]
- [[_COMMUNITY_CLAUDE.md Instructions|CLAUDE.md Instructions]]
- [[_COMMUNITY_Graph JSON Output|Graph JSON Output]]
- [[_COMMUNITY_Graph Report Output|Graph Report Output]]
- [[_COMMUNITY_graphify explain Command|graphify explain Command]]
- [[_COMMUNITY_graphify path Command|graphify path Command]]
- [[_COMMUNITY_graphify query Command|graphify query Command]]
- [[_COMMUNITY_graphify update Command|graphify update Command]]
- [[_COMMUNITY_graphify wiki Index|graphify wiki Index]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 67 edges
2. `getSupabase()` - 43 edges
3. `AEDHAS Deployment Guide` - 34 edges
4. `Card()` - 23 edges
5. `CardContent()` - 23 edges
6. `Button()` - 22 edges
7. `CardHeader()` - 21 edges
8. `checkRateLimit()` - 20 edges
9. `CardTitle()` - 18 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `AEDHAS Deployment Guide` --references--> `AI Model Client Config`  [EXTRACTED]
  DEPLOYMENT.md → src/lib/ai/client.ts
- `AEDHAS Deployment Guide` --references--> `Proxy Middleware (Clerk auth + i18n)`  [EXTRACTED]
  DEPLOYMENT.md → src/proxy.ts
- `AEDHAS Deployment Guide` --references--> `Maintenance Script: Rotate Question Pool`  [EXTRACTED]
  DEPLOYMENT.md → scripts/rotate-questions.ts
- `AEDHAS Deployment Guide` --references--> `Base Database Schema (17 tables, 12 RPC functions, RLS)`  [EXTRACTED]
  DEPLOYMENT.md → src/lib/db/schema.sql
- `AEDHAS Deployment Guide` --references--> `Seed: 8 AI Collaboration Challenges`  [EXTRACTED]
  DEPLOYMENT.md → src/lib/db/seed-ai-challenges.sql

## Import Cycles
- 1-file cycle: `api/astro/lib/vedic.py -> api/astro/lib/vedic.py`

## Hyperedges (group relationships)
- **Onboarding submission flow: wizard state to persisted user record** — onboarding_onboarding_wizard_onboardingwizard, onboarding_onboarding_wizard_submitdata, onboarding_onboarding_wizard_onboardingdata, onboarding_page_handlecomplete, onboarding_route_onboardingschema, onboarding_route_post [INFERRED 0.85]
- **Per-step advance gating for the onboarding wizard** — onboarding_onboarding_wizard_canproceedstep1, onboarding_onboarding_wizard_canproceedstep2, onboarding_onboarding_wizard_canproceedstep3, onboarding_onboarding_wizard_canproceedstep4, onboarding_onboarding_wizard_isemailvalid, onboarding_onboarding_wizard_handlenext [EXTRACTED 1.00]
- **Five-locale next-intl message catalog set with identical key trees** — messages_en, messages_hi, messages_kn, messages_ta, messages_te, messages_en_locale_key_parity [EXTRACTED 1.00]

## Communities (68 total, 18 thin omitted)

### Community 0 - "Assessment Input Components"
Cohesion: 0.06
Nodes (51): FreeTextInput(), FreeTextInputProps, SjtCard(), SjtCardProps, SjtOption, CollegeDashboard(), CollegeDashboardProps, DashboardContentProps (+43 more)

### Community 1 - "Vedic Astrology Python Functions"
Cohesion: 0.06
Nodes (54): handler, Vercel Python Serverless Function: Full Kundli analysis. Input: name + DOB + bir, handler, Vercel Python Serverless Function: Quick AstroCareer analysis. Input: name + DOB, BaseHTTPRequestHandler, datetime, get_careers_from_chart(), get_careers_from_numerology() (+46 more)

### Community 2 - "Email Notification Library"
Cohesion: 0.05
Nodes (49): safeReadError(), sendEmail(), SendEmailParams, SendEmailResult, sendGuardianConsentEmail(), SendGuardianConsentEmailArgs, sendReportReadyEmail(), SendReportReadyEmailArgs (+41 more)

### Community 3 - "i18n Routing & Sitemap"
Cohesion: 0.05
Nodes (33): staticPaths, { Link, redirect, usePathname, useRouter, getPathname }, Locale, routing, geistMono, geistSans, localeNames, DimensionRadar() (+25 more)

### Community 4 - "NPM Dependencies"
Cohesion: 0.05
Nodes (38): dependencies, ai, @ai-sdk/react, @base-ui/react, class-variance-authority, @clerk/nextjs, clsx, lucide-react (+30 more)

### Community 5 - "shadcn UI Primitives"
Cohesion: 0.11
Nodes (20): cn(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+12 more)

### Community 6 - "Onboarding & Locale Switcher"
Cohesion: 0.11
Nodes (22): LocaleSwitcher(), OnboardingRole, OnboardingWizardProps, OrgMode, SelectContent(), SelectGroup(), SelectLabel(), SelectScrollDownButton() (+14 more)

### Community 7 - "Behavioral Scoring & Tiers"
Cohesion: 0.13
Nodes (18): average(), computeDimensionScore(), DimensionScoreResult, classifyForContext(), classifyTiers(), DimensionScoreInput, TierName, buildReportPrompt() (+10 more)

### Community 8 - "Dashboard API Routes"
Cohesion: 0.15
Nodes (15): EMPTY_ANALYTICS, GET(), GET(), POST(), DashboardContent(), DashboardPage(), DashboardPageProps, getSupabase() (+7 more)

### Community 9 - "Domain IRT Engine"
Cohesion: 0.16
Nodes (16): difficultyToTheta(), SelectionResult, selectNextQuestion(), SessionState, thetaToDifficulty(), updateAbilityEstimate(), buildDomainFollowUpPrompt(), DomainFollowUpParams (+8 more)

### Community 10 - "shadcn Component Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 11 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 12 - "App Layout & Navigation"
Cohesion: 0.17
Nodes (11): Footer(), Navbar(), Sheet(), SheetClose(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader() (+3 more)

### Community 13 - "Question Variant Seeding"
Cohesion: 0.15
Nodes (18): buildTranslationPrompt(), EnglishOption, EnglishVariant, fetchEnglishOptions(), fetchEnglishVariants(), fetchExistingPairs(), getServiceRoleClient(), insertVariant() (+10 more)

### Community 14 - "API Validation Schemas"
Cohesion: 0.11
Nodes (16): AiCollabMessageInput, aiCollabMessageSchema, AiCollabStartInput, AssessmentRespondInput, AssessmentStartInput, assessmentStartSchema, DomainRespondInput, domainRespondSchema (+8 more)

### Community 15 - "Deployment Guide"
Cohesion: 0.12
Nodes (17): AI Model Configuration, Architecture Overview, Context, AEDHAS Deployment Guide, DPDP Act Compliance Notes, Environment Variables Reference, Local Development (Optional), Prerequisites (+9 more)

### Community 16 - "Session Assembly"
Cohesion: 0.22
Nodes (11): AssembledQuestion, assembleSession(), findUncoveredDimensions(), IncompleteCoverageError, QuestionForAssembly, seedRandom(), shuffleArray(), withRapidFireQuestion() (+3 more)

### Community 17 - "AI Collab Session Engine"
Cohesion: 0.26
Nodes (11): canComplete(), canSendMore(), CollabSessionState, getRemainingTime(), isSessionExpired(), runLlmFingerprint(), POST(), AiCollabAssistantParams (+3 more)

### Community 18 - "Response Confidence & Follow-ups"
Cohesion: 0.20
Nodes (10): computeResponseConfidence(), buildFollowUpPrompt(), LOCALE_LANGUAGE_INSTRUCTIONS, buildScoringPrompt(), LOCALE_LANGUAGE_LABELS, FreeTextScoring, freeTextScoringSchema, POST() (+2 more)

### Community 19 - "Assessment Progress UI"
Cohesion: 0.19
Nodes (10): ProgressBar(), ProgressBarProps, TimerDisplay(), TimerDisplayProps, AntiCheatState, useAntiCheat(), TimerState, useTimer() (+2 more)

### Community 20 - "AI Collab Scoring Prompts"
Cohesion: 0.21
Nodes (9): buildSessionScoringPrompt(), LOCALE_LANGUAGE_LABELS, SessionScoringParams, dimensionScoreSchema, PromptComplexity, promptComplexitySchema, SessionScoring, sessionScoringSchema (+1 more)

### Community 21 - "AI Collab Score Computation"
Cohesion: 0.25
Nodes (9): AiCollabDimensionScores, AiCollabScoreResult, computeAiCollabScore(), AI_COLLAB_CONFIG, AI_COLLAB_DIMENSIONS, AiCollabDimensionCode, AiCollabTargetRole, computeAiCollabComposite() (+1 more)

### Community 22 - "Redis Rate Limiting"
Cohesion: 0.29
Nodes (7): getRedis(), checkRateLimit(), limiters, POST(), POST(), aiCollabStartSchema, domainStartSchema

### Community 23 - "Assessment Consent & Start"
Cohesion: 0.27
Nodes (5): ConsentForm(), ConsentFormProps, CardDescription(), Checkbox(), Label()

### Community 24 - "Platform Infrastructure Services"
Cohesion: 0.24
Nodes (10): Clerk Authentication, DPDP Act 2023 Compliance, Supabase PostgreSQL (Mumbai ap-south-1), Upstash Redis (rate limiting), Vercel Platform, Proxy Middleware (Clerk auth + i18n), AEDHAS README (project overview), Clerk Keyless Mode Do-Not-Commit Notice (+2 more)

### Community 25 - "AI Client & LLM Fingerprint"
Cohesion: 0.29
Nodes (5): AI_MODELS, LlmFingerprintResult, LOCALE_LANGUAGE_LABELS, LLMFingerprint, llmFingerprintSchema

### Community 26 - "Domain Score Computation"
Cohesion: 0.39
Nodes (6): computeDomainScore(), DomainResponse, DomainScoreResult, POST(), getProficiencyLevel(), ProficiencyLevel

### Community 27 - "Question Pool Rotation"
Cohesion: 0.43
Nodes (7): fetchActiveQuestions(), getServiceRoleClient(), main(), parsePercent(), QuestionRow, requireEnv(), retire()

### Community 28 - "Database Migrations"
Cohesion: 0.52
Nodes (7): Migration 001: Reports RLS Policy, Migration 002: Organizations, Migration 003: Guardian Consent, Migration 004: Report Locales (report_narratives), Migration 005: Anti-Cheat Columns, Supabase Migrations Guide, Base Database Schema (17 tables, 12 RPC functions, RLS)

### Community 29 - "Deployment Troubleshooting"
Cohesion: 0.29
Nodes (7): AI Gateway returns 401, Build fails, "Clerk: auth() was called without middleware", Python astro functions fail, RPC function not found, Supabase connection fails, Troubleshooting

### Community 30 - "AstroCareer Quick Page"
Cohesion: 0.33
Nodes (4): AstroResult, NumerologySystem, Input(), SelectItem()

### Community 31 - "Project README"
Cohesion: 0.33
Nodes (5): AEDHAS, Deployment, Features, Local Development, Tech Stack

### Community 32 - "Database Initialization Steps"
Cohesion: 0.40
Nodes (5): 3a. Run Schema, 3b. Seed Dimensions, 3c. Seed Domain Questions, 3d. Seed AI Challenges, Step 3: Initialize Database

### Community 33 - "Next.js 16 Agent Rules"
Cohesion: 0.50
Nodes (4): Next.js Agent Rules (breaking-changes notice), Next.js Bundled Docs (node_modules/next/dist/docs), Project CLAUDE.md, Next.js 16 App Router

### Community 34 - "Service Provisioning Steps"
Cohesion: 0.50
Nodes (4): 2a. Supabase (Database — Mumbai Region), 2b. Upstash Redis (Rate Limiting), 2d. Enable AI Gateway, Step 2: Provision Services

### Community 35 - "Maintenance Scripts Docs"
Cohesion: 0.50
Nodes (4): Maintenance Scripts, `rotate-questions.ts`, `seed-question-variants.ts`, Shared required env vars

### Community 36 - "Migrations README"
Cohesion: 0.50
Nodes (3): Existing database (already has the base schema), Fresh database, Migrations

### Community 37 - "AI Gateway Config"
Cohesion: 0.67
Nodes (3): AI Model Client Config, Vercel AI Gateway (OIDC), Maintenance Script: Seed Question Variants (hi/te/ta/kn)

### Community 38 - "Post-Deploy Verification"
Cohesion: 0.67
Nodes (3): 5a. Check deployment, 5b. Verify each feature, Step 5: Post-Deploy Verification

## Knowledge Gaps
- **273 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+268 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSupabase()` connect `Dashboard API Routes` to `Assessment Input Components`, `Email Notification Library`, `i18n Routing & Sitemap`, `Behavioral Scoring & Tiers`, `Domain IRT Engine`, `Session Assembly`, `AI Collab Session Engine`, `Response Confidence & Follow-ups`, `AI Collab Scoring Prompts`, `Redis Rate Limiting`, `Domain Score Computation`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `cn()` connect `shadcn UI Primitives` to `Assessment Input Components`, `i18n Routing & Sitemap`, `Onboarding & Locale Switcher`, `App Layout & Navigation`, `Assessment Progress UI`, `Assessment Consent & Start`, `AstroCareer Quick Page`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `OnboardingWizard()` connect `Email Notification Library` to `Onboarding & Locale Switcher`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `getSupabase()` (e.g. with `CandidateDetailPage()` and `POST()`) actually correct?**
  _`getSupabase()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Vercel Python Serverless Function: Full Kundli analysis. Input: name + DOB + bir`, `Career mapping based on numerology and Vedic astrology.`, `Get top 5 careers based on destiny number.` to the rest of the system?**
  _302 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assessment Input Components` be split into smaller, more focused modules?**
  _Cohesion score 0.05700852189244784 - nodes in this community are weakly interconnected._
- **Should `Vedic Astrology Python Functions` be split into smaller, more focused modules?**
  _Cohesion score 0.058699101004759384 - nodes in this community are weakly interconnected._