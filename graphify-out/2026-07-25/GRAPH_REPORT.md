# Graph Report - /mnt/work/projects/amtarikshadev-project4-aedhas  (2026-07-25)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 705 nodes · 1357 edges · 45 communities (38 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 41|Community 41]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 67 edges
2. `getSupabase()` - 43 edges
3. `Card()` - 23 edges
4. `CardContent()` - 23 edges
5. `Button()` - 22 edges
6. `CardHeader()` - 21 edges
7. `checkRateLimit()` - 20 edges
8. `AEDHAS Deployment Guide` - 19 edges
9. `CardTitle()` - 18 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `AEDHAS Deployment Guide` --references--> `AI Model Client Config`  [EXTRACTED]
  DEPLOYMENT.md → src/lib/ai/client.ts
- `AEDHAS Deployment Guide` --references--> `Proxy Middleware (Clerk auth + i18n)`  [EXTRACTED]
  DEPLOYMENT.md → src/proxy.ts
- `AEDHAS Deployment Guide` --references--> `Seed: 8 AI Collaboration Challenges`  [EXTRACTED]
  DEPLOYMENT.md → src/lib/db/seed-ai-challenges.sql
- `AEDHAS Deployment Guide` --references--> `Seed: Behavioral Questions (SJT)`  [EXTRACTED]
  DEPLOYMENT.md → src/lib/db/seed-behavioral-questions.sql
- `AEDHAS Deployment Guide` --references--> `Seed: 60 Domain MCQs`  [EXTRACTED]
  DEPLOYMENT.md → src/lib/db/seed-domain-questions.sql

## Import Cycles
- 1-file cycle: `api/astro/lib/vedic.py -> api/astro/lib/vedic.py`

## Communities (45 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (50): ConsentForm(), ConsentFormProps, FreeTextInputProps, SjtCardProps, SjtOption, CollegeDashboardProps, DomainMcqCard(), DomainMcqCardProps (+42 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (54): handler, Vercel Python Serverless Function: Full Kundli analysis. Input: name + DOB + bir, handler, Vercel Python Serverless Function: Quick AstroCareer analysis. Input: name + DOB, BaseHTTPRequestHandler, datetime, get_careers_from_chart(), get_careers_from_numerology() (+46 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (29): staticPaths, average(), computeDimensionScore(), DimensionScoreResult, sendReportReadyEmail(), Locale, routing, geistMono (+21 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (38): dependencies, ai, @ai-sdk/react, @base-ui/react, class-variance-authority, @clerk/nextjs, clsx, lucide-react (+30 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (28): difficultyToTheta(), SelectionResult, selectNextQuestion(), SessionState, thetaToDifficulty(), updateAbilityEstimate(), buildDomainFollowUpPrompt(), DomainFollowUpParams (+20 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (32): Migration 001: Reports RLS Policy, Migration 002: Organizations, Migration 003: Guardian Consent, Migration 004: Report Locales (report_narratives), Migration 005: Anti-Cheat Columns, Next.js Agent Rules (breaking-changes notice), Next.js Bundled Docs (node_modules/next/dist/docs), Project CLAUDE.md (+24 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (21): AssembledQuestion, assembleSession(), findUncoveredDimensions(), IncompleteCoverageError, QuestionForAssembly, seedRandom(), shuffleArray(), withRapidFireQuestion() (+13 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (24): safeReadError(), sendEmail(), SendEmailParams, SendEmailResult, sendGuardianConsentEmail(), SendGuardianConsentEmailArgs, SendReportReadyEmailArgs, EmailContent (+16 more)

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (20): cn(), CardAction(), CardFooter(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem() (+12 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (20): DomainResponse, DomainScoreResult, DashboardContentProps, ONBOARDING_ROLES, OnboardingData, OnboardingRole, OnboardingWizard(), OnboardingWizardProps (+12 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (18): EMPTY_ANALYTICS, GET(), GET(), CollegeDashboard(), DashboardContent(), DashboardPage(), DashboardPageProps, getSupabase() (+10 more)

### Community 11 - "Community 11"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (14): AI_MODELS, computeResponseConfidence(), LlmFingerprintResult, LOCALE_LANGUAGE_LABELS, runLlmFingerprint(), buildFollowUpPrompt(), LOCALE_LANGUAGE_INSTRUCTIONS, buildScoringPrompt() (+6 more)

### Community 13 - "Community 13"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 14 - "Community 14"
Cohesion: 0.15
Nodes (18): buildTranslationPrompt(), EnglishOption, EnglishVariant, fetchEnglishOptions(), fetchEnglishVariants(), fetchExistingPairs(), getServiceRoleClient(), insertVariant() (+10 more)

### Community 15 - "Community 15"
Cohesion: 0.21
Nodes (11): AstroResult, NumerologySystem, SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton() (+3 more)

### Community 16 - "Community 16"
Cohesion: 0.27
Nodes (10): canComplete(), canSendMore(), CollabSessionState, getRemainingTime(), isSessionExpired(), POST(), AiCollabAssistantParams, buildAiCollabSystemPrompt() (+2 more)

### Community 17 - "Community 17"
Cohesion: 0.24
Nodes (9): computeDomainScore(), POST(), getRedis(), checkRateLimit(), limiters, POST(), POST(), getProficiencyLevel() (+1 more)

### Community 18 - "Community 18"
Cohesion: 0.20
Nodes (10): FreeTextInput(), ProgressBar(), ProgressBarProps, SjtCard(), AntiCheatState, useAntiCheat(), TimerState, useTimer() (+2 more)

### Community 19 - "Community 19"
Cohesion: 0.14
Nodes (8): TimerDisplay(), TimerDisplayProps, TierBadge(), TierBadgeProps, tierColors, Checkbox(), Separator(), Skeleton()

### Community 20 - "Community 20"
Cohesion: 0.16
Nodes (9): CareerSuggestion, DashaData, GeoResult, HousePosition, KundliResult, PLANET_ORDER, PlanetPosition, Input() (+1 more)

### Community 21 - "Community 21"
Cohesion: 0.23
Nodes (10): LocaleSwitcher(), Sheet(), SheetClose(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+2 more)

### Community 22 - "Community 22"
Cohesion: 0.21
Nodes (9): buildSessionScoringPrompt(), LOCALE_LANGUAGE_LABELS, SessionScoringParams, dimensionScoreSchema, PromptComplexity, promptComplexitySchema, SessionScoring, sessionScoringSchema (+1 more)

### Community 23 - "Community 23"
Cohesion: 0.25
Nodes (9): AiCollabDimensionScores, AiCollabScoreResult, computeAiCollabScore(), AI_COLLAB_CONFIG, AI_COLLAB_DIMENSIONS, AiCollabDimensionCode, AiCollabTargetRole, computeAiCollabComposite() (+1 more)

### Community 24 - "Community 24"
Cohesion: 0.29
Nodes (10): AGENTS.md Project Rules, Project CLAUDE.md Instructions, graphify-out/graph.json, graphify-out/GRAPH_REPORT.md, Graphify Knowledge Graph Workflow, graphify explain Command, graphify path Command, graphify query Command (+2 more)

### Community 25 - "Community 25"
Cohesion: 0.43
Nodes (7): fetchActiveQuestions(), getServiceRoleClient(), main(), parsePercent(), QuestionRow, requireEnv(), retire()

### Community 26 - "Community 26"
Cohesion: 0.29
Nodes (6): POST(), AiCollabMessageInput, aiCollabMessageSchema, AiCollabStartInput, aiCollabStartSchema, localeSchema

## Knowledge Gaps
- **227 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+222 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSupabase()` connect `Community 10` to `Community 0`, `Community 2`, `Community 4`, `Community 6`, `Community 7`, `Community 12`, `Community 16`, `Community 17`, `Community 22`, `Community 26`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 8` to `Community 0`, `Community 15`, `Community 18`, `Community 19`, `Community 20`, `Community 21`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `routing` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `getSupabase()` (e.g. with `CandidateDetailPage()` and `POST()`) actually correct?**
  _`getSupabase()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Vercel Python Serverless Function: Full Kundli analysis. Input: name + DOB + bir`, `Career mapping based on numerology and Vedic astrology.`, `Get top 5 careers based on destiny number.` to the rest of the system?**
  _255 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.0602655771195097 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.058699101004759384 - nodes in this community are weakly interconnected._