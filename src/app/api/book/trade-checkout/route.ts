/**
 * One-step trade checkout (Kam t648u). Server recomputes the price from the
 * decided sheet. Never trusts a client total. Prefer Stripe TEST when
 * STRIPE_SECRET_KEY_TEST is set and body.test is true (or STRIPE_FORCE_TEST=1).
 * No live-money tests from agents.
 */
import { NextResponse } from 'next/server'
import { EMBEDDED_BRANDING, embeddedPublishableKey, wantsEmbedded } from '@/lib/embedded-checkout'
import { isTradeSlug, type TradeSlug } from '@/lib/services'
import { priceTrade } from '@/lib/trade-checkout'
import { termsAcceptanceMeta } from '@/lib/terms-version'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function bad(msg: string, status = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status })
}

function appUrl() {
  return (process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://www.brxs.ca').replace(/\/$/, '')
}

function stripeKey(preferTest: boolean): { key: string; mode: 'test' | 'live' } | null {
  const test = (process.env.STRIPE_SECRET_KEY_TEST || '').trim()
  const live = (process.env.STRIPE_SECRET_KEY || '').trim()
  if (preferTest && test.startsWith('sk_test_')) return { key: test, mode: 'test' }
  if (preferTest && live.startsWith('sk_test_')) return { key: live, mode: 'test' }
  if (live.startsWith('sk_')) return { key: live, mode: live.startsWith('sk_live_') ? 'live' : 'test' }
  if (test.startsWith('sk_')) return { key: test, mode: 'test' }
  return null
}

async function createSession(key: string, form: URLSearchParams) {
  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  })
  return { ok: res.ok, status: res.status, j: await res.json() }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try { body = await req.json() } catch { return bad('Invalid request.') }
  if (typeof body.website === 'string' && body.website.trim()) return NextResponse.json({ ok: true })

  const trade = String(body.trade || '')
  if (!isTradeSlug(trade)) return bad('Pick a service.')
  const priced = priceTrade({
    trade: trade as TradeSlug,
    scope: String(body.scope || ''),
    address: String(body.address || ''),
    preferred_date: String(body.timing || body.preferred_date || ''),
  })
  if (!priced.ok) return bad(priced.error)
  const q = priced.quote

  const name = String(body.name || '').trim().slice(0, 120)
  const email = String(body.email || '').trim().slice(0, 254)
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad('Add your name and a valid email.')

  const preferTest = process.env.STRIPE_FORCE_TEST === '1' || body.test === true || body.test === '1'
  const sk = stripeKey(preferTest)
  if (!sk) return bad('Checkout is not configured. Email help@brxs.ca.', 503)

  const meta: Record<string, string> = {
    kind: 'trade_booking',
    package_id: q.package_id,
    package_interest: q.name,
    job_type: q.vendor_type,
    vendor_type: q.vendor_type,
    trade: q.trade,
    property_address: q.address,
    email,
    agent_name: name,
    name,
    phone: String(body.phone || '').slice(0, 40),
    company: String(body.company || '').slice(0, 160),
    client_type: String(body.clientType || '').slice(0, 40),
    preferred_date: q.preferred_date || '',
    preferred_window: String(body.timing || '').slice(0, 60),
    notes: String(body.details || '').slice(0, 500),
    subtotal_cents: String(q.subtotal_cents),
    tax_cents: String(q.tax_cents),
    total_cents: String(q.total_cents),
    tax_rate: String(q.tax_rate),
    tax_province: q.province,
    tax_label_display: q.tax_label,
    price_basis: 'pre_tax',
    ...termsAcceptanceMeta(),
  }

  const form = new URLSearchParams()
  form.set('mode', 'payment')
  form.set('currency', 'cad')
  form.set('locale', 'en')
  form.set('allow_promotion_codes', 'false')
  form.set('customer_email', email)
  const publishableKey = wantsEmbedded(body) ? embeddedPublishableKey(sk.key, process.env) : null
  if (publishableKey) {
    form.set('ui_mode', 'elements')
    form.set('return_url', `${appUrl()}/book/trade?paid=1&session_id={CHECKOUT_SESSION_ID}`)
  } else {
    form.set('submit_type', 'book')
    form.set('success_url', `${appUrl()}/book/trade?paid=1&session_id={CHECKOUT_SESSION_ID}`)
    form.set('cancel_url', `${appUrl()}/services#book-${q.trade}`)
  }
  form.append('payment_method_types[0]', 'card')
  form.append('line_items[0][price_data][currency]', 'cad')
  form.append('line_items[0][price_data][product_data][name]', `Bricks ${q.name}`)
  form.append('line_items[0][price_data][product_data][description]', `${q.address}. Incl. ${q.tax_label}.`)
  form.append('line_items[0][price_data][unit_amount]', String(q.total_cents))
  form.append('line_items[0][quantity]', '1')
  for (const [k, v] of Object.entries(meta)) form.append(`metadata[${k}]`, v)
  for (const [k, v] of Object.entries(EMBEDDED_BRANDING)) form.set(`branding_settings[${k}]`, v)

  const session = await createSession(sk.key, form)
  if (!session.ok) {
    // Drop branding and retry once (older Stripe accounts).
    for (const k of Object.keys(EMBEDDED_BRANDING)) form.delete(`branding_settings[${k}]`)
    const again = await createSession(sk.key, form)
    if (!again.ok) return bad('Stripe error: ' + (again.j?.error?.message || again.status), 502)
    Object.assign(session, again)
  }
  if (publishableKey && session.j.client_secret) {
    return NextResponse.json({
      ok: true, mode: sk.mode, quote: q, session_id: session.j.id,
      client_secret: session.j.client_secret, publishable_key: publishableKey,
      ui_mode: session.j.ui_mode === 'elements' ? 'elements' : 'embedded', url: null,
    })
  }
  return NextResponse.json({ ok: true, mode: sk.mode, quote: q, session_id: session.j.id, url: session.j.url })
}
