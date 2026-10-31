import type { Article } from '../types'
import { p, h, ul, ol, note, flow, qa } from '../blocks'
import { VIRTUAL_STAGING_ENABLED } from '@/lib/pricing'

/**
 * Home services sold as quote requests (phase 1). No prices: every job is quoted by a person.
 * Keep the compliance lines: measurement is never a survey; repairs exclude electrical,
 * plumbing and gas; inspections are Ontario only.
 */
export const HOME_SERVICES: Article[] = [
  {
    slug: 'how-quote-requests-work',
    title: `How quote requests work`,
    summary: `Send a request, get a written quote, approve it. Nothing is booked or charged before you say yes.`,
    popular: true,
    howto: true,
    body: [
      p(`Staging, cleaning, inspections, measurement and repairs are booked through a quote request, not online checkout. Every property is different, so a person at Bricks reviews each request and quotes it in writing.`),
      ol(
        `Open [home services](/services). Every service has its own section, for example [Cleaning and turnovers](/services#cleaning), and one quote form at the bottom of the page covers all of them.`,
        `Fill in the form: who it's for, the address, the type of job and any details such as rooms, access or dates.`,
        `Send it. We email you a copy right away.`,
        `A person at Bricks reviews it and may reply with a few questions.`,
        `You get a written quote with the scope, timing and price.`,
        `Approve the quote by replying. Bricks then schedules the vendor.`,
      ),
      h(`What it costs`),
      p(`There are no public prices for these services yet. The written quote is the price. Nothing is booked or charged until you approve it.`),
      h(`Where the results go`),
      p(`Reports, photos, checklists and measurements are kept with the property in your Bricks account. If you don't have an account yet, we send them by email and you can [create one](/help/getting-started) later.`),
      qa(
        [`Is a quote request a booking?`, `No. It's a request for a price. Nothing is booked until you approve the written quote.`],
        [`Who does the work?`, `Vetted independent vendors that Bricks schedules and checks. $2M commercial general liability insurance is required for repair and inspection vendors.`],
        [`Can I combine services with a photo visit?`, `Yes. Say so in the details, for example a clean or staging before listing photos, and we schedule them in order.`],
      ),
    ],
    related: ['home-staging', 'cleaning-and-turnovers', 'handyman-and-repairs'],
  },
  {
    slug: 'home-staging',
    title: `Home staging`,
    summary: `Staging vacant or lived-in homes before photos and showings, by quote.`,
    body: [
      p(`Bricks arranges staging for vacant and occupied homes, model suites and units between tenants. [Request a quote](/services#quote-staging) with the address and the rooms you want staged.`),
      h(`What's included`),
      ul(
        `A consult or a plan from your photos and floor plan.`,
        `For vacant homes: furniture, rugs, art and accessories installed, then removed later.`,
        `For occupied homes: editing and restyling what's there, with accent pieces where they help.`,
        `Install before the photo visit, and removal when the listing closes or the rental period ends.`,
      ),
      h(`What you get back`),
      p(`A written quote first, then install photos of each staged room. Install, photo visit and removal dates are kept with the property in your Bricks account.`),
      ...(VIRTUAL_STAGING_ENABLED ? [note(`Virtual staging is different. It adds furniture to photos and is a photo add-on. See [Add-ons](/help/booking/add-ons).`)] : []),
    ],
    related: ['how-quote-requests-work', 'cleaning-and-turnovers'],
  },
  {
    slug: 'cleaning-and-turnovers',
    title: `Cleaning and turnovers`,
    summary: `Pre-listing deep cleans, move-in and move-out cleans, rental turnovers and post-construction cleans.`,
    body: [
      p(`[Request a quote](/services#quote-cleaning) for a clean before listing photos, between owners or between tenants.`),
      h(`Types of clean`),
      ul(
        `**Pre-listing deep clean:** kitchens, baths, floors, glass and fixtures, timed before the photo visit.`,
        `**Move-in or move-out:** an empty unit cleaned top to bottom.`,
        `**Rental turnover:** a unit cleaned between tenants on a checklist you approve.`,
        `**Post-construction:** dust and debris after a renovation or new build. Always quoted after a look at the site.`,
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
      p(`[Request a quote](/services#quote-inspections) for an inspection of a home, condo or building. Inspections are available in Ontario only.`),
      h(`Types of inspection`),
      ul(
        `Pre-listing inspections, to find issues before the home goes on the market.`,
        `Pre-purchase inspections for buyers and their agents.`,
        `Condo units and new homes before possession, including deficiency lists.`,
        `Building condition assessments for commercial and multi-unit buildings, always quoted after a review of the building.`,
      ),
      h(`What you get back`),
      p(`A written report with photos, organised by system and area, kept with the property in your Bricks account.`),
      h(`Insurance`),
      p(`$2M commercial general liability insurance is required for repair and inspection vendors. A person at Bricks checks the certificate before an inspector takes jobs.`),
      note(`Need a repair from the report? [Handyman and repairs](/help/home-services/handyman-and-repairs) covers small items such as caulking, trim and doors.`),
    ],
    related: ['how-quote-requests-work', 'handyman-and-repairs'],
  },
  {
    slug: 'measurement-and-floor-area',
    title: `Measurement and floor area`,
    summary: `Measured interior floor area and floor plans for listings and leasing. Not a legal survey.`,
    body: [
      p(`[Request a quote](/services#quote-measurement) for measured interior floor area and a floor plan of each level.`),
      h(`What's measured`),
      ul(
        `Room-by-room and total interior floor area for a listing or lease.`,
        `A measured floor plan of each level.`,
        `Commercial rentable area for offices, retail and industrial space, always quoted after a look at the drawings.`,
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
    summary: `Small repairs and deficiency lists, with a written estimate first. No electrical, plumbing or gas work.`,
    body: [
      p(`[Request a quote](/services#quote-repairs) for the small jobs that hold up a listing or a turnover.`),
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
        ['Request', 'Send the list and photos if you have them.'],
        ['Estimate', 'A written estimate for each item, with time and materials.'],
        ['Approve', 'Nothing starts until you approve it.'],
        ['Done', 'Before and after photos for each item, kept with the property.'],
      ),
      p(`$2M commercial general liability insurance is required for repair and inspection vendors.`),
    ],
    related: ['how-quote-requests-work', 'home-inspections', 'cleaning-and-turnovers'],
  },
]

/** Vendor-side articles for the "Working with Bricks" collection (slug stays 'photographers'). */
export const TRADE_VENDORS: Article[] = [
  {
    slug: 'apply-as-a-home-services-vendor',
    title: `Apply as a home services vendor`,
    summary: `Stagers, cleaning crews, inspectors, measurers and repair vendors: how to apply.`,
    howto: true,
    body: [
      p(`Bricks works with independent vendors in five trades besides photography: staging, cleaning, inspections, measurement and repairs. Start at [brxs.ca/work-with-bricks](/work-with-bricks) and pick your trade.`),
      ol(
        `Pick your trade at [Work with Bricks](/work-with-bricks).`,
        `Add your contact details, business name, home city and travel radius.`,
        `List your tools, equipment and the jobs you do. No photo samples are needed for these trades.`,
        `Inspectors and repair vendors: upload a certificate of insurance showing $2M commercial general liability, which is required for repair and inspection vendors.`,
        `Add your HST/GST number, or confirm the small-supplier exemption.`,
        `Read and accept the independent contractor agreement, then submit.`,
      ),
      p(`A person reviews every application, usually within 1–3 business days. Check spam too.`),
      note(`Jobs in these trades are quoted to the client first. Bricks contacts you with the scope before any job is confirmed.`),
    ],
    related: ['insurance-for-home-services-vendors', 'how-vendor-work-works'],
  },
  {
    slug: 'insurance-for-home-services-vendors',
    title: `Insurance for home services vendors`,
    summary: `$2M commercial general liability insurance is required for repair and inspection vendors. WSIB is optional for repairs.`,
    body: [
      h(`Who needs proof of insurance`),
      ul(
        `**Inspectors:** a certificate of insurance showing $2M commercial general liability, required for inspection vendors.`,
        `**Handyman and repair vendors:** a certificate of insurance showing $2M commercial general liability, required for repair vendors. A WSIB clearance is optional and helps if you have workers.`,
        `**Stagers, cleaning crews and measurers:** no certificate is required to apply.`,
      ),
      h(`How it's checked`),
      p(`Upload the certificate as a PDF or image in the application. A person at Bricks checks the insurer, the limit and the expiry date before you take jobs. Send a new certificate when your policy renews.`),
      qa(
        [`Can I apply before my certificate arrives?`, `For inspections and repairs, no. The application needs the certificate and the $2M confirmation.`],
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
      h(`Estimates and photos`),
      p(`Write the estimate item by item before work starts. Take a before and an after photo of each item. The client sees them with the property in Bricks.`),
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
]
