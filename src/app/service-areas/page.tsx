import type { Metadata } from 'next'
import Link from 'next/link'
import CoverageMap from '@/components/CoverageMap'
import { coverageDetailCards } from '@/lib/coverage'
import { AREA_SERVED_SCHEMA, COVERAGE_LINE, TOUR_NAME, VISIT_NAME } from '@/lib/brand'
import { ORG_REF } from '@/lib/schema'

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

const areas = coverageDetailCards()

const mapToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

export default function ServiceAreasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'Real estate photography',
            description:
              'Listing photos and real estate photography for Canadian agents — HDR, licensed drone, floor plans, optional virtual tour and virtual visit.',
            url: 'https://www.brxs.ca/service-areas',
            provider: ORG_REF,
            areaServed: AREA_SERVED_SCHEMA,
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
        {mapToken ? (
          <CoverageMap token={mapToken} />
        ) : (
          <div className="cov-map-missing">
            <p>Map token missing — coverage is still Canada-wide. Book an address and we confirm travel on the quote.</p>
            <Link className="btn btn-brick" href="/book">Book a shoot</Link>
          </div>
        )}
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
            <p className="lead">Pick services à la carte, get travel on the quote, MLS-ready listing photos on a 24–48h target.</p>
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
