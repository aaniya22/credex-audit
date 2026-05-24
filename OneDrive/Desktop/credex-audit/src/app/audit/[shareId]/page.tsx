'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AuditResult } from '@/lib/auditEngine'

interface AuditData {
  shareId: string
  results: AuditResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
}

export default function AuditPage() {
  const params = useParams()
  const shareId = params.shareId as string

  const [audit, setAudit] = useState<AuditData | null>(null)
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem(`audit_${shareId}`)
    if (stored) {
      const data = JSON.parse(stored)
      setAudit(data)
      fetchSummary(data)
    }
    setLoading(false)
  }, [shareId])

  const fetchSummary = async (data: AuditData) => {
    try {
      const res = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          results: data.results,
          totalMonthlySavings: data.totalMonthlySavings,
          useCase: 'mixed',
          teamSize: 5,
        }),
      })
      const json = await res.json()
      setSummary(json.summary)
    } catch {
      setSummary('Unable to generate summary at this time.')
    }
  }

  const handleLeadSubmit = async () => {
    if (!email) return
    setSubmitting(true)
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shareId,
          email,
          companyName: company,
          role,
          monthlySavings: audit?.totalMonthlySavings,
        }),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  const severityColor = (severity: string) => {
    if (severity === 'overspending') return 'border-red-500/50 bg-red-500/5'
    if (severity === 'review') return 'border-yellow-500/50 bg-yellow-500/5'
    return 'border-emerald-500/50 bg-emerald-500/5'
  }

  const severityBadge = (severity: string) => {
    if (severity === 'overspending') return 'bg-red-500/20 text-red-400'
    if (severity === 'review') return 'bg-yellow-500/20 text-yellow-400'
    return 'bg-emerald-500/20 text-emerald-400'
  }

  const severityLabel = (severity: string) => {
    if (severity === 'overspending') return 'Overspending'
    if (severity === 'review') return 'Review'
    return 'Optimal'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading your audit...</p>
      </div>
    )
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Audit not found.</p>
          <a href="/" className="text-emerald-400 underline">Run a new audit</a>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-10 text-center">
          <p className="text-gray-400 text-sm mb-2">Your AI Spend Audit</p>
          <h1 className="text-4xl font-bold mb-6">Here's where your money is going</h1>
          <div className="flex justify-center gap-8">
            <div className="bg-gray-800 rounded-2xl px-8 py-5">
              <p className="text-gray-400 text-sm mb-1">Monthly Savings</p>
              <p className="text-4xl font-bold text-emerald-400">${audit.totalMonthlySavings}</p>
            </div>
            <div className="bg-gray-800 rounded-2xl px-8 py-5">
              <p className="text-gray-400 text-sm mb-1">Annual Savings</p>
              <p className="text-4xl font-bold text-emerald-400">${audit.totalAnnualSavings}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* AI Summary */}
        {summary && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-sm text-emerald-400 mb-2 font-medium">AI Analysis</p>
            <p className="text-gray-300 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Per-Tool Breakdown</h2>
          {audit.results.map((result, i) => (
            <div key={i} className={`border rounded-2xl p-6 ${severityColor(result.severity)}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold capitalize">{result.tool.replace('_', ' ')}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${severityBadge(result.severity)}`}>
                      {severityLabel(result.severity)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 capitalize">Current plan: {result.plan}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Current spend</p>
                  <p className="font-bold">${result.currentSpend}/mo</p>
                </div>
              </div>
              <div className="bg-black/20 rounded-xl p-4">
                <p className="text-sm font-medium mb-1">{result.recommendedAction}</p>
                <p className="text-sm text-gray-400">{result.reason}</p>
                {result.savings > 0 && (
                  <p className="text-emerald-400 font-bold mt-2">Save ${result.savings}/mo</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Credex CTA for high savings */}
        {audit.totalMonthlySavings > 500 && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center">
            <h3 className="text-xl font-bold text-emerald-400 mb-2">You qualify for a Credex consultation</h3>
            <p className="text-gray-400 mb-4">Your team could save ${audit.totalMonthlySavings}/mo through discounted AI credits. Credex sources surplus AI infrastructure at significant discounts.</p>
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer"
              className="inline-block bg-emerald-500 text-gray-950 font-bold px-6 py-3 rounded-xl hover:bg-emerald-400 transition-all">
              Book a Free Credex Consultation →
            </a>
          </div>
        )}

        {/* Lead capture */}
        {!submitted ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Get this report in your inbox</h2>
            <p className="text-gray-400 text-sm">We'll email you the full audit + notify you when new optimizations apply to your stack.</p>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="email" placeholder="your@email.com" value={email}
                onChange={e => setEmail(e.target.value)}
                className="col-span-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text" placeholder="Company name (optional)" value={company}
                onChange={e => setCompany(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text" placeholder="Your role (optional)" value={role}
                onChange={e => setRole(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              onClick={handleLeadSubmit}
              disabled={submitting || !email}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-gray-950 font-bold rounded-xl py-3 transition-all"
            >
              {submitting ? 'Sending...' : 'Send Me the Report'}
            </button>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center">
            <p className="text-emerald-400 font-bold text-lg">✓ Report sent!</p>
            <p className="text-gray-400 mt-2">Check your inbox. We'll reach out if we spot more savings.</p>
          </div>
        )}

        {/* Share */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
          <p className="text-gray-400 text-sm mb-3">Share this audit</p>
          <div className="flex gap-3">
            <input
              readOnly
              value={`${window.location.origin}/audit/${shareId}`}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-400"
            />
            <button
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/audit/${shareId}`)}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition-all"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="text-center">
          <a href="/" className="text-gray-500 text-sm hover:text-gray-300">← Run another audit</a>
        </div>
      </div>
    </main>
  )
}