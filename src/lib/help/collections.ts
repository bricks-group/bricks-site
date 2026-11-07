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
  { slug: 'home-services', title: 'Home services', summary: 'Staging, cleaning, inspections and measurement, by quote.', icon: 'home' },
  { slug: 'integrations', title: 'Integrations', summary: 'MLS feeds, CRMs, calendars and payments.', icon: 'link' },
  { slug: 'account-security', title: 'Account, security and privacy', summary: 'Settings, notifications, privacy and deleting your account.', icon: 'lock' },
  { slug: 'photographers', title: 'Working with Bricks', summary: 'Applying as a photographer, pilot or home services vendor, jobs, pay and the capture standard.', icon: 'aperture' },
  { slug: 'troubleshooting', title: 'Troubleshooting', summary: 'Sign-in, email, payment and delivery problems.', icon: 'wrench' },
  { slug: 'contact', title: 'Contact', summary: 'Email, phone, privacy requests and feedback.', icon: 'mail' },
]

export const COLLECTION_DESCRIPTIONS: Record<string, string> = {
  "agents": "Learn how to manage listings in Bricks, build a listing launch kit, send documents for e-signature, use deal rooms and keep contacts together in your CRM.",
  "booking": "Get help booking listing media in Bricks: compare packages and add-ons, understand quotes and travel fees, choose a time and prepare for delivery of your media.",
  "brokerages": "Find help setting up a brokerage in Bricks, managing seats and rosters, following the office pipeline and working with trust accounting and seat billing.",
  "builders": "Learn how Site Progress works in Bricks, from booking site visits to reading reports, making measurements, importing captures and comparing models over time.",
  "changes-refunds": "Find guidance on rescheduling or cancelling a Bricks shoot, access problems, weather interruptions and refunds, with links to the relevant booking policies.",
  "commercial": "Get help with commercial property in Bricks: book leasing sets and aerials, explore the leasing desk plan and understand mapping options for commercial sites.",
  "getting-started": "Get started with Bricks software: choose an account type, create an account, sign in, reset a password or learn how to book listing media without an account.",
  "investors": "Learn how to use Bricks for acquisition captures, portfolio monitoring and baseline comparisons, and how to read progress reports shared by a project builder.",
  "plans-billing": "Understand Bricks plans and billing, including monthly or yearly payments, upgrades, cancellation, subscription refunds, invoices, payment methods and tax.",
  "property-managers": "Get help using Bricks for rental media, condition reports and turnovers, with guidance on property visits, unit status and sharing reports with owners.",
  "teams": "Learn how Bricks team plans work, invite agents, share shoot allocations and add seats as your team grows, with guidance on choosing a team or brokerage plan."
}
