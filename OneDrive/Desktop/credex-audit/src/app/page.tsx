'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ToolInput, ToolName, UseCase } from '@/lib/auditEngine'

const TOOLS = [
  { id: 'cursor', name: 'Cursor', plans: ['hobby', 'pro', 'business', 'enterprise'] },
  { id: 'github_copilot', name: 'GitHub Copilot', plans: ['individual', 'business', 'enterprise'] },
  { id: 'claude', name: 'Claude', plans: ['free', 'pro', 'max', 'team', 'enterprise'] },
  { id: 'chatgpt', name: 'ChatGPT', plans: ['plus', 'team', 'enterprise'] },
  { id: 'anthropic_api', name: 'Anthropic API', plans: ['direct'] },
  { id: 'openai_api', name: 'OpenAI API', plans: ['direct'] },
  { id: 'gemini', name: 'Gemini', plans: ['pro', 'ultra', 'api'] },
  { id: 'windsurf', name: 'Windsurf', plans: ['free', 'pro', 'teams'] },
]

const USE_CASES: { id: UseCase; label: string }[] = [
  { id: 'coding', label: 'Coding' },
  { id: 'writing', label: 'Writing' },
  { id: 'data', label: 'Data Analysis' },
  { id: 'research', label: 'Research' },
  { id: 'mixed', label: 'Mixed' },
]

export default function Home() {
  const router = useRouter()
  const [selectedTools, setSelectedTools] = useState<ToolInput[]>([])
  const [teamSize, setTeamSize] = useState(5)
  const [useCase, setUseCase] = useState<UseCase>('coding')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleTool = (toolId: ToolName) => {
    setSelectedTools(prev => {
      const exists = prev.find(t => t.tool === toolId)
      if (exists) return prev.filter(t => t.tool !== toolId)
      const toolInfo = TOOLS.find(t => t.id === toolId)!
      return [...prev, { tool: toolId, plan: toolInfo.plans[0], seats: 1, monthlySpend: 0 }]
    })
  }

  const updateTool = (toolId: ToolName, field: keyof ToolInput, value: string | number) => {
    setSelectedTools(prev =>
      prev.map(t => t.tool === toolId ? { ...t, [field]: value } : t)
    )
  }

  const handleSubmit = async () => {
    if (selectedTools.length === 0) {
      setError('Please select at least one tool.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tools: selectedTools, teamSize, useCase }),
      })
      const data = await res.json()
      if (data.shareId) {
        // Save audit data to sessionStorage for results page
        sessionStorage.setItem(`audit_${data.shareId}`, JSON.stringify(data))
        router.push(`/audit/${data.shareId}`)
      } else {
        console.error('API error:', data)
        setError('Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-block bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1 text-emerald-400 text-sm mb-6">
            Free AI Spend Audit
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Are you overpaying for<br />
            <span className="text-emerald-400">AI tools?</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Most startups overspend on AI subscriptions by 30–50%. Get an instant audit of your stack — free, no login required.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

        {/* Team info */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-semibold">Your Team</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Team Size</label>
              <input
                type="number"
                min={1}
                value={teamSize}
                onChange={e => setTeamSize(Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Primary Use Case</label>
              <select
                value={useCase}
                onChange={e => setUseCase(e.target.value as UseCase)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                {USE_CASES.map(u => (
                  <option key={u.id} value={u.id}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tool selection */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Select Your AI Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TOOLS.map(tool => {
              const selected = selectedTools.find(t => t.tool === tool.id)
              return (
                <button
                  key={tool.id}
                  onClick={() => toggleTool(tool.id as ToolName)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    selected
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  {tool.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tool details */}
        {selectedTools.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-semibold">Tool Details</h2>
            {selectedTools.map(toolInput => {
              const toolInfo = TOOLS.find(t => t.id === toolInput.tool)!
              return (
                <div key={toolInput.tool} className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-800 last:border-0">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">{toolInfo.name} — Plan</label>
                    <select
                      value={toolInput.plan}
                      onChange={e => updateTool(toolInput.tool, 'plan', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 capitalize"
                    >
                      {toolInfo.plans.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Seats</label>
                    <input
                      type="number" min={1}
                      value={toolInput.seats}
                      onChange={e => updateTool(toolInput.tool, 'seats', Number(e.target.value))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Monthly Spend ($)</label>
                    <input
                      type="number" min={0}
                      value={toolInput.monthlySpend}
                      onChange={e => updateTool(toolInput.tool, 'monthlySpend', Number(e.target.value))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-gray-950 font-bold rounded-xl py-4 text-lg transition-all"
        >
          {loading ? 'Analyzing your stack...' : 'Run My Free Audit →'}
        </button>

        <p className="text-center text-gray-500 text-sm">
          No login required. Your data is never sold.
        </p>
      </div>
    </main>
  )
}