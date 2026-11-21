import { AGENT_LAUNCH_LIVE } from './launch'
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
    points: ['Book media at rack rate', 'Listing file, transactions, and BYO MLS®'],
  },
  {
    id: 'keystone',
    name: 'Keystone',
    price: '$49 / mo',
    yearly: '$490 / yr · 2 months free',
    over: 'Individual',
    value: '≈ $40.83 / mo billed yearly.',
    points: ['Everything in Clay', 'CRM', 'E-sign fields placed on the PDF + shareable links'],
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
    value: '≈ $124.17 / mo billed yearly. AI suite included.',
    points: ['Everything in Marble', 'AI suite included — same AI as add-ons on lower plans', 'AI Listing Copy', 'AI CMA', 'AI Document Drafter'],
  },
] as const

export const SOFTWARE_BLURB =
  'Clay is free. Pay monthly, or yearly and get two months free.'

/** Modular Stripe AI add-ons. Attach to paid-capable plans; included in Diamond. No credit pools. */
export const ADDONS = [
  { id: 'ai-listing-copy', name: 'AI Listing Copy', price: '$19 / mo' },
  { id: 'ai-cma', name: 'AI CMA', price: '$25 / mo' },
  { id: 'ai-document-drafter', name: 'AI Document Drafter', price: '$19 / mo' },
] as const

export const ADDONS_BLURB =
  'Add AI to any paid plan. Diamond includes all three.'

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

/** Month-to-month seat rate (exact billed amounts, no lock-in). Mirrors backend BROKERAGE_MONTHLY_SEAT_CENTS. */
export const OFFICE_SEAT_PRICE_PER_MONTH = { boutique: 74, growth: 56, enterprise: 44, franchise: 31 } as const
export const OFFICE_MONTHLY_NOTE =
  'Prefer monthly? Boutique is $74, Growth $56, Enterprise $44 and Franchise $31 per seat per month, with no lock-in. Annual billing is $708, $540, $420 and $300 per seat per year, respectively. CAD, before tax.'

/** Extra agent on a team plan, past the six the lead's plan covers (CAD, before tax). */
export const TEAM_EXTRA_SEAT = { monthly: 79, yearly: 790 } as const

export const OFFICE_INCLUDES =
  'Every seat gets all of Bricks, plus trust accounting. Agents don’t pay separately.'

/** Plan matrix: same rows, same order on every card. `from` = first plan that includes it. */
export const PLAN_ORDER = ['clay', 'keystone', 'marble', 'diamond'] as const
export const PLAN_FEATURES: readonly { label: string; from: (typeof PLAN_ORDER)[number]; note?: string; addon?: string }[] = [
  { label: 'Book media at rack rate', from: 'clay' },
  { label: 'Listing file, transactions, and BYO MLS®', from: 'clay' },
  ...(AGENT_LAUNCH_LIVE ? [{ label: 'Listing launch kit', from: 'clay' as const, note: 'Feature sheet, social pack and MLS® package, on every plan' }] : []),
  { label: 'CRM', from: 'keystone' },
  { label: 'E-sign and shareable links', from: 'keystone', note: 'Fields on the PDF, SHA-256 fingerprints and an audit trail' },
  { label: 'Forms', from: 'marble' },
  ...(AGENT_LAUNCH_LIVE ? [{ label: 'Deal room', from: 'marble' as const, note: 'Private links for lawyers, brokers and inspectors. Included on every brokerage seat' }] : []),
  { label: 'AI Listing Copy', from: 'diamond', addon: '$19 / mo' },
  { label: 'AI CMA', from: 'diamond', addon: '$25 / mo' },
  { label: 'AI Document Drafter', from: 'diamond', addon: '$19 / mo' },
]

/** Rentals plans for property managers (monthly, CAD before tax). Shown on /property-managers, help and blog. */
export const RENTALS_PLANS = [
  { name: 'Rentals 5', bundles: 5, monthly: 1325 },
  { name: 'Rentals 12', bundles: 12, monthly: 2990 },
  { name: 'Rentals 25', bundles: 25, monthly: 5875 },
] as const
