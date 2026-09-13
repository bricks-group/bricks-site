import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import RevealObserver from '@/components/RevealObserver'
import {
  AREA_SERVED_SCHEMA,
  COVERAGE_LINE,
  KNOWS_ABOUT,
  TOUR_NAME,
  VISIT_NAME,
  VISIT_PACKAGING,
  WORK_PHOTOS,
} from '@/lib/brand'
import {
  PHOTO_RATE,
  DRONE_RATE,
  TOUR_RANGE,
  VISIT_PRICE_LABEL,
  FOOTPRINT_BANDS,
  PHOTO_RANGE,
  DRONE_RANGE,
} from '@/lib/pricing'

const OG =
  'https://rbywjnnctjglhcdemnnj.supabase.co/storage/v1/object/public/BRX%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'

const CORE_FROM = PHOTO_RATE[0] + DRONE_RATE[0]

export const metadata: Metadata = {
  title: 'Real Estate Photography & Listing Photos Canada | Bricks',
  description:
    'Professional real estate photography and MLS listing photos across Canada. HDR stills, licensed drone, floor plan included on standard shoots, 24–48h delivery. Book listing media online.',
  alternates: { canonical: '/real-estate-photography' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Real Estate Photography & Listing Photos Canada | Bricks',
    description:
      'HDR listing photos, MLS-ready delivery, licensed drone, and floor plans — Canada-wide. Book online.',
    images: [OG],
    url: 'https://www.brxs.ca/real-estate-photography',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Photography & Listing Photos Canada | Bricks',
    description:
      'HDR listing photos, MLS-ready delivery, licensed drone, and floor plans — Canada-wide.',
    images: [OG],
  },
}

const faqs = [
  {
    q: 'What is included in Bricks real estate photography?',
    a: 'Every standard shoot includes HDR interiors and exteriors, licensed drone (Advanced RPAS), and a branded floor plan. Edited MLS-ready listing photos deliver in 24–48 hours. Photos-only drops drone and floor plan; Showcase and Full suite add more.',
  },
  {
    q: 'How much do listing photos cost in Canada?',
    a: `HDR photography starts at $${PHOTO_RATE[0]} CAD by footprint (${PHOTO_RANGE}). Licensed drone is ${DRONE_RANGE}. Floor plan is included on every standard shoot. Travel: first 25 km from Mississauga free, then $0.75/km — quoted before you confirm.`,
  },
  {
    q: 'Do you shoot MLS photos Canada-wide?',
    a: `Yes. ${COVERAGE_LINE} Coverage is confirmed at booking with travel quoted up front — we do not headline a single metro as the only market.`,
  },
  {
    q: `Virtual tour vs ${VISIT_NAME.toLowerCase()}?`,
    a: `${TOUR_NAME} is a path-confined walkthrough (${TOUR_RANGE} by footprint). ${VISIT_NAME} is a free-roam Gaussian splat — ${VISIT_PRICE_LABEL.toLowerCase()} (${FOOTPRINT_BANDS}), always a paid add-on, never packaged.`,
  },
  {
    q: 'How fast is delivery?',
    a: 'Edited and MLS-ready in 24–48 hours on standard shoots. Rush is a flat add-on when you need same/next day.',
  },
]

export default function RealEstatePhotographyPage() {
  const samples = WORK_PHOTOS.slice(0, 6)

  return (
    <>
      <RevealObserver />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Real estate photography & listing photos',
            serviceType: 'Real estate photography',
            description:
              'Professional real estate photography and MLS listing photos for Canadian agents — HDR, licensed drone, floor plan, 24–48h delivery.',
            provider: {
              '@type': 'LocalBusiness',
              name: 'Bricks',
              legalName: 'Bricks Group',
              url: 'https://www.brxs.ca/',
              telephone: '+1-343-453-4578',
              email: 'help@brxs.ca',
              priceRange: `$$ (HDR from $${PHOTO_RATE[0]}; HDR + drone + floor plan from ~$${CORE_FROM})`,
              areaServed: AREA_SERVED_SCHEMA,
              knowsAbout: [
                ...KNOWS_ABOUT,
                'Listing photos',
                'MLS photos',
                'Real estate photographer Canada',
              ],
            },
            areaServed: AREA_SERVED_SCHEMA,
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'CAD',
              lowPrice: PHOTO_RATE[0],
              highPrice: PHOTO_RATE[PHOTO_RATE.length - 1],
              offerCount: 4,
            },
            url: 'https://www.brxs.ca/real-estate-photography',
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <span className="badge">Listing media · Canada</span>
          <h1>Real estate photography &amp; listing photos, Canada-wide.</h1>
          <p className="sub">
            MLS-ready HDR listing photos, licensed drone real estate photos, and a floor plan on every standard shoot — edited in 24–48 hours. Book online today.
          </p>
          <div className="cta-row">
            <Link className="btn btn-brick" href="/book">
              Book listing photos
            </Link>
            <Link className="btn btn-sec" href="/blog/canada-real-estate-photography-cost-2026">
              Canada cost guide
            </Link>
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">What agents book</span>
              <h2>Listing media that sells the space.</h2>
            </div>
            <p>
              Bricks is built for Canadian real estate professionals who need consistent listing photos — not a one-off freelancer roulette. Same core set, Canada-wide.
            </p>
          </div>
          <div className="incl">
            <div className="c rvl">
              <span className="ic">01</span>
              <h4>HDR listing photos</h4>
              <p>Exposure-bracketed interiors and exteriors — the MLS photo standard agents expect on every listing.</p>
            </div>
            <div className="c rvl">
              <span className="ic">02</span>
              <h4>Licensed drone</h4>
              <p>Advanced RPAS-certified aerial for context and curb appeal. Included on packages with drone, or à la carte.</p>
            </div>
            <div className="c rvl">
              <span className="ic">03</span>
              <h4>Floor plan included</h4>
              <p>Branded 2D floor plan on every standard shoot — buyers understand the layout before the showing.</p>
            </div>
            <div className="c rvl">
              <span className="ic">04</span>
              <h4>24–48h delivery</h4>
              <p>Edited, MLS-ready media in one to two business days. Rush available when the listing date is tight.</p>
            </div>
          </div>
        </section>

        <section className="block rvl" aria-label="Sample listing photos">
          <div className="sec-head">
            <div>
              <span className="over">Proof</span>
              <h2>Real estate photography samples.</h2>
            </div>
          </div>
          <div className="grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {samples.map((p) => (
              <div key={p.src} className="rvl" style={{ borderRadius: 2, overflow: 'hidden', border: '1px solid var(--hair)' }}>
                <Image src={p.src} alt={p.alt} width={640} height={480} loading="lazy" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            ))}
          </div>
          <p style={{ marginTop: 16, fontSize: 14, color: 'var(--inkMute)' }}>
            More residential, multifamily, and commercial work lives on the <Link href="/gallery">gallery</Link> (gated until full marketing open). Photographers: <Link href="/photographers">apply to shoot for Bricks</Link>.
          </p>
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">Pricing snapshot</span>
              <h2>À la carte by footprint.</h2>
            </div>
          </div>
          <div className="prose">
            <ul>
              <li>
                <strong>HDR photography:</strong> {PHOTO_RANGE} CAD by footprint
              </li>
              <li>
                <strong>Licensed drone:</strong> {DRONE_RANGE} CAD
              </li>
              <li>
                <strong>Floor plan:</strong> included on every standard shoot
              </li>
              <li>
                <strong>{TOUR_NAME}:</strong> path-confined add-on {TOUR_RANGE}
              </li>
              <li>
                <strong>{VISIT_NAME}:</strong> {VISIT_PRICE_LABEL} ({FOOTPRINT_BANDS}) — {VISIT_PACKAGING}
              </li>
            </ul>
            <p>
              HDR + drone starting point is about <strong>${CORE_FROM}</strong> before travel and HST. Full menu and software plans sit on Pricing (gated until launch open); booking quotes live on{' '}
              <Link href="/book">/book</Link>.
            </p>
          </div>
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">Guides</span>
              <h2>Read before you book.</h2>
            </div>
          </div>
          <div className="grid3">
            <Link className="card np rvl" href="/blog/canada-real-estate-photography-cost-2026">
              <div className="meta">
                <span className="t">Pricing</span>
                <h3>How much does real estate photography cost in Canada? (2026)</h3>
                <p>Canada-wide cost overview for listing photos, drone, floor plans, and tours.</p>
              </div>
            </Link>
            <Link className="card np rvl" href="/blog/gta-real-estate-media-cost-2026">
              <div className="meta">
                <span className="t">Regional</span>
                <h3>GTA real estate media cost (2026)</h3>
                <p>Regional cluster with market ranges for Greater Toronto Area agents.</p>
              </div>
            </Link>
            <Link className="card np rvl" href="/blog/whats-included-listing-shoot">
              <div className="meta">
                <span className="t">The shoot</span>
                <h3>What&apos;s included in a listing photo shoot?</h3>
                <p>HDR, drone, floor plan, delivery SLA — and what stays optional.</p>
              </div>
            </Link>
          </div>
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">FAQ</span>
              <h2>Listing photos, answered.</h2>
            </div>
          </div>
          <div className="faq">
            {faqs.map((f) => (
              <div className="qa" key={f.q}>
                <h4>{f.q}</h4>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="block rvl">
          <div className="book">
            <span className="over">Book</span>
            <h2>Get MLS listing photos in 24–48 hours.</h2>
            <p className="lead">
              Pick services, get a tailored quote by footprint and travel, pay to lock an exact clock time. {COVERAGE_LINE}
            </p>
            <div className="cta-row">
              <Link className="btn btn-brick" href="/book">
                Book a shoot
              </Link>
              <Link className="btn btn-sec" href="/photographers" style={{ color: 'var(--moon)', borderColor: 'var(--moonMute)' }}>
                Photographers apply
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
