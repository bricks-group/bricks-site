import { NextRequest, NextResponse } from 'next/server'
import { WORK_END, WORK_START, buildDaySlots, filterOpenSlots, resolvePropertyTimezone, zoneAbbrev } from '@/lib/schedule'

const SUPABASE_URL = (
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  ''
).replace(/\/$/, '')
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const OS_API = (process.env.BRICKS_OS_API_URL || 'https://api.brxs.ca').replace(/\/$/, '')

type Taken = { start: string; end: string }

function json(data: Record<string, unknown>, status = 200) {
  return NextResponse.json(data, { status })
}

function asIso(v: unknown): string {
  return typeof v === 'string' && v.trim() ? v.trim() : ''
}

function takenFromLead(row: Record<string, unknown>): Taken | null {
  const start = asIso(row.selected_slot_start)
  if (!start) return null
  const end = asIso(row.selected_slot_end) || start
  return { start, end }
}

/** Paid leads already on this civil date — existing PostgREST table, not Cal.com. */
async function takenFromLeads(ymd: string): Promise<Taken[] | null> {
  if (!SERVICE_ROLE) return null
  const qs =
    `preferred_date=eq.${encodeURIComponent(ymd)}` +
    `&status=eq.paid` +
    `&select=selected_slot_start,selected_slot_end`
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/media_booking_leads?${qs}`, {
      headers: {
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
      },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const rows = (await res.json()) as Record<string, unknown>[]
    if (!Array.isArray(rows)) return null
    return rows.map(takenFromLead).filter((x): x is Taken => x !== null)
  } catch {
    return null
  }
}

/**
 * Thin probe of OS if it already exposes day occupancy.
 * Unknown / missing routes are ignored — we never invent a calendar.
 */
async function takenFromOs(ymd: string): Promise<Taken[] | null> {
  const url = `${OS_API}/api/book/availability?date=${encodeURIComponent(ymd)}`
  try {
    const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(2500) })
    if (!res.ok) return null
    const j = (await res.json()) as {
      taken?: Taken[]
      booked?: Taken[]
      slots?: { start?: string; end?: string; available?: boolean }[]
    }
    if (Array.isArray(j.taken)) return j.taken.filter((t) => t?.start && t?.end)
    if (Array.isArray(j.booked)) return j.booked.filter((t) => t?.start && t?.end)
    if (Array.isArray(j.slots)) {
      return j.slots
        .filter((s) => s && s.available === false && s.start)
        .map((s) => {
          const start = String(s.start)
          const end = s.end ? String(s.end) : start
          return { start, end }
        })
    }
    return null
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const date = (req.nextUrl.searchParams.get('date') || '').trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return json({ ok: false, error: 'date=YYYY-MM-DD required' }, 400)
  }

  const zone = resolvePropertyTimezone({
    timezone: req.nextUrl.searchParams.get('tz'),
    province: req.nextUrl.searchParams.get('province'),
    address: req.nextUrl.searchParams.get('address'),
  })
  const generated = buildDaySlots(date, new Date(), zone.tz)
  const [leads, os] = await Promise.all([takenFromLeads(date), takenFromOs(date)])
  const taken: Taken[] = [...(leads || []), ...(os || [])]
  const live = leads !== null || os !== null
  const slots = live ? filterOpenSlots(generated, taken) : generated

  return json({
    ok: true,
    date,
    tz: zone.tz,
    tz_abbrev: zoneAbbrev(zone.tz),
    province: zone.province,
    hours: { start: WORK_START, end: WORK_END },
    availability: live ? 'live' : 'hours',
    slots,
  })
}
