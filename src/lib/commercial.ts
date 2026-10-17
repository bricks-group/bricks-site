/**
 * Builders & developers (site progress) pricing — industry median, billed the
 * way the industry bills it (Kam, 2026-10-17). Source of truth for the API is
 * Bricks-OS common/dev_project_billing.py; sources + math in
 * ship/commercial/commercial-pricing-payout-20261017.md.
 */
export const SITE_PRODUCT = 'Site Progress'

export const PER_VISIT = [
  { key: 'visual', name: 'Progress visit', what: 'Drone stills + video of the site, dated and filed by project.', price: 375, unit: 'per visit' },
  { key: 'mapped', name: 'Mapped capture', what: 'Orthomosaic, 3D model and a measurable site map.', price: 1499, unit: 'per capture' },
  { key: 'setup', name: 'First mapped capture setup', what: 'Ground control on the first mapped flight of a site.', price: 650, unit: 'one time per site' },
] as const

export const PLANS = [
  { kind: 'Visual', rows: [
    { cadence: 'Monthly', visits: 1, price: 300 },
    { cadence: 'Every two weeks', visits: 2, price: 600 },
    { cadence: 'Weekly', visits: 4, price: 1200 },
  ] },
  { kind: 'Mapped', rows: [
    { cadence: 'Monthly', visits: 1, price: 1200 },
    { cadence: 'Every two weeks', visits: 2, price: 2400 },
    { cadence: 'Weekly', visits: 4, price: 4500 },
  ] },
] as const

export const PLAN_NOTE =
  'Plans bill monthly per site, month to month. Mapped plans add the one-time $650 setup on the first capture. Survey-grade (RTK / check points) is quoted. CAD, plus HST.'

export const fmt = (n: number) => `$${n.toLocaleString('en-CA')}`
