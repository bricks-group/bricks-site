import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAnonKey, getSupabasePublicUrl } from '@/lib/supabase-public'
import { sendContactMessage } from '@/lib/contact-mail'

export async function POST(req: NextRequest) {
  const SUPABASE_URL = getSupabasePublicUrl()
  const SUPABASE_ANON_KEY = getSupabaseAnonKey()
  if (!process.env.RESEND_API_KEY && (!SUPABASE_URL || !SUPABASE_ANON_KEY)) {
    return NextResponse.json(
      { ok: false, error: 'Contact form temporarily unavailable. Please email hello@brxs.ca.' },
      { status: 503 },
    )
  }

  let body: { name?: string; email?: string; message?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const name = (body.name || '').toString().trim()
  const email = (body.email || '').toString().trim()
  const message = (body.message || '').toString().trim()

  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !message) {
    return NextResponse.json({ ok: false, error: 'Fill in name, a valid email, and a message.' }, { status: 400 })
  }

  const sent = await sendContactMessage({ name, email, message }, {
    sourceLabel: 'the Bricks contact page', supabaseUrl: SUPABASE_URL, supabaseKey: SUPABASE_ANON_KEY,
  })
  if (!sent.ok) {
    return NextResponse.json(
      { ok: false, error: sent.status === 502 ? 'Could not send message. Please email hello@brxs.ca directly.' : sent.error },
      { status: sent.status },
    )
  }
  return NextResponse.json({ ok: true })
}
