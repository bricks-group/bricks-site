import { NextRequest, NextResponse } from 'next/server'
import { newsletterSecret } from '@/lib/newsletter/config'
import { alert, subscribeContact } from '@/lib/newsletter/resend'
import { verifyToken } from '@/lib/newsletter/token'

export const dynamic = 'force-dynamic'

const json = (data: Record<string, unknown>, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } })

/** Step 2 of double opt-in: the confirm page posts the signed token here. */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try { body = await req.json() } catch { return json({ ok: false, state: 'invalid' }, 400) }
  const v = verifyToken(newsletterSecret(), body.t, 'c')
  if (!v.ok) return json({ ok: false, state: v.reason }, 400)
  const consentAt = new Date().toISOString()
  const r = await subscribeContact(v.email, { signup_source: v.source || 'newsletter:site', consent_at: consentAt })
  if (!r.ok) {
    await alert('Newsletter confirm failed', `Someone confirmed but could not be saved (${r.step}${r.status ? ` ${r.status}` : ''}). Check the Resend contacts key and segment on the site.`)
    return json({ ok: false, state: 'error' }, 502)
  }
  await alert('New newsletter subscriber', `A new subscriber confirmed (${v.source || 'site'}) at ${consentAt}. They are in the Newsletter segment in Resend.`)
  return json({ ok: true, state: 'confirmed' })
}
