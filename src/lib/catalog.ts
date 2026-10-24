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
    points: ['Everything in Clay', 'CRM', 'E-sign with a signing checklist and shareable links'],
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
 * Brokerage seat rates (CAD per seat per year, billed yearly).
 * Mirrors Supabase software_tiers (boutique 70800 / growth 54000 / enterprise 42000 / franchise 30000 cents per year).
 * Single source for the visible seat cards and the SoftwareApplication JSON-LD.
 */
export const OFFICE_SEAT_PRICE_PER_YEAR = {
  boutique: 708,
  growth: 540,
  enterprise: 420,
  franchise: 300,
} as const

/**
 * Brokerage monthly seat rates (CAD per seat per month, month to month, no lock-in).
 * Yearly rate / 12 + 25%, rounded to the dollar. Mirrors Bricks OS
 * backend/server.py BROKERAGE_MONTHLY_SEAT_CENTS and OnboardingPage BROKERAGE_MONTHLY_SEAT.
 */
export const OFFICE_SEAT_PRICE_PER_MONTH = {
  boutique: 74,
  growth: 56,
  enterprise: 44,
  franchise: 31,
} as const

/** Individual plans: yearly = 10 × monthly (two months free). Mirrors OS plans.js annualPrice. */
export const SOFTWARE_PRICES = {
  keystone: { monthly: 49, yearly: 490 },
  marble: { monthly: 99, yearly: 990 },
  diamond: { monthly: 149, yearly: 1490 },
} as const

const seatPerYear = (n: number) => `$${n.toLocaleString('en-US')} / seat / yr`
const seatPerMonth = (n: number) => `$${n} / seat / mo`

/** Brokerage seats: per seat, billed yearly, or monthly at +25% with no lock-in. Full OS on every seat — not a Clay–Diamond bundle. */
export const OFFICE_PLANS = [
  { id: 'boutique', name: 'Boutique', seats: '5–24 seats', seatPricePerYear: OFFICE_SEAT_PRICE_PER_YEAR.boutique, price: seatPerYear(OFFICE_SEAT_PRICE_PER_YEAR.boutique), seatPricePerMonth: OFFICE_SEAT_PRICE_PER_MONTH.boutique, priceMonthly: seatPerMonth(OFFICE_SEAT_PRICE_PER_MONTH.boutique) },
  { id: 'growth', name: 'Growth', seats: '25–74 seats', seatPricePerYear: OFFICE_SEAT_PRICE_PER_YEAR.growth, price: seatPerYear(OFFICE_SEAT_PRICE_PER_YEAR.growth), seatPricePerMonth: OFFICE_SEAT_PRICE_PER_MONTH.growth, priceMonthly: seatPerMonth(OFFICE_SEAT_PRICE_PER_MONTH.growth) },
  { id: 'enterprise', name: 'Enterprise', seats: '75–199 seats', seatPricePerYear: OFFICE_SEAT_PRICE_PER_YEAR.enterprise, price: seatPerYear(OFFICE_SEAT_PRICE_PER_YEAR.enterprise), seatPricePerMonth: OFFICE_SEAT_PRICE_PER_MONTH.enterprise, priceMonthly: seatPerMonth(OFFICE_SEAT_PRICE_PER_MONTH.enterprise) },
  { id: 'franchise', name: 'Franchise', seats: '200+ seats', seatPricePerYear: OFFICE_SEAT_PRICE_PER_YEAR.franchise, price: seatPerYear(OFFICE_SEAT_PRICE_PER_YEAR.franchise), seatPricePerMonth: OFFICE_SEAT_PRICE_PER_MONTH.franchise, priceMonthly: seatPerMonth(OFFICE_SEAT_PRICE_PER_MONTH.franchise) },
] as const

export const OFFICE_INCLUDES =
  'Every seat gets all of Bricks, plus trust accounting. Agents don’t pay separately.'

/** Plan matrix: same rows, same order on every card. `from` = first plan that includes it. */
export const PLAN_ORDER = ['clay', 'keystone', 'marble', 'diamond'] as const
export const PLAN_FEATURES: readonly { label: string; from: (typeof PLAN_ORDER)[number]; note?: string; addon?: string }[] = [
  { label: 'Book media at rack rate', from: 'clay' },
  { label: 'Listing file, transactions, and BYO MLS', from: 'clay' },
  { label: 'CRM', from: 'keystone' },
  { label: 'E-sign and shareable links', from: 'keystone', note: 'Signing checklist and shareable links. Placing fields on the PDF is coming soon.' },
  { label: 'Forms', from: 'marble' },
  { label: 'AI Listing Copy', from: 'diamond', addon: '$19 / mo' },
  { label: 'AI CMA', from: 'diamond', addon: '$25 / mo' },
  { label: 'AI Document Drafter', from: 'diamond', addon: '$19 / mo' },
]
