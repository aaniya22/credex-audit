import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { shareId, email, companyName, role, teamSize, monthlySavings } = await req.json()

    if (!email || !shareId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Update audit record with lead info
    await supabase.from('audits').update({
      email, company_name: companyName, role, team_size: teamSize,
    }).eq('share_id', shareId)

    // Send confirmation email
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Your AI Spend Audit Report',
        html: `
          <h2>Your AI Spend Audit is Ready</h2>
          <p>Hi ${role || 'there'},</p>
          <p>Your audit shows potential savings of <strong>$${monthlySavings}/month</strong> ($${monthlySavings * 12}/year).</p>
          <p>View your full report: <a href="${process.env.NEXT_PUBLIC_APP_URL}/audit/${shareId}">${process.env.NEXT_PUBLIC_APP_URL}/audit/${shareId}</a></p>
          ${monthlySavings > 500 ? `<p><strong>You qualify for a Credex consultation</strong> — we can help you capture these savings through discounted AI credits. Reply to this email to book a call.</p>` : ''}
          <p>— Team Credex</p>
        `,
      })
    } catch (emailErr) {
      console.error('Email send failed:', emailErr)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}