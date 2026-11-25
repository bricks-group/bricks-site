/**
 * Spec for the listing-media payment bypass.
 *
 * These tests fail on purpose while a buyer can pay the Photos-only price and
 * still have the dispatched job include a floor plan or a virtual tour.
 * They pass once fulfilment on the Stripe session and on the dispatch job
 * comes only from the priced quote.
 *
 * Run:
 *   npx tsx --test src/lib/listing-checkout-fulfilment.test.ts
 */
import assert from 'node:assert/strict'
import { afterEach, before, describe, it } from 'node:test'
import { POST as checkoutPOST } from '../app/api/create-checkout/route'
import { buildQuote, type QuoteResult } from './quote-engine'
import { buildDaySlots } from './schedule'

const HIGHER_PACKAGE = /\b(showcase|suite|premium|luxury|estate|essentials|story|full)\b/i
const UNPAID_ADDON = new Set(['tour', 'floorplan_2d', 'floor_plan_only', 'reel', 'drone', 'twilight'])

type DispatchJob = {
  package_id?: string
  package_name?: string
  add_ons?: { key?: string; included?: boolean }[]
  package_price?: number | null
  job_type?: string
}

const realFetch = globalThis.fetch
const envSnapshot = { ...process.env }

let webhookHandler: ((req: Request) => Promise<Response>) | null = null
let ensureDispatchJob: ((opts: {
  supabaseUrl: string
  serviceKey: string
  leadId: string
  sessionId: string
  m: Record<string, string>
  quote: { total: number | null; lat: number | null; lon: number | null }
  preferredDate: string
  timezone: string
  province: string | null
}) => Promise<{ jobId: string | null }>) | null = null

const stripeSessionBodies: string[] = []
const dispatchJobs: DispatchJob[] = []
const quoteRequests: Record<string, unknown>[] = []

function installDeno() {
  const g = globalThis as unknown as { Deno?: { env: { get: (k: string) => string | undefined }; serve: (arg: unknown) => unknown } }
  g.Deno = {
    env: { get: (key: string) => process.env[key] },
    serve: (arg: unknown) => {
      const fn = typeof arg === 'function'
        ? arg
        : (arg as { handler?: (req: Request) => Promise<Response> }).handler
      if (typeof fn === 'function') webhookHandler = fn as (req: Request) => Promise<Response>
      return { finished: Promise.resolve(), shutdown: () => Promise.resolve() }
    },
  }
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

function installFetch() {
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    const method = (init?.method || 'GET').toUpperCase()
    if (url.includes('nominatim.openstreetmap.org')) {
      return jsonResponse([{ lat: '43.6532', lon: '-79.3832', display_name: '1 King St W, Toronto, Ontario, Canada' }])
    }
    if (url.includes('https://api.brxs.ca/api/book/www-quote')) {
      const body = JSON.parse(String(init?.body || '{}')) as Record<string, unknown>
      quoteRequests.push(body)
      const priced = await buildQuote(body)
      if (!priced.ok) return jsonResponse({ ok: false, error: priced.error }, priced.status)
      // Covered-address OS quote: same engine as the request body it was given,
      // plus the assignee the route requires before it will open Stripe.
      const quote: QuoteResult & { assignee_id: string } = {
        ...priced.quote,
        assignee_id: 'vendor-covered',
        travel_pending: false,
      }
      return jsonResponse({ ok: true, quote })
    }
    if (url.includes('https://api.stripe.com/v1/payment_method_domains')) return jsonResponse({ id: 'pmd' })
    if (url.includes('https://api.stripe.com/v1/checkout/sessions')) {
      stripeSessionBodies.push(String(init?.body || ''))
      return jsonResponse({ id: 'cs_test', url: 'https://checkout.stripe.com/c/pay/cs_test' })
    }
    if (url.includes('/rest/v1/media_booking_leads') && method === 'POST') return jsonResponse([{ id: 'lead-1' }], 201)
    if (url.includes('/api/v1/dispatch/jobs') && method === 'POST') {
      const job = JSON.parse(String(init?.body || '{}')) as DispatchJob
      dispatchJobs.push(job)
      return jsonResponse({ job_id: 'job-1', id: 'job-1' })
    }
    if (url.includes('/rest/v1/')) return jsonResponse([])
    throw new Error('unexpected fetch ' + method + ' ' + url)
  }) as typeof fetch
}

before(async () => {
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_placeholder'
  process.env.SUPABASE_URL = 'https://example.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-test'
  process.env.INTERNAL_API_KEY = 'internal-test'
  process.env.DISPATCH_API_URL = 'https://dispatch.test'
  process.env.STRIPE_SECRET_KEY = 'sk_test_placeholder'
  process.env.APP_URL = 'https://www.brxs.ca'
  installDeno()
  installFetch()
  await import('../../supabase/functions/stripe-webhook/index.ts')
  const job = await import('../../supabase/functions/stripe-webhook/job.ts')
  ensureDispatchJob = job.ensureDispatchJob
  if (!webhookHandler) throw new Error('stripe-webhook handler was not registered')
})

afterEach(() => {
  stripeSessionBodies.length = 0
  dispatchJobs.length = 0
  quoteRequests.length = 0
  installFetch()
})

function slot() {
  const slots = buildDaySlots('2026-12-01', new Date(0), 'America/Toronto')
  const first = slots[0]
  if (!first) throw new Error('no bookable slot')
  return first
}

function booking(extra: Record<string, unknown>) {
  const when = slot()
  return {
    agent_name: 'Ada Agent',
    email: 'ada@example.com',
    brokerage: 'Example Realty',
    phone: '4165550100',
    property_address: '1 King St W, Toronto, ON',
    property_type: 'Condo',
    sqft: 1000,
    preferred_date: '2026-12-01',
    preferred_window: 'morning',
    selected_slot_start: when.start,
    selected_slot_end: when.end,
    timezone: 'America/Toronto',
    province: 'ON',
    drone_addon: false,
    reel_addon: false,
    tour_addon: false,
    twilight_addon: false,
    rush_addon: false,
    staging_addon: false,
    visit_addon: false,
    ...extra,
  }
}

async function postCheckout(extra: Record<string, unknown>) {
  const res = await checkoutPOST(new Request('https://www.brxs.ca/api/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking(extra)),
  }))
  const body = await res.json()
  return { status: res.status, body }
}

function sessionMeta(formBody: string) {
  const form = new URLSearchParams(formBody)
  const meta: Record<string, string> = {}
  for (const [key, value] of form.entries()) {
    const match = key.match(/^metadata\[(.+)\]$/)
    if (match) meta[match[1]] = value
  }
  return {
    amount: form.get('line_items[0][price_data][unit_amount]'),
    meta,
  }
}

async function sign(raw: string) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET || ''
  const ts = Math.floor(Date.now() / 1000).toString()
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${ts}.${raw}`))
  const hex = Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, '0')).join('')
  return `t=${ts},v1=${hex}`
}

async function completeCheckout(meta: Record<string, string>, sessionId: string) {
  if (!webhookHandler) throw new Error('webhook handler missing')
  dispatchJobs.length = 0
  const event = {
    id: 'evt_' + sessionId,
    type: 'checkout.session.completed',
    data: { object: { id: sessionId, metadata: meta, amount_total: 16837, currency: 'cad' } },
  }
  const raw = JSON.stringify(event)
  const res = await webhookHandler(new Request('https://example.supabase.co/functions/v1/stripe-webhook', {
    method: 'POST',
    headers: { 'stripe-signature': await sign(raw), 'content-type': 'application/json' },
    body: raw,
  }))
  const text = await res.text()
  return { status: res.status, text, jobs: dispatchJobs.slice() }
}

function assertPhotosOnlyJob(job: DispatchJob) {
  assert.equal(job.package_id, 'photos_only')
  assert.doesNotMatch(String(job.package_name || ''), HIGHER_PACKAGE)
  const keys = (job.add_ons || []).map((addon) => addon.key)
  for (const key of keys) assert.equal(UNPAID_ADDON.has(String(key)), false, JSON.stringify(job.add_ons))
}

describe('listing media checkout fulfilment', () => {
  it('rejects a missing package_id before creating a Stripe session', async () => {
    const res = await postCheckout({
      package_id: '',
      package_interest: 'Showcase',
      floor_plan_included: true,
    })
    assert.equal(res.status, 400, JSON.stringify(res.body))
    assert.equal(res.body.ok, false)
    assert.equal(stripeSessionBodies.length, 0)
  })

  it('charges the photos-only quote and does not stamp a client floor plan or a higher package', async () => {
    const res = await postCheckout({
      package_id: 'photos_only',
      package_interest: 'Showcase',
      floor_plan_included: true,
    })
    assert.equal(res.status, 200, JSON.stringify(res.body))
    assert.equal(quoteRequests.length, 1)
    const sent = quoteRequests[0]
    assert.equal(Object.hasOwn(sent, 'floor_plan_included'), false)
    assert.equal(Object.hasOwn(sent, 'package_interest'), false)
    assert.equal(sent.package_id, 'photos_only')
    assert.equal(sent.tour_addon, false)
    assert.equal(sent.drone_addon, false)

    const priced = await buildQuote(sent)
    assert.equal(priced.ok, true)
    if (!priced.ok) return
    assert.equal(priced.quote.floor_plan_included, false)
    assert.equal(priced.quote.addons.some((addon) => /tour|floor plan/i.test(addon.label)), false)
    const photosCents = String(Math.round(priced.quote.total * 100))

    const showcase = await buildQuote({ ...sent, package_id: 'showcase', drone_addon: true, reel_addon: true, tour_addon: true })
    assert.equal(showcase.ok, true)
    if (!showcase.ok) return
    assert.ok(showcase.quote.total > priced.quote.total)

    assert.equal(stripeSessionBodies.length, 1)
    const session = sessionMeta(stripeSessionBodies[0])
    assert.equal(session.amount, photosCents)
    assert.equal(session.meta.package_id, 'photos_only')
    assert.equal(session.meta.floor_plan_included, 'false')
    assert.equal(session.meta.tour_addon, 'false')
    assert.equal(session.meta.drone_addon, 'false')
    assert.doesNotMatch(session.meta.package_interest || '', HIGHER_PACKAGE)

    const paid = await completeCheckout(session.meta, 'cs_photos_hostile')
    assert.equal(paid.status, 200, paid.text)
    assert.equal(paid.jobs.length, 1, paid.text)
    assert.equal(paid.jobs[0].package_price, Math.round(priced.quote.total))
    assertPhotosOnlyJob(paid.jobs[0])
  })

  it('webhook does not turn client package_interest or floor_plan_included into delivered add-ons', async () => {
    const when = slot()
    const hostile: Record<string, string> = {
      agent_name: 'Ada Agent',
      email: 'ada@example.com',
      brokerage: 'Example Realty',
      property_address: '1 King St W, Toronto, ON',
      property_type: 'Condo',
      package_id: '',
      package_interest: 'Showcase',
      floor_plan_included: 'true',
      floor_plan_only: 'false',
      drone_addon: 'false',
      reel_addon: 'false',
      tour_addon: 'false',
      twilight_addon: 'false',
      rush_addon: 'false',
      staging_addon: 'false',
      visit_addon: 'false',
      preferred_date: '2026-12-01',
      preferred_window: 'morning',
      selected_slot_start: when.start,
      selected_slot_end: when.end,
      timezone: 'America/Toronto',
      province: 'ON',
      assignee_id: 'vendor-covered',
      quote_json: JSON.stringify({ total: 168.37, lat: 43.6532, lon: -79.3832 }),
    }
    const paid = await completeCheckout(hostile, 'cs_empty_package')
    // An empty package id was not priced as Showcase. Dispatch nothing, or
    // dispatch only the photos-only job the quote total paid for.
    if (paid.jobs.length === 0) {
      assert.equal(paid.status, 200, paid.text)
      return
    }
    assert.equal(paid.jobs.length, 1, paid.text)
    assertPhotosOnlyJob(paid.jobs[0])
  })

  it('ensureDispatchJob ignores a client floor_plan_included flag on photos_only', async () => {
    if (!ensureDispatchJob) throw new Error('ensureDispatchJob missing')
    const when = slot()
    dispatchJobs.length = 0
    await ensureDispatchJob({
      supabaseUrl: 'https://example.supabase.co',
      serviceKey: 'service-role-test',
      leadId: 'lead-job',
      sessionId: 'cs_job',
      preferredDate: '2026-12-01',
      timezone: 'America/Toronto',
      province: 'ON',
      quote: { total: 168.37, lat: 43.6532, lon: -79.3832 },
      m: {
        agent_name: 'Ada Agent',
        email: 'ada@example.com',
        brokerage: 'Example Realty',
        property_address: '1 King St W, Toronto, ON',
        property_type: 'Condo',
        package_id: 'photos_only',
        package_interest: 'Photos only',
        floor_plan_included: 'true',
        floor_plan_only: 'false',
        drone_addon: 'false',
        reel_addon: 'false',
        tour_addon: 'false',
        twilight_addon: 'false',
        rush_addon: 'false',
        staging_addon: 'false',
        visit_addon: 'false',
        preferred_date: '2026-12-01',
        preferred_window: 'morning',
        selected_slot_start: when.start,
        selected_slot_end: when.end,
        timezone: 'America/Toronto',
        province: 'ON',
        assignee_id: 'vendor-covered',
      },
    })
    assert.equal(dispatchJobs.length, 1)
    assertPhotosOnlyJob(dispatchJobs[0])
  })
})

process.on('exit', () => {
  globalThis.fetch = realFetch
  for (const key of Object.keys(process.env)) {
    if (!(key in envSnapshot)) delete process.env[key]
  }
  Object.assign(process.env, envSnapshot)
})
