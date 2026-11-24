import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAnonKey, getSupabasePublicUrl } from '@/lib/supabase-public'
import { QUOTE_INBOX, isSmokeTest, sendClientConfirmation, sendContactMessage } from '@/lib/contact-mail'
import { cleanQuoteRequest, quoteConfirmation, quoteInboxMessage, quoteRecipientKey } from '@/lib/services'
import { supportDb } from '@/lib/support/db'
import { clientKey, connectingIp, limited } from '@/lib/support/rate-limit'

const IP_LIMIT = { windowSec: 600, max: 8 }
const RECIPIENT_LIMIT = { windowSec: 86_400, max: 3 }
const BUSY = 'Too many requests. Try again later, or email help@brxs.ca.'

/**
 * Home services quote request from /services and the trade pages. Public like
 * the rest of /api/book. The request goes to help@brxs.ca through Resend (same
 * sender as /api/book/property-request) and the client gets a confirmation email.
 * Nothing is booked, priced or charged.
 *
 * The confirmation goes to an unverified address, so it carries none of the
 * submitter's free text, and both the client IP and the recipient mailbox are
 * rate limited before anything is sent.
 */
export async function POST(req: NextRequest) {
  const url = getSupabasePublicUrl()
  const key = getSupabaseAnonKey()
  if (!process.env.RESEND_API_KEY && (!url || !key)) return NextResponse.json({ ok: false, error: 'Requests are unavailable right now. Email help@brxs.ca.' }, { status: 503 })

  // A missing CF-Connecting-IP must not share one 'unknown' rate-limit bucket.
  const ip = connectingIp(req.headers)
  if (!ip || ip === 'unknown') return NextResponse.json({ ok: false, error: 'We couldn’t confirm this request. Please try again.' }, { status: 400 })

  let b: Record<string, unknown>
  try { b = await req.json() } catch { return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 }) }
  if (!b || typeof b !== 'object' || Array.isArray(b)) return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  if (typeof b.website === 'string' && b.website.trim()) return NextResponse.json({ ok: true }) // honeypot

  const r = cleanQuoteRequest(b)
  if (!r.ok) return NextResponse.json({ ok: false, error: r.error }, { status: 400 })
  const q = r.q

  const db = supportDb()
  if (await limited(db, clientKey('service-request-ip', ip), IP_LIMIT)) {
    return NextResponse.json({ ok: false, error: BUSY }, { status: 429, headers: { 'Retry-After': String(IP_LIMIT.windowSec) } })
  }
  if (await limited(db, clientKey('service-request-to', quoteRecipientKey(q.email)), RECIPIENT_LIMIT)) {
    return NextResponse.json({ ok: false, error: BUSY }, { status: 429, headers: { 'Retry-After': String(RECIPIENT_LIMIT.windowSec) } })
  }

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
