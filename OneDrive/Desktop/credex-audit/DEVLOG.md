# Dev Log

## Day 1 — 2026-05-24
**Hours worked:** 6

**What I did:** Set up Next.js project with TypeScript and Tailwind. Installed 
Supabase, Resend, shadcn/ui. Created .env.local with all API keys. Set up 
Supabase database table with RLS policies. Built the spend input form with 
tool selection, plan dropdowns, seat and spend inputs. Form state persists 
via sessionStorage.

**What I learned:** Supabase RLS blocks all operations by default — you must 
explicitly create policies. Next.js App Router separates api/ routes from 
page components strictly.

**Blockers / what I'm stuck on:** Anthropic API requires paid credits — using 
templated fallback summary for now.

**Plan for tomorrow:** Build audit engine, results page, and API routes.

## Day 2 — 2026-05-25
**Hours worked:** 5

**What I did:** Built the full audit engine with rules for all 8 tools. 
Created results page with per-tool breakdown, savings hero, AI summary, 
lead capture form, and shareable URL. Fixed routing bug (results page was 
in wrong folder). Fixed Supabase RLS error. All 6 MVP features working end-to-end.

**What I learned:** Deterministic rules are better than AI for audit logic — 
the reasoning needs to be finance-defensible, not probabilistic.

**Blockers / what I'm stuck on:** Need to set up CI and write tests.

**Plan for tomorrow:** Write tests, set up GitHub Actions, start deployment.

## Day 3 — 2026-05-26
**Hours worked:** 4

**What I did:** Wrote 7 Jest tests for audit engine, all passing. Set up 
GitHub Actions CI workflow. Created all required markdown files: ARCHITECTURE, 
GTM, ECONOMICS, PROMPTS, PRICING_DATA, TESTS, REFLECTION, LANDING_COPY, METRICS.

**What I learned:** Passing formData into auditTool function is necessary for 
cross-tool checks like duplicate coding assistant detection.

**Blockers / what I'm stuck on:** User interviews — reaching out to potential users.

**Plan for tomorrow:** Deploy to Vercel, conduct user interviews, final polish.

## Day 4 — 2026-05-27
**Hours worked:** 4

**What I did:** Deployed to Vercel. Conducted user interviews. Final polish 
on UI and documentation. Submitted assignment.

**What I learned:** Deployment on Vercel is seamless with Next.js — zero config needed.

**Blockers / what I'm stuck on:** None.

**Plan for tomorrow:** Assignment submitted!