import type { Metadata } from 'next'
import Link from 'next/link'
import { AREA_SERVED_SCHEMA, COVERAGE_LINE, KNOWS_ABOUT, TOUR_NAME, VISIT_NAME } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Service Areas | Listing Photos & Real Estate Photography Canada — Bricks',
  description:
    'Bricks delivers listing photos and real estate photography across Canada. HDR, licensed drone, floor plan included — confirm coverage and travel at booking. Not limited to one metro.',
  alternates: { canonical: '/service-areas' },
  openGraph: {
    title: 'Service Areas | Listing Photos Canada — Bricks',
    description: `Bricks listing media across Canada. ${COVERAGE_LINE} HDR, drone, floor plans, optional virtual tour.`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Service Areas | Listing Photos Canada — Bricks',
    description: 'Listing photos and real estate photography for Canadian agents — Canada-wide coverage confirmed at booking.',
  },
}

type Area = {
  name: string
  region: string
  headline: string
  desc: string
  search: string
}

const areas: Area[] = [
  {
    name: 'Toronto',
    region: 'Ontario',
    headline: 'Listing photos Toronto agents actually use on MLS',
    desc: 'Condos, semis, and detached across the city — including Etobicoke and North York. Controlled airspace near Pearson and Billy Bishop is why licensed Advanced RPAS drone work matters on Toronto listing media, not phone aerials.',
    search: 'listing photos Toronto · real estate photography Toronto',
  },
  {
    name: 'Mississauga',
    region: 'Ontario · base',
    headline: 'Real estate photography Mississauga — our travel origin',
    desc: 'Base for travel quotes. Lakefront condos to large north-end detached get the same HDR + drone + floor plan core, with the first 25 km of travel free on the quote.',
    search: 'real estate photographer Mississauga · MLS photos Mississauga',
  },
  {
    name: 'Hamilton',
    region: 'Ontario',
    headline: 'Listing photos Hamilton and the mountain',
    desc: 'Character homes and new inventory west of Toronto. Travel is quoted from Mississauga before you confirm — no surprise kilometre fees after the shoot.',
    search: 'listing photos Hamilton · real estate photography Hamilton',
  },
  {
    name: 'Durham',
    region: 'Ontario',
    headline: 'Listing media across Durham Region',
    desc: 'Ajax through Oshawa and north — family detached stock that benefits from drone context shots and a clear floor plan for buyers comparing layouts online.',
    search: 'listing photos Durham · real estate photographer Durham Region',
  },
  {
    name: 'York',
    region: 'Ontario',
    headline: 'Real estate photography in York Region',
    desc: 'Vaughan, Richmond Hill, Markham, and Newmarket corridors. Higher-value detached often add a path-confined virtual tour or cinematic reel on top of the core set.',
    search: 'listing photos York Region · real estate photography Vaughan',
  },
  {
    name: 'Niagara',
    region: 'Ontario',
    headline: 'Listing photos toward the Niagara peninsula',
    desc: 'Coverage toward the peninsula when travel pencils. Ask first — we confirm drone feasibility and quote travel before you lock the slot.',
    search: 'listing photos Niagara · real estate photography St. Catharines',
  },
  {
    name: 'Brampton',
    region: 'Ontario',
    headline: 'Listing photos Brampton — detached & new-build heavy',
    desc: 'Wide lots and new-build elevations are strong candidates for licensed drone exteriors paired with HDR interiors and a floor plan buyers can trust.',
    search: 'listing photos Brampton · drone real estate photos Brampton',
  },
  {
    name: 'Oakville',
    region: 'Ontario',
    headline: 'Real estate photography Oakville & waterfront',
    desc: 'Premium detached and waterfront listings where twilight exteriors and a virtual tour earn their keep beside the standard HDR set.',
    search: 'listing photos Oakville · real estate photographer Oakville',
  },
  {
    name: 'Halton',
    region: 'Ontario',
    headline: 'Milton, Burlington & Halton Hills listing media',
    desc: 'Growing family-home markets plus Georgetown/Acton properties that need aerial context. Same 24–48h MLS delivery as the rest of the network.',
    search: 'listing photos Milton · listing photos Burlington',
  },
  {
    name: 'Ottawa',
    region: 'Ontario / National Capital',
    headline: 'Listing photos Ottawa (coverage on confirm)',
    desc: 'National Capital inventory from downtown condos to suburban detached. Photographer coverage expands with booked demand — confirm before you pay.',
    search: 'listing photos Ottawa · real estate photography Ottawa',
  },
  {
    name: 'Calgary & Edmonton',
    region: 'Alberta',
    headline: 'Alberta listing photos via the Bricks network',
    desc: 'Prairie light and larger footprints change the frame count, not the standard: HDR, optional licensed drone, floor plan on every standard shoot. Confirm local contractor coverage at booking.',
    search: 'listing photos Calgary · real estate photography Edmonton',
  },
  {
    name: 'Vancouver & Lower Mainland',
    region: 'British Columbia',
    headline: 'BC listing media (coverage on confirm)',
    desc: 'Condo-dense cores and North Shore detached need disciplined HDR and careful aerial planning. We confirm a local photographer before locking travel expectations.',
    search: 'listing photos Vancouver · real estate photography Lower Mainland',
  },
]

export default function ServiceAreasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Bricks',
            legalName: 'Bricks Group',
            description:
              'Listing photos and real estate photography for Canadian agents — HDR, licensed drone, floor plans, optional virtual tour and virtual visit.',
            url: 'https://www.brxs.ca/service-areas',
            telephone: '+1-343-453-4578',
            email: 'help@brxs.ca',
            priceRange: '$$ (à la carte from $149)',
            areaServed: AREA_SERVED_SCHEMA,
            knowsAbout: KNOWS_ABOUT,
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Canadian listing media',
              itemListElement: [
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Real estate photography' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Listing photos / MLS photos' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Drone real estate photos' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Floor plans for listings' } },
              ],
            },
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <span className="badge">Service areas · Canada</span>
          <h1>Listing photos across Canada — not one metro.</h1>
          <p className="sub">
            Bricks is a Canada-wide listing-media network. {COVERAGE_LINE} City sections below are coverage context and search language agents already use — travel and photographer availability are confirmed before you book.
          </p>
          <div className="cta-row">
            <Link className="btn btn-brick" href="/book">
              Book listing photos
            </Link>
            <Link className="btn btn-sec" href="/real-estate-photography">
              Real estate photography overview
            </Link>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="over">Where we shoot</span>
              <h2>Regions with unique listing stock</h2>
            </div>
            <p>
              Same core set everywhere — HDR listing photos, licensed drone when booked, floor plan on every standard shoot, 24–48h MLS-ready delivery. City pages are not a spam laundry list; each note reflects housing stock and aerial constraints.
            </p>
          </div>
          <div className="areas">
            {areas.map((a) => (
              <div key={a.name} className="a rvl" id={a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
                <p className="over" style={{ marginBottom: 6 }}>
                  {a.region}
                </p>
                <h4>{a.name}</h4>
                <p style={{ fontWeight: 500, color: 'var(--ink)', marginBottom: 8 }}>{a.headline}</p>
                <p>{a.desc}</p>
                <p style={{ marginTop: 10, fontSize: 12.5, color: 'var(--inkMute)' }}>{a.search}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="over">How booking works</span>
              <h2>Coverage first, then the clock time.</h2>
            </div>
          </div>
          <div className="prose">
            <p>
              Enter the listing address on <Link href="/book">/book</Link>. We size footprint, quote travel, and only then offer exact clock times from live availability — not vague morning/afternoon windows. If your municipality is not listed above, ask anyway; network coverage follows booked demand.
            </p>
            <p>
              Cost context: <Link href="/blog/canada-real-estate-photography-cost-2026">Canada photography cost (2026)</Link> ·{' '}
              <Link href="/blog/gta-real-estate-media-cost-2026">GTA regional cluster</Link> · product page:{' '}
              <Link href="/real-estate-photography">Real estate photography &amp; listing photos</Link>.
            </p>
            <p>
              {TOUR_NAME} stays path-confined; {VISIT_NAME.toLowerCase()} is free-roam splat and never packaged. Photographers join at{' '}
              <Link href="/photographers">/photographers</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="book">
            <span className="over">Book your area</span>
            <h2>Shoot where we can cover today.</h2>
            <p className="lead">Pick services à la carte, get travel on the quote, and MLS-ready listing photos in 24–48 hours.</p>
            <div className="cta-row">
              <Link className="btn btn-brick" href="/book">
                Book listing media
              </Link>
              <Link className="btn btn-sec" href="/pricing" style={{ color: 'var(--moon)', borderColor: 'var(--moonMute)' }}>
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
