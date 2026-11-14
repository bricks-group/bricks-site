import type { Article } from '../types'
import { p, h, ul, ol, note, table, qa } from '../blocks'
import {
  PHOTO_RATE, DRONE_RATE, REEL_RATE, TOUR_RATE, TWILIGHT_RATE, VISIT_RATE, RUSH_FLAT, STAGING_PER_IMAGE, VIRTUAL_STAGING_ENABLED,
  FLOOR_PLAN_ONLY_RATE, bandCells, PHOTO_ONLY_FROM, CORE_FROM, STORY_FROM, SHOWCASE_FROM, FULL_FROM,
} from '@/lib/pricing'

const row = (name: string, rate: readonly number[]) => [name, ...bandCells(rate)]

export const BOOKING: Article[] = [
  {
    slug: 'book-a-listing-shoot',
    title: `Book a listing shoot`,
    summary: `Four steps at brxs.ca/book: what to shoot, the package, an exact time, then pay.`,
    popular: true,
    howto: true,
    body: [
      p(`You can book at [brxs.ca/book](/book) with or without an account. It takes a few minutes.`),
      ol(
        `**What do you need shot?** Start typing the address and pick it from the list. Add the property type and the square footage if you know it. Square footage sets the footprint band, which sets the price.`,
        `**Pick a package, then add extras.** Bricks suggests a package for the listing. Choose any other, or build your own à la carte.`,
        `**Pick a date and an exact time.** The clock times you see are live from photographers' calendars. Bricks assigns the photographer.`,
        `**Review and pay.** The photographer and travel are final before you pay. You pay the full amount, including HST, through Stripe to lock the time.`,
      ),
      p(`Your booked time is held and sent to the photographer, and a confirmation email is on its way. Add anything the photographer should know, like lockbox codes, occupied rooms, pets or condo rules, in the booking notes.`),
      note(`Have a launch code? Enter it at checkout.`),
    ],
    related: ['packages-explained', 'how-pricing-works', 'choose-a-shoot-time', 'pay-for-a-booking'],
  },
  {
    slug: 'packages-explained',
    title: `What's in each package`,
    summary: `Photos only, Essentials, Story, Showcase, Full suite and Floor plan only, side by side.`,
    popular: true,
    body: [
      p(`Every package is priced by the home's footprint band. The prices below are the Small band, before HST and travel.`),
      table(['Package', 'What you get', 'From'], [
        [`Photos only`, `HDR photos, interiors and exteriors. No drone and no floor plan.`, `$${PHOTO_ONLY_FROM}`],
        [`Essentials`, `HDR photos, licensed drone and a floor plan in one shoot.`, `$${CORE_FROM}`],
        [`Story`, `Essentials plus a cinematic reel, 30–45 seconds.`, `$${STORY_FROM}`],
        [`Showcase`, `Story plus a virtual tour.`, `$${SHOWCASE_FROM}`],
        [`Full suite`, `Showcase plus twilight exteriors.`, `$${FULL_FROM}`],
        [`Floor plan only`, `A floor plan. No photos or drone.`, `$${FLOOR_PLAN_ONLY_RATE} flat`],
      ]),
      p(VIRTUAL_STAGING_ENABLED
        ? `Virtual Visit and virtual staging are never part of a package. Add them on their own. See [Add-ons](/help/booking/add-ons).`
        : `Virtual Visit is never part of a package. Add it on its own. See [Add-ons](/help/booking/add-ons).`),
      p(`Full rates for every band are on [Pricing](/pricing).`),
    ],
    related: ['how-pricing-works', 'add-ons', 'virtual-tour-or-virtual-visit'],
  },
  {
    slug: 'how-pricing-works',
    title: `How media pricing works`,
    summary: `Prices follow four footprint bands, with a minimum band for some property types.`,
    body: [
      p(`Media is priced by the size of the home, in four bands:`),
      table(['Band', 'Finished area'], [
        ['Small', 'Up to 1,200 sq ft'], ['Mid', '1,200 to 2,500 sq ft'], ['Large', '2,500 to 4,000 sq ft'], ['XL', '4,000 sq ft and up'],
      ]),
      h(`Property type sets a minimum band`),
      p(`Some property types start at a higher band, whatever the square footage. Bricks uses whichever is higher.`),
      table(['Property type', 'Starts at'], [
        ['Condo', 'Small'], ['Semi or townhouse', 'Mid'], ['Detached', 'Mid'], ['Multiplex', 'Large'], ['Commercial', 'Large'], ['Estate', 'XL'],
      ]),
      h(`Rates by band`),
      table(['Service', 'Small', 'Mid', 'Large', 'XL'], [
        row('HDR photography', PHOTO_RATE), row('Licensed drone', DRONE_RATE), row('Cinematic reel', REEL_RATE),
        row('Virtual tour', TOUR_RATE), row('Virtual Visit', VISIT_RATE), row('Twilight exterior', TWILIGHT_RATE),
      ]),
      p(`Flat prices: floor plan only $${FLOOR_PLAN_ONLY_RATE}, ${VIRTUAL_STAGING_ENABLED ? `virtual staging $${STAGING_PER_IMAGE} a photo, ` : ''}rush delivery +$${RUSH_FLAT}. All prices are CAD, before HST. Travel may apply. See [Travel fees](/help/booking/travel-fees).`),
      note(`If you don't enter square footage, Bricks estimates it from the building footprint and tells you so. Confirm the number for an exact quote. The final invoice reflects the actual scope.`),
    ],
    related: ['packages-explained', 'travel-fees', 'add-ons'],
  },
  {
    slug: 'add-ons',
    title: `Add-ons you can book`,
    summary: VIRTUAL_STAGING_ENABLED ? `Drone, reel, virtual tour, Virtual Visit, twilight, staging and rush delivery.` : `Drone, reel, virtual tour, Virtual Visit, twilight and rush delivery.`,
    body: [
      p(`Add extras to any package in step 2 of booking, or build the shoot à la carte.`),
      table(['Add-on', 'What it is', 'Price'], [
        [`Licensed drone`, `Aerial photos by a Transport Canada certified pilot.`, bandCells(DRONE_RATE).join(' / ')],
        [`Cinematic reel`, `A 30–45 second film, edited by Bricks.`, bandCells(REEL_RATE).join(' / ')],
        [`Virtual tour`, `A path walkthrough. Viewers follow a set path.`, bandCells(TOUR_RATE).join(' / ')],
        [`Virtual Visit`, `Free-roam 3D. Viewers move anywhere in the home.`, bandCells(VISIT_RATE).join(' / ')],
        [`Twilight exterior`, `Exteriors shot for real at blue hour, windows lit.`, bandCells(TWILIGHT_RATE).join(' / ')],
        ...(VIRTUAL_STAGING_ENABLED ? [[`Virtual staging`, `Furniture added to photos of vacant rooms, marked as virtually staged.`, `$${STAGING_PER_IMAGE} a photo`]] : []),
        [`Rush delivery`, `Faster than standard delivery.`, `+$${RUSH_FLAT} flat`],
      ]),
      p(`Banded prices are Small / Mid / Large / XL, CAD before HST.`),
    ],
    related: ['packages-explained', 'virtual-tour-or-virtual-visit', 'twilight-photos'],
  },
  {
    slug: 'virtual-tour-or-virtual-visit',
    title: `Virtual tour or Virtual Visit?`,
    summary: `A virtual tour follows a set path. A Virtual Visit is free-roam 3D.`,
    body: [
      table(['', 'Virtual tour', 'Virtual Visit'], [
        ['How viewers move', 'Along a set path through the home', 'Anywhere, in free-roam 3D'],
        ['In a package', 'Included in Showcase and Full suite', 'Never. Always an add-on'],
        ['Price', bandCells(TOUR_RATE).join(' / '), bandCells(VISIT_RATE).join(' / ')],
      ]),
      p(`Pick a virtual tour when you want a guided walk through the home. Pick a Virtual Visit when you want buyers or renters to explore on their own before a showing.`),
    ],
    related: ['add-ons', 'packages-explained'],
  },
  {
    slug: 'twilight-photos',
    title: `Twilight photos`,
    summary: `Twilight is shot for real at blue hour. Bricks doesn't fake skies by default.`,
    body: [
      p(`Twilight exteriors are shot at blue hour, with the windows lit and colour still in the sky. Because it depends on the time of sunset, twilight is shot as its own part of the visit.`),
      p(`Bricks keeps real window views and doesn't add fake skies by default, so photos stay MLS®-safe.`),
      p(`Twilight is included in Full suite, or add it to any shoot for ${bandCells(TWILIGHT_RATE).join(' / ')} by band.`),
    ],
    related: ['add-ons', 'what-you-get'],
  },
  {
    slug: 'travel-fees',
    title: `Travel fees`,
    summary: `$0 inside the no-travel-fee area on our coverage map. Outside it, the first 25 km from the assigned photographer are free, then $0.75 a km.`,
    body: [
      p(`Travel is $0 for properties inside the no-travel-fee area shown on our coverage map. Outside that area, travel is priced from the assigned photographer's location: the first 25 km are free, then $0.75 per additional km. Your assigned photographer and final travel fee are confirmed before payment.`),
      p(`Bricks assigns the photographer before you pay, so travel is on your quote and final before checkout. Bricks serves Canada. If you're unsure about your area, [ask us](/contact) and we'll confirm coverage and quote any travel.`),
    ],
    related: ['how-pricing-works', 'choose-a-shoot-time'],
  },
  {
    slug: 'choose-a-shoot-time',
    title: `Choose a shoot time`,
    summary: `Pick an exact clock time. Times come live from photographers' calendars.`,
    body: [
      p(`In the **When** step, pick a date to see clock times. The times shown are live from photographer calendars, so a time you can pick is a time a photographer can make.`),
      ul(
        `If a day shows no times, there are no shoot hours left that day. Pick another date.`,
        `Bricks assigns the photographer. Checkout stays blocked until a photographer is assigned and the final fee is shown.`,
        `Twilight times depend on sunset.`,
      ),
      p(`After you pay, the date and time are held and sent to the photographer.`),
    ],
    related: ['book-a-listing-shoot', 'no-times-available', 'reschedule-a-shoot'],
  },
  {
    slug: 'pay-for-a-booking',
    title: `Pay for a booking`,
    summary: `Pay in full at checkout through Stripe, by card, Apple Pay or Google Pay.`,
    body: [
      p(`You pay the quoted amount in full, including HST, at checkout to lock the time. Payment goes through Stripe, and Bricks never stores full card numbers. The quote at checkout is the contract price for the package and add-ons you picked.`),
      h(`Ways to pay`),
      ul(
        `Credit and debit cards`,
        `Apple Pay in Safari and on iOS`,
        `Google Pay in Chrome and on Android`,
      ),
      p(`Bricks doesn't take PayPal, Klarna, Afterpay or Interac.`),
      p(`Prices are in Canadian dollars. Have a launch code? Enter it at checkout.`),
    ],
    related: ['book-a-listing-shoot', 'payment-failed', 'invoices-and-receipts'],
  },
  {
    slug: 'prepare-for-a-shoot',
    title: `Get the home ready for a shoot`,
    summary: `A short checklist for agents and sellers before the photographer arrives.`,
    body: [
      p(`The photographer tidies each room as they go, but they won't move heavy furniture or handle valuables. A little prep makes the biggest difference.`),
      ul(
        `Clear counters down to one or two objects.`,
        `Make beds, put toilet seats down and hide cords.`,
        `Put bins, shoes and pet bowls away.`,
        `Turn on the lights and open the blinds.`,
        `Move cars off the driveway, and arrange for pets to be out.`,
        `Tell us about access: lockbox, concierge, parking and any condo or building rules for amenities or drone.`,
      ),
      p(`You're responsible for arranging access and occupant consent. Bricks doesn't photograph occupants or children. Note occupied rooms, children or access limits in the booking notes.`),
    ],
    related: ['book-a-listing-shoot', 'no-access-or-no-show'],
  },
  {
    slug: 'drone-rules',
    title: `Drone shoots and airspace`,
    summary: `Every drone pilot is Transport Canada certified. Some sites can't be flown.`,
    body: [
      p(`Drone is flown by pilots who hold a Transport Canada drone pilot certificate. They stay in visual line of sight and below 122 m.`),
      p(`Drone may be skipped if Transport Canada rules, NAV CANADA airspace, weather or the site make it unsafe or unlawful. When that happens, the rest of the ground package is still delivered, and Bricks refunds the drone add-on if it was charged separately and couldn't be shot.`),
      p(`Condo buildings and some sites need permission to fly. Tell us in the booking notes if the building has rules.`),
    ],
    related: ['drone-not-flown', 'add-ons'],
  },
  {
    slug: 'what-you-get',
    title: `Delivery: what you get and when`,
    summary: `Photos usually within 24 hours, other media within 24–48 hours.`,
    popular: true,
    body: [
      p(`Photos are typically delivered within 24 hours of the shoot, and other media within 24–48 hours. These are targets, not guarantees. Weather, airspace, site access, equipment or processing can cause delays.`),
      h(`What arrives`),
      ul(
        `A media link with downloads sized for MLS®, web and print.`,
        `A property website for the listing.`,
        `If you have a Bricks account, the media also lands on the listing in the app.`,
      ),
      p(`Every photo and film is edited by Bricks in-house. Photos are MLS®-safe: real window views, and no fake skies by default.`),
      note(`Download and keep copies. Bricks isn't a long-term archive once files are delivered.`),
    ],
    related: ['using-your-media', 'media-not-arrived', 'twilight-photos'],
  },
  {
    slug: 'using-your-media',
    title: `How you can use your media`,
    summary: `A perpetual licence to market that property, once the booking is paid.`,
    body: [
      p(`Bricks owns copyright in the deliverables. When your booking is paid in full, you get a perpetual, non-exclusive licence to use them to market that property.`),
      h(`You can`),
      ul(`Use them on MLS®, the web, social and print.`, `Use them in brokerage materials.`, `Share them with the seller for that listing.`),
      h(`You can't`),
      ul(`Sell the files as stock.`, `Use them to market a different property.`),
      h(`Keeping a property out of our portfolio`),
      p(`Bricks and the photographer may use the media in portfolio and Bricks marketing. To keep a property unpublished by us, email [help@brxs.ca](mailto:help@brxs.ca) **before the shoot**.`),
    ],
    related: ['what-you-get'],
  },
  {
    slug: 'booking-faq',
    title: `Booking questions, answered`,
    summary: `Quick answers to the questions people ask most before they book.`,
    body: [
      qa(
        [`Are the photos MLS®-safe?`, `Yes. Bricks keeps real window views and doesn't add fake skies by default. Twilight is shot for real at blue hour.`],
        [`What's in Essentials?`, `HDR photos, licensed drone and a floor plan in one shoot.`],
        [`Can I pay with Apple Pay or Google Pay?`, `Yes, plus cards. Apple Pay works in Safari and on iOS, Google Pay in Chrome and on Android. Bricks doesn't take PayPal, Klarna, Afterpay or Interac.`],
        [`How fast is delivery?`, `Photos typically within 24 hours of the shoot, other media within 24–48 hours.`],
        [`Can I reschedule?`, `Yes. 24 hours or more before the shoot window is free. Inside 24 hours we'll try; if we can't, the cancellation rules apply.`],
        [`What if I need to cancel?`, `24 hours or more before the shoot window: full refund. Inside 24 hours, or no-show or no access: no refund. No callout fee.`],
        [`Do I need an account?`, `No. An account is optional, and it puts the media on your listing in Bricks.`],
        [`Is Virtual Visit in a package?`, `Not in residential listing-media packages: it is a separately priced add-on to Photos only, Essentials, Story, Showcase and Full suite. Commercial leasing sets and acquisition captures include it as specified in their scope.`],
      ),
    ],
    related: ['book-a-listing-shoot', 'reschedule-a-shoot', 'cancel-a-shoot'],
  },
]
