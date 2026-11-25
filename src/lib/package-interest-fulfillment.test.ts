/**
 * Spec for the listing-media checkout / Stripe webhook package split.
 *
 * A caller of POST /api/create-checkout can omit package_id and put a premium
 * name in package_interest. The route prices only package_id and the add-on
 * flags (via the quote body). The Stripe webhook then reads package_interest
 * whenever package_id normalizes to empty, and that id turns on a virtual tour
 * and a photographer tier the quote never charged.
 *
 * These tests fail while that split exists. They pass when a paid session is
 * refused before Stripe, or the dispatch job's tour, package id, and tier
 * match the quote that was actually charged.
 *
 * The Bricks OS www-quote service is not in this repo. The stand-in prices the
 * exact JSON this route posts, using buildQuote (the in-repo engine kept in
 * lockstep with supabase/functions/quote). It sets assignee_id because this
 * route only creates a Stripe session when the quote names an assignee; both
 * in-repo quoters leave that field null and the route treats OS as the
 * assigner. No other quote field is invented.
 */
import assert from 'node:assert/strict'
import { afterEach, before, describe, it } from 'node:test'
import { buildQuote, type QuoteResult } from './quote-engine'
import { POST as checkoutPOST } from '../app/api/create-checkout/route'
import { isPublicPath } from '../middleware'
import { buildDaySlots } from './schedule'

const g = globalThis as typeof globalThis & {
  Deno?: { serve: (fn: (req: Request) => Promise<Response>) => unknown; env: { get: (name: string) => string | undefined } }
  __stripeWebhook?: (req: Request) => Promise<Response>
}

g.Deno = {
  serve(fn) {
    g.__stripeWebhook = fn
    return { shutdown() {} }
  },
  env: {
    get(name: string) {
      const v = process.env[name]
      return v === undefined ? undefined : v
    },
  },
}

let ensureDispatchJob: (opts: {
  supabaseUrl: string
  serviceKey: string
  leadId: string
  sessionId: string
  m: Record<string, string>
  quote: { total: number | null; lat: number | null; lon: number | null }
  preferredDate: string
  timezone: string
  province: string | null
}) => Promise<{ created: boolean; error?: string }>

before(async () => {
  const job = await import('../../supabase/functions/stripe-webhook/job.ts')
  ensureDispatchJob = job.ensureDispatchJob
  await import('../../supabase/functions/stripe-webhook/index.ts')
  if (!g.__stripeWebhook) throw new Error('stripe webhook handler was not registered')
})

const STRIPE_PLACEHOLDER = 'sk_test_placeholder'
const WEBHOOK_PLACEHOLDER = 'whsec_placeholder'
const SERVICE_PLACEHOLDER = 'service_role_placeholder'
const INTERNAL_PLACEHOLDER = 'internal_placeholder'
const SUPABASE_URL = 'https://supabase.test'
const ASSIGNEE = 'os-assigned-vendor'
const SESSION_ID = 'cs_test_placeholder'

const realFetch = globalThis.fetch
const envKeys = [
  'STRIPE_SECRET_KEY',
  'INTERNAL_API_KEY',
  'BRICKS_INTERNAL_API_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_WEBHOOK_SECRET_TEST',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DISPATCH_API_URL',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_FROM_NUMBER',
  'RESEND_API_KEY',
] as const
const savedEnv = Object.fromEntries(envKeys.map((k) => [k, process.env[k]]))

afterEach(() => {
  globalThis.fetch = realFetch
  for (const k of envKeys) {
    if (savedEnv[k] === undefined) delete process.env[k]
    else process.env[k] = savedEnv[k]
  }
})

type QuoteBody = Record<string, unknown>
type StripeSession = { unitAmount: number; metadata: Record<string, string> }
type DispatchJob = {
  package_id?: string
  package_price?: number | null
  add_ons?: { key?: string }[]
  min_tier_required?: number
}

const SHOOT_DATE = '2026-12-01'
const slot = buildDaySlots(SHOOT_DATE, new Date(0), 'America/Toronto')[0]

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function checkoutBody(over: Record<string, unknown>) {
  return {
    agent_name: 'Ada Agent',
    email: 'ada@example.com',
    brokerage: 'Example Realty',
    property_address: '1 King St W, Toronto, ON',
    property_type: 'Condo',
    sqft: 850,
    preferred_date: SHOOT_DATE,
    selected_slot_start: slot.start,
    selected_slot_end: slot.end,
    timezone: 'America/Toronto',
    province: 'ON',
    drone_addon: true,
    reel_addon: false,
    tour_addon: false,
    twilight_addon: false,
    ...over,
  }
}

async function postCheckout(body: Record<string, unknown>) {
  const quoteRequests: QuoteBody[] = []
  const quotes: QuoteResult[] = []
  const stripeForms: string[] = []
  let osCheckoutCalled = false
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    if (url.startsWith('https://nominatim.openstreetmap.org/')) {
      return jsonResponse([
        { lat: '43.65', lon: '-79.38', display_name: '1 King Street West, Toronto, Ontario, Canada' },
      ])
    }
    if (url.startsWith('https://overpass-api.de/')) {
      return jsonResponse({ elements: [] })
    }
    if (url === 'https://api.brxs.ca/api/book/www-quote') {
      const sent = JSON.parse(String(init?.body || '{}')) as QuoteBody
      quoteRequests.push(sent)
      const priced = await buildQuote(sent)
      if (!priced.ok) return jsonResponse({ ok: false, error: priced.error }, priced.status)
      // Route continues to Stripe only when the quote has an assignee. The
      // in-repo quoters set assignee_id null; OS is what this route calls to
      // fill it. Price lines stay the buildQuote result for `sent`.
      const quote = { ...priced.quote, assignee_id: ASSIGNEE }
      quotes.push(quote)
      return jsonResponse({ ok: true, quote })
    }
    if (url === 'https://api.brxs.ca/api/book/www-create-checkout') {
      osCheckoutCalled = true
      return jsonResponse({ ok: false, error: 'os checkout not used in this test' }, 502)
    }
    if (url === 'https://api.stripe.com/v1/payment_method_domains') {
      return jsonResponse({ id: 'pmd_placeholder' })
    }
    if (url === 'https://api.stripe.com/v1/checkout/sessions') {
      stripeForms.push(String(init?.body || ''))
      return jsonResponse({ id: SESSION_ID, url: 'https://checkout.stripe.com/c/pay/cs_test_placeholder' })
    }
    throw new Error('unexpected checkout fetch ' + url)
  }) as typeof fetch

  process.env.STRIPE_SECRET_KEY = STRIPE_PLACEHOLDER
  process.env.INTERNAL_API_KEY = INTERNAL_PLACEHOLDER
  const res = await checkoutPOST(
    new Request('https://www.brxs.ca/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  )
  const payload = await res.json()
  const form = stripeForms[0]
  let session: StripeSession | null = null
  if (form) {
    const params = new URLSearchParams(form)
    const metadata: Record<string, string> = {}
    for (const [k, v] of params.entries()) {
      const m = k.match(/^metadata\[(.+)\]$/)
      if (m) metadata[m[1]] = v
    }
    session = {
      unitAmount: Number(params.get('line_items[0][price_data][unit_amount]')),
      metadata,
    }
  }
  return { status: res.status, payload, quoteRequests, quotes, session, osCheckoutCalled }
}

function pricedTier(packageId: unknown): number {
  const n = String(packageId ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
  if (['estate', 'luxury', 'suite', 'showcase'].includes(n)) return 3
  if (['premium', 'story'].includes(n)) return 2
  return 1
}

function addonPriced(quote: QuoteResult, label: string) {
  return quote.addons.some((a) => a.label === label)
}

async function sign(secret: string, raw: string) {
  const ts = Math.floor(Date.now() / 1000)
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${ts}.${raw}`))
  const hex = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return `t=${ts},v1=${hex}`
}

function installFulfillmentFetch(jobs: DispatchJob[]) {
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    const method = (init?.method || 'GET').toUpperCase()
    if (url.startsWith(`${SUPABASE_URL}/rest/v1/app_secrets`)) return jsonResponse([])
    if (url.startsWith(`${SUPABASE_URL}/rest/v1/media_booking_leads`) && method === 'GET') return jsonResponse([])
    if (url.startsWith(`${SUPABASE_URL}/rest/v1/media_booking_leads`) && method === 'POST') {
      return jsonResponse([{ id: 'lead_test_1' }])
    }
    if (url.startsWith(`${SUPABASE_URL}/rest/v1/jobs`) && method === 'GET') return jsonResponse([])
    if (url.startsWith(`${SUPABASE_URL}/rest/v1/jobs`) && method === 'POST') {
      jobs.push(JSON.parse(String(init?.body || '{}')))
      return jsonResponse([{ id: 'job_row_1' }])
    }
    if (url.startsWith('https://dispatch.test/api/v1/dispatch/jobs') && method === 'POST') {
      jobs.push(JSON.parse(String(init?.body || '{}')))
      return jsonResponse({ job_id: 'job_test_1' })
    }
    throw new Error('unexpected fulfillment fetch ' + method + ' ' + url)
  }) as typeof fetch
}

async function fulfill(metadata: Record<string, string>): Promise<{ webhook: DispatchJob; direct: DispatchJob }> {
  process.env.SUPABASE_URL = SUPABASE_URL
  process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_PLACEHOLDER
  process.env.STRIPE_WEBHOOK_SECRET = WEBHOOK_PLACEHOLDER
  delete process.env.STRIPE_WEBHOOK_SECRET_TEST
  process.env.DISPATCH_API_URL = 'https://dispatch.test'
  process.env.INTERNAL_API_KEY = INTERNAL_PLACEHOLDER
  delete process.env.TWILIO_ACCOUNT_SID
  delete process.env.TWILIO_AUTH_TOKEN
  delete process.env.TWILIO_FROM_NUMBER
  delete process.env.RESEND_API_KEY

  const event = {
    id: 'evt_test_placeholder',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: SESSION_ID,
        object: 'checkout.session',
        metadata,
        livemode: false,
        currency: 'cad',
        amount_total: Number(metadata.total_cents || 0),
      },
    },
  }
  const raw = JSON.stringify(event)
  const webhookJobs: DispatchJob[] = []
  installFulfillmentFetch(webhookJobs)
  const res = await g.__stripeWebhook!(
    new Request('https://supabase.test/functions/v1/stripe-webhook', {
      method: 'POST',
      headers: { 'stripe-signature': await sign(WEBHOOK_PLACEHOLDER, raw) },
      body: raw,
    }),
  )
  const note = await res.json()
  assert.equal(res.status, 200, JSON.stringify(note))
  assert.equal(webhookJobs.length, 1, JSON.stringify(note))

  const directJobs: DispatchJob[] = []
  installFulfillmentFetch(directJobs)
  const parsed = JSON.parse(metadata.quote_json || 'null') as { total?: number; lat?: number; lon?: number } | null
  const direct = await ensureDispatchJob({
    supabaseUrl: SUPABASE_URL,
    serviceKey: SERVICE_PLACEHOLDER,
    leadId: 'lead_test_1',
    sessionId: SESSION_ID,
    m: metadata,
    quote: {
      total: typeof parsed?.total === 'number' ? parsed.total : null,
      lat: typeof parsed?.lat === 'number' ? parsed.lat : null,
      lon: typeof parsed?.lon === 'number' ? parsed.lon : null,
    },
    preferredDate: metadata.preferred_date,
    timezone: metadata.timezone || 'America/Toronto',
    province: metadata.province || 'ON',
  })
  assert.equal(direct.created, true, direct.error || 'dispatch job was not created')
  assert.equal(directJobs.length, 1)
  return { webhook: webhookJobs[0], direct: directJobs[0] }
}

function assertJobMatchesQuote(job: DispatchJob, quoteRequest: QuoteBody, quote: QuoteResult, unitAmount: number) {
  const charged = Math.round(quote.total * 100)
  assert.equal(unitAmount, charged)
  const keys = (job.add_ons || []).map((a) => String(a.key || ''))
  const detail = `package_id=${job.package_id} tier=${job.min_tier_required} add_ons=${keys.join(',') || '(none)'} charged_cents=${unitAmount} quote_total=${quote.total}`
  assert.equal(keys.includes('tour'), addonPriced(quote, 'Virtual tour'), detail)
  assert.equal(keys.includes('reel'), addonPriced(quote, 'Cinematic reel'), detail)
  assert.equal(keys.includes('twilight'), addonPriced(quote, 'Twilight photography'), detail)
  const tierCap = pricedTier(quoteRequest.package_id)
  assert.ok(
    (job.min_tier_required || 1) <= tierCap,
    `min_tier_required ${job.min_tier_required} exceeds priced package tier ${tierCap} (package_id=${JSON.stringify(quoteRequest.package_id)})`,
  )
  const premium = ['showcase', 'suite', 'full', 'premium', 'luxury', 'estate', 'story']
  if (premium.includes(String(job.package_id || ''))) {
    const pricedId = String(quoteRequest.package_id ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9_]+/g, '_')
    assert.equal(job.package_id, pricedId)
  }
  if (typeof job.package_price === 'number') {
    assert.equal(job.package_price, Math.round(quote.total))
  }
}

async function assertPaidBooking(over: Record<string, unknown>) {
  const out = await postCheckout(checkoutBody(over))
  if (!out.session) {
    assert.notEqual(out.status, 200)
    assert.equal(out.payload.ok, false)
    assert.equal(out.osCheckoutCalled, false)
    const err = String(out.payload.error || '')
    assert.match(err, /package/i, `refused before Stripe for a reason other than the package: ${err}`)
    return
  }
  assert.equal(out.payload.ok, true)
  assert.equal(out.quoteRequests.length, 1)
  const quoteRequest = out.quoteRequests[0]
  const quote = out.quotes[0]
  assert.equal(quoteRequest.package_interest, undefined)
  const jobs = await fulfill(out.session.metadata)
  const failures: string[] = []
  for (const [name, job] of [
    ['stripe-webhook/index.ts', jobs.webhook],
    ['stripe-webhook/job.ts', jobs.direct],
  ] as const) {
    try {
      assertJobMatchesQuote(job, quoteRequest, quote, out.session.unitAmount)
    } catch (err) {
      failures.push(`${name}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }
  assert.equal(failures.length, 0, failures.join('\n'))
}

describe('listing media package_interest cannot outrun the charged quote', () => {
  it('checkout is reachable without the site gate', () => {
    assert.equal(isPublicPath('/api/create-checkout'), true)
  })

  it('Full suite label with no package_id does not dispatch a tour or a tier-3 suite job at the photo+drone price', async () => {
    await assertPaidBooking({
      package_interest: 'Full suite - HDR photo + Drone',
    })
  })

  it('Showcase label with no package_id does not dispatch a tour', async () => {
    await assertPaidBooking({
      package_interest: 'Showcase',
    })
  })

  it('Story label with no package_id does not raise the photographer tier', async () => {
    await assertPaidBooking({
      package_interest: 'Story',
    })
  })

  it('package_id "suite " is not fulfilled as suite unless that id was what the quote priced', async () => {
    await assertPaidBooking({
      package_id: 'suite ',
      package_interest: 'HDR photo + Drone',
      drone_addon: false,
      reel_addon: false,
      tour_addon: false,
      twilight_addon: false,
    })
  })

  it('a priced suite package is charged and dispatched as suite, tour included', async () => {
    await assertPaidBooking({
      package_id: 'suite',
      package_interest: 'Full suite — HDR photo + Drone + Cinematic reel + Virtual tour + Twilight',
      drone_addon: false,
      reel_addon: false,
      tour_addon: false,
      twilight_addon: false,
    })
  })

  it('a display label that names no premium package stays on the priced photo+drone job', async () => {
    await assertPaidBooking({
      package_interest: 'HDR photo + Drone',
    })
  })
})
