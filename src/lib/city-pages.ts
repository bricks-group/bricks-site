/**
 * City landing pages under /real-estate-photography/{city}. Copy is per city on purpose: coverage status,
 * travel, airspace and building rules differ. Coverage facts mirror coverage.ts and the travel-fees help article.
 */
export type CityPage = {
  slug: 'toronto' | 'ottawa' | 'calgary' | 'vancouver'
  city: string
  province: string
  title: string
  description: string
  h1: string
  sub: string
  /** 'base' = GTA / Golden Horseshoe home base, no travel fee in GTA major markets. 'confirm' = photographer confirmed at booking. */
  coverage: 'base' | 'confirm'
  coverageLine: string
  local: { title: string; detail: string }[]
  localProse: string[]
  faqs: { q: string; a: string }[]
}

const TRAVEL = 'Travel is $0 for properties inside the no-travel-fee area shown on our coverage map. Outside that area, travel is priced from the assigned photographer’s location: the first 25 km are free, then $0.75 per additional km. Your assigned photographer and final travel fee are confirmed before payment.'
const CONFIRM = 'Bricks confirms a local photographer when you book. Checkout stays blocked until a photographer is assigned and the final price is shown.'

export const CITY_PAGES: readonly CityPage[] = [
  {
    slug: 'toronto',
    city: 'Toronto',
    province: 'Ontario',
    title: 'Real Estate Photography Toronto & GTA | Bricks',
    description: 'Real estate photography in Toronto and the GTA: HDR listing photos, licensed drone, floor plans and virtual tours, booked at an exact time with no travel fee in GTA major markets.',
    h1: 'Real estate photography in Toronto.',
    sub: 'Listing photos, licensed drone, floor plans, film and tours across Toronto and the GTA, Bricks’ home base. Pick an exact time and pay one quoted price.',
    coverage: 'base',
    coverageLine: 'Toronto and the GTA are Bricks’ home base. In the GTA’s major markets, including Toronto, Mississauga, Peel, Halton, York and Durham, there is no travel fee.',
    local: [
      { title: 'Condos', detail: 'Book amenity shots around the building’s rules, and tell us about concierge or loading-dock access.' },
      { title: 'Drone near the airports', detail: 'Pearson and Billy Bishop put much of the city in controlled airspace. Pilots get NAV CANADA authorization first.' },
      { title: 'Semis and narrow lots', detail: 'Aerials show yard depth, laneway access and the street that a front elevation can’t.' },
      { title: 'Suburbs and the 905', detail: 'Detached homes in Peel, Halton, York and Durham, with no travel fee in GTA major markets.' },
    ],
    localProse: [
      'Toronto inventory is split between downtown condos and detached and semi-detached homes across the city and the 905. A condo listing usually needs clean interiors, the view and the building’s amenities. A house needs the exterior, the yard and often an aerial.',
      'Many Toronto condo buildings need permission before a drone flies, and some limit when amenities can be photographed. Put the building’s rules in the booking notes and the shoot is planned around them.',
    ],
    faqs: [
      { q: 'Is there a travel fee in Toronto?', a: 'No. There is no travel fee in the GTA’s major markets, including Toronto, Mississauga, Peel, Halton, York and Durham. Elsewhere, the first 25 km from the assigned photographer are free, then $0.75 a km.' },
      { q: 'Can you fly a drone in downtown Toronto?', a: 'Often, with planning. Much of Toronto is controlled airspace around Pearson and Billy Bishop, so the pilot requests NAV CANADA authorization, and condo buildings may need permission. If a flight can’t be done safely or lawfully, it’s skipped and a separately charged drone add-on is refunded.' },
      { q: 'How fast are Toronto listing photos delivered?', a: 'Photos are typically delivered within 24 hours of the shoot, and other media within 24–48 hours. Rush delivery is available for a flat fee.' },
      { q: 'Can I also book staging, cleaning or an inspection in Toronto?', a: 'Yes. Home staging, cleaning and Ontario home inspections are quoted in writing through Bricks. Nothing is booked until you approve the quote.' },
    ],
  },
  {
    slug: 'ottawa',
    city: 'Ottawa',
    province: 'Ontario',
    title: 'Real Estate Photography Ottawa | Bricks',
    description: 'Real estate photography in Ottawa: HDR listing photos, licensed drone, floor plans and virtual tours. A local photographer is confirmed when you book, before you pay.',
    h1: 'Real estate photography in Ottawa.',
    sub: 'Listing photos, licensed drone, floor plans, film and tours for Ottawa homes and condos, with a local photographer confirmed before you pay.',
    coverage: 'confirm',
    coverageLine: `Ottawa is a confirmed-at-booking market. ${CONFIRM}`,
    local: [
      { title: 'Downtown condos', detail: 'Interiors, views and amenities, shot around the building’s rules.' },
      { title: 'Suburban homes', detail: 'Kanata, Orléans, Barrhaven and beyond: exteriors, yards and aerials.' },
      { title: 'Drone near YOW', detail: 'Parts of the city sit in controlled airspace around Ottawa’s airport. Pilots get NAV CANADA authorization first.' },
      { title: 'Ontario home services', detail: 'Ottawa is in Ontario, so home inspections can be quoted here as well as staging and cleaning.' },
    ],
    localProse: [
      'Ottawa listings range from downtown and Centretown condos to family homes in the suburbs. Suburban homes usually benefit most from drone: lot size, the backyard and nearby parks read better from above.',
      'Because Ottawa is outside the GTA base, Bricks confirms a local photographer for your time before you pay, and any travel is on the quote.',
    ],
    faqs: [
      { q: 'Does Bricks cover Ottawa?', a: `Yes, with coverage confirmed at booking. ${CONFIRM}` },
      { q: 'Is there a travel fee in Ottawa?', a: TRAVEL },
      { q: 'Can I book a home inspection in Ottawa?', a: 'Yes. Ottawa is in Ontario, where Bricks arranges pre-listing, pre-purchase, condo and new-build inspections. Every inspection is quoted in writing first.' },
      { q: 'What do Ottawa listing photos cost?', a: 'The same Canada-wide menu as everywhere else, priced by the home’s footprint, plus any travel on your quote.' },
    ],
  },
  {
    slug: 'calgary',
    city: 'Calgary',
    province: 'Alberta',
    title: 'Real Estate Photography Calgary | Bricks',
    description: 'Real estate photography in Calgary: HDR listing photos, licensed drone, floor plans and virtual tours, priced by home size. A local photographer is confirmed before you pay.',
    h1: 'Real estate photography in Calgary.',
    sub: 'HDR photos, optional drone, floor plans, film and tours for Calgary listings. Bricks confirms a local photographer when you book.',
    coverage: 'confirm',
    coverageLine: `Calgary is a confirmed-at-booking market. ${CONFIRM}`,
    local: [
      { title: 'Detached and new communities', detail: 'Exteriors, yards and aerials that show the lot and the community around it.' },
      { title: 'Inner-city infills', detail: 'Narrow lots and tall houses, where an aerial explains the layout.' },
      { title: 'Drone near YYC', detail: 'Calgary International puts large parts of the city in controlled airspace. Pilots get NAV CANADA authorization first.' },
      { title: 'Winter light', detail: 'Short winter days. Book exteriors in the middle of the day, or add twilight for blue hour.' },
    ],
    localProse: [
      'Calgary buyers shop a lot of detached homes in newer communities, where the lot, the garage and the street matter as much as the kitchen. Licensed drone is worth adding on most of them.',
      'Calgary is outside the Ontario base, so a local photographer is confirmed for your time before you pay. Home inspections through Bricks are Ontario only and are not offered in Calgary.',
    ],
    faqs: [
      { q: 'Does Bricks cover Calgary?', a: `Yes, with coverage confirmed at booking. ${CONFIRM}` },
      { q: 'Is there a travel fee in Calgary?', a: TRAVEL },
      { q: 'Are prices different in Calgary?', a: 'No. Bricks uses one Canada-wide menu priced by the home’s footprint. Any travel is added to your quote before you pay. Prices are before tax.' },
      { q: 'Can I book a home inspection in Calgary?', a: 'No. Home inspections through Bricks are available in Ontario only.' },
    ],
  },
  {
    slug: 'vancouver',
    city: 'Vancouver',
    province: 'British Columbia',
    title: 'Real Estate Photography Vancouver | Bricks',
    description: 'Real estate photography in Vancouver: HDR listing photos, licensed drone, floor plans and virtual tours for condos and homes. A local photographer is confirmed before you pay.',
    h1: 'Real estate photography in Vancouver.',
    sub: 'Listing photos, licensed drone, floor plans, film and tours for Vancouver condos and North Shore homes, with a local photographer confirmed before you pay.',
    coverage: 'confirm',
    coverageLine: `Vancouver is a confirmed-at-booking market. ${CONFIRM}`,
    local: [
      { title: 'Strata condos', detail: 'Strata rules often cover amenity photos and drone. Add them to the booking notes.' },
      { title: 'Views', detail: 'Water and mountain views, with real window views and no fake skies by default.' },
      { title: 'Busy airspace', detail: 'YVR and the harbour’s float planes and helicopters mean pilots plan around controlled airspace and get NAV CANADA authorization.' },
      { title: 'North Shore and hillside homes', detail: 'Aerials explain slope, decks and the view a ground photo can’t.' },
    ],
    localProse: [
      'Vancouver listings lean on condos in dense cores and on view homes. For a condo, the view and the light are the listing. Bricks keeps real window views rather than swapping in skies, so photos stay MLS®-safe.',
      'Vancouver is outside the Ontario base, so a local photographer is confirmed for your time before you pay. Home inspections through Bricks are Ontario only and are not offered in British Columbia.',
    ],
    faqs: [
      { q: 'Does Bricks cover Vancouver?', a: `Yes, with coverage confirmed at booking. ${CONFIRM}` },
      { q: 'Is there a travel fee in Vancouver?', a: TRAVEL },
      { q: 'Can you fly a drone over a Vancouver condo?', a: 'Sometimes. Much of Vancouver is busy, controlled airspace, and strata buildings may need permission. If a flight can’t be done safely or lawfully, it’s skipped and a separately charged drone add-on is refunded.' },
      { q: 'Do you replace skies or window views?', a: 'No, not by default. Bricks keeps real window views and doesn’t add fake skies, so photos stay MLS®-safe. Twilight is shot for real at blue hour.' },
    ],
  },
]

export function cityPage(slug: string) {
  return CITY_PAGES.find((c) => c.slug === slug)
}
