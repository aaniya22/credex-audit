export type ToolName =
  | 'cursor' | 'github_copilot' | 'claude' | 'chatgpt'
  | 'anthropic_api' | 'openai_api' | 'gemini' | 'windsurf'

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed'

export interface ToolInput {
  tool: ToolName
  plan: string
  seats: number
  monthlySpend: number
}

export interface FormData {
  tools: ToolInput[]
  teamSize: number
  useCase: UseCase
}

export interface AuditResult {
  tool: ToolName
  plan: string
  currentSpend: number
  recommendedAction: string
  savings: number
  reason: string
  severity: 'overspending' | 'optimal' | 'review'
}

export interface AuditSummary {
  results: AuditResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  shareId?: string
}

const PRICING: Record<string, Record<string, number>> = {
  cursor: { hobby: 0, pro: 20, business: 40, enterprise: 60 },
  github_copilot: { individual: 10, business: 19, enterprise: 39 },
  claude: { free: 0, pro: 20, max: 100, team: 30, enterprise: 60, api: 0 },
  chatgpt: { plus: 20, team: 30, enterprise: 60, api: 0 },
  anthropic_api: { direct: 0 },
  openai_api: { direct: 0 },
  gemini: { pro: 20, ultra: 300, api: 0 },
  windsurf: { free: 0, pro: 15, teams: 35 },
}

export function runAudit(formData: FormData): AuditSummary {
  const results: AuditResult[] = []

  for (const toolInput of formData.tools) {
    const result = auditTool(toolInput, formData.teamSize, formData.useCase, formData)
    results.push(result)
  }

  const totalMonthlySavings = results.reduce((sum, r) => sum + r.savings, 0)

  return {
    results,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
  }
}

function auditTool(tool: ToolInput, teamSize: number, useCase: UseCase, formData: FormData): AuditResult {
  const perSeatCost = tool.seats > 0 ? tool.monthlySpend / tool.seats : tool.monthlySpend

  // Cursor
  if (tool.tool === 'cursor') {
    if (tool.plan === 'business' && tool.seats <= 2) {
      return {
        tool: tool.tool, plan: tool.plan, currentSpend: tool.monthlySpend,
        recommendedAction: 'Downgrade to Pro plan',
        savings: (PRICING.cursor.business - PRICING.cursor.pro) * tool.seats,
        reason: 'Business plan is overkill for teams of 2 or fewer. Pro has the same core features.',
        severity: 'overspending',
      }
    }
    if (tool.plan === 'enterprise' && tool.seats <= 5) {
      return {
        tool: tool.tool, plan: tool.plan, currentSpend: tool.monthlySpend,
        recommendedAction: 'Downgrade to Business plan',
        savings: (PRICING.cursor.enterprise - PRICING.cursor.business) * tool.seats,
        reason: 'Enterprise tier adds SSO/compliance features rarely needed under 5 seats.',
        severity: 'overspending',
      }
    }
    if (useCase !== 'coding' && tool.plan !== 'hobby') {
      return {
        tool: tool.tool, plan: tool.plan, currentSpend: tool.monthlySpend,
        recommendedAction: 'Consider downgrading or switching to GitHub Copilot',
        savings: Math.round(tool.monthlySpend * 0.3),
        reason: `Cursor is optimized for coding workflows. For ${useCase}, alternatives may be cheaper.`,
        severity: 'review',
      }
    }
  }

  // GitHub Copilot
  if (tool.tool === 'github_copilot') {
    if (tool.plan === 'business' && tool.seats <= 3) {
      return {
        tool: tool.tool, plan: tool.plan, currentSpend: tool.monthlySpend,
        recommendedAction: 'Switch to Individual plan',
        savings: (PRICING.github_copilot.business - PRICING.github_copilot.individual) * tool.seats,
        reason: 'Business plan adds org management features not needed for small teams.',
        severity: 'overspending',
      }
    }
    if (tool.plan === 'enterprise' && tool.seats <= 10) {
      return {
        tool: tool.tool, plan: tool.plan, currentSpend: tool.monthlySpend,
        recommendedAction: 'Downgrade to Business plan',
        savings: (PRICING.github_copilot.enterprise - PRICING.github_copilot.business) * tool.seats,
        reason: 'Enterprise adds policy controls and audit logs — unnecessary under 10 seats typically.',
        severity: 'overspending',
      }
    }
  }

  // Claude
  if (tool.tool === 'claude') {
    if (tool.plan === 'team' && tool.seats <= 2) {
      return {
        tool: tool.tool, plan: tool.plan, currentSpend: tool.monthlySpend,
        recommendedAction: 'Switch to individual Pro plans',
        savings: tool.monthlySpend - PRICING.claude.pro * tool.seats,
        reason: 'Team plan pricing is higher per seat than individual Pro for very small teams.',
        severity: 'overspending',
      }
    }
    if (tool.plan === 'max' && useCase === 'writing') {
      return {
        tool: tool.tool, plan: tool.plan, currentSpend: tool.monthlySpend,
        recommendedAction: 'Downgrade to Pro plan',
        savings: (PRICING.claude.max - PRICING.claude.pro) * tool.seats,
        reason: 'Max plan is designed for heavy API/coding usage. Pro is sufficient for writing workflows.',
        severity: 'overspending',
      }
    }
  }

  // ChatGPT
  if (tool.tool === 'chatgpt') {
    if (tool.plan === 'team' && tool.seats <= 2) {
      return {
        tool: tool.tool, plan: tool.plan, currentSpend: tool.monthlySpend,
        recommendedAction: 'Switch to Plus plan',
        savings: (PRICING.chatgpt.team - PRICING.chatgpt.plus) * tool.seats,
        reason: 'Team plan adds workspace features unnecessary for individuals or pairs.',
        severity: 'overspending',
      }
    }
  }

  // Gemini Ultra
  if (tool.tool === 'gemini' && tool.plan === 'ultra') {
    return {
      tool: tool.tool, plan: tool.plan, currentSpend: tool.monthlySpend,
      recommendedAction: 'Evaluate if Ultra features are actively used',
      savings: Math.round((PRICING.gemini.ultra - PRICING.gemini.pro) * tool.seats),
      reason: 'Gemini Ultra is significantly more expensive. Pro covers most use cases.',
      severity: 'review',
    }
  }

  // Duplicate tools check — coding assistants
  const codingTools = ['cursor', 'github_copilot', 'windsurf']
  if (codingTools.includes(tool.tool)) {
    const otherCodingTools = formData.tools.filter(
      t => codingTools.includes(t.tool) && t.tool !== tool.tool
    )
    if (otherCodingTools.length > 0) {
      return {
        tool: tool.tool, plan: tool.plan, currentSpend: tool.monthlySpend,
        recommendedAction: `Consolidate — pick one coding assistant`,
        savings: Math.round(tool.monthlySpend * 0.5),
        reason: `You're paying for multiple AI coding assistants. Developers rarely use more than one effectively.`,
        severity: 'overspending',
      }
    }
  }

  // Default — looks optimal
  return {
    tool: tool.tool, plan: tool.plan, currentSpend: tool.monthlySpend,
    recommendedAction: 'No changes needed',
    savings: 0,
    reason: `Your ${tool.plan} plan on ${tool.tool} looks right-sized for your team and use case.`,
    severity: 'optimal',
  }
}