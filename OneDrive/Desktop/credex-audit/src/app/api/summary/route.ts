import { NextRequest, NextResponse } from 'next/server'
import { AuditResult } from '@/lib/auditEngine'

export async function POST(req: NextRequest) {
  try {
    const { results, totalMonthlySavings, useCase, teamSize } = await req.json()

    // Try Anthropic API
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (apiKey && apiKey !== 'your_anthropic_api_key') {
      try {
        const topIssues = results
          .filter((r: AuditResult) => r.severity === 'overspending')
          .map((r: AuditResult) => `${r.tool}: ${r.recommendedAction}`)
          .join(', ')

        const prompt = `You are an AI spend analyst. Write a 100-word personalized audit summary for a ${teamSize}-person team using AI tools primarily for ${useCase}. Their total potential monthly savings is $${totalMonthlySavings}. Top issues found: ${topIssues || 'none — spending looks optimal'}. Be direct, specific, and helpful. No fluff.`

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 200,
            messages: [{ role: 'user', content: prompt }],
          }),
        })

        const data = await response.json()
        const summary = data.content?.[0]?.text

        if (summary) {
          return NextResponse.json({ summary })
        }
      } catch (apiErr) {
        console.error('Anthropic API failed:', apiErr)
      }
    }

    // Fallback templated summary
    const summary = totalMonthlySavings > 0
      ? `Your ${teamSize}-person team is spending more than necessary on AI tools. Our audit identified $${totalMonthlySavings}/month in potential savings ($${totalMonthlySavings * 12}/year). The biggest opportunities are in right-sizing plans to your actual team size and use case. Consolidating overlapping tools would also reduce spend without impacting productivity. These are straightforward changes you can make this week.`
      : `Your ${teamSize}-person team is spending efficiently on AI tools for ${useCase} workflows. Your current plan selections are well-matched to your team size. Keep monitoring as your team grows — plan tiers that make sense today may not be optimal at 2x headcount.`

    return NextResponse.json({ summary })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ summary: 'Unable to generate summary at this time.' })
  }
}