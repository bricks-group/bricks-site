import type { Article } from '../types'
import { p, h, ul, ol, note, flow, qa } from '../blocks'
import { VIRTUAL_STAGING_ENABLED } from '@/lib/pricing'
import { isTradeEnabled, tradeListPhrase } from '@/lib/services'
import { DISPUTES, PAYOUT_TIMING } from '@/lib/trade-pricing'

/** Repairs is paused for launch (services.ts `enabled: false`); its articles and mentions come back with the flag. */
const REPAIRS = isTradeEnabled('repairs')
const REPAIR_SLUGS = new Set(['handyman-and-repairs', 'repairs-scope-for-vendors'])
const LIST = tradeListPhrase()
const LIST_CAP = LIST.charAt(0).toUpperCase() + LIST.slice(1)
const CGL_WHO = REPAIRS ? 'repair and inspection vendors' : 'inspection vendors'
/** Drop paused-trade articles and the related links that point at them. */
function onSale(list: Article[]): Article[] {
  if (REPAIRS) return list
  return list.filter((a) => !REPAIR_SLUGS.has(a.slug)).map((a) => ({ ...a, related: a.related?.filter((r) => !REPAIR_SLUGS.has(r)) }))
}

/**
 * Home services sold at set prices (decided 21 Nov 2026). Prices live in trade-pricing.ts.
 * Keep the compliance lines: measurement is never a survey; repairs exclude electrical,
 * plumbing and gas; inspections are Ontario only.
 */
export const HOME_SERVICES: Article[] = onSale([
  {
    slug: 'how-quote-requests-work',
    title: `How booking home services works`,
    summary: `Pick the service at its set price. We email the time and a link to pay.`,
    popular: true,
    howto: true,
    body: [
      p(`${LIST_CAP} each have a set price, like listing photos.`),
      ol(
        `Open [home services](/services). Every service shows its set prices, for example [Cleaning and turnovers](/services#cleaning).`,
        `Pick the service and price in the form, and add the address and your timing.`,
        `We match a vetted vendor near you and email the time.`,
        `Pay the set price from that email. Nothing is charged before then.`,
      ),
      h(`What it costs`),
      p(`The price you pick is the price, before HST. Each vendor has their own calendar, so services booked together can land on different days. They all sit on one timeline for the listing.`),
      h(`Where the results go`),
      p(`Reports, photos, checklists and measurements are kept with the property in your Bricks account. If you don't have an account yet, we send them by email and you can [create one](/help/getting-started) later.`),
      qa(
        [`When am I charged?`, `When you pay the link we email with your time. Not before.`],
        [`Who does the work?`, `Vetted independent vendors that Bricks schedules and checks. $2M commercial general liability insurance is required for ${CGL_WHO}.`],
        [`Can I combine services with a photo visit?`, `Yes. Say so in the details, for example a clean or staging before listing photos, and we schedule them in order.`],
      ),
    ],
    related: ['home-staging', 'cleaning-and-turnovers', 'handyman-and-repairs'],
  },
  {
    slug: 'home-staging',
    title: `Home staging`,
    summary: `Staging vacant or lived-in homes before photos and showings, at set prices.`,
    body: [
      p(`Bricks arranges staging for vacant and occupied homes, model suites and units between tenants. [Book staging](/services#book-staging): $295 for a consult, credited to the install. Occupied homes from $1,795 and vacant homes from $2,495 for 30 days, by size. Each extra 30 days is 25% of the first.`),
      h(`What's included`),
      ul(
        `A consult or a plan from your photos and floor plan.`,
        `For vacant homes: furniture, rugs, art and accessories installed, then removed later.`,
        `For occupied homes: editing and restyling what's there, with accent pieces where they help.`,
        `Install before the photo visit, and removal when the listing closes or the rental period ends.`,
      ),
      h(`What you get back`),
      p(`A set price first, then install photos of each staged room. Install, photo visit and removal dates are kept with the property in your Bricks account.`),
      ...(VIRTUAL_STAGING_ENABLED ? [note(`Virtual staging is different. It adds furniture to photos and is a photo add-on. See [Add-ons](/help/booking/add-ons).`)] : []),
    ],
    related: ['how-quote-requests-work', 'cleaning-and-turnovers'],
  },
  {
    slug: 'cleaning-and-turnovers',
    title: `Cleaning and turnovers`,
    summary: `Pre-listing deep cleans, move-in and move-out cleans and rental turnovers, at set prices.`,
    body: [
      p(`[Book a clean](/services#book-cleaning) before listing photos, between owners or between tenants. $229 for a studio or 1 bed, $279 for 2 beds, $369 for 3 beds or a townhouse, $449 to $649 for a house by size.`),
      h(`Types of clean`),
      ul(
        `**Pre-listing deep clean:** kitchens, baths, floors, glass and fixtures, timed before the photo visit.`,
        `**Move-in or move-out:** an empty unit cleaned top to bottom.`,
        `**Rental turnover:** a unit cleaned between tenants on a checklist you approve.`,
      ),
      h(`What you get back`),
      p(`Room-by-room photos when the clean is done, and the completed checklist, kept with the property in your Bricks account.`),
    ],
    related: ['how-quote-requests-work', 'home-staging', 'handyman-and-repairs'],
  },
  {
    slug: 'home-inspections',
    title: `Home and building inspections`,
    summary: `Pre-listing, pre-purchase, condo and new-build inspections in Ontario, with a written report.`,
    body: [
      p(`[Book an inspection](/services#book-inspections). $349 for a condo, $399 for a townhouse or semi, $449 to $629 for a detached home by size. Ontario only.`),
      h(`Types of inspection`),
      ul(
        `Pre-listing inspections, to find issues before the home goes on the market.`,
        `Pre-purchase inspections for buyers and their agents.`,
        `Condo units and new homes before possession, including deficiency lists.`,
      ),
      h(`What you get back`),
      p(`A written report with photos, organised by system and area, kept with the property in your Bricks account.`),
      h(`Insurance`),
      p(`$2M commercial general liability insurance is required for ${CGL_WHO}. A person at Bricks checks the certificate before an inspector takes jobs.`),
      ...(REPAIRS ? [note(`Need a repair from the report? [Handyman and repairs](/help/home-services/handyman-and-repairs) covers small items such as caulking, trim and doors.`)] : []),
    ],
    related: ['how-quote-requests-work', 'handyman-and-repairs'],
  },
  {
    slug: 'measurement-and-floor-area',
    title: `Measurement and floor area`,
    summary: `Measured interior floor area and floor plans for listings and leasing. Not a legal survey.`,
    body: [
      p(`[Book a measured floor plan](/services#book-measurement) for $99, with interior floor area for each level, basement included.`),
      h(`What's measured`),
      ul(
        `Room-by-room and total interior floor area for a listing or lease.`,
        `A measured floor plan of each level.`,
      ),
      h(`What you get back`),
      p(`The measurements, a floor plan and a short note on the method, including what was and wasn't counted. They're kept with the property in your Bricks account.`),
      h(`Measurement is not a legal survey`),
      p(`A measurement shows the size of the space. It doesn't show property lines, easements or encroachments, and it can't be used where a legal land survey is required. If you need a legal land survey, Bricks will refer you to an Ontario Land Surveyor.`),
    ],
    related: ['how-quote-requests-work', 'home-inspections'],
  },
  {
    slug: 'handyman-and-repairs',
    title: `Handyman and repairs`,
    summary: `Small repairs and deficiency lists at set prices. No electrical, plumbing or gas work.`,
    body: [
      p(`[Book a handyman](/services#book-repairs) for the small jobs that hold up a listing or a turnover. $149 for the first hour with travel, then $47.50 per 30 minutes. $449 for a half day, $849 for a full day. Materials at cost with the receipt.`),
      h(`What's included`),
      ul(
        `Drywall patches and paint touch-ups.`,
        `Caulking and sealing around tubs, showers, sinks, windows and baseboards.`,
        `Doors, handles, hinges and loose trim.`,
        `Furniture assembly and mounting shelves, blinds and mirrors.`,
        `Deficiency lists from an inspection or a walkthrough.`,
      ),
      h(`What's not included`),
      p(`Repairs don't include electrical, plumbing or gas work. Hire a licensed electrician, plumber or gas contractor for those. Larger renovations are out of scope too.`),
      flow(
        ['Book', 'Pick the hour, half day or full day, and send the list.'],
        ['Pay', 'Pay the set price from the email with your time.'],
        ['Extra time', 'You approve any extra 30 minutes in Bricks first.'],
        ['Done', 'Before and after photos for each item, kept with the property.'],
      ),
      p(`$2M commercial general liability insurance is required for repair and inspection vendors.`),
    ],
    related: ['how-quote-requests-work', 'home-inspections', 'cleaning-and-turnovers'],
  },
])

/** Vendor-side articles for the "Working with Bricks" collection (slug stays 'photographers'). */
export const TRADE_VENDORS: Article[] = onSale([
  {
    slug: 'apply-as-a-home-services-vendor',
    title: `Apply as a home services vendor`,
    summary: REPAIRS ? `Stagers, cleaning crews, inspectors, measurers and repair vendors: how to apply.` : `Stagers, cleaning crews, inspectors and measurers: how to apply.`,
    howto: true,
    body: [
      p(`Bricks works with independent vendors in ${REPAIRS ? 'five' : 'four'} trades besides photography: ${LIST}. Start at [brxs.ca/work-with-bricks](/work-with-bricks) and pick your trade.`),
      ol(
        `Pick your trade at [Work with Bricks](/work-with-bricks).`,
        `Add your contact details, business name, home city and travel radius.`,
        `List your tools, equipment and the jobs you do. No photo samples are needed for these trades.`,
        REPAIRS ? `Inspectors and repair vendors: upload a certificate of insurance showing $2M commercial general liability, which is required for repair and inspection vendors.` : `Inspectors: upload a certificate of insurance showing $2M commercial general liability, which is required for inspection vendors.`,
        `Add your HST/GST number, or confirm the small-supplier exemption.`,
        `Read and accept the independent contractor agreement, then submit.`,
      ),
      p(`A person reviews every application, usually within 1–3 business days. Check spam too.`),
      note(`Every job in these trades has a set price and a set cut for you, shown before you accept. ${PAYOUT_TIMING} ${DISPUTES}`),
    ],
    related: ['insurance-for-home-services-vendors', 'how-vendor-work-works'],
  },
  {
    slug: 'insurance-for-home-services-vendors',
    title: `Insurance for home services vendors`,
    summary: REPAIRS ? `$2M commercial general liability insurance is required for repair and inspection vendors. WSIB is optional for repairs.` : `$2M commercial general liability insurance is required for inspection vendors.`,
    body: [
      h(`Who needs proof of insurance`),
      ul(
        `**Inspectors:** a certificate of insurance showing $2M commercial general liability, required for inspection vendors.`,
        ...(REPAIRS ? [`**Handyman and repair vendors:** a certificate of insurance showing $2M commercial general liability, required for repair vendors. A WSIB clearance is optional and helps if you have workers.`] : []),
        `**Stagers, cleaning crews and measurers:** no certificate is required to apply.`,
      ),
      h(`How it's checked`),
      p(`Upload the certificate as a PDF or image in the application. A person at Bricks checks the insurer, the limit and the expiry date before you take jobs. Send a new certificate when your policy renews.`),
      qa(
        [`Can I apply before my certificate arrives?`, `For inspections${REPAIRS ? ' and repairs' : ''}, no. The application needs the certificate and the $2M confirmation.`],
        [`Does Bricks insure my work?`, `No. You're an independent contractor and carry your own insurance.`],
      ),
    ],
    related: ['apply-as-a-home-services-vendor', 'site-jobs-and-insurance'],
  },
  {
    slug: 'repairs-scope-for-vendors',
    title: `Repairs: what's in scope`,
    summary: `Small repairs and deficiency lists only. No electrical, plumbing or gas work.`,
    body: [
      p(`Repair jobs through Bricks are small, listable items: drywall and paint touch-ups, caulking, doors, hardware, trim, assembly and deficiency lists.`),
      h(`Never through Bricks`),
      p(`Electrical, plumbing and gas work are out of scope, even when you hold the licence. Tell the client to hire a licensed electrician, plumber or gas contractor, and flag it in the job notes.`),
      h(`Time and photos`),
      p(`Jobs are booked by the hour, half day or full day at a set price. Extra time goes in 30 minute blocks the client approves in Bricks first. Keep material receipts; they're paid back at cost. Take a before and an after photo of each item.`),
    ],
    related: ['apply-as-a-home-services-vendor', 'insurance-for-home-services-vendors'],
  },
  {
    slug: 'measurement-and-inspection-standards-for-vendors',
    title: `Measurement and inspection standards`,
    summary: `What measurers and inspectors deliver, and the words to avoid.`,
    body: [
      h(`Measurers`),
      p(`Deliver measured interior floor area and a floor plan, with a short note on the method and what was counted. Never call a measurement a survey. If the client needs a legal land survey, Bricks refers them to an Ontario Land Surveyor.`),
      h(`Inspectors`),
      p(`Inspections through Bricks are in Ontario only. Deliver a written report with photos, organised by system and area. Keep your certificate of insurance current.`),
    ],
    related: ['apply-as-a-home-services-vendor', 'insurance-for-home-services-vendors'],
  },
])
