import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAnonKey, getSupabasePublicUrl } from '@/lib/supabase-public'
import { QUOTE_INBOX, isSmokeTest, sendClientConfirmation, sendContactMessage } from '@/lib/contact-mail'
import { cleanQuoteRequest, quoteConfirmation, quoteInboxMessage } from '@/lib/services'

/**
 * Home services quote request from /services and the trade pages. Public like
 * the rest of /api/book. The request goes to help@brxs.ca through Resend (same
 * sender as /api/book/property-request) and the client gets a confirmation email.
 * Nothing is booked, priced or charged.
 */
export async function POST(req: NextRequest) {
  const url = getSupabasePublicUrl()
  const key = getSupabaseAnonKey()
  if (!process.env.RESEND_API_KEY && (!url || !key)) return NextResponse.json({ ok: false, error: 'Requests are unavailable right now. Email help@brxs.ca.' }, { status: 503 })

  let b: Record<string, unknown>
  try { b = await req.json() } catch { return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 }) }
  if (typeof b.website === 'string' && b.website.trim()) return NextResponse.json({ ok: true }) // honeypot

  const r = cleanQuoteRequest(b)
  if (!r.ok) return NextResponse.json({ ok: false, error: r.error }, { status: 400 })
  const q = r.q
  const m = { name: q.name, email: q.email, message: quoteInboxMessage(q) }

  const sent = await sendContactMessage(m, {
    sourceLabel: `the Bricks /${q.trade.slug} quote form`,
    subject: `Bricks — ${q.trade.name.toLowerCase()} quote request from ${q.name}`,
    inbox: QUOTE_INBOX,
    supabaseUrl: url,
    supabaseKey: key,
  })
  if (!sent.ok) return NextResponse.json({ ok: false, error: 'Could not send. Email help@brxs.ca.' }, { status: sent.status })

  const c = quoteConfirmation(q)
  const confirmation = await sendClientConfirmation({ to: q.email, name: q.name, ...c }, { smoke: isSmokeTest(m) })
  return NextResponse.json({ ok: true, via: sent.via, confirmation: confirmation.sent })
}
