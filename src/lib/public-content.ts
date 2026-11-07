/** Shared public definitions: visible answers, structured data and the AI text export. */
export const BRICKS_DEFINITION = 'Bricks is subscription software for Canadian real estate: builders, developers, investors, brokerages, teams and realtors. Listing media, Virtual Visit free-roam 3D and Site Progress — drone mapping, orthomosaics, models, documents, reports and comparisons over time — are services booked inside Bricks. Bricks Group is based in Ontario, Canada.'

export const LISTING_MEDIA_DESCRIPTION = 'Listing media is a service booked inside Bricks: HDR photography, licensed drone, floor plans, video and cinematic reels, with files delivered to the listing.'
export const VIRTUAL_VISIT_DESCRIPTION = 'Virtual Visit is Bricks’ flagship free-roam 3D service, built from a Gaussian splat. It is a paid add-on, not a path-confined virtual tour, and is never included in a media package.'
export const SITE_PROGRESS_DESCRIPTION = 'Site Progress brings dated site visits, drone mapping and orthomosaics, models, documents, reports and comparisons over time into Bricks for builders, developers and investors.'

export const HOME_FAQS = [
  { id: 'what', q: 'What is Bricks?', a: BRICKS_DEFINITION },
  { id: 'who', q: 'Who is it for?', a: 'Builders, developers and investors running projects, and the brokerages, teams and agents selling them.' },
  { id: 'booking', q: 'How do I book media or a site visit?', a: 'From inside Bricks, or online. Enter the address, pick what you need and see the full price before you pay.' },
  { id: 'coverage', q: 'Where do you work?', a: 'Across Canada. Availability and any travel charges are confirmed for the property at booking; inspections are available in Ontario only.' },
  { id: 'virtual-visit', q: 'What is Virtual Visit?', a: VIRTUAL_VISIT_DESCRIPTION },
  { id: 'site-progress', q: 'What is Site Progress?', a: SITE_PROGRESS_DESCRIPTION },
  { id: 'plans', q: 'How much does Bricks software cost?', a: 'Clay is free. Keystone is $49 a month or $490 a year, Marble is $99 a month or $990 a year, and Diamond is $149 a month or $1,490 a year. All prices are CAD, before tax. Services are booked separately.' },
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
