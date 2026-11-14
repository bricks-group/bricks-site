import { NextResponse } from 'next/server'
import { isProvinceBlock } from '@/lib/property-tax'
import { NOT_COVERED_MESSAGE, UNAVAILABLE_CODE, UNAVAILABLE_MESSAGE, isNotCoveredCode } from '@/lib/booking-coverage'
import { stripVirtualStaging } from '@/lib/pricing'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const OS_QUOTE = 'https://api.brxs.ca/api/book/www-quote'

async function quoteViaOs(body: Record<string, unknown>) {
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

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'Expected JSON object' }, { status: 400 })
  }

  // Virtual staging is off sale (VIRTUAL_STAGING_ENABLED in lib/pricing): never quote it.
  body = stripVirtualStaging(body)

  // Booking coverage (Kam 2026-11-14): only the Bricks API can confirm an eligible
  // vendor reaches the address, so there is no local-engine fallback any more. If
  // it can't be reached, fail closed with a calm 503 and never show a payable quote.
  let proxied: Awaited<ReturnType<typeof quoteViaOs>> = null
  try {
    proxied = await quoteViaOs(body)
  } catch {
    proxied = null
  }
  if (!proxied) {
    return NextResponse.json({ ok: false, code: UNAVAILABLE_CODE, error: UNAVAILABLE_MESSAGE }, { status: 503 })
  }
  if (proxied.ok && proxied.j?.quote) {
    return NextResponse.json({ ok: true, quote: proxied.j.quote, via: 'os-assign' })
  }
  const code = typeof proxied.j?.code === 'string' ? proxied.j.code : undefined
  const msg = (typeof proxied.j?.error === 'string' && proxied.j.error) || (typeof proxied.j?.detail === 'string' && proxied.j.detail) || ''
  if (proxied.status === 422 && isProvinceBlock(proxied.j)) {
    // Province rules from OS (Saskatchewan unavailable / province unknown).
    return NextResponse.json({ ok: false, error: proxied.j?.error || proxied.j?.detail, code: proxied.j?.code || 'province' }, { status: 422 })
  }
  if (isNotCoveredCode(code) || proxied.status === 409) {
    return NextResponse.json({ ok: false, code: code || 'not_covered', error: NOT_COVERED_MESSAGE }, { status: 409 })
  }
  if (proxied.status === 422 || proxied.status === 400) {
    return NextResponse.json({ ok: false, code: code || 'bad_request', error: msg || 'Check the address and try again.' }, { status: proxied.status })
  }
  return NextResponse.json({ ok: false, code: UNAVAILABLE_CODE, error: UNAVAILABLE_MESSAGE }, { status: 503 })
}
