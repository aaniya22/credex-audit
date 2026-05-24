import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { runAudit, FormData } from '@/lib/auditEngine'
import { nanoid } from 'nanoid'

export async function POST(req: NextRequest) {
  try {
    const body: FormData = await req.json()

    if (!body.tools || body.tools.length === 0) {
      return NextResponse.json({ error: 'No tools provided' }, { status: 400 })
    }

    const audit = runAudit(body)
    const shareId = nanoid(10)

    const { error } = await supabase.from('audits').insert({
      share_id: shareId,
      tools: body.tools,
      total_monthly_savings: audit.totalMonthlySavings,
      total_annual_savings: audit.totalAnnualSavings,
    })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save audit' }, { status: 500 })
    }

    return NextResponse.json({ ...audit, shareId })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}