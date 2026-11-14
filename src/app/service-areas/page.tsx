import type { Metadata } from 'next'
import Link from 'next/link'
import CoverageMap from '@/components/CoverageMap'
import { coverageDetailCards } from '@/lib/coverage'
import { AREA_SERVED_SCHEMA } from '@/lib/brand'
import { TRAVEL_ANSWER } from '@/lib/faq-content'
import PublicFaqs from '@/components/PublicFaqs'
import { ORG_REF } from '@/lib/schema'
import { OG_IMAGE } from '@/lib/og'

// Coverage (Kam, 2026-11-14): all of Ontario, wherever a vendor is near. /api/create-checkout
// refuses payment until a photographer is assigned, so 'before you pay' is true to the code.
const TITLE = 'Real Estate Photography Service Areas in Ontario | Bricks'
const DESC = 'Real estate photography and listing media across Ontario, wherever a photographer is near. We check your address and assign one before you pay.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/service-areas' },
  openGraph: { images: [OG_IMAGE], title: TITLE, description: DESC },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
}

const FAQS = [
  { q: 'Where does Bricks shoot?', a: 'Across Ontario, wherever a photographer is near. Enter the listing address when you book, and we assign a photographer and show the final price before you pay.' },
  { q: 'Is there a travel fee?', a: TRAVEL_ANSWER },
  { q: 'What if no photographer is near my address?', a: 'Checkout stays closed until a photographer is assigned, so you never pay for a shoot nobody can take. Email help@brxs.ca with the address and we’ll look into it.' },
] as const

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
              'Listing photos and real estate photography for Ontario agents: HDR, licensed drone, floor plans, optional virtual tour and virtual visit.',
            url: 'https://www.brxs.ca/service-areas',
            provider: ORG_REF,
            areaServed: AREA_SERVED_SCHEMA,
          }),
        }}
      />

      <section className="hero hero-cov">
        <div className="wrap">
          <span className="badge">Service areas</span>
          <h1>Across Ontario, wherever a vendor is near.</h1>
          <p className="sub">
            We check your address when you book. You pay only once a photographer is assigned and any travel is on the quote.
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
            <p>Across Ontario, wherever a photographer is near. Enter an address to check yours.</p>
            <Link className="btn btn-sec" href="/book">Book a shoot</Link>
          </div>
        )}
      </section>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="over">How it works</span>
              <h2>Start with the address.</h2>
            </div>
          </div>
          <div className="prose">
            <p>
              <Link href="/book">Enter the listing address</Link> and we&apos;ll size the home, quote travel and show the exact times available. If no photographer is near, checkout stays closed and you aren’t charged.
            </p>
            <p>
              City guides: <Link href="/real-estate-photography/toronto">real estate photography in Toronto</Link> and <Link href="/real-estate-photography/ottawa">in Ottawa</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="over">Regions</span>
              <h2>Same standard, everywhere.</h2>
            </div>
          </div>
          <div className="areas">
            {areas.map((a) => (
              <div key={a.name} className="a rvl" id={a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
                <p className="over" style={{ marginBottom: 6 }}>
                  {a.region}
                </p>
                <h3>{a.name}</h3>
                <p style={{ fontWeight: 500, color: 'var(--ink)', marginBottom: 8 }}>{a.headline}</p>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFaqs title="Questions about coverage." faqs={FAQS} />

      <section className="block">
        <div className="wrap">
          <div className="book">
            <span className="over">Book</span>
            <h2>Ready when you are.</h2>
            <p className="lead">Pick your services and see travel on the quote before you pay.</p>
            <div className="cta-row">
              <Link className="btn btn-sec" href="/book" style={{ color: 'var(--moon)', borderColor: 'var(--moon)' }}>
                Book a shoot
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
