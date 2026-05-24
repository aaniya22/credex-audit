export interface ShareableAudit {
  shareId: string
  tools: import('./auditEngine').ToolInput[]
  results: import('./auditEngine').AuditResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  createdAt: string
}