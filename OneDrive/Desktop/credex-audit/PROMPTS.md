# Prompts

## AI Summary Prompt

Used in: `src/app/api/summary/route.ts`

### Final Prompt
You are an AI spend analyst. Write a 100-word personalized audit summary
for a {teamSize}-person team using AI tools primarily for {useCase}.
Their total potential monthly savings is ${totalMonthlySavings}.
Top issues found: {topIssues}.
Be direct, specific, and helpful. No fluff.

### Why I wrote it this way
- Kept it under 100 words to avoid rambling
- Made it role-specific ("AI spend analyst") so the tone stays professional
- Injected real numbers so the output feels personalized not generic
- "No fluff" instruction cuts filler sentences the model tends to add

### What I tried that didn't work
- Longer prompts with more context made the model repeat the audit data instead of summarizing it
- Asking for bullet points made it feel like a list not a summary
- Without the word limit the model wrote 300+ words

### Fallback
If the API is unavailable or returns an error, the system falls back to a 
templated summary generated from the audit data directly in code.