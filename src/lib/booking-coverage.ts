/**
 * Booking coverage (Kam, 2026-11-14: booking "needs to check coverage").
 *
 * Every booking path (/book, /book/property, /book/site) checks the address
 * against active, approved vendors' service radius before time slots or payment.
 * The check itself runs on the Bricks API (backend/booking_coverage.py, reading
 * vendor_members home_lat/home_lng + max_travel_km); quote and checkout re-run it
 * server-side, so skipping this client step can't book an uncovered address.
 */

export const NOT_COVERED_MESSAGE = 'We’re not in your area yet. Leave your email and we’ll let you know.'
export const UNAVAILABLE_MESSAGE = 'We couldn’t confirm coverage for this address. Please try again in a moment.'

/** API codes that mean "no vendor reaches this address" (not an error). */
export const NOT_COVERED_CODES = ['not_covered', 'outside_service_area'] as const
export const UNAVAILABLE_CODE = 'coverage_unavailable'

export type CoverageFlow = 'book' | 'property' | 'site'
export type CoverageInput = { address: string; lat?: number | null; lon?: number | null; province?: string; flow: CoverageFlow }
export type CoverageState =
  | { status: 'covered' }
  | { status: 'not_covered'; message: string }
  | { status: 'error'; message: string }

type Json = Record<string, unknown> | null | undefined

export function isNotCoveredCode(code: unknown): boolean {
  return typeof code === 'string' && (NOT_COVERED_CODES as readonly string[]).includes(code)
}

/** Map an /api/book/coverage (or quote/checkout) response to a UI state. Unknown = error (fail closed). */
export function interpretCoverage(httpStatus: number, j: Json): CoverageState {
  const body = j || {}
  if (httpStatus >= 200 && httpStatus < 300 && body.ok === true) {
    if (body.covered === true) return { status: 'covered' }
    if (body.covered === false) return { status: 'not_covered', message: NOT_COVERED_MESSAGE }
  }
  if (isNotCoveredCode(body.code)) return { status: 'not_covered', message: NOT_COVERED_MESSAGE }
  if (body.code === 'address_not_found' && typeof body.error === 'string') return { status: 'error', message: body.error }
  return { status: 'error', message: UNAVAILABLE_MESSAGE }
}

export function coverageKey(i: CoverageInput): string {
  return `${i.flow}|${i.address.trim().toLowerCase()}`
}

export async function checkCoverage(i: CoverageInput): Promise<CoverageState> {
  try {
    const r = await fetch('/api/book/coverage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: i.address.trim(), flow: i.flow }),
    })
    const j = (await r.json().catch(() => null)) as Json
    return interpretCoverage(r.status, j)
  } catch {
    return { status: 'error', message: UNAVAILABLE_MESSAGE }
  }
}

export async function joinCoverageWaitlist(i: CoverageInput & { email: string }): Promise<{ ok: boolean; error?: string }> {
  try {
    const r = await fetch('/api/book/coverage-waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: i.email.trim(), address: i.address.trim(), lat: i.lat ?? undefined, lon: i.lon ?? undefined, flow: i.flow }),
    })
    const j = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string }
    return r.ok && j.ok ? { ok: true } : { ok: false, error: j.error || 'We couldn’t save that just now. Please email help@brxs.ca.' }
  } catch {
    return { ok: false, error: 'We couldn’t save that just now. Please email help@brxs.ca.' }
  }
}
