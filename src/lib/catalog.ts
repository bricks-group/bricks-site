/**
 * Locked public catalog (software + brokerage seats).
 * Media rates live in pricing.ts. Do not invent a founder discount.
 * Annual individual plans = pay 10, get 12 (two months free).
 * Stripe tiers are live on OS. Media is always à la carte.
 */
export const SOFTWARE_PLANS = [
  {
    id: 'clay',
    name: 'Clay',
    price: 'Free',
    yearly: 'No card',
    over: 'Individual',
    value: 'Free desk. No card.',
    points: ['Book media at rack rate', 'Listing file, transactions, and BYO MLS'],
  },
  {
    id: 'keystone',
    name: 'Keystone',
    price: '$49 / mo',
    yearly: '$490 / yr · 2 months free',
    over: 'Individual',
    value: '≈ $40.83 / mo billed yearly.',
    points: ['Everything in Clay', 'CRM', 'Checklist e-sign + shareable links (on-document PDF placement not available yet)'],
  },
  {
    id: 'marble',
    name: 'Marble',
    price: '$99 / mo',
    yearly: '$990 / yr · 2 months free',
    over: 'Individual',
    value: '≈ $82.50 / mo billed yearly.',
    recommended: true,
    points: ['Everything in Keystone', 'Forms'],
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: '$149 / mo',
    yearly: '$1,490 / yr · 2 months free',
    over: 'Individual',
    value: '≈ $124.17 / mo billed yearly. AI suite sold as $63 / mo of add-ons, included.',
    points: ['Everything in Marble', 'AI suite included — same AI as add-ons on lower plans', 'AI Listing Copy', 'AI CMA', 'AI Document Drafter'],
  },
] as const

export const SOFTWARE_BLURB =
  'Stripe tiers are live on OS. Media is always à la carte. Modular add-ons attach without a plan jump.'

/** Modular Stripe AI add-ons. Attach to paid-capable plans; included in Diamond. No credit pools. */
export const ADDONS = [
  { id: 'ai-listing-copy', name: 'AI Listing Copy', price: '$19 / mo' },
  { id: 'ai-cma', name: 'AI CMA', price: '$25 / mo' },
  { id: 'ai-document-drafter', name: 'AI Document Drafter', price: '$19 / mo' },
] as const

export const ADDONS_BLURB =
  'Add-ons attach to any paid-capable plan; Diamond includes the AI suite.'

/**
 * Brokerage seat rates (CAD per seat per year, billed annually).
 * Mirrors Bricks OS backend brokerage_seat_prices (monthly 59 / 45 / 35 / 25 × 12).
 * Single source for the visible seat cards and the SoftwareApplication JSON-LD.
 */
export const OFFICE_SEAT_PRICE_PER_YEAR = {
  boutique: 708,
  growth: 540,
  enterprise: 420,
  franchise: 300,
} as const

const seatPerYear = (n: number) => `$${n.toLocaleString('en-US')} / seat / yr`

/** Brokerage seats: per seat, billed annually. Full OS on every seat — not a Clay–Diamond bundle. */
export const OFFICE_PLANS = [
  { id: 'boutique', name: 'Boutique', seats: '5–24 seats', seatPricePerYear: OFFICE_SEAT_PRICE_PER_YEAR.boutique, price: seatPerYear(OFFICE_SEAT_PRICE_PER_YEAR.boutique) },
  { id: 'growth', name: 'Growth', seats: '25–74 seats', seatPricePerYear: OFFICE_SEAT_PRICE_PER_YEAR.growth, price: seatPerYear(OFFICE_SEAT_PRICE_PER_YEAR.growth) },
  { id: 'enterprise', name: 'Enterprise', seats: '75–199 seats', seatPricePerYear: OFFICE_SEAT_PRICE_PER_YEAR.enterprise, price: seatPerYear(OFFICE_SEAT_PRICE_PER_YEAR.enterprise) },
  { id: 'franchise', name: 'Franchise', seats: '200+ seats', seatPricePerYear: OFFICE_SEAT_PRICE_PER_YEAR.franchise, price: seatPerYear(OFFICE_SEAT_PRICE_PER_YEAR.franchise) },
] as const

export const OFFICE_INCLUDES =
  'Full system on every seat — CRM, transactions, checklist e-sign + shareable links, forms, BYO MLS — plus trust accounting. On-document PDF placement is not available yet. Agents do not pay individually.'
