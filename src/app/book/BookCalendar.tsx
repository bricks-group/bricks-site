'use client'

import { useEffect, useMemo, useState } from 'react'
import { localYmd } from '@/lib/schedule'

type DayInfo = { date: string; available: boolean; open?: number; reason?: string }

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_FMT = new Intl.DateTimeFormat('en-CA', { month: 'long', year: 'numeric', timeZone: 'UTC' })
const LONG_FMT = new Intl.DateTimeFormat('en-CA', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })

/** Civil YYYY-MM-DD helpers (UTC-anchored so no local rollover). */
function ymdToUtc(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}
function utcToYmd(d: Date): string {
  return d.toISOString().slice(0, 10)
}
function addMonths(ym: string, n: number): string {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + n, 1))
  return utcToYmd(d).slice(0, 7)
}

export function BookCalendar({
  value,
  onChange,
  tz,
  area,
  maxMonthsAhead = 3,
}: {
  value: string
  onChange: (ymd: string) => void
  tz: string
  area?: string
  maxMonthsAhead?: number
}) {
  const today = localYmd(new Date(), tz)
  const [month, setMonth] = useState((value || today).slice(0, 7))
  const [days, setDays] = useState<Record<string, DayInfo>>({})
  const [live, setLive] = useState(false)
  const [loading, setLoading] = useState(true)

  const minMonth = today.slice(0, 7)
  const maxMonth = addMonths(minMonth, maxMonthsAhead - 1)

  useEffect(() => {
    let alive = true
    setLoading(true)
    const qs = new URLSearchParams({ start: today, days: String(maxMonthsAhead * 31), tz })
    if (area) qs.set('area', area)
    fetch('/api/book/days?' + qs.toString(), { cache: 'no-store' })
      .then((r) => r.json())
      .then((j: { source?: string; days?: DayInfo[] }) => {
        if (!alive) return
        const map: Record<string, DayInfo> = {}
        for (const d of j.days || []) map[d.date] = d
        setDays(map)
        setLive(j.source === 'live')
      })
      .catch(() => alive && setLive(false))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [today, tz, area, maxMonthsAhead])

  const cells = useMemo(() => {
    const first = ymdToUtc(month + '-01')
    const lead = first.getUTCDay()
    const out: (string | null)[] = Array.from({ length: lead }, () => null)
    const d = new Date(first)
    while (utcToYmd(d).slice(0, 7) === month) {
      out.push(utcToYmd(d))
      d.setUTCDate(d.getUTCDate() + 1)
    }
    while (out.length % 7) out.push(null)
    return out
  }, [month])

  function state(ymd: string): 'past' | 'full' | 'open' {
    if (ymd < today) return 'past'
    const info = days[ymd]
    if (live && info && !info.available) return info.reason === 'past' || ymd === today ? 'past' : 'full'
    return 'open'
  }

  return (
    <div className="bcal" aria-busy={loading}>
      <div className="bcal-head">
        <button type="button" className="bcal-nav" aria-label="Previous month" disabled={month <= minMonth} onClick={() => setMonth(addMonths(month, -1))}>
          ‹
        </button>
        <div className="bcal-month" aria-live="polite">{MONTH_FMT.format(ymdToUtc(month + '-01'))}</div>
        <button type="button" className="bcal-nav" aria-label="Next month" disabled={month >= maxMonth} onClick={() => setMonth(addMonths(month, 1))}>
          ›
        </button>
      </div>
      <div className="bcal-grid" role="grid">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="bcal-wd" aria-hidden>{w}</div>
        ))}
        {cells.map((ymd, i) => {
          if (!ymd) return <div key={'e' + i} />
          const st = state(ymd)
          const sel = ymd === value
          const label = LONG_FMT.format(ymdToUtc(ymd)) + (st === 'full' ? ', fully booked' : st === 'past' ? ', unavailable' : '')
          return (
            <button
              type="button"
              key={ymd}
              className={`bcal-day${sel ? ' sel' : ''}${ymd === today ? ' today' : ''}${st !== 'open' ? ' off' : ''}${st === 'full' ? ' full' : ''}`}
              disabled={st !== 'open'}
              aria-pressed={sel}
              aria-label={label}
              onClick={() => onChange(ymd)}
            >
              {Number(ymd.slice(8))}
            </button>
          )
        })}
      </div>
      <div className="bcal-legend">
        <span><i className="dot open" /> Open</span>
        <span><i className="dot full" /> Fully booked</span>
        <span className="bcal-src">{loading ? 'Checking photographer calendars…' : live ? 'Live from photographer calendars' : 'Times confirmed on the next step'}</span>
      </div>
    </div>
  )
}
