import type { Metadata } from 'next'
import Link from 'next/link'
import CoverageMap from '@/components/CoverageMap'
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
}

const areas: Area[] = [
  {
    name: 'Toronto',
    region: 'Ontario',
    headline: 'Listing photos Toronto agents actually use on MLS',
    desc: 'Condos, semis, and detached across the city. Controlled airspace near Pearson and Billy Bishop is why licensed Advanced RPAS drone work matters — not phone aerials.',
  },
  {
    name: 'Mississauga',
    region: 'Ontario · base',
    headline: 'Travel origin for quotes',
    desc: 'Base for travel quotes. First 25 km free, then billed per kilometre — confirmed before you pay.',
  },
  {
    name: 'Hamilton',
    region: 'Ontario',
    headline: 'Listing photos Hamilton and the mountain',
    desc: 'Character homes and new inventory west of Toronto. Travel quoted from Mississauga before you confirm.',
  },
  {
    name: 'Durham',
    region: 'Ontario',
    headline: 'Listing media across Durham Region',
    desc: 'Ajax through Oshawa and north — family detached that benefits from drone context and a clear floor plan.',
  },
  {
    name: 'York',
    region: 'Ontario',
    headline: 'Real estate photography in York Region',
    desc: 'Vaughan, Richmond Hill, Markham, and Newmarket corridors. Higher-value detached often add a path-confined virtual tour or reel.',
  },
  {
    name: 'Niagara',
    region: 'Ontario',
    headline: 'Toward the Niagara peninsula',
    desc: 'Coverage when travel pencils. We confirm drone feasibility and quote travel before you lock the slot.',
  },
  {
    name: 'Brampton',
    region: 'Ontario',
    headline: 'Detached & new-build heavy',
    desc: 'Wide lots and new-build elevations pair well with licensed drone exteriors, HDR interiors, and a floor plan.',
  },
  {
    name: 'Oakville',
    region: 'Ontario',
    headline: 'Oakville & waterfront',
    desc: 'Premium detached and waterfront where twilight and a virtual tour earn their keep beside the standard HDR set.',
  },
  {
    name: 'Ottawa',
    region: 'National Capital',
    headline: 'Coverage on confirm',
    desc: 'National Capital inventory from downtown condos to suburban detached. Confirm photographer coverage before you pay.',
  },
  {
    name: 'Calgary & Edmonton',
    region: 'Alberta',
    headline: 'Alberta via the Bricks network',
    desc: 'Same standard: HDR, optional licensed drone, floor plan on every standard shoot. Confirm local contractor coverage at booking.',
  },
  {
    name: 'Vancouver & Lower Mainland',
    region: 'British Columbia',
    headline: 'BC coverage on confirm',
    desc: 'Condo-dense cores and North Shore detached need disciplined HDR and careful aerial planning. We confirm a local photographer first.',
  },
]

const mapToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

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
          }),
        }}
      />

      <section className="hero hero-cov">
        <div className="wrap">
          <span className="badge">Service areas · Canada</span>
          <h1>Where we shoot.</h1>
          <p className="sub">
            {COVERAGE_LINE} The map is the coverage story — hubs we run today, plus cities we confirm at booking. Travel is quoted before you pay.
          </p>
          <div className="cta-row">
            <Link className="btn btn-brick" href="/book">
              Book a shoot
            </Link>
            <Link className="learn-link" href="/pricing">
              View pricing →
            </Link>
          </div>
        </div>
      </section>

      <section className="cov-visual" aria-label="Coverage map">
        <div className="wrap cov-visual-wrap">
          {mapToken ? (
            <CoverageMap token={mapToken} />
          ) : (
            <div className="cov-map-missing">
              <p>Map token missing — coverage is still Canada-wide. Book an address and we confirm travel on the quote.</p>
              <Link className="btn btn-brick" href="/book">Book a shoot</Link>
            </div>
          )}
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
              Enter the listing address on <Link href="/book">/book</Link>. We size footprint, quote travel, and only then offer exact clock times from live availability — not vague morning/afternoon windows. If your city is not pinned above, ask anyway; network coverage follows booked demand.
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
          <div className="sec-head">
            <div>
              <span className="over">Hub notes</span>
              <h2>Same standard, local stock.</h2>
            </div>
            <p>Context for housing stock and aerial constraints — not a spam laundry list.</p>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="book">
            <span className="over">Book your area</span>
            <h2>Ready when you are.</h2>
            <p className="lead">Pick services à la carte, get travel on the quote, MLS-ready listing photos in 24–48 hours.</p>
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
