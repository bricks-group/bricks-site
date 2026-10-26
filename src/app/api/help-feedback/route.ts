import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAnonKey, getSupabasePublicUrl } from '@/lib/supabase-public'
import { sendContactMessage } from '@/lib/contact-mail'
import { feedbackMessage, parseFeedback } from '@/lib/help/feedback'

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }
  const parsed = parseFeedback(body)
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 })

  const SUPABASE_URL = getSupabasePublicUrl()
  const SUPABASE_ANON_KEY = getSupabaseAnonKey()
  if (!process.env.RESEND_API_KEY && (!SUPABASE_URL || !SUPABASE_ANON_KEY)) {
    return NextResponse.json({ ok: false, error: 'Feedback is unavailable right now. Email help@brxs.ca.' }, { status: 503 })
  }
  const sent = await sendContactMessage(feedbackMessage(parsed.value), {
    sourceLabel: 'the Bricks help centre', supabaseUrl: SUPABASE_URL, supabaseKey: SUPABASE_ANON_KEY,
  })
  if (!sent.ok) {
    return NextResponse.json({ ok: false, error: 'Could not send. Email help@brxs.ca.' }, { status: sent.status })
  }
  return NextResponse.json({ ok: true })
}
