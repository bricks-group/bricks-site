/** Native booking clock — property-local Canada time, no third-party calendar. */

/** Fallback IANA zone when province cannot be derived. Do not market as Toronto time. */
export const FALLBACK_TZ = 'America/Toronto'

/** @deprecated Use FALLBACK_TZ. Not a product clock and must not appear in UI copy. */
export const BOOK_TZ = FALLBACK_TZ

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

export type ProvinceCode =
  | 'BC' | 'AB' | 'SK' | 'MB' | 'ON' | 'QC'
  | 'NB' | 'NS' | 'PE' | 'NL' | 'YT' | 'NT' | 'NU'

/** Province/territory → IANA zone (v1: one zone per province). */
export const PROVINCE_TZ: Record<ProvinceCode, string> = {
  BC: 'America/Vancouver',
  AB: 'America/Edmonton',
  SK: 'America/Regina',
  MB: 'America/Winnipeg',
  ON: 'America/Toronto',
  QC: 'America/Toronto',
  NB: 'America/Halifax',
  NS: 'America/Halifax',
  PE: 'America/Halifax',
  NL: 'America/St_Johns',
  YT: 'America/Whitehorse',
  NT: 'America/Yellowknife',
  NU: 'America/Iqaluit',
}

/** Generic Canadian abbrev — PT/MT/CT/ET/AT/NT, not PDT/EST and not IANA names. */
export const ZONE_ABBREV: Record<string, string> = {
  'America/Vancouver': 'PT',
  'America/Whitehorse': 'MT',
  'America/Edmonton': 'MT',
  'America/Yellowknife': 'MT',
  'America/Regina': 'CT',
  'America/Winnipeg': 'CT',
  'America/Toronto': 'ET',
  'America/Iqaluit': 'ET',
  'America/Halifax': 'AT',
  'America/St_Johns': 'NT',
}

const NAME_TO_CODE: Record<string, ProvinceCode> = {
  'british columbia': 'BC',
  'colombie-britannique': 'BC',
  'colombie britannique': 'BC',
  alberta: 'AB',
  saskatchewan: 'SK',
  manitoba: 'MB',
  ontario: 'ON',
  quebec: 'QC',
  'new brunswick': 'NB',
  'nouveau-brunswick': 'NB',
  'nouveau brunswick': 'NB',
  'nova scotia': 'NS',
  'nouvelle-ecosse': 'NS',
  'nouvelle ecosse': 'NS',
  'prince edward island': 'PE',
  pei: 'PE',
  'ile-du-prince-edouard': 'PE',
  'ile du prince edouard': 'PE',
  'newfoundland and labrador': 'NL',
  newfoundland: 'NL',
  'terre-neuve-et-labrador': 'NL',
  'terre-neuve': 'NL',
  'terre neuve': 'NL',
  yukon: 'YT',
  'northwest territories': 'NT',
  nwt: 'NT',
  'territoires du nord-ouest': 'NT',
  nunavut: 'NU',
}

const POSTAL_TO_PROVINCE: Record<string, ProvinceCode> = {
  A: 'NL',
  B: 'NS',
  C: 'PE',
  E: 'NB',
  G: 'QC',
  H: 'QC',
  J: 'QC',
  K: 'ON',
  L: 'ON',
  M: 'ON',
  N: 'ON',
  P: 'ON',
  R: 'MB',
  S: 'SK',
  T: 'AB',
  V: 'BC',
  Y: 'YT',
}

const BOOK_TIMEZONES = new Set<string>([...Object.values(PROVINCE_TZ), FALLBACK_TZ])

function fold(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/['’]/g, '')
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

export function isBookTimezone(tz: string): boolean {
  return BOOK_TIMEZONES.has(tz)
}

export function zoneAbbrev(tz: string): string {
  return ZONE_ABBREV[tz] || 'ET'
}

export function normalizeProvince(raw?: string | null): ProvinceCode | null {
  if (!raw) return null
  const trimmed = raw.trim()
  if (!trimmed) return null
  const upper = trimmed.toUpperCase()
  if (upper.startsWith('CA-') && upper.length === 5) {
    const code = upper.slice(3) as ProvinceCode
    return code in PROVINCE_TZ ? code : null
  }
  if (upper === 'PEI') return 'PE'
  if (upper === 'NWT') return 'NT'
  if (upper === 'YK') return 'YT'
  if (upper in PROVINCE_TZ) return upper as ProvinceCode
  return NAME_TO_CODE[fold(trimmed)] || null
}

export function provinceFromAddress(address?: string | null): ProvinceCode | null {
  if (!address) return null
  const folded = fold(address)
  const names = Object.keys(NAME_TO_CODE).sort((a, b) => b.length - a.length)
  for (const name of names) {
    if (folded.includes(name)) return NAME_TO_CODE[name]
  }
  const codeRe = /(?:^|,\s*|\s+)(BC|AB|SK|MB|ON|QC|NB|NS|PE|NL|YT|NT|NU|PEI|NWT|YK)(?:\s*,|\s*$)/i
  const m = address.match(codeRe)
  if (m) {
    return normalizeProvince(m[1])
  }
  const postal = address.match(/\b([ABCEGHJKLMNPRSTVXY])\d[A-Z]\s?\d[A-Z]\d\b/i)
  if (postal) {
    return POSTAL_TO_PROVINCE[postal[1].toUpperCase()] || null
  }
  return null
}

export type ResolvedTimezone = {
  tz: string
  province: ProvinceCode | null
  source: 'province' | 'address' | 'timezone' | 'fallback'
}

/** Province, then address, then allowlisted IANA, then silent Toronto fallback. */
export function resolvePropertyTimezone(input: {
  timezone?: string | null
  province?: string | null
  address?: string | null
} = {}): ResolvedTimezone {
  const fromProvince = normalizeProvince(input.province)
  if (fromProvince) {
    return { tz: PROVINCE_TZ[fromProvince], province: fromProvince, source: 'province' }
  }
  const fromAddress = provinceFromAddress(input.address)
  if (fromAddress) {
    return { tz: PROVINCE_TZ[fromAddress], province: fromAddress, source: 'address' }
  }
  const tz = (input.timezone || '').trim()
  if (tz && isBookTimezone(tz)) {
    return { tz, province: null, source: 'timezone' }
  }
  return { tz: FALLBACK_TZ, province: null, source: 'fallback' }
}

/** Convert a civil clock on YYYY-MM-DD in `tz` to a UTC ISO string. */
export function civilLocalToIso(ymd: string, hm: string, tz: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null
  const [hh, mm] = hm.split(':').map(Number)
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null
  const y = Number(ymd.slice(0, 4))
  const mo = Number(ymd.slice(5, 7)) - 1
  const d = Number(ymd.slice(8, 10))
  let guess = Date.UTC(y, mo, d, hh, mm, 0)
  for (let i = 0; i < 3; i++) {
    const fp = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
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

export function localYmd(d = new Date(), tz: string = FALLBACK_TZ): string {
  return d.toLocaleDateString('en-CA', { timeZone: tz })
}

/** ISO instant → civil YYYY-MM-DD in `tz` (edge create-checkout name). */
export function civilYmd(iso: string, tz: string = FALLBACK_TZ): string {
  return localYmd(new Date(iso), tz)
}

export function localClockHm(iso: string, tz: string = FALLBACK_TZ): string {
  const t = new Date(iso).toLocaleTimeString('en-CA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: tz,
  })
  return t === '24:00' ? '00:00' : t
}

function plainSpaces(s: string): string {
  return s.replace(/[\u202f\u00a0]/g, ' ')
}

export function formatSlotClock(iso: string, tz: string = FALLBACK_TZ): string {
  return plainSpaces(new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: tz,
  }))
}

export function formatSlotLabel(iso: string, tz: string = FALLBACK_TZ): string {
  return `${formatSlotClock(iso, tz)} ${zoneAbbrev(tz)}`
}

/** e.g. Fri, Sep 25 · 2:00 PM PT */
export function formatBookedWhen(iso: string, tz: string = FALLBACK_TZ): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  const day = d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: tz,
  })
  return `${day} · ${formatSlotClock(iso, tz)} ${zoneAbbrev(tz)}`
}

export function slotBoundsIso(
  ymd: string,
  startHm: string,
  tz: string = FALLBACK_TZ,
): { start: string; end: string } | null {
  const startMin = hmToMin(startHm)
  if (!Number.isFinite(startMin)) return null
  const start = civilLocalToIso(ymd, startHm, tz)
  const end = civilLocalToIso(ymd, minToHm(startMin + SLOT_DURATION_MIN), tz)
  if (!start || !end) return null
  return { start, end }
}

export function buildDaySlots(ymd: string, now = new Date(), tz: string = FALLBACK_TZ): BookSlot[] {
  const startMin = hmToMin(WORK_START)
  const endMin = hmToMin(WORK_END)
  const lastStart = endMin - SLOT_DURATION_MIN
  const today = localYmd(now, tz)
  const out: BookSlot[] = []
  for (let m = startMin; m <= lastStart; m += SLOT_STEP_MIN) {
    const bounds = slotBoundsIso(ymd, minToHm(m), tz)
    if (!bounds) continue
    if (ymd < today) continue
    if (ymd === today && new Date(bounds.start).getTime() <= now.getTime()) continue
    out.push({
      start: bounds.start,
      end: bounds.end,
      label: formatSlotLabel(bounds.start, tz),
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

// ── Twilight (blue hour) add-on slots ──────────────────────────────────────
// Launch review 2026-11-07: 09:00–17:00 hours block blue hour for most of the
// year. A twilight booking gets ONE extra slot around local sunset (computed
// for the property's lat/lng and date; NOAA solar formula, no library), never
// general evening slots.

/** Minutes before sunset the twilight session starts (sunset−30 → sunset+30). */
export const TWILIGHT_LEAD_MIN = 30
export const TWILIGHT_ROUND_MIN = 15

/** Province fallback point (largest metro) when the address has no pin. */
export const PROVINCE_POINT: Record<ProvinceCode, { lat: number; lng: number }> = {
  BC: { lat: 49.28, lng: -123.12 },
  AB: { lat: 51.05, lng: -114.07 },
  SK: { lat: 50.45, lng: -104.61 },
  MB: { lat: 49.9, lng: -97.14 },
  ON: { lat: 43.65, lng: -79.38 },
  QC: { lat: 45.5, lng: -73.57 },
  NB: { lat: 46.09, lng: -64.78 },
  NS: { lat: 44.65, lng: -63.57 },
  PE: { lat: 46.24, lng: -63.13 },
  NL: { lat: 47.56, lng: -52.71 },
  YT: { lat: 60.72, lng: -135.05 },
  NT: { lat: 62.45, lng: -114.37 },
  NU: { lat: 63.75, lng: -68.52 },
}

/** Sunset instant (UTC ISO) for a civil date at lat/lng; null in polar day/night. */
export function sunsetIso(ymd: string, lat: number, lng: number): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd) || !Number.isFinite(lat) || !Number.isFinite(lng)) return null
  const y = Number(ymd.slice(0, 4))
  const mo = Number(ymd.slice(5, 7)) - 1
  const d = Number(ymd.slice(8, 10))
  const dayMs = Date.UTC(y, mo, d)
  const n = Math.floor((dayMs - Date.UTC(y, 0, 1)) / 86400000) + 1
  const yearDays = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 366 : 365
  const g = ((2 * Math.PI) / yearDays) * (n - 1)
  const eqtime =
    229.18 *
    (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g))
  const decl =
    0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) +
    0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g)
  const rad = Math.PI / 180
  const cosHa =
    Math.cos(90.833 * rad) / (Math.cos(lat * rad) * Math.cos(decl)) - Math.tan(lat * rad) * Math.tan(decl)
  if (cosHa < -1 || cosHa > 1) return null
  const ha = Math.acos(cosHa) / rad
  const sunsetUtcMin = 720 - 4 * (lng - ha) - eqtime
  return new Date(dayMs + Math.round(sunsetUtcMin) * 60000).toISOString()
}

export type TwilightPoint = { lat?: number | null; lng?: number | null; province?: ProvinceCode | null }

function twilightPoint(p: TwilightPoint): { lat: number; lng: number } | null {
  if (typeof p.lat === 'number' && typeof p.lng === 'number' && Number.isFinite(p.lat) && Number.isFinite(p.lng)) {
    return { lat: p.lat, lng: p.lng }
  }
  return p.province ? PROVINCE_POINT[p.province] : null
}

/** The single twilight add-on slot for a date (property-local), or [] if none. */
export function buildTwilightSlots(
  ymd: string,
  now = new Date(),
  tz: string = FALLBACK_TZ,
  point: TwilightPoint = {},
): BookSlot[] {
  const pt = twilightPoint(point)
  if (!pt) return []
  const ss = sunsetIso(ymd, pt.lat, pt.lng)
  if (!ss) return []
  const localSunset = hmToMin(localClockHm(ss, tz))
  let startMin = localSunset - TWILIGHT_LEAD_MIN
  startMin -= ((startMin % TWILIGHT_ROUND_MIN) + TWILIGHT_ROUND_MIN) % TWILIGHT_ROUND_MIN
  if (startMin < 0 || startMin + SLOT_DURATION_MIN > 24 * 60) return []
  const bounds = slotBoundsIso(ymd, minToHm(startMin), tz)
  if (!bounds) return []
  const today = localYmd(now, tz)
  if (ymd < today) return []
  if (ymd === today && new Date(bounds.start).getTime() <= now.getTime()) return []
  return [{ start: bounds.start, end: bounds.end, label: `${formatSlotLabel(bounds.start, tz)} · Twilight` }]
}

/**
 * Server-side guard: a booked start must be a normal shoot-hours start, or —
 * only when the twilight add-on is on — the twilight slot for that date.
 * (Ignores "now"; checkout separately rejects past slots.)
 */
export function isBookableStart(
  ymd: string,
  startIso: string,
  tz: string,
  opts: { twilight?: boolean } & TwilightPoint = {},
): boolean {
  const t = Date.parse(startIso)
  if (!Number.isFinite(t)) return false
  const epoch = new Date(0)
  const normal = buildDaySlots(ymd, epoch, tz)
  if (normal.some((s) => Date.parse(s.start) === t)) return true
  if (!opts.twilight) return false
  // ±20 min tolerance: client pin vs province fallback can shift rounding one step.
  return buildTwilightSlots(ymd, epoch, tz, opts).some((s) => Math.abs(Date.parse(s.start) - t) <= 20 * 60000)
}
