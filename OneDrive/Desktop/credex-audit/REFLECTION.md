# Reflection

## 1. Hardest Bug

The hardest bug was the Row Level Security error from Supabase. When I first 
ran the audit, the API returned a 500 error. The terminal showed: 
"new row violates row-level security policy for table audits."

My first hypothesis was that the Supabase client was misconfigured — wrong URL 
or anon key. I checked the .env.local file and the keys were correct.

My second hypothesis was that the table schema was wrong. I checked the SQL 
and it looked fine.

Then I realized: Supabase enables RLS by default but creates no policies, 
which means all operations are blocked. The fix was adding explicit policies 
for insert, select, and update. Once I ran the policy SQL, inserts worked 
immediately. The lesson: always check RLS policies before debugging anything else 
in Supabase.

## 2. A Decision I Reversed

I initially put the audit results page at `src/app/api/audit/[shareId]/page.tsx` 
thinking it belonged with the API routes. This caused a 404 because Next.js 
serves pages from `app/` not `app/api/`. 

I reversed this when I saw the URL was resolving correctly 
(`/audit/ik7JrJeQPy`) but returning 404. Moving the file to 
`src/app/audit/[shareId]/page.tsx` fixed it immediately. 

The lesson: in Next.js App Router, `api/` is strictly for route handlers, 
not pages.

## 3. What I'd Build in Week 2

- PDF export of the full audit report (highest requested feature)
- Benchmark mode: "your AI spend per developer is $X, companies your size average $Y"
- A/B test two versions of the results page CTA to optimize consultation bookings
- Embeddable widget so bloggers can drop the audit form into their posts
- Pricing data auto-refresh via a weekly cron job hitting vendor pages

## 4. How I Used AI Tools

I used Claude (Anthropic) throughout this project for:
- Generating boilerplate (API route structure, Supabase client setup)
- Debugging error messages (the RLS bug, the Next.js routing bug)
- Writing first drafts of markdown documentation

What I didn't trust AI with:
- The audit engine logic — I wrote and verified every rule manually because 
  the reasoning has to be defensible to a finance person
- The unit economics math — I worked through the conversion funnel myself
- The git history — every commit was a real decision I made

One time the AI was wrong: it suggested putting the results page inside 
`app/api/[shareId]/page.tsx`. This caused a 404. I caught it because I 
understood Next.js routing well enough to know API routes and pages 
are separate concerns.

## 5. Self-Rating

| Dimension | Score | Reason |
|-----------|-------|--------|
| Discipline | 7/10 | Worked consistently across days but could have started docs earlier |
| Code quality | 7/10 | TypeScript throughout, clean abstractions, could use more error handling |
| Design sense | 8/10 | Dark theme is clean and appropriate for the audience |
| Problem-solving | 8/10 | Debugged RLS and routing issues quickly without outside help |
| Entrepreneurial thinking | 7/10 | GTM and economics are specific but user interviews were hard to get |