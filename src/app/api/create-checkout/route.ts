import { NextResponse } from 'next/server'
import { buildQuote, type QuoteResult } from '@/lib/quote-engine'
import { stripVirtualStaging } from '@/lib/pricing'
import { termsAcceptanceMeta } from '@/lib/terms-version'
import { resolvePropertyTimezone, localYmd, isBookableStart } from '@/lib/schedule'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const WALLET_DOMAINS = ['brxs.ca', 'www.brxs.ca']
const OS_CHECKOUT = 'https://api.brxs.ca/api/book/www-create-checkout'

function bad(msg: string, status = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status })
}

function publicAppUrl() {
  return (process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://www.brxs.ca').replace(
    /\/$/,
    '',
  )
}

/** Civil YYYY-MM-DD in property timezone (alias of localYmd for an ISO instant). */
function civilYmd(iso: string, tz: string): string {
  return localYmd(new Date(iso), tz)
}

async function ensureWalletDomains(stripeKey: string) {
  await Promise.all(
    WALLET_DOMAINS.map((domain_name) =>
      fetch('https://api.stripe.com/v1/payment_method_domains', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ domain_name }).toString(),
      }).catch(() => null),
    ),
  )
}

async function createCheckoutSession(stripeKey: string, form: URLSearchParams) {
  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  })
  const j = await res.json()
  return { ok: res.ok, status: res.status, j }
}

const OS_QUOTE = 'https://api.brxs.ca/api/book/www-quote'

async function proxyToOsQuote(body: Record<string, unknown>) {
  const key = (
    process.env.INTERNAL_API_KEY ||
    process.env.BRICKS_INTERNAL_API_KEY ||
    ''
  ).trim()
  if (!key) return null
  const res = await fetch(OS_QUOTE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Internal-Api-Key': key,
    },
    body: JSON.stringify({
      ...body,
      property_address: body.property_address || body.address,
    }),
  })
  const j = await res.json().catch(() => ({}))
  return { ok: res.ok && j?.ok, status: res.status, j }
}

async function proxyToOs(body: Record<string, unknown>) {
  const key = (
    process.env.INTERNAL_API_KEY ||
    process.env.BRICKS_INTERNAL_API_KEY ||
    ''
  ).trim()
  if (!key) return null
  const res = await fetch(OS_CHECKOUT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Internal-Api-Key': key,
    },
    body: JSON.stringify(body),
  })
  const j = await res.json().catch(() => ({}))
  return { ok: res.ok && j?.ok, status: res.status, j }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return bad('Invalid JSON')
  }
  if (!body || typeof body !== 'object') return bad('Expected JSON object')
  // Virtual staging is off sale (VIRTUAL_STAGING_ENABLED in lib/pricing): never price or charge it.
  body = stripVirtualStaging(body)

  const preferredDate = (body.preferred_date || '').toString().trim()
  const preferredWindow = (body.preferred_window || '').toString().trim().toLowerCase()
  const slotStart = (body.selected_slot_start || '').toString().trim()
  const slotEnd = (body.selected_slot_end || '').toString().trim()
  if (!preferredDate || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(preferredDate)) {
    return bad('preferred_date (YYYY-MM-DD) is required')
  }
  const startMs = Date.parse(slotStart)
  const endMs = Date.parse(slotEnd)
  if (!slotStart || !slotEnd || Number.isNaN(startMs) || Number.isNaN(endMs) || endMs <= startMs) {
    return bad('selected_slot_start and selected_slot_end (ISO) are required')
  }

  const zone = resolvePropertyTimezone({
    timezone: (body.timezone || '').toString(),
    province: (body.province || '').toString(),
    address: (body.property_address || '').toString(),
  })
  const slotDay = civilYmd(slotStart, zone.tz)
  if (slotDay !== preferredDate) {
    return bad('selected_slot_start must fall on preferred_date in the property local timezone')
  }

  const pkgNormEarly = String(body.package_id || '')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
  if (['standard', 'premium', 'luxury', 'estate'].includes(pkgNormEarly)) {
    return bad(
      'Legacy Companion package_id is not sold on www. Use essentials/story/showcase/suite (or photos_only / floor_plan_only).',
    )
  }

  const stripeKey = (process.env.STRIPE_SECRET_KEY || '').trim()
  if (!stripeKey) {
    // No local Stripe — proxy to OS (same recompute + session create).
    try {
      const proxied = await proxyToOs(body)
      if (!proxied) {
        return bad(
          'Checkout unavailable: Stripe not configured on www and INTERNAL_API_KEY missing for OS proxy',
          503,
        )
      }
      if (!proxied.ok) {
        return NextResponse.json(
          { ok: false, error: proxied.j?.error || `OS checkout failed (${proxied.status})` },
          { status: proxied.status >= 400 ? proxied.status : 502 },
        )
      }
      return NextResponse.json({
        ok: true,
        url: proxied.j.url,
        session_id: proxied.j.session_id,
        via: 'os-proxy',
      })
    } catch (e) {
      return bad('OS checkout proxy error: ' + String(e), 502)
    }
  }

  const quoteBody = {
    address: body.property_address || body.address,
    property_type: body.property_type,
    drone_addon:
      body.drone_addon === true ||
      body.drone_addon === 'true' ||
      ['essentials', 'story', 'showcase', 'suite', 'full'].includes(pkgNormEarly),
    reel_addon:
      body.reel_addon === true ||
      body.reel_addon === 'true' ||
      ['story', 'showcase', 'suite', 'full'].includes(pkgNormEarly),
    tour_addon:
      body.tour_addon === true ||
      body.tour_addon === 'true' ||
      ['showcase', 'suite', 'full'].includes(pkgNormEarly),
    twilight_addon:
      body.twilight_addon === true ||
      body.twilight_addon === 'true' ||
      ['suite', 'full'].includes(pkgNormEarly),
    rush_addon: body.rush_addon === true || body.rush_addon === 'true',
    staging_addon: body.staging_addon === true || body.staging_addon === 'true',
    staging_images: body.staging_images,
    visit_addon: body.visit_addon === true || body.visit_addon === 'true',
    floor_plan_only:
      body.floor_plan_only === true ||
      body.floor_plan_only === 'true' ||
      pkgNormEarly === 'floor_plan_only',
    package_id: body.package_id,
    sqft: body.sqft || undefined,
  }

  // Assign-first: prefer OS (allocates vendor + final travel / GTA $0). Fall back to
  // local buildQuote only when OS is unreachable; never charge with travel_pending.
  let q: QuoteResult | null = null
  let viaOs = false
  try {
    const proxied = await proxyToOsQuote(quoteBody as Record<string, unknown>)
    if (proxied?.ok && proxied.j?.quote) {
      q = proxied.j.quote
      viaOs = true
    } else if (proxied && proxied.status === 409) {
      return bad(
        proxied.j?.error ||
          proxied.j?.detail ||
          'No photographer available — checkout blocked until one is assigned.',
        409,
      )
    }
  } catch {
    /* fall through */
  }
  if (!viaOs) {
    const priced = await buildQuote(quoteBody as Record<string, unknown>)
    if (!priced.ok) {
      return bad('Could not verify pricing for this booking: ' + priced.error, priced.status === 422 ? 422 : 502)
    }
    q = priced.quote
  }
  if (!q) {
    return bad('Could not verify pricing for this booking', 502)
  }
  if (q.travel_pending || !(q as QuoteResult & { assignee_id?: string }).assignee_id) {
    // Last resort: try full OS checkout proxy (re-allocates + Stripe)
    try {
      const proxied = await proxyToOs(body)
      if (proxied?.ok) {
        return NextResponse.json({
          ok: true,
          url: proxied.j.url,
          session_id: proxied.j.session_id,
          via: 'os-proxy-assign',
        })
      }
      if (proxied && proxied.status === 409) {
        return bad(
          proxied.j?.error ||
            proxied.j?.detail ||
            'No photographer available — checkout blocked until one is assigned.',
          409,
        )
      }
    } catch {
      /* continue to explicit block */
    }
    return bad(
      'Checkout blocked: a photographer must be assigned and the final fee shown before payment.',
      409,
    )
  }
  const amountCents = Math.round(q.total * 100)
  if (amountCents < 50) return bad('Amount too small')

  const pkgNorm = pkgNormEarly
  const floorPlanOnly =
    body.floor_plan_only === true ||
    body.floor_plan_only === 'true' ||
    pkgNorm === 'floor_plan_only' ||
    pkgNorm === 'floorplan_only'
  const photosOnly =
    pkgNorm === 'photos_only' || /photos\s*only/i.test(String(body.package_interest || ''))

  const droneOn =
    !photosOnly &&
    !floorPlanOnly &&
    (body.drone_addon === true ||
      body.drone_addon === 'true' ||
      ['essentials', 'story', 'showcase', 'suite', 'full'].includes(pkgNorm))
  const reelOn =
    !floorPlanOnly &&
    (body.reel_addon === true ||
      body.reel_addon === 'true' ||
      ['story', 'showcase', 'suite', 'full'].includes(pkgNorm))
  const tourOn =
    !floorPlanOnly &&
    (body.tour_addon === true ||
      body.tour_addon === 'true' ||
      ['showcase', 'suite', 'full'].includes(pkgNorm))
  const twilightOn =
    !floorPlanOnly &&
    (body.twilight_addon === true ||
      body.twilight_addon === 'true' ||
      ['suite', 'full'].includes(pkgNorm))
  // Shoot hours guard (launch review 2026-11-07): a start must be a normal
  // 09:00–17:00 slot, or the sunset twilight slot when twilight is booked.
  // Never general evening slots.
  {
    const plat = Number(body.property_lat)
    const plng = Number(body.property_lng)
    if (
      !isBookableStart(preferredDate, slotStart, zone.tz, {
        twilight: twilightOn,
        lat: Number.isFinite(plat) && body.property_lat != null ? plat : null,
        lng: Number.isFinite(plng) && body.property_lng != null ? plng : null,
        province: zone.province,
      })
    ) {
      return bad(
        twilightOn
          ? 'selected_slot_start must be a shoot-hours slot or the twilight slot near sunset for that date'
          : 'selected_slot_start must be within shoot hours (twilight times need the twilight add-on)',
      )
    }
  }
  const floorPlan =
    floorPlanOnly ||
    body.floor_plan_included === true ||
    body.floor_plan_included === 'true' ||
    (body.floor_plan_included == null && droneOn && !photosOnly)

  const appUrl = publicAppUrl()
  const meta: Record<string, string> = {
    agent_name: (body.agent_name || '').toString().slice(0, 200),
    email: (body.email || '').toString().slice(0, 200),
    property_address: (body.property_address || '').toString().slice(0, 300),
    property_type: (body.property_type || '').toString(),
    package_id: (floorPlanOnly ? 'floor_plan_only' : body.package_id || '').toString().slice(0, 64),
    package_interest: (body.package_interest || '').toString(),
    floor_plan_included: String(!!floorPlan),
    preferred_date: preferredDate,
    preferred_window: ['morning', 'afternoon', 'evening'].includes(preferredWindow)
      ? preferredWindow
      : '',
    selected_slot_start: slotStart,
    selected_slot_end: slotEnd,
    timezone: zone.tz,
    province: (zone.province || (body.province || '').toString().trim()).slice(0, 8),
    drone_addon: String(droneOn),
    reel_addon: String(reelOn),
    tour_addon: String(tourOn),
    twilight_addon: String(twilightOn),
    rush_addon: String(body.rush_addon === true || body.rush_addon === 'true'),
    staging_addon: String(!!(q as { staging_addon?: boolean }).staging_addon),
    staging_images: String((q as { staging_images?: number }).staging_images || 0),
    visit_addon: String(!!(q as { visit_addon?: boolean }).visit_addon),
    visit_sqft_tier: ['small', 'mid', 'large', 'xl'][(q as { footprint_band?: number }).footprint_band ?? 0] || 'small',
    floor_plan_only: String(!!floorPlanOnly),
    phone: (body.phone || '').toString(),
    brokerage: (body.brokerage || '').toString(),
    notes: (body.notes || '').toString().slice(0, 500),
    travel_fee: String(q.travel_fee ?? 0),
    travel_pending: 'false',
    travel_basis: String((q as { travel_basis?: string }).travel_basis || 'vendor_assigned').slice(0, 40),
    gta_major: String(!!(q as { gta_major?: boolean }).gta_major),
    assignee_id: String((q as { assignee_id?: string }).assignee_id || '').slice(0, 80),
    quote_json: JSON.stringify({
      total: q.total,
      lat: q.lat ?? null,
      lon: q.lon ?? null,
      travel_fee: q.travel_fee ?? 0,
      travel_pending: false,
      travel_basis: (q as { travel_basis?: string }).travel_basis || null,
      gta_major: !!(q as { gta_major?: boolean }).gta_major,
      assignee_id: (q as { assignee_id?: string }).assignee_id || null,
      base_rate: q.base_rate ?? null,
    }).slice(0, 480),
    // Terms acceptance (Counsel 2026-11-07): version shown at the pay button + time.
    ...termsAcceptanceMeta(),
  }

  const form = new URLSearchParams()
  form.set('mode', 'payment')
  form.set('currency', 'cad')
  form.set('locale', 'en')
  form.set('submit_type', 'book')
  form.set('success_url', `${appUrl}/book?paid=1&session_id={CHECKOUT_SESSION_ID}`)
  form.set('cancel_url', `${appUrl}/book?paid=0`)
  form.append('payment_method_types[0]', 'card')
  form.append('payment_method_types[1]', 'link')
  form.set('allow_promotion_codes', 'true')
  if (meta.email) form.set('customer_email', meta.email)
  form.append('line_items[0][price_data][currency]', 'cad')
  form.append(
    'line_items[0][price_data][product_data][name]',
    `Bricks listing media — ${meta.property_address}`,
  )
  const travelDesc = (q as { gta_major?: boolean }).gta_major
    ? 'Travel $0 (GTA major market)'
    : `Travel ${q.travel_fee} CAD from assigned photographer`
  form.append(
    'line_items[0][price_data][product_data][description]',
    `${meta.package_interest || (floorPlanOnly ? 'Floor plan only' : 'HDR photo + drone')} (incl. HST). ${travelDesc}, base ${q.base_rate} CAD.`,
  )
  form.append('line_items[0][price_data][unit_amount]', String(amountCents))
  form.append('line_items[0][quantity]', '1')
  for (const [k, v] of Object.entries(meta)) {
    form.append(`metadata[${k}]`, v)
  }

  try {
    await ensureWalletDomains(stripeKey)
    let session = await createCheckoutSession(stripeKey, form)
    const linkErr = String(session.j?.error?.message || '')
    if (!session.ok && /link/i.test(linkErr)) {
      form.delete('payment_method_types[1]')
      session = await createCheckoutSession(stripeKey, form)
    }
    if (!session.ok) {
      return bad('Stripe error: ' + (session.j.error?.message || session.status), 502)
    }
    return NextResponse.json({
      ok: true,
      url: session.j.url,
      session_id: session.j.id,
      via: 'www-stripe',
    })
  } catch (e) {
    return bad('Stripe upstream error: ' + String(e), 502)
  }
}
