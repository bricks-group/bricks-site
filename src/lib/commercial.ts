/**
 * Builders & developers (site progress) pricing, v2 (Kam-approved 2026-10-24).
 * Source of truth for the API and Stripe is Bricks-OS
 * common/dev_project_billing.py; keep these in lockstep. Bricks is not pitched
 * as the cheapest: one vendor, one portal, dated evidence for every draw.
 */
export const SITE_PRODUCT = 'Site Progress'

export const PER_VISIT = [
  { key: 'visual', name: 'Progress visit', what: 'Drone photos and video of the site, dated by visit.', price: 495, unit: 'per visit' },
  { key: 'mapped', name: 'Mapped capture', what: 'An orthomosaic, a 3D model and a measurable site map.', price: 1499, unit: 'per capture' },
  { key: 'setup', name: 'Mapping setup', what: 'Ground control for the first mapped flight on a site.', price: 650, unit: 'one time per site' },
] as const

export const PLANS = [
  { kind: 'Visual', rows: [
    { cadence: 'Monthly', visits: 1, price: 450 },
    { cadence: 'Every two weeks', visits: 2, price: 850 },
    { cadence: 'Weekly', visits: 4, price: 1600 },
  ] },
  { kind: 'Mapped', rows: [
    { cadence: 'Monthly', visits: 1, price: 1400 },
    { cadence: 'Every two weeks', visits: 2, price: 2600 },
    { cadence: 'Weekly', visits: 4, price: 3900 },
  ] },
] as const

export const PLAN_NOTE =
  'Plans are billed monthly per site, month to month. Mapped plans add the one-time $650 setup. Survey-grade mapping is $1,499 for up to 10 acres plus $60 per extra acre, up to 200 acres, plus the one-time $650 setup. CAD, plus tax (GST/HST based on the property\'s province).'

export const fmt = (n: number) => `$${n.toLocaleString('en-CA')}`

/** One line for Home, Pricing and anywhere Site Progress is priced. Figures come from PER_VISIT and PLANS (the same amounts Stripe charges). */
export const SITE_PROGRESS_LINE =
  `Site visits from ${fmt(PER_VISIT[0].price)}, or ${fmt(PLANS[0].rows[0].price)} a month on a plan. Mapped sites add a one-time ${fmt(PER_VISIT[2].price)} setup.`

/** Server-rendered price list on /book/site (crawlable above the client form). */
export const SITE_PRICE_GROUPS: { label: string; items: { name: string; price: string }[] }[] = [
  { label: 'One visit', items: PER_VISIT.map((x) => ({ name: x.name, price: `${fmt(x.price)} ${x.unit}` })) },
  ...PLANS.map((p) => ({ label: `${p.kind} plans, per site a month`, items: p.rows.map((r) => ({ name: r.cadence, price: fmt(r.price) })) })),
]
