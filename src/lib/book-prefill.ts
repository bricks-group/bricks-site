/**
 * /book prefill from Bricks.
 *
 * Two inputs, same output:
 *  - `?h=<token>`: Book media on a listing in Bricks mints a 30-minute signed
 *    token (ids only). /api/book/handoff redeems it server-side for the
 *    address, property details and the agent's own contact, so no contact
 *    details ride in the URL. See readHandoff().
 *  - Plain params (the earlier Book a shoot link, and the fallback when the
 *    token can't be minted): ?address=&name=&email=&phone=&brokerage= plus
 *    non-personal listing details ?type=&sqft=&beds=&baths=&price=&lot=
 *    &vacant=&focus=&gaps=&photo=&step=packages. photo= is why the listing's
 *    photos fall short (none|few|phone|low_res|defects), from Bricks' per-photo
 *    quality check.
 *
 * Values are trimmed, single-spaced, length-capped, and dropped when they
 * don't look right. The booking still needs a quote, a time and payment, so
 * nothing here can book on its own.
 */
export type ListingDetails = {
  propertyType?: string
  typeClass?: 'condo' | 'house' | 'commercial' | 'land'
  sqft?: number
  beds?: number
  baths?: number
  price?: number
  lotAcres?: number
  vacant?: boolean
}

export const FOCUSES = ['photos', 'visit', 'video', 'floorplan', 'drone', 'staging'] as const
export type Focus = (typeof FOCUSES)[number]
export const PHOTO_REASONS = ['none', 'few', 'phone', 'low_res', 'defects'] as const
export type PhotoReason = (typeof PHOTO_REASONS)[number]

export type BookPrefill = {
  address?: string
  name?: string
  email?: string
  phone?: string
  brokerage?: string
  details?: ListingDetails
  focus?: Focus
  gaps?: Focus[]
  /** Why the listing's photos fall short (only with a photos gap). */
  photoReason?: PhotoReason
  /** Land on the package step (contact + address already known). */
  packages?: boolean
  /** Signed handoff token from Bricks. */
  token?: string
  /** Addresses the signed-in client booked or saved before (contact handoff). */
  addresses?: string[]
  /** Filled from the client's own Bricks account. */
  fromAccount?: boolean
}

type ContactKey = 'address' | 'name' | 'email' | 'phone' | 'brokerage'
const CAPS: Record<ContactKey, number> = { address: 160, name: 120, email: 120, phone: 40, brokerage: 120 }

function clean(v: unknown, max: number): string {
  // Strip control characters and angle brackets; collapse whitespace.
  return String(v ?? '').replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)
}

function contactOk(k: ContactKey, v: string): boolean {
  if (!v) return false
  if (k === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return false
  if (k === 'phone' && (v.replace(/\D/g, '').length < 7 || /[^0-9+().\-\s x]/i.test(v))) return false
  if (k === 'address' && v.length < 3) return false
  return true
}

function num(v: unknown, min: number, max: number): number | undefined {
  if (v === null || v === undefined || v === '') return undefined
  const n = typeof v === 'number' ? v : Number(String(v).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) && n >= min && n <= max ? n : undefined
}

export function typeClassOf(raw: string): ListingDetails['typeClass'] {
  const t = raw.toLowerCase()
  if (!t) return undefined
  if (/commercial|retail|industrial|office/.test(t)) return 'commercial'
  if (t.includes('condo') && t.includes('town')) return 'house'
  if (/condo|apt|apartment|loft/.test(t)) return 'condo'
  if (/land|lot|farm|acreage/.test(t)) return 'land'
  if (/detach|semi|town|row|house|bungalow|multiplex|duplex|triplex|estate|cottage|residential/.test(t)) return 'house'
  return undefined
}

function asFocus(v: unknown): Focus | undefined {
  const s = String(v ?? '').trim().toLowerCase()
  return (FOCUSES as readonly string[]).includes(s) ? (s as Focus) : undefined
}

function details(src: Record<string, unknown>): ListingDetails | undefined {
  const d: ListingDetails = {}
  const type = clean(src.propertyType ?? src.property_type ?? src.type, 40)
  if (type) d.propertyType = type
  const tc = String(src.typeClass ?? src.type_class ?? '').toLowerCase()
  d.typeClass = (['condo', 'house', 'commercial', 'land'].includes(tc) ? tc : typeClassOf(type)) as ListingDetails['typeClass']
  if (!d.typeClass) delete d.typeClass
  const sqft = num(src.sqft, 200, 60000); if (sqft) d.sqft = Math.round(sqft)
  const beds = num(src.beds ?? src.bedrooms, 0, 30); if (beds !== undefined) d.beds = beds
  const baths = num(src.baths ?? src.bathrooms, 0, 30); if (baths !== undefined) d.baths = baths
  const price = num(src.price ?? src.list_price, 10000, 500000000); if (price) d.price = Math.round(price)
  const lot = num(src.lot ?? src.lot_acres ?? src.lotAcres, 0.001, 100000); if (lot) d.lotAcres = lot
  const vac = src.vacant
  if (vac === true || vac === '1' || vac === 'true') d.vacant = true
  if (vac === false || vac === '0' || vac === 'false') d.vacant = false
  return Object.keys(d).length ? d : undefined
}

function asPhotoReason(v: unknown, gaps?: Focus[]): PhotoReason | undefined {
  const s = String(v ?? '').trim().toLowerCase()
  if (!gaps || !gaps.includes('photos')) return undefined
  return (PHOTO_REASONS as readonly string[]).includes(s) ? (s as PhotoReason) : undefined
}

function gapsOf(v: unknown): Focus[] | undefined {
  const list = Array.isArray(v) ? v : String(v ?? '').split(',')
  const out = list.map(asFocus).filter((x): x is Focus => !!x)
  return out.length ? Array.from(new Set(out)) : undefined
}

export function readBookPrefill(search: string): BookPrefill {
  const q = new URLSearchParams(search || '')
  if (q.get('paid') === '1') return {}
  const out: BookPrefill = {}
  const token = q.get('h') || ''
  if (/^[A-Za-z0-9_\-]{16,560}\.[a-f0-9]{32}$/.test(token)) out.token = token
  for (const k of Object.keys(CAPS) as ContactKey[]) {
    const v = clean(q.get(k), CAPS[k])
    if (contactOk(k, v)) out[k] = v
  }
  const src: Record<string, unknown> = {}
  q.forEach((v, k) => { src[k] = v })
  const d = details(src); if (d) out.details = d
  const f = asFocus(q.get('focus')); if (f) out.focus = f
  const g = gapsOf(q.get('gaps')); if (g) out.gaps = g
  const pr = asPhotoReason(q.get('photo'), g); if (pr) out.photoReason = pr
  if (q.get('step') === 'packages') out.packages = true
  return out
}

/** Shape the OS redeem response (GET /api/book/handoff/{token}) like a prefill. */
export function readHandoff(j: unknown): BookPrefill {
  if (!j || typeof j !== 'object') return {}
  const r = j as Record<string, unknown>
  const out: BookPrefill = { packages: true }
  for (const k of Object.keys(CAPS) as ContactKey[]) {
    const v = clean(r[k], CAPS[k])
    if (contactOk(k, v)) out[k] = v
  }
  const d = details((r.details && typeof r.details === 'object' ? r.details : {}) as Record<string, unknown>)
  if (d) out.details = d
  const f = asFocus(r.focus); if (f) out.focus = f
  const g = gapsOf(r.gaps); if (g) out.gaps = g
  const pr = asPhotoReason(r.photo_reason, g); if (pr) out.photoReason = pr
  if (Array.isArray(r.addresses)) {
    const list = Array.from(new Set(r.addresses.map((a) => clean(a, CAPS.address)).filter((a) => a.length >= 5))).slice(0, 5)
    if (list.length) out.addresses = list
  }
  if (r.kind === 'contact') { out.fromAccount = true; out.packages = false }
  return out
}

/**
 * Signed in to Bricks but no listing handoff: app.brxs.ca mints a contact-only
 * handoff for the signed-in client and sends the browser back here with ?h=.
 */
export function contactHandoffUrl(osUrl: string, returnTo: string): string {
  return `${osUrl.replace(/\/$/, '')}/book-details?next=${encodeURIComponent(returnTo)}`
}

/** Contact + address complete, so the package step can open first. */
export function canSkipToPackages(p: BookPrefill): boolean {
  return !!(p.packages && p.name && p.email && p.phone && p.brokerage && p.address)
}

/** www /book property type option for a listing (never Estate: that changes the price floor). */
export function bookTypeOption(d?: ListingDetails): string {
  if (!d) return ''
  const t = (d.propertyType || '').toLowerCase()
  if (d.typeClass === 'condo') return 'Condo'
  if (d.typeClass === 'commercial') return 'Commercial'
  if (/multiplex|duplex|triplex|fourplex/.test(t)) return 'Multiplex'
  if (/semi|town|row|link/.test(t)) return 'Semi / Town'
  if (d.typeClass === 'house') return 'Detached'
  return ''
}
