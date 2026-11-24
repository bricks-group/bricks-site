import { VIRTUAL_STAGING_ENABLED } from './pricing'
/**
 * Home services Bricks books through quote requests (phase 1 of vendor trades).
 * No public prices or payouts: every request is quoted by a person first.
 * Compliance lines are deliberate:
 *  - Measurement copy never uses the s-word except "legal land survey" and "Ontario Land Surveyor" (referral only).
 *  - Repairs exclude electrical, plumbing and gas work.
 *  - Inspections are Ontario only.
 * `vendorType` matches Dispatch vendor types (app/services/vendor_profile.py).
 */
export type TradeSlug = 'staging' | 'cleaning' | 'inspections' | 'measurement' | 'repairs'
export type TradeIcon = 'staging' | 'cleaning' | 'inspection' | 'measure' | 'repairs'

export type Trade = {
  slug: TradeSlug
  vendorType: 'stager' | 'cleaner' | 'inspector' | 'measurer' | 'handyman'
  name: string
  short: string
  icon: TradeIcon
  title: string
  description: string
  h1: string
  sub: string
  handles: { title: string; detail: string }[]
  forWhom: { title: string; detail: string }[]
  receive: { title: string; detail: string }[]
  rules: string[]
  scopes: string[]
  /** Vendor side: who should apply, and what they need. */
  apply: { role: string; lede: string; needs: string[]; cgl: boolean; wsibOptional: boolean }
  /**
   * Off = paused for clients and applicants: hidden from /services, the quote form,
   * /work-with-bricks and help. The entry and its code stay. Mirrors Dispatch
   * trade_registry.json `enabled` (Dispatch also blocks applying and assignment).
   */
  enabled: boolean
}

/** Every trade, including paused ones. Use TRADES for anything a client or applicant sees. */
export const ALL_TRADES: readonly Trade[] = [
  {
    slug: 'staging',
    vendorType: 'stager',
    enabled: true,
    name: 'Home staging',
    short: 'Furnished, styled rooms before photos and showings.',
    icon: 'staging',
    title: 'Home staging, booked through Bricks | Bricks',
    description: 'Request a quote for staging a vacant or occupied home before listing photos. Plan, install and removal, tracked in your Bricks account.',
    h1: 'Staging, quoted and scheduled with your listing.',
    sub: 'Request a quote for staging a vacant or lived-in home. Bricks lines up the stager, the install date and the photo visit so the rooms are ready when the photographer arrives.',
    handles: [
      { title: 'Consult and plan', detail: 'A walkthrough or a plan from your photos and floor plan, with the rooms to stage.' },
      { title: 'Vacant homes', detail: 'Furniture, rugs, art and accessories brought in, installed and removed later.' },
      { title: 'Occupied homes', detail: 'Edit and restyle what the owner has, with accent pieces where they help.' },
      { title: 'Install and removal dates', detail: 'Install before the photo visit, removal when the listing closes or the rental ends.' },
    ],
    forWhom: [
      { title: 'Agents and teams', detail: 'Listings that need to photograph and show well.' },
      { title: 'Builders', detail: 'Model suites and inventory homes.' },
      { title: 'Investors and property managers', detail: 'Units being sold or leased between tenants.' },
    ],
    receive: [
      { title: 'A written quote', detail: 'Rooms, inventory, install and removal dates and the rental period, before anything is booked.' },
      { title: 'Dates kept with the listing', detail: 'Install, photo visit and removal dates, kept with the property in your Bricks account.' },
      { title: 'Install photos', detail: 'Photos of each staged room once the install is done.' },
    ],
    rules: VIRTUAL_STAGING_ENABLED ? ['Virtual staging is a separate photo add-on, not part of this service.'] : [],
    scopes: ['Consult and plan', 'Vacant home', 'Occupied home', 'Model suite', 'Not sure yet'],
    apply: {
      role: 'Stagers',
      lede: 'Staging companies and independent stagers with their own inventory or a reliable rental source.',
      needs: ['A portfolio link to past installs (optional)', 'Your inventory, truck and crew, or how you source them', 'Areas you can install in'],
      cgl: false,
      wsibOptional: false,
    },
  },
  {
    slug: 'cleaning',
    vendorType: 'cleaner',
    enabled: true,
    name: 'Cleaning and turnovers',
    short: 'Deep cleans before listing, move-outs and rental turnovers.',
    icon: 'cleaning',
    title: 'Pre-listing and turnover cleaning, booked through Bricks | Bricks',
    description: 'Request a quote for a pre-listing deep clean, a move-in or move-out clean, a rental turnover or a post-construction clean, with photo proof in your Bricks account.',
    h1: 'Cleaning that’s done before the camera arrives.',
    sub: 'Request a quote for a deep clean before photos, a move-out or a rental turnover. The cleaning crew is scheduled ahead of the photo visit, and you get photo proof when it’s done.',
    handles: [
      { title: 'Pre-listing deep clean', detail: 'Kitchens, baths, floors, glass and fixtures, timed before the photo visit.' },
      { title: 'Move-in and move-out', detail: 'An empty unit cleaned top to bottom between owners or tenants.' },
      { title: 'Rental turnovers', detail: 'Units cleaned between tenants on a checklist you approve.' },
      { title: 'Post-construction', detail: 'Dust and debris cleaned after a renovation or a new build. Always quoted after a look at the site.' },
    ],
    forWhom: [
      { title: 'Agents and teams', detail: 'Listings that need to be photo-ready.' },
      { title: 'Property managers and landlords', detail: 'Turnovers between tenants.' },
      { title: 'Builders and investors', detail: 'Units after construction or a renovation.' },
    ],
    receive: [
      { title: 'A written quote', detail: 'Scope, checklist and crew size, before anything is booked.' },
      { title: 'Photo proof', detail: 'Room-by-room photos when the clean is done.' },
      { title: 'A completed checklist', detail: 'What was cleaned, kept with the property in your Bricks account.' },
    ],
    rules: [],
    scopes: ['Pre-listing deep clean', 'Move-in or move-out', 'Rental turnover', 'Post-construction', 'Not sure yet'],
    apply: {
      role: 'Cleaning crews',
      lede: 'Cleaning companies and crews who do deep cleans, move-outs and turnovers.',
      needs: ['Crew size and the cleans you do', 'Your supplies and equipment', 'Areas you can work in'],
      cgl: false,
      wsibOptional: false,
    },
  },
  {
    slug: 'inspections',
    vendorType: 'inspector',
    enabled: true,
    name: 'Home and building inspections',
    short: 'Pre-listing, pre-purchase, condo and new-build inspections in Ontario.',
    icon: 'inspection',
    title: 'Home and building inspections in Ontario, booked through Bricks | Bricks',
    description: 'Request a quote for a pre-listing, pre-purchase, condo or new-build home inspection in Ontario. A written report with photos, kept with the property in Bricks.',
    h1: 'Inspections with the report kept on the property.',
    sub: 'Request a quote for a home or building inspection in Ontario. Bricks schedules an insured inspector, and the written report with photos is kept with the property in your Bricks account.',
    handles: [
      { title: 'Pre-listing inspections', detail: 'Find issues before the home goes on the market.' },
      { title: 'Pre-purchase inspections', detail: 'For buyers and their agents, booked around the conditional period.' },
      { title: 'Condo and new-build', detail: 'Condo units and new homes before possession, including deficiency lists.' },
      { title: 'Building condition assessments', detail: 'For commercial and multi-unit buildings. Always quoted after a review of the building.' },
    ],
    forWhom: [
      { title: 'Agents and teams', detail: 'Pre-listing reports and buyer inspections.' },
      { title: 'Homeowners and buyers', detail: 'One home, one report.' },
      { title: 'Investors, property managers and commercial owners', detail: 'Buildings and portfolios.' },
    ],
    receive: [
      { title: 'A written quote', detail: 'Inspection type, timing and report format, before anything is booked.' },
      { title: 'A written report with photos', detail: 'Findings by system and area, kept with the property in your Bricks account.' },
      { title: 'An insured inspector', detail: '$2M commercial general liability insurance is required for repair and inspection vendors.' },
    ],
    rules: ['Inspections are available in Ontario only.'],
    scopes: ['Pre-listing', 'Pre-purchase', 'Condo', 'New-build or pre-delivery', 'Building condition assessment', 'Not sure yet'],
    apply: {
      role: 'Home and building inspectors',
      lede: 'Inspectors working in Ontario who write their own reports.',
      needs: ['A certificate of insurance showing $2M commercial general liability (required for repair and inspection vendors)', 'Your professional designation or membership, if any', 'A sample report (shared later, with client details removed)'],
      cgl: true,
      wsibOptional: false,
    },
  },
  {
    slug: 'measurement',
    vendorType: 'measurer',
    enabled: true,
    name: 'Measurement and floor area',
    short: 'Measured interior floor area and floor plans.',
    icon: 'measure',
    title: 'Floor area measurement and floor plans, booked through Bricks | Bricks',
    description: 'Request a quote for measured interior floor area and floor plans for listings and leasing. A measurement is not a legal survey.',
    h1: 'Measured floor area you can stand behind.',
    sub: 'Request a quote for measured interior floor area and a floor plan. The measurements and the plan are kept with the property in your Bricks account.',
    handles: [
      { title: 'Interior floor area', detail: 'Room-by-room and total interior area for a listing or a lease.' },
      { title: 'Floor plans', detail: 'A clear, measured plan of each level.' },
      { title: 'Commercial rentable area', detail: 'Offices, retail and industrial space. Always quoted after a look at the drawings.' },
    ],
    forWhom: [
      { title: 'Agents and teams', detail: 'Square footage and a plan for the listing.' },
      { title: 'Property managers and landlords', detail: 'Unit sizes for leasing.' },
      { title: 'Commercial owners and leasing teams', detail: 'Space measured for a lease.' },
    ],
    receive: [
      { title: 'A written quote', detail: 'What will be measured, how, and the format, before anything is booked.' },
      { title: 'Measurements and a floor plan', detail: 'Kept with the property in your Bricks account.' },
      { title: 'The method used', detail: 'A short note on what was and wasn’t included in the area.' },
    ],
    rules: [
      'A measurement is not a legal survey. It doesn’t show property lines, easements or encroachments.',
      'If you need a legal land survey, Bricks will refer you to an Ontario Land Surveyor.',
    ],
    scopes: ['Interior floor area', 'Floor plan', 'Commercial rentable area', 'Not sure yet'],
    apply: {
      role: 'Measurers',
      lede: 'Measurement technicians who produce floor area and floor plans for listings and leasing.',
      needs: ['The tools you measure with', 'The standards you measure to', 'A sample floor plan (shared later)'],
      cgl: false,
      wsibOptional: false,
    },
  },
  {
    slug: 'repairs',
    vendorType: 'handyman',
    // Paused for launch (2026-11-01). Set to true to turn repairs back on.
    enabled: false,
    name: 'Handyman and repairs',
    short: 'Small repairs and deficiency lists before listing or between tenants.',
    icon: 'repairs',
    title: 'Handyman and small repairs, booked through Bricks | Bricks',
    description: 'Request a quote for drywall, paint touch-ups, caulking, doors, hardware, trim and deficiency lists before listing or between tenants. Insured repair vendors. No electrical, plumbing or gas work.',
    h1: 'Small repairs, done before the listing goes live.',
    sub: 'Request a quote for the small jobs that hold up a listing or a turnover. You approve a written estimate first, and before and after photos are kept with the property in your Bricks account.',
    handles: [
      { title: 'Drywall and paint touch-ups', detail: 'Patch holes and dents, and touch up walls and trim.' },
      { title: 'Caulking and sealing', detail: 'Tubs, showers, sinks, windows and baseboards.' },
      { title: 'Doors, hardware and trim', detail: 'Adjust doors, replace handles, hinges and loose trim.' },
      { title: 'Assembly and mounting', detail: 'Furniture, shelves, blinds and mirrors.' },
      { title: 'Deficiency lists', detail: 'A list from an inspection or a walkthrough, worked through item by item.' },
    ],
    forWhom: [
      { title: 'Agents and teams', detail: 'Fixes before photos and showings.' },
      { title: 'Property managers and landlords', detail: 'Turnover repairs between tenants.' },
      { title: 'Investors and builders', detail: 'Deficiency lists and punch lists.' },
    ],
    receive: [
      { title: 'A written estimate first', detail: 'Each item, with time and materials, approved by you before work starts.' },
      { title: 'Before and after photos', detail: 'For each item, kept with the property in your Bricks account.' },
      { title: 'An insured repair vendor', detail: '$2M commercial general liability insurance is required for repair and inspection vendors.' },
    ],
    rules: [
      'Repairs don’t include electrical, plumbing or gas work. Hire a licensed electrician, plumber or gas contractor for those.',
      'Larger renovations are out of scope.',
    ],
    scopes: ['Drywall and paint', 'Caulking', 'Doors, hardware and trim', 'Assembly and mounting', 'Deficiency list', 'Not sure yet'],
    apply: {
      role: 'Handyman and repair vendors',
      lede: 'Handymen and small repair companies who work through lists cleanly and photograph their work.',
      needs: ['A certificate of insurance showing $2M commercial general liability (required for repair and inspection vendors)', 'WSIB clearance if you have workers (optional)', 'Your tools and vehicle'],
      cgl: true,
      wsibOptional: true,
    },
  },
]

/** Trades on sale. Paused trades (enabled: false) are left out everywhere clients or applicants look. */
export const TRADES: readonly Trade[] = ALL_TRADES.filter((t) => t.enabled)

export function isTradeEnabled(slug: TradeSlug): boolean {
  return TRADES.some((t) => t.slug === slug)
}

/** "staging, cleaning, inspections and measurement" from the trades on sale. */
export function tradeListPhrase(): string {
  const n = TRADES.map((t) => t.slug)
  return n.length < 2 ? n.join('') : `${n.slice(0, -1).join(', ')} and ${n[n.length - 1]}`
}

export const TRADE_SLUGS = TRADES.map((t) => t.slug)

export function tradeBySlug(slug: string): Trade | undefined {
  return TRADES.find((t) => t.slug === slug)
}

export function isTradeSlug(v: string): v is TradeSlug {
  return (TRADE_SLUGS as string[]).includes(v)
}

export const QUOTE_CLIENT_TYPES = [
  { key: 'agent', label: 'Agent' },
  { key: 'team', label: 'Team or brokerage' },
  { key: 'property_manager', label: 'Property manager or landlord' },
  { key: 'investor', label: 'Investor' },
  { key: 'builder', label: 'Builder or developer' },
  { key: 'commercial', label: 'Commercial real estate' },
  { key: 'homeowner', label: 'Homeowner or other' },
] as const

export type QuoteClientType = (typeof QUOTE_CLIENT_TYPES)[number]['key']

export function isQuoteClientType(v: string): v is QuoteClientType {
  return QUOTE_CLIENT_TYPES.some((c) => c.key === v)
}

export const PROPERTY_TYPES = ['House', 'Condo or apartment', 'Townhouse', 'Multi-unit building', 'Commercial space', 'Other'] as const

export const TIMING_OPTIONS = ['As soon as possible', 'Within 2 weeks', 'Within a month', 'Flexible'] as const

export type QuoteRequestInput = {
  trade: string
  clientType: string
  name: string
  email: string
  phone?: string
  company?: string
  address: string
  propertyType?: string
  size?: string
  timing?: string
  scope?: string
  details?: string
  website?: string
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const clip = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '')

export type CleanQuote = {
  trade: Trade
  clientLabel: string
  name: string
  email: string
  phone: string
  company: string
  address: string
  propertyType: string
  size: string
  timing: string
  scope: string
  details: string
}

/** Validate a quote request body. Returns the cleaned request or a customer-facing error. */
export function cleanQuoteRequest(b: Record<string, unknown>): { ok: true; q: CleanQuote } | { ok: false; error: string } {
  const trade = tradeBySlug(clip(b.trade, 40))
  if (!trade) return { ok: false, error: 'Pick a service.' }
  const ct = clip(b.clientType, 40)
  if (!isQuoteClientType(ct)) return { ok: false, error: 'Pick who it’s for.' }
  const name = clip(b.name, 120)
  const email = clip(b.email, 254)
  if (!name || !EMAIL_RE.test(email)) return { ok: false, error: 'Add your name and a valid email.' }
  const address = clip(b.address, 300)
  if (!address) return { ok: false, error: 'Add the property address.' }
  const scope = clip(b.scope, 80)
  return {
    ok: true,
    q: {
      trade,
      clientLabel: QUOTE_CLIENT_TYPES.find((c) => c.key === ct)!.label,
      name,
      email,
      phone: clip(b.phone, 40),
      company: clip(b.company, 160),
      address,
      propertyType: clip(b.propertyType, 60),
      size: clip(b.size, 40),
      timing: clip(b.timing, 60),
      scope: trade.scopes.includes(scope) ? scope : '',
      details: clip(b.details, 2000),
    },
  }
}

/** Plain-text body for the request inbox. */
export function quoteInboxMessage(q: CleanQuote, internal = true): string {
  return [
    internal ? `Quote request: ${q.trade.name} [${q.trade.vendorType}]` : `Service: ${q.trade.name}`,
    `For: ${q.clientLabel}`,
    q.scope && `Scope: ${q.scope}`,
    `Address: ${q.address}`,
    q.propertyType && `Property type: ${q.propertyType}`,
    q.size && `Size: ${q.size}`,
    q.timing && `Timing: ${q.timing}`,
    q.company && `Company: ${q.company}`,
    q.phone && `Phone: ${q.phone}`,
    q.details && `Details: ${q.details}`,
  ].filter(Boolean).join('\n')
}

/**
 * Rate-limit key for the confirmation recipient: one mailbox however the
 * address is cased or +tagged (and dotted, for Gmail).
 */
export function quoteRecipientKey(email: string): string {
  const e = email.trim().toLowerCase()
  const at = e.lastIndexOf('@')
  if (at < 1) return e
  let local = e.slice(0, at).split('+')[0] || e.slice(0, at)
  const domain = e.slice(at + 1)
  if (domain === 'gmail.com' || domain === 'googlemail.com') local = local.replace(/\./g, '')
  return `${local}@${domain === 'googlemail.com' ? 'gmail.com' : domain}`
}

/**
 * Confirmation the client receives. Bricks only; no prices promised. The
 * address it goes to is unverified, so it carries only Bricks copy and fields
 * picked from fixed lists, never the name, address, details or other free text.
 */
export function quoteConfirmation(q: CleanQuote): { subject: string; text: string } {
  const rules = q.trade.rules.length ? `\n${q.trade.rules.join('\n')}\n` : ''
  return {
    subject: `We got your ${q.trade.name.toLowerCase()} request`,
    text: [
      'Hi,',
      '',
      `Thanks for your ${q.trade.name.toLowerCase()} request. A person at Bricks will review it and reply by email, usually with a few questions or a written quote. Nothing is booked or charged until you approve a quote.`,
      rules,
      'Your request:',
      [`Service: ${q.trade.name}`, `For: ${q.clientLabel}`, q.scope && `Scope: ${q.scope}`].filter(Boolean).join('\n'),
      '',
      'If you didn’t send this request, you can ignore this email.',
      '',
      'Reply to this email if anything changes.',
      '',
      'Bricks',
      'help@brxs.ca',
    ].join('\n'),
  }
}
