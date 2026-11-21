import { NextRequest, NextResponse } from 'next/server'
import { newsletterSecret, postalAddress, siteBase } from '@/lib/newsletter/config'
import { confirmEmail } from '@/lib/newsletter/email'
import { alert, sendEmail } from '@/lib/newsletter/resend'
import { confirmToken, normEmail, unsubscribeToken } from '@/lib/newsletter/token'

export const dynamic = 'force-dynamic'

const json = (data: Record<string, unknown>, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } })

function cleanSource(raw: unknown): string {
  const s = String(raw ?? '').trim().toLowerCase().replace(/[^a-z0-9:_\-/.]/g, '').slice(0, 60) || 'site'
  return s.startsWith('newsletter:') ? s : `newsletter:${s}`
}

/** Step 1 of double opt-in: send the confirm email. Nothing is stored until the link is used. */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try { body = await req.json() } catch { return json({ ok: false, error: 'Invalid request.' }, 400) }
  // Bots fill every field; people never see this one.
  if (typeof body.company === 'string' && body.company.trim()) return json({ ok: true })
  const email = normEmail(body.email)
  if (!email) return json({ ok: false, error: 'Enter a valid email.' }, 400)
  if (body.consent !== true) return json({ ok: false, error: 'Tick the box to agree.' }, 400)
  const secret = newsletterSecret()
  if (!secret) {
    await alert('Newsletter sign-up is down', 'NEWSLETTER_SECRET is not set on the site, so sign-ups cannot send a confirm email.')
    return json({ ok: false, error: 'Sign-up is paused. Try again soon.' }, 503)
  }
  const base = siteBase(req.nextUrl.origin)
  const msg = confirmEmail({
    to: email, base, postal: postalAddress(),
    confirmToken: confirmToken(secret, email, cleanSource(body.source)),
    unsubToken: unsubscribeToken(secret, email),
  })
  const sent = await sendEmail(msg)
  if (!sent.ok) {
    await alert('Newsletter confirm email failed', `A sign-up confirm email could not be sent (status ${sent.status}). Check the Resend sending key on the site.`)
    return json({ ok: false, error: "We couldn't send the email. Try again soon." }, 502)
  }
  return json({ ok: true })
}
