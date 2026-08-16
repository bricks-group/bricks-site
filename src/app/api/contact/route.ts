import { NextRequest, NextResponse } from 'next/server'

// Public bricks-prelaunch Supabase credentials (already shipped in the client
// bundle via BookingWizard). The Resend key lives only in the Supabase vault —
// this route forwards to the contact-message edge function, which holds it.
// No Vercel env var is required.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ctqwxwrcxwruaqojohpf.supabase.co'
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_dsC8pvo5X9ZVZGbkaotrGQ_VhRINFod'

export async function POST(req: NextRequest) {
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

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/contact-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ name, email, message }),
    })
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
    if (!res.ok || !data.ok) {
      return NextResponse.json(
        { ok: false, error: data.error || 'Could not send message.' },
        { status: res.ok ? 502 : res.status },
      )
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Could not send message. Please email booking@brxs.ca directly.' },
      { status: 502 },
    )
  }
}
