/**
 * Locked public catalog (software + office seats).
 * Media rates live in pricing.ts. Do not invent a founder discount.
 * Annual individual plans = pay 10, get 12 (two months free).
 */
export const SOFTWARE_PLANS = [
  {
    id: 'clay',
    name: 'Clay',
    price: 'Free',
    yearly: 'No card',
    over: 'Individual',
    points: ['Book media at rack rate', 'No CRM, e-sign, transactions, or MLS'],
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
    points: ['Everything in Keystone', 'Transactions'],
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: '$149 / mo',
    yearly: '$1,490 / yr · 2 months free',
    over: 'Individual',
    points: ['Everything in Marble', 'MLS'],
  },
] as const

/** Office OS: per seat, billed annually. Full OS on every seat — not a Clay–Diamond bundle. */
export const OFFICE_PLANS = [
  { id: 'boutique', name: 'Boutique', seats: '5–24 seats', price: '$708 / seat / yr' },
  { id: 'growth', name: 'Growth', seats: '25–74 seats', price: '$540 / seat / yr' },
  { id: 'enterprise', name: 'Enterprise', seats: '75–199 seats', price: '$420 / seat / yr' },
  { id: 'franchise', name: 'Franchise', seats: '200+ seats', price: '$300 / seat / yr' },
] as const

export const OFFICE_INCLUDES =
  'Full OS on every seat — CRM, transactions, e-sign, forms, MLS — plus trust accounting. Agents do not pay individually.'

