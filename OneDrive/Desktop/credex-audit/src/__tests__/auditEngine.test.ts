import { runAudit, FormData } from '../lib/auditEngine'

describe('Audit Engine', () => {
  test('Cursor Business 2 seats should flag overspending', () => {
    const input: FormData = {
      tools: [{ tool: 'cursor', plan: 'business', seats: 2, monthlySpend: 80 }],
      teamSize: 2,
      useCase: 'coding',
    }
    const result = runAudit(input)
    expect(result.results[0].severity).toBe('overspending')
    expect(result.results[0].savings).toBeGreaterThan(0)
  })

  test('Cursor Pro 1 seat should be optimal', () => {
    const input: FormData = {
      tools: [{ tool: 'cursor', plan: 'pro', seats: 1, monthlySpend: 20 }],
      teamSize: 1,
      useCase: 'coding',
    }
    const result = runAudit(input)
    expect(result.results[0].severity).toBe('optimal')
    expect(result.results[0].savings).toBe(0)
  })

  test('GitHub Copilot Business 3 seats should flag overspending', () => {
    const input: FormData = {
      tools: [{ tool: 'github_copilot', plan: 'business', seats: 3, monthlySpend: 57 }],
      teamSize: 3,
      useCase: 'coding',
    }
    const result = runAudit(input)
    expect(result.results[0].severity).toBe('overspending')
  })

  test('Claude Max for writing should flag overspending', () => {
    const input: FormData = {
      tools: [{ tool: 'claude', plan: 'max', seats: 1, monthlySpend: 100 }],
      teamSize: 1,
      useCase: 'writing',
    }
    const result = runAudit(input)
    expect(result.results[0].severity).toBe('overspending')
  })

  test('Multiple coding tools should flag consolidation', () => {
    const input: FormData = {
      tools: [
        { tool: 'cursor', plan: 'pro', seats: 1, monthlySpend: 20 },
        { tool: 'windsurf', plan: 'pro', seats: 1, monthlySpend: 15 },
      ],
      teamSize: 1,
      useCase: 'coding',
    }
    const result = runAudit(input)
    expect(result.results.some(r => r.severity === 'overspending')).toBe(true)
  })

  test('Total savings should sum correctly', () => {
    const input: FormData = {
      tools: [
        { tool: 'cursor', plan: 'business', seats: 2, monthlySpend: 80 },
        { tool: 'github_copilot', plan: 'business', seats: 2, monthlySpend: 38 },
      ],
      teamSize: 2,
      useCase: 'coding',
    }
    const result = runAudit(input)
    expect(result.totalMonthlySavings).toBeGreaterThan(0)
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12)
  })

  test('Optimal spend returns zero savings', () => {
    const input: FormData = {
      tools: [{ tool: 'cursor', plan: 'pro', seats: 5, monthlySpend: 100 }],
      teamSize: 5,
      useCase: 'coding',
    }
    const result = runAudit(input)
    expect(result.totalMonthlySavings).toBe(0)
  })
})