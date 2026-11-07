import { NextRequest, NextResponse } from 'next/server'

/**
 * Per-day booking availability for the shoot calendar.
 * Source: Dispatch aggregates photographers' linked calendars (Google / iCloud / ICS),
 * work hours and booked jobs. If Dispatch is unreachable we answer `source: "fallback"`
 * and the client treats every future day as open (slots still verify per day).
 */
const DISPATCH_API = (process.env.DISPATCH_API_URL || 'https://dispatch-api.brxs.ca').replace(/\/$/, '')

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const start = (sp.get('start') || '').slice(0, 10)
  const days = Math.min(92, Math.max(1, parseInt(sp.get('days') || '42', 10) || 42))
  const qs = new URLSearchParams({ days: String(days), tz: sp.get('tz') || 'America/Toronto' })
  if (/^\d{4}-\d{2}-\d{2}$/.test(start)) qs.set('start', start)
  const area = (sp.get('area') || '').slice(0, 120)
  if (area) qs.set('area', area)
  try {
    const res = await fetch(`${DISPATCH_API}/api/vendor-os/public/availability-days?${qs}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })
    const j = (await res.json()) as { ok?: boolean; source?: string; days?: unknown[] }
    if (res.ok && j.ok && Array.isArray(j.days) && j.source === 'live') {
      return NextResponse.json({ ok: true, source: 'live', days: j.days }, { headers: { 'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=30' } })
    }
  } catch {
    /* fall through */
  }
  return NextResponse.json({ ok: true, source: 'fallback', days: [] }, { headers: { 'Cache-Control': 'no-store' } })
}
