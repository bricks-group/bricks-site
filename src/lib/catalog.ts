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
    points: ['Book media at rack rate', 'Listing file, transactions, and BYO MLS'],
  },
  {
    id: 'keystone',
    name: 'Keystone',
    price: '$49 / mo',
    yearly: '$490 / yr · 2 months free',
    over: 'Individual',
    points: ['Everything in Clay', 'CRM', 'E-sign'],
  },
  {
    id: 'marble',
    name: 'Marble',
    price: '$99 / mo',
    yearly: '$990 / yr · 2 months free',
    over: 'Individual',
    points: ['Everything in Keystone', 'Forms'],
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: '$149 / mo',
    yearly: '$1,490 / yr · 2 months free',
    over: 'Individual',
    points: ['Everything in Marble', 'AI suite included — same AI as add-ons on lower plans'],
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

/** Brokerage seats: per seat, billed annually. Full OS on every seat — not a Clay–Diamond bundle. */
export const OFFICE_PLANS = [
  { id: 'boutique', name: 'Boutique', seats: '5–24 seats', price: '$708 / seat / yr' },
  { id: 'growth', name: 'Growth', seats: '25–74 seats', price: '$540 / seat / yr' },
  { id: 'enterprise', name: 'Enterprise', seats: '75–199 seats', price: '$420 / seat / yr' },
  { id: 'franchise', name: 'Franchise', seats: '200+ seats', price: '$300 / seat / yr' },
] as const

export const OFFICE_INCLUDES =
  'Full OS on every seat — CRM, transactions, e-sign, forms, MLS — plus trust accounting. Agents do not pay individually.'
