/** Shared public definitions: visible answers, structured data and the AI text export. */
export const BRICKS_DEFINITION = 'Bricks is subscription software for Canadian real estate: builders, developers, investors, brokerages, teams and realtors. Listing media, Virtual Visit free-roam 3D and Site Progress — drone mapping, orthomosaics, models, documents, reports and comparisons over time — are services booked inside Bricks. Bricks Group is based in Ontario, Canada.'

export const LISTING_MEDIA_DESCRIPTION = 'Listing media is a service booked inside Bricks: HDR photography, licensed drone, floor plans, video and cinematic reels, with files delivered to the listing.'
export const VIRTUAL_VISIT_DESCRIPTION = 'Virtual Visit is Bricks’ flagship free-roam 3D service, built from a Gaussian splat—not a path-confined virtual tour. It is a separately priced add-on to residential listing-media packages. Commercial leasing sets and acquisition captures include Virtual Visit as specified in their scope.'
export const SITE_PROGRESS_DESCRIPTION = 'Site Progress brings dated site visits, drone mapping and orthomosaics, models, documents, reports and comparisons over time into Bricks for builders, developers and investors.'

export const HOME_FAQS = [
  { id: 'what', q: 'What is Bricks?', a: BRICKS_DEFINITION },
  { id: 'who', q: 'Who is it for?', a: 'Builders, developers and investors running projects, and the brokerages, teams and agents selling them.' },
  { id: 'booking', q: 'How do I book media or a site visit?', a: 'From inside Bricks, or online. Enter the address, pick what you need and see the full price before you pay.' },
  { id: 'coverage', q: 'Where do you work?', a: 'Across Canada. Availability and any travel charges are confirmed for the property at booking; inspections are available in Ontario only.' },
  { id: 'virtual-visit', q: 'What is Virtual Visit?', a: VIRTUAL_VISIT_DESCRIPTION },
  { id: 'site-progress', q: 'What is Site Progress?', a: SITE_PROGRESS_DESCRIPTION },
  { id: 'plans', q: 'How much does Bricks software cost?', a: 'Start free. Paid plans are $49, $99 or $149 a month, or $490, $990 or $1,490 a year (two months free). The $99 plan is the one we recommend. CAD, before tax. Services are booked separately.' },
] as const

export const MEDIA_FAQS = [
  { q: 'What listing media can I book in Bricks?', a: LISTING_MEDIA_DESCRIPTION },
  { q: 'Is Virtual Visit the same as a virtual tour?', a: VIRTUAL_VISIT_DESCRIPTION },
  { q: 'Do I need a paid software plan to book listing media?', a: 'No. Clay is free, and you can also book listing media online without an account. Media services are priced separately; enter the property address to see your quote before paying.' },
] as const

export const SITE_PROGRESS_FAQS = [
  { q: 'What is Site Progress?', a: SITE_PROGRESS_DESCRIPTION },
  { q: 'Can I compare site visits over time?', a: 'Yes. Bricks keeps captures as dated visits, including your own imported GeoTIFF, LAS and OBJ files. The builder hub supports 3D comparisons and reports showing changes since earlier visits.' },
  { q: 'Does a progress report certify completion or quantities?', a: 'No. Bricks reports are visual documentation, not a cost, quantity or completion certification. Reports can be shared as PDFs or expiring read-only links.' },
] as const

// Generated from Markez's seo-content-w1/_src/faqs.py (2026-11-14). Edit there, not here.
// AGENT_FAQS edited here 2026-11-14 per Kam: no plan names or prices on /agents (mirror in faqs.py).
export const AGENT_FAQS = [
  { q: "How much does Bricks cost for an agent?", a: "You can start free and add more only when you need it. Current prices are on the pricing page. Listing media is booked separately, per shoot." },
  { q: "How do I book listing media?", a: "From the listing in Bricks, or at brxs.ca/book without an account. Enter the address, pick services and an exact time. Bricks assigns the photographer before you pay, so travel is on the quote. Photos usually arrive within 24 hours and other media within 24 to 48 hours. These are targets, not guarantees." },
  { q: "Can I cancel or reschedule a shoot?", a: "Cancel 24 hours or more before the shoot window for a full refund. Inside 24 hours, or if the photographer can’t get in, there’s no refund. Rescheduling 24 hours or more ahead is free." },
  { q: "Does Bricks post to my MLS®?", a: "No. The launch kit builds an MLS® package with board-sized photos, a field sheet, remarks and a required-field checklist. You submit it yourself. Bricks never posts or submits for you." },
  { q: "Can my team use Bricks?", a: "Yes. Up to 6 agents share the lead’s plan, with one shared pipeline. Larger offices can use brokerage seats instead." },
] as const

export const PM_FAQS = [
  { q: "What can property managers book in Bricks?", a: "A turnover media bundle for $295, a move-in or move-out condition report for $145, a rental listing set for $195, a listing set with video for $255, or a building set for $650. CAD, before HST." },
  { q: "Does the turnover media bundle include cleaning?", a: "No. It is media only: a move-out condition report, new listing photos and a measured floor plan in one visit. Cleaning, repairs and other physical turnover work are not included." },
  { q: "When should I book a condition report?", a: "A move-out report or turnover is shot within two weeks after the move-out date. A move-in report is shot within two weeks before move-in, while the unit is empty. Book at least 1 day ahead, or 2 days if there’s a drone." },
  { q: "Are there monthly plans for rentals?", a: "Yes. Rentals 5, 12 and 25 give that many turnover media bundles a month for $1,325, $2,990 or $5,875 a month, CAD plus tax. Credits can be spent on any rentals visit, and unused credits roll over one month." },
  { q: "Do I need an account to book?", a: "Not for one or two units. A property manager account shows every unit’s turnover and next step, compares each condition report room by room with the last one, and prints an owner report for any period." },
  { q: "Does Bricks sync with my property management system?", a: "Not yet. Your team updates unit status in Bricks: available, reserved or leased." },
] as const

export const ABOUT_FAQS = [
  { q: "What is Bricks?", a: "Bricks is subscription software for Canadian real estate: builders, developers, investors, brokerages, teams and realtors. Listing media, Virtual Visit free-roam 3D and Site Progress — drone mapping, orthomosaics, models, documents, reports and comparisons over time — are services booked inside Bricks. Bricks Group is based in Ontario, Canada." },
  { q: "Who is Bricks for?", a: "Builders and developers, agents and brokerages, property managers, and the vendors who do the work on site. Each works from the same record." },
  { q: "Who makes Bricks?", a: "Bricks Group, founded in 2026 and based in Mississauga, Ontario." },
  { q: "Is Bricks software or a media company?", a: "Software first. Projects, listings and deals live in Bricks. When a site needs a progress visit or a listing needs media, you book it inside Bricks, and the files land where the work is." },
  { q: "Where does Bricks work?", a: "Across Canada. Availability and any travel charges are confirmed for the property at booking. Inspections are available in Ontario only." },
  { q: "How do I contact Bricks?", a: "Email hello@brxs.ca for general questions or help@brxs.ca for support, or call (289) 312-7425." },
] as const

export const BROKERAGE_FAQS = [
  { q: "How much are brokerage seats?", a: "Billed yearly, a seat is $708 on Boutique (5–24 seats), $540 on Growth (25–74), $420 on Enterprise (75–199) and $300 on Franchise (200+). Month to month, it is $74, $56, $44 or $31 a seat, with no lock-in. CAD, before tax." },
  { q: "What does every seat get?", a: "All of Bricks: deals, e-sign with an audit trail, a launch kit for each listing and a deal room for each closing. Agents don’t pay separately." },
  { q: "Is trust accounting included?", a: "Yes, for brokerages only. It is part of every brokerage account, under Accounting in the Finance section. It isn’t available on agent or team plans." },
  { q: "How many agents do I need for a brokerage plan?", a: "Brokerage plans start at 5 seats. With fewer agents, a team plan puts up to 6 agents on the lead’s plan." },
  { q: "Is listing media included in the seat price?", a: "No. Media is billed separately. Agents book shoots from the listing, and the brokerage can mark favourite photographers, who get priority for its agents’ shoots." },
  { q: "How do I set up my brokerage?", a: "Create a brokerage account and finish onboarding. In Billing, enter your seat count under Office plans and subscribe. Then add agents from Office, Agents, or share your invite link." },
] as const
