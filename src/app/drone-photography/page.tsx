import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Landing from '@/components/seo/Landing'
import { DRONE_RATE, DRONE_RANGE, CORE_FROM, bandCells, FOOTPRINT_BANDS } from '@/lib/pricing'
import { WORK_PHOTOS } from '@/lib/brand'
import { focusedServiceSchema } from '@/lib/schema'
import { bandRows } from '@/lib/landing'
import { OG_IMAGE } from '@/lib/og'

const URL = 'https://www.brxs.ca/drone-photography'
const TITLE = 'Drone Photography for Real Estate in Canada | Bricks'
const DESC = `Licensed real estate drone photography across Canada, flown by pilots with a Transport Canada Advanced certificate. Aerials ${DRONE_RANGE} by home size, or in Essentials from $${CORE_FROM}.`

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/drone-photography' },
  openGraph: { title: TITLE, description: DESC, url: URL, images: [OG_IMAGE] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE] },
}

const AERIALS = WORK_PHOTOS.filter((p) => p.alt.startsWith('Drone view'))

const FAQS = [
  { q: 'Who flies Bricks drone shoots?', a: 'Pilots who hold a Transport Canada Advanced certificate. They fly in visual line of sight and below 122 m, and get NAV CANADA authorization when a property sits in controlled airspace.' },
  { q: 'What does drone photography cost?', a: `Licensed drone is ${bandCells(DRONE_RATE).join(' / ')} CAD before HST, by footprint (${FOOTPRINT_BANDS} sq ft). It is included in Essentials, Story, Showcase and Full suite.` },
  { q: 'What happens if the drone can’t fly?', a: 'If Transport Canada rules, NAV CANADA airspace, weather or the site make a flight unsafe or unlawful, the pilot skips it. The rest of the shoot is still delivered, and Bricks refunds the drone part, its add-on price plus the tax you paid on it, including when the drone is part of a package.' },
  { q: 'Can you fly over a condo building?', a: 'Many condo buildings need the board’s or property manager’s permission first. Add the building’s rules to the booking notes and Bricks plans the flight around them.' },
]

export default function DronePhotographyPage() {
  return (
    <Landing
      schemas={[focusedServiceSchema({ url: URL, id: '/drone-photography#service', name: 'Real estate drone photography', serviceType: 'Aerial real estate photography', description: 'Licensed aerial photos of homes, lots and commercial properties for listings, flown by Transport Canada Advanced certified pilots and delivered with the listing in Bricks.', offers: ['drone', 'essentials'] })]}
      h1="Drone photography for real estate."
      sub="Aerial photos that show the lot, the street and what’s nearby, flown by Advanced-certified pilots and delivered with the rest of the listing media."
      primary={{ href: '/book', label: 'Book a drone shoot' }}
      secondary={{ href: '/pricing', label: 'See pricing' }}
      sections={[
        {
          title: 'What aerials show that the ground can’t.',
          rows: [
            { title: 'The whole lot', detail: 'Lot lines, yard depth, pools, garages and outbuildings in one frame.' },
            { title: 'The setting', detail: 'Parks, water, schools and transit, shot from a height buyers can read.' },
            { title: 'The roof and exterior', detail: 'A clean overhead view of the house and its condition.' },
            { title: 'Rural and acreage', detail: 'Land, tree lines and access roads that ground photos miss.' },
          ],
        },
        {
          title: 'Flown by the rules.',
          lede: 'Commercial drone work in Canada is regulated by Transport Canada. Every Bricks drone pilot holds an Advanced certificate, and every flight is planned for the airspace.',
          body: (
            <>
              <p>Pilots fly in visual line of sight and below 122 m. Near airports and in controlled airspace, which covers large parts of Toronto, Vancouver, Calgary and Ottawa, the pilot requests NAV CANADA authorization before the shoot.</p>
              <p>If a flight can’t be done safely or lawfully, it’s skipped, the ground shoot goes ahead, and Bricks refunds the drone part, its add-on price plus the tax you paid on it, even when the drone is part of a package. Read <Link href="/blog/drone-photography-rules-ontario">drone photography rules for real estate in Ontario</Link>, or <Link href="/blog/drone-licence-canada">how to get a drone licence in Canada</Link> if you fly yourself.</p>
            </>
          ),
        },
        {
          title: 'Priced by home size.',
          link: { href: '/pricing', label: 'Full pricing' },
          rows: bandRows(DRONE_RATE),
          note: <>Drone is part of Essentials (HDR photos, drone and a floor plan) from ${CORE_FROM}. CAD, before travel and HST.</>,
        },
        {
          title: 'Recent aerial work.',
          body: (
            <div className="landing-grid">
              {AERIALS.map((p) => <Image key={p.src} src={p.src} alt={p.alt} width={1200} height={900} quality={90} sizes="(max-width:900px) 100vw, 33vw" loading="lazy" />)}
            </div>
          ),
          note: <><Link href="/gallery">See more work</Link> · Builders tracking a site over time should look at <Link href="/drone-mapping">drone mapping</Link>.</>,
        },
      ]}
      faqTitle="Drone photography, answered."
      faqs={FAQS}
      close={{ title: 'Add aerials to your next listing.', href: '/book', label: 'Book a drone shoot' }}
    />
  )
}
