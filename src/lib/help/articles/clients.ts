import type { Article } from '../types'
import { p, h, ul, ol, note, table } from '../blocks'
import { signupUrl } from '@/lib/brand'
import { OFFICE_PLANS, OFFICE_SEAT_PRICE_PER_MONTH } from '@/lib/catalog'
import { PER_VISIT, PLANS as SITE_PLANS, PLAN_NOTE, fmt } from '@/lib/commercial'
import { ONE_OFFS, money } from '@/lib/propertyCheckout'

const oneOff = (k: string) => [ONE_OFFS[k].name, ONE_OFFS[k].what, money(ONE_OFFS[k].cents)]

export const AGENTS: Article[] = [
  {
    slug: 'agent-quick-start',
    title: `Quick start for agents`,
    summary: `Create a free account, add a listing, book the shoot from it, then launch.`,
    popular: true,
    howto: true,
    body: [
      ol(
        `[Create a free agent account](${signupUrl('solo')}). Clay needs no card.`,
        `Add your listing. It becomes the listing file for photos, documents and the deal.`,
        `Choose **Book media** in the sidebar. When the shoot is delivered, the media lands on the listing.`,
        `Open the launch kit to download the feature sheet, social pack and MLS® package.`,
        `When an offer comes in, track the deal and send documents for e-signature.`,
      ),
      p(`CRM and e-sign come with Keystone. Forms and the deal room come with Marble. See [plans](/help/plans-billing/plans-overview).`),
    ],
    related: ['listing-launch-kit', 'e-sign-documents', 'book-a-listing-shoot'],
  },
  {
    slug: 'listing-launch-kit',
    title: `The listing launch kit`,
    summary: `A feature sheet, social pack and MLS® package, made from the listing. On every plan.`,
    body: [
      p(`Bricks builds a launch kit from the listing's details and its delivered photos. It's on every plan, including free Clay.`),
      table(['Piece', 'What it is'], [
        ['Feature sheet', 'A one-page PDF with a QR code to the listing site.'],
        ['Social pack', 'Feed, story and link crops, with captions.'],
        ['MLS® package', 'Board-sized photos, a field sheet, remarks and a required-field checklist.'],
      ]),
      p(`Download each piece, then share or submit it yourself.`),
      note(`Bricks never posts to social media or submits to your MLS® for you.`),
    ],
    related: ['agent-quick-start', 'mls-feeds'],
  },
  {
    slug: 'e-sign-documents',
    title: `Send documents for e-signature`,
    summary: `Place fields on the PDF, send from the deal, and get a fingerprinted signed copy.`,
    howto: true,
    body: [
      p(`E-sign is on Keystone and up, and on every brokerage seat.`),
      ol(
        `Open the deal and add the PDF.`,
        `Place signature, initials, date and text fields on the PDF for each signer.`,
        `Send it. Each signer gets a link.`,
        `Follow progress on the deal: sent, opened, signed and completed.`,
      ),
      h(`What makes it hold up`),
      ul(
        `SHA-256 fingerprints of the original and the signed PDF.`,
        `Every event recorded with the time, IP address and browser.`,
        `Fillable fields flattened, so the signed PDF can't be edited.`,
      ),
    ],
    related: ['deal-room', 'plans-overview'],
  },
  {
    slug: 'deal-room',
    title: `Use the deal room`,
    summary: `Give each lawyer, broker or inspector a private link to their part of the deal.`,
    body: [
      p(`The deal room is on Marble and up, and on every brokerage seat. Give each lawyer, mortgage broker, inspector or appraiser a private link that shows only their dates, conditions and documents.`),
      ul(
        `They can send documents back and say a condition is met. You decide what it means for the deal.`,
        `Their deadlines go into their own calendar, with optional reminder emails 48 hours before.`,
        `Links end 30 days after closing, and you can turn one off at any time.`,
      ),
    ],
    related: ['e-sign-documents', 'plans-overview'],
  },
  {
    slug: 'contacts-and-crm',
    title: `Contacts and CRM`,
    summary: `Keep clients in Bricks, or sync them with Follow Up Boss or kvCORE.`,
    body: [
      p(`The CRM is on Keystone and up. Keep your contacts beside your listings and deals.`),
      p(`Already use a CRM? Bricks connects to Follow Up Boss and kvCORE. See [Connect your CRM](/help/integrations/connect-your-crm).`),
    ],
    related: ['connect-your-crm', 'plans-overview'],
  },
]

export const TEAMS: Article[] = [
  {
    slug: 'team-plan',
    title: `How team plans work`,
    summary: `Up to 6 agents on the lead's plan, monthly or yearly, with a shared pipeline.`,
    popular: true,
    body: [
      ul(
        `**Up to 6 agents.** The lead and up to five agents share the lead's plan: Keystone, Marble or Diamond. The team pays that plan's price, not a price per agent.`,
        `**Monthly or yearly.** Pay monthly, or yearly and get two months free. See [Monthly or yearly billing](/help/plans-billing/monthly-or-yearly).`,
        `**Shared pipeline.** Every deal and listing in one view, with who owns each one. The lead sees every deal and listing.`,
        `**Invite by email.** Agents join from an invite and keep their own logins.`,
        `**Every agent gets the whole desk:** deals, listing files and e-sign, with media booked from the listing.`,
      ),
      p(`[Start a team](${signupUrl('team')}).`),
    ],
    related: ['invite-team-members', 'add-team-seats', 'team-or-brokerage'],
  },
  {
    slug: 'invite-team-members',
    title: `Invite agents to your team`,
    summary: `Invite by email with a monthly shoot allocation. They join with their own login.`,
    howto: true,
    body: [
      ol(
        `In the Bricks app, open **Members** under **Team** in the sidebar.`,
        `Choose **Invite member**.`,
        `Enter their name and email, and a monthly shoot allocation.`,
        `Send. They get an email to join, and sign in with their own login.`,
      ),
      p(`Filter members by **All**, **Active**, **At limit** and **Dormant** to see who's used their allocation and who hasn't been active.`),
    ],
    related: ['team-shoot-allocations', 'add-team-seats'],
  },
  {
    slug: 'team-shoot-allocations',
    title: `Shoot allocations for team members`,
    summary: `Set how many shoots each agent can book a month.`,
    body: [
      p(`Each member has a monthly shoot allocation, set when you invite them. It starts at 10, and you choose the number.`),
      p(`Members who have used their allocation show under **At limit**.`),
    ],
    related: ['invite-team-members', 'team-plan'],
  },
  {
    slug: 'add-team-seats',
    title: `Add seats past 6 agents`,
    summary: `$79 per agent a month, or $790 a year. Seats count once Stripe confirms payment.`,
    howto: true,
    body: [
      p(`Your plan covers a set number of agents, you included. Add a seat for each agent past that: $79 per agent a month, or $790 a year, CAD plus tax.`),
      ol(
        `Open **Billing** under **Team** in the sidebar.`,
        `Choose how many seats to add, monthly or yearly.`,
        `Pay in Stripe. The seats count as soon as Stripe confirms the payment.`,
      ),
    ],
    related: ['team-or-brokerage', 'team-plan'],
  },
  {
    slug: 'team-or-brokerage',
    title: `Team plan or brokerage seats?`,
    summary: `From about 17 agents, brokerage seats can cost less.`,
    body: [
      table(['', 'Team plan', 'Brokerage seats'], [
        ['Size', 'Up to 6 agents, plus added seats', 'From 5 seats'],
        ['Billing', 'The lead\'s plan, monthly or yearly', 'Per seat, yearly or monthly'],
        ['Trust accounting', 'No', 'Yes'],
      ]),
      p(`From about 17 agents, brokerage seats can cost less than a team plan with added seats. See [Brokerage seat pricing](/help/brokerages/brokerage-seat-pricing).`),
    ],
    related: ['brokerage-seat-pricing', 'add-team-seats'],
  },
]

export const BROKERAGES: Article[] = [
  {
    slug: 'brokerage-seat-pricing',
    title: `Brokerage seat pricing`,
    summary: `Four tiers by office size. Every seat gets all of Bricks, plus trust accounting.`,
    popular: true,
    body: [
      table(['Tier', 'Seats', 'Per seat, yearly', 'Per seat, monthly'], OFFICE_PLANS.map((o) => [
        o.name, o.seats, o.price.replace(' / seat / yr', ''), `$${OFFICE_SEAT_PRICE_PER_MONTH[o.id]}`,
      ])),
      p(`Monthly is $74 (Boutique), $56 (Growth), $44 (Enterprise) or $31 (Franchise) per seat per month, with no lock-in. Prices are CAD, before HST. Agents don't pay separately, and media is billed separately.`),
      p(`Fewer than 5 agents? See [team plans](/help/teams/team-plan).`),
    ],
    related: ['set-up-your-brokerage', 'office-seat-billing'],
  },
  {
    slug: 'set-up-your-brokerage',
    title: `Set up your brokerage`,
    summary: `Create the office, choose your seats and add your agents.`,
    howto: true,
    body: [
      ol(
        `[Create a brokerage account](${signupUrl('brokerage')}) and finish onboarding.`,
        `Open **Billing**. Under **Office plans**, enter your seat count and choose **Subscribe**.`,
        `Open **Agents** under **Office**. Choose **Add agent** to send an invite, or share your **Invite link**.`,
      ),
      p(`Want a walkthrough first? [Talk to us](/contact).`),
    ],
    related: ['brokerage-seat-pricing', 'brokerage-roster-pipeline'],
  },
  {
    slug: 'brokerage-roster-pipeline',
    title: `Roster and pipeline`,
    summary: `See your agents, their seats, who can book media, and every deal in one view.`,
    body: [
      ul(
        `**Roster:** your agents, their seats, and who can book media.`,
        `**Pipeline:** every deal and listing in the office in one view.`,
        `**Media on the listing:** shoots attach to the listing, booked from Bricks or a phone.`,
      ),
      p(`Find agents under **Office > Agents**, and deals under **Desk > Transactions**. Filter agents by **All**, **Active**, **At cap** and **Invited**.`),
      p(`Every seat also gets e-sign with an audit trail, the listing launch kit and a deal room for each closing.`),
    ],
    related: ['trust-accounting', 'set-up-your-brokerage'],
  },
  {
    slug: 'trust-accounting',
    title: `Trust accounting`,
    summary: `Included for brokerages only. Not in agent or team plans.`,
    body: [
      p(`Trust accounting is part of every brokerage account. Find it under **Accounting** in the **Finance** section of the sidebar. It isn't available on agent or team plans.`),
      p(`For a walkthrough with your broker of record, [talk to us](/contact).`),
    ],
    related: ['brokerage-roster-pipeline', 'brokerage-seat-pricing'],
  },
]

export const BUILDERS: Article[] = [
  {
    slug: 'site-progress-overview',
    title: `Site Progress, explained`,
    summary: `Dated drone visits, maps and reports for anything under construction.`,
    popular: true,
    body: [
      p(`Site Progress puts every drone visit to a site on one dated timeline in your builder account. Reports and investor updates are drafted from it, so what you send matches what was captured.`),
      ul(
        `**Progress visit:** drone photos and video of the site, dated by visit.`,
        `**Mapped capture:** an orthomosaic, a 3D model and a measurable site map.`,
        `**Mapping setup:** ground control for the first mapped flight on a site.`,
      ),
      p(`Book a visit at [brxs.ca/book/site](/book/site), or put a site on a monthly plan. [Create a builder account](${signupUrl('builder')}).`),
    ],
    related: ['site-progress-pricing', 'progress-reports', 'site-pilots-insurance'],
  },
  {
    slug: 'site-progress-pricing',
    title: `Site Progress pricing`,
    summary: `Per visit, or per site each month on a plan.`,
    body: [
      h(`Per visit`),
      table(['Service', 'Price'], PER_VISIT.map((x) => [x.name, `${fmt(x.price)} ${x.unit}`])),
      h(`Monthly plans, per site`),
      table(['Cadence', 'Visual', 'Mapped'], SITE_PLANS[0].rows.map((r, i) => [
        `${r.cadence} (${r.visits} visit${r.visits === 1 ? '' : 's'} a month)`, fmt(r.price), fmt(SITE_PLANS[1].rows[i].price),
      ])),
      p(PLAN_NOTE),
      p(`Plans are paid monthly in advance per site. Cancel from billing, and it takes effect at the end of the paid month. Several sites or something custom? [Tell us about them](/contact).`),
    ],
    related: ['site-progress-overview', 'drone-not-flown'],
  },
  {
    slug: 'progress-reports',
    title: `Progress reports and investor updates`,
    summary: `Reports drafted from dated visits, shared as a PDF or an expiring link.`,
    body: [
      ul(
        `Pick a date range. Reports are drafted from the visits in it.`,
        `Revisions keep a change log.`,
        `Share as a PDF, or as a read-only link that expires. Readers don't need an account.`,
        `Images carry scale bars and pins.`,
        `Schedule, budget and percent complete stay marked as your own figures.`,
      ),
      note(`Reports are visual documentation of site conditions, not a cost, quantity or completion certification. Each report says so.`),
    ],
    related: ['measurements-and-3d', 'site-progress-overview'],
  },
  {
    slug: 'measurements-and-3d',
    title: `Measurements, imports and 3D compare`,
    summary: `Cut, fill and area estimates, imported files, and change between two visits.`,
    body: [
      h(`Measurements`),
      p(`Measure cut, fill, net volume and area on a mapped capture. The method is shown with each number. These are estimates, not a survey. Survey-grade accuracy is quoted separately.`),
      h(`Imports`),
      p(`Bring your own files: GeoTIFF, LAS, LAZ, E57, PLY, OBJ, GLB, photos, video and PDF, up to 5 GB a file. Imported files are marked as imported.`),
      h(`3D compare`),
      p(`Compare two mapped visits on a 0.5 m grid. Changes under 10 cm are left out.`),
      h(`Evidence`),
      p(`Each visit keeps an evidence index with SHA-256 fingerprints, the weather on the day from NASA POWER, and the capture details.`),
    ],
    related: ['progress-reports', 'site-progress-pricing'],
  },
  {
    slug: 'site-pilots-insurance',
    title: `Pilots, insurance and site rules`,
    summary: `Advanced-certified pilots with at least $2M liability insurance, or your higher minimum.`,
    body: [
      ul(
        `Site work goes only to vetted pilots with a Transport Canada Advanced Operations certificate.`,
        `Drone liability insurance of at least $2,000,000 per occurrence, or the higher minimum you set on the order (for example $5,000,000 under CCDC 41).`,
        `On request, Bricks provides the certificate of insurance for the flight before it happens.`,
        `Flights depend on weather, airspace (including NAV CANADA authorization), and site access and safety rules.`,
      ),
      p(`A visit that can't be flown safely is rescheduled within the same billing month where possible.`),
    ],
    related: ['site-progress-overview', 'drone-not-flown'],
  },
]

export const PROPERTY_MANAGERS: Article[] = [
  {
    slug: 'property-manager-services',
    title: `What property managers can book`,
    summary: `Turnover media bundles, condition reports, listing sets and building sets, booked online. Media only: physical turnover cleaning is quoted separately.`,
    popular: true,
    body: [
      table(['Service', 'What you get', 'Price'], ['pm_turnover', 'pm_condition_report', 'pm_listing_set', 'pm_listing_video', 'pm_building_set'].map(oneOff)),
      p(`Prices are CAD, before HST. Book at [brxs.ca/book/property](/book/property?for=property_manager). One or two units? You can also book at [brxs.ca/book](/book) without an account.`),
    ],
    related: ['condition-report-timing', 'rentals-plans', 'unit-status'],
  },
  {
    slug: 'condition-report-timing',
    title: `When to book condition reports and turnovers`,
    summary: `Move-out within two weeks after. Move-in within two weeks before, while the unit is empty.`,
    body: [
      ul(
        `**Move-out report or turnover:** shot within two weeks after the move-out date.`,
        `**Move-in report:** shot within two weeks before the move-in date, while the unit is empty.`,
        `Book at least 1 day ahead, or 2 days if there's a drone. Dates can be up to six months out.`,
        `Add a site phone number or access notes so the photographer can get in.`,
      ),
      p(`Each condition report is dated room by room and compared with the last report for that unit.`),
    ],
    related: ['property-manager-services', 'unit-status'],
  },
  {
    slug: 'rentals-plans',
    title: `Monthly rentals plans`,
    summary: `Rentals 5, 12 or 25 turnover media bundles a month, as credits for any rentals visit.`,
    body: [
      table(['Plan', 'Turnover media bundles a month', 'Price a month'], [['Rentals 5', '5', '$1,325'], ['Rentals 12', '12', '$2,990'], ['Rentals 25', '25', '$5,875']]),
      p(`Each paid month adds that many turnover credits. Spend them on any rentals visit, at any of your buildings: a turnover is 1 credit, a building set 3. Unused credits roll over one month, up to one month's worth.`),
      p(`Nothing is booked without your confirmation. If you cancel, the plan runs to the end of the month you've paid for.`),
      p(`CAD plus tax. Choose a plan in your [property manager account](${signupUrl('property_manager')}).`),
    ],
    related: ['property-manager-services'],
  },
  {
    slug: 'unit-status',
    title: `Units, status and owner reports`,
    summary: `Track every unit's turnover and next step. Print an owner report for any period.`,
    body: [
      p(`A property manager account shows every unit's turnover and next step, compares each condition report room by room with the last one, and prints an owner report for any period.`),
      note(`Your team updates unit status in Bricks. It doesn't sync with a property management system yet.`),
    ],
    related: ['condition-report-timing', 'rentals-plans'],
  },
]

export const COMMERCIAL: Article[] = [
  {
    slug: 'commercial-leasing-sets',
    title: `Leasing sets and aerials`,
    summary: `Photos, a measured floor plan and a Virtual Visit of the space, priced by size.`,
    popular: true,
    body: [
      table(['Service', 'What you get', 'Price'], ['cre_leasing_s', 'cre_leasing_m', 'cre_leasing_l', 'cre_aerial'].map(oneOff)),
      p(`CAD, before HST. Book at [brxs.ca/book/property](/book/property?for=commercial). Add the suite for each space.`),
      p(`Spaces over 20,000 sq ft are quoted. Send a request and we reply with a price.`),
    ],
    related: ['leasing-desk', 'commercial-mapping'],
  },
  {
    slug: 'leasing-desk',
    title: `The leasing desk plan`,
    summary: `Two leasing sets a month and hosted Virtual Visits for every space.`,
    body: [
      p(`The leasing desk plan is $1,590 a month, CAD plus tax: two leasing sets a month for spaces up to 7,500 sq ft, and hosted Virtual Visits for every space.`),
      p(`A commercial account shows which spaces have leasing media and which need it, with a printable leasing package and a CSV listing sheet for each property. [Create a commercial account](${signupUrl('commercial')}).`),
    ],
    related: ['commercial-leasing-sets'],
  },
  {
    slug: 'commercial-mapping',
    title: `Mapping a commercial site`,
    summary: `Measured maps and a 3D model, booked like any other visit.`,
    body: [
      p(`Book a progress visit or mapped capture for a commercial property at [brxs.ca/book/site](/book/site). Prices are the same as [Site Progress](/help/builders/site-progress-pricing).`),
      note(`Maps and models are visual documentation, not a survey. Survey-grade accuracy is quoted separately.`),
    ],
    related: ['site-progress-pricing', 'commercial-leasing-sets'],
  },
]

export const INVESTORS: Article[] = [
  {
    slug: 'acquisition-capture',
    title: `Acquisition captures`,
    summary: `A dated baseline when you buy: interior, exterior, aerial and a Virtual Visit.`,
    popular: true,
    body: [
      table(['Service', 'What you get', 'Price'], ['inv_acquisition', 'inv_acquisition_mapped'].map(oneOff)),
      p(`CAD, before HST. Book online at [brxs.ca/book/property](/book/property?for=investor).`),
    ],
    related: ['portfolio-watch', 'insurance-claim-pack'],
  },
  {
    slug: 'portfolio-watch',
    title: `Portfolio watch`,
    summary: `A dated aerial and roof check, compared with the last visit.`,
    body: [
      p(`Portfolio watch is for properties you hold: a dated aerial and roof check, compared with the last visit.`),
      table(['Cadence', 'Price'], [['Quarterly', '$195 a month per property, billed $585 a quarter'], ['Monthly', '$450 a month per property, one visit a month']]),
      p(`CAD plus tax, set up in your [investor account](${signupUrl('investor')}).`),
      p(`Each paid period adds a visit. Bricks emails a proposed date and you confirm it in one tap, or turn on auto-confirm. Nothing is booked until it's confirmed. If you cancel, the plan runs to the end of the period you've paid for.`),
    ],
    related: ['acquisition-capture', 'insurance-claim-pack'],
  },
  {
    slug: 'insurance-claim-pack',
    title: `Baseline comparison and claim pack`,
    summary: `Compare the baseline with the latest visit, and build a claim pack around a date of loss.`,
    body: [
      p(`Your investor account compares the acquisition baseline with the latest visit. If something happens, it builds an insurance claim pack from the records either side of a date of loss.`),
    ],
    related: ['portfolio-watch', 'acquisition-capture'],
  },
  {
    slug: 'reading-builder-reports',
    title: `Reading reports from a builder`,
    summary: `You don't need an account to read a report a builder shares with you.`,
    body: [
      ul(
        `Builders share each report or update as a link that expires, or as a PDF.`,
        `Schedule, budget and percent complete stay marked as the builder's own figures.`,
        `Reports are visual documentation of site conditions, not a cost, quantity or completion certification.`,
      ),
    ],
    related: ['progress-reports'],
  },
]

export const REITS: Article[] = [
  {
    slug: 'reit-account',
    title: `One account for the portfolio`,
    summary: `Each building keeps its units, leasing media, reports and visits together.`,
    popular: true,
    body: [
      p(`A REIT account files everything by property. Each building keeps its units, leasing media, reports and visits together.`),
      ul(
        `**Units by building:** unit number, phase, monthly rent and size.`,
        `**Leasing status:** mark each unit available, reserved or leased, and filter by status.`,
        `**Phases and amenities:** group units by phase and list the building's amenities.`,
        `**Site Progress on the same project:** visits, reports and investor updates sit beside the units.`,
      ),
      note(`Your team updates unit status in Bricks. It doesn't sync with a property management system yet.`),
      p(`[Create a REIT account](${signupUrl('reit_leasing')}).`),
    ],
    related: ['reit-services-pricing'],
  },
  {
    slug: 'reit-services-pricing',
    title: `What REITs can book, and volume pricing`,
    summary: `Residential, commercial and investor visits. 10% off at 10 properties, 15% at 25.`,
    body: [
      ul(
        `**Residential buildings:** listing sets, condition reports and turnover media bundles by unit. See [Property managers](/help/property-managers/property-manager-services).`,
        `**Office, retail and industrial:** leasing sets priced by size, and aerial sets. See [Commercial](/help/commercial/commercial-leasing-sets).`,
        `**Acquisitions and watch:** a dated baseline when you buy, then a check every quarter. See [Investors](/help/investors/acquisition-capture).`,
        `**Construction:** [Site Progress](/help/builders/site-progress-pricing).`,
      ),
      p(`Every visit is priced and booked online. With 10 or more properties in your account, every visit booked from it is 10% off, and 15% off at 25.`),
    ],
    related: ['reit-account', 'site-progress-pricing'],
  },
]
