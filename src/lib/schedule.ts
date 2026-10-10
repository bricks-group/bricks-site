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
