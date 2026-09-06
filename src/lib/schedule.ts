/** Native booking clock — America/Toronto, no third-party calendar. */

export const BOOK_TZ = 'America/Toronto'

/** Shoot-day open hours when no vendor work_start/work_end is published here. */
export const WORK_START = '09:00'
export const WORK_END = '17:00'

/** Booked slot length sent as selected_slot_end. Start times still step by 30 min. */
export const SLOT_DURATION_MIN = 60
export const SLOT_STEP_MIN = 30

export type BookSlot = {
  start: string
  end: string
  label: string
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function hmToMin(hm: string): number {
  const [h, m] = hm.split(':').map(Number)
  return h * 60 + m
}

function minToHm(total: number): string {
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${pad2(h)}:${pad2(m)}`
}

/** Convert a civil America/Toronto clock on YYYY-MM-DD to a UTC ISO string. */
export function torontoLocalToIso(ymd: string, hm: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null
  const [hh, mm] = hm.split(':').map(Number)
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null
  const y = Number(ymd.slice(0, 4))
  const mo = Number(ymd.slice(5, 7)) - 1
  const d = Number(ymd.slice(8, 10))
  let guess = Date.UTC(y, mo, d, hh, mm, 0)
  for (let i = 0; i < 3; i++) {
    const fp = new Intl.DateTimeFormat('en-CA', {
      timeZone: BOOK_TZ,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).formatToParts(new Date(guess))
    const g = (typ: string) => Number(fp.find((part) => part.type === typ)?.value || '0')
    const gotH = g('hour') === 24 ? 0 : g('hour')
    const want = Date.UTC(y, mo, d, hh, mm, 0)
    const got = Date.UTC(g('year'), g('month') - 1, g('day'), gotH, g('minute'), g('second'))
    guess += want - got
  }
  return new Date(guess).toISOString()
}

export function torontoYmd(d = new Date()): string {
  return d.toLocaleDateString('en-CA', { timeZone: BOOK_TZ })
}

export function torontoClockHm(iso: string): string {
  const t = new Date(iso).toLocaleTimeString('en-CA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: BOOK_TZ,
  })
  return t === '24:00' ? '00:00' : t
}

export function formatSlotClock(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: BOOK_TZ,
  })
}

/** e.g. Fri, Sep 25 · 2:00 PM ET */
export function formatBookedWhen(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  const day = d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: BOOK_TZ,
  })
  return `${day} · ${formatSlotClock(iso)} ET`
}

export function slotBoundsIso(ymd: string, startHm: string): { start: string; end: string } | null {
  const startMin = hmToMin(startHm)
  if (!Number.isFinite(startMin)) return null
  const start = torontoLocalToIso(ymd, startHm)
  const end = torontoLocalToIso(ymd, minToHm(startMin + SLOT_DURATION_MIN))
  if (!start || !end) return null
  return { start, end }
}

export function buildDaySlots(ymd: string, now = new Date()): BookSlot[] {
  const startMin = hmToMin(WORK_START)
  const endMin = hmToMin(WORK_END)
  const lastStart = endMin - SLOT_DURATION_MIN
  const today = torontoYmd(now)
  const out: BookSlot[] = []
  for (let m = startMin; m <= lastStart; m += SLOT_STEP_MIN) {
    const bounds = slotBoundsIso(ymd, minToHm(m))
    if (!bounds) continue
    if (ymd < today) continue
    if (ymd === today && new Date(bounds.start).getTime() <= now.getTime()) continue
    out.push({
      start: bounds.start,
      end: bounds.end,
      label: formatSlotClock(bounds.start),
    })
  }
  return out
}

export function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  const as = new Date(aStart).getTime()
  const ae = new Date(aEnd).getTime()
  const bs = new Date(bStart).getTime()
  const be = new Date(bEnd).getTime()
  if (![as, ae, bs, be].every(Number.isFinite)) return false
  return as < be && ae > bs
}

export function filterOpenSlots(slots: BookSlot[], taken: { start: string; end: string }[]): BookSlot[] {
  if (!taken.length) return slots
  return slots.filter((s) => !taken.some((t) => rangesOverlap(s.start, s.end, t.start, t.end)))
}
