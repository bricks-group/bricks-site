import type { Collection } from './types'

/** Order here is the order on the help home page. */
export const COLLECTIONS: Collection[] = [
  { slug: 'getting-started', title: 'Getting started', summary: 'What Bricks is, account types, signing up and signing in.', icon: 'start' },
  { slug: 'booking', title: 'Booking media', summary: 'Packages, pricing, add-ons, times, travel and delivery.', icon: 'camera' },
  { slug: 'changes-refunds', title: 'Reschedule, cancel and refunds', summary: 'Moving or cancelling a shoot, and how refunds work.', icon: 'calendar' },
  { slug: 'plans-billing', title: 'Plans and billing', summary: 'Plans, upgrades, invoices, tax and cancelling.', icon: 'card' },
  { slug: 'agents', title: 'Agents', summary: 'Listings, launch kits, e-sign and deal rooms.', icon: 'person', audience: true },
  { slug: 'teams', title: 'Teams', summary: 'Seats, invites and shared shoot allocations.', icon: 'people', audience: true },
  { slug: 'brokerages', title: 'Brokerages', summary: 'Seat pricing, rosters, compliance and trust accounting.', icon: 'building', audience: true },
  { slug: 'builders', title: 'Builders and developers', summary: 'Site progress visits, reports and measurements.', icon: 'crane', audience: true },
  { slug: 'property-managers', title: 'Property managers', summary: 'Condition reports, rental media and unit status.', icon: 'key', audience: true },
  { slug: 'commercial', title: 'Commercial', summary: 'Leasing sets, the leasing desk and site mapping.', icon: 'tower', audience: true },
  { slug: 'investors', title: 'Investors', summary: 'Acquisition capture, portfolio watch and claims.', icon: 'chart', audience: true },
  { slug: 'reits', title: 'REITs', summary: 'Portfolio accounts and volume pricing.', icon: 'grid', audience: true },
  { slug: 'integrations', title: 'Integrations', summary: 'MLS feeds, CRMs, calendars and payments.', icon: 'link' },
  { slug: 'account-security', title: 'Account, security and privacy', summary: 'Settings, notifications, privacy and deleting your account.', icon: 'lock' },
  { slug: 'photographers', title: 'Photographers and pilots', summary: 'Applying, jobs, pay, and the capture standard step by step.', icon: 'aperture' },
  { slug: 'troubleshooting', title: 'Troubleshooting', summary: 'Sign-in, email, payment and delivery problems.', icon: 'wrench' },
  { slug: 'contact', title: 'Contact', summary: 'Email, phone, privacy requests and feedback.', icon: 'mail' },
]
