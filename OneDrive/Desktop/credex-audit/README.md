# SpendSight — AI Spend Auditor for Startups

A free web app that audits your team's AI tool subscriptions and shows you 
exactly where you're overpaying — in 60 seconds, no login required.

Built for the Credex Web Development Internship — Round 1.

🔗 **Live URL**:https://credex-audit-gamma.vercel.app/

---



## Quick Start

### Install

```bash
git clone https://github.com/aaniya22/credex-audit.git
cd credex-audit
npm install
```

### Environment Variables

Create `.env.local` in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Run Tests

```bash
npm test
```

### Deploy

```bash
vercel deploy
```

---

## Decisions

1. **Next.js over plain React** — App Router gives us serverless API routes 
   and easy Vercel deployment in one repo. No separate backend needed.

2. **Deterministic rules over AI for audit logic** — The audit engine uses 
   hardcoded rules, not an LLM. A finance person needs to agree with the 
   reasoning. AI is used only for the summary paragraph where creativity helps.

3. **Supabase over Firebase** — Postgres is better for structured audit data 
   with relational queries. Supabase's free tier is generous and the client 
   library is excellent.

4. **Email after value, never before** — The audit result is shown instantly 
   with no gate. Email is only asked for after the user sees their savings. 
   This follows the assignment brief and maximizes completion rates.

5. **nanoid for share IDs over UUID** — nanoid generates short, URL-friendly 
   IDs (10 chars) vs UUID's 36 chars. Better for sharing and cleaner URLs.

---

## Who It's For

Startup engineering managers and CTOs paying for 3+ AI tools with no 
centralized view of spend — who sigh and pay the bill every month without 
knowing if they're getting value.