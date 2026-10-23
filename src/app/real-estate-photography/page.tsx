import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import RevealObserver from '@/components/RevealObserver'
import {
  AREA_SERVED_SCHEMA,
  COVERAGE_LINE,
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
import { ORG_REF } from '@/lib/schema'

const OG =
  'https://rbywjnnctjglhcdemnnj.supabase.co/storage/v1/object/public/Bricks%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'

const CORE_FROM = PHOTO_RATE[0] + DRONE_RATE[0]

export const metadata: Metadata = {
  title: 'Real Estate Photography & Listing Photos Canada | Bricks',
  description:
    'Professional real estate photography and MLS listing photos across Canada. HDR stills, licensed drone, floor plan included on standard shoots, photos in 24h and other media on a 24–48h target. Book listing media online.',
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
    a: 'Every standard shoot includes HDR interiors and exteriors, licensed drone and a branded floor plan. We aim to deliver photos in 24 hours.',
  },
  {
    q: 'How much do listing photos cost in Canada?',
    a: `HDR photography starts at $${PHOTO_RATE[0]} CAD, depending on home size. Floor plans are included. Travel is priced from the assigned photographer’s location: the first 25 km are free, then $0.75/km.`,
  },
  {
    q: 'Do you shoot MLS photos Canada-wide?',
    a: 'Yes. We confirm coverage when you book and quote travel up front.',
  },
  {
    q: 'Virtual tour or virtual visit?',
    a: 'A virtual tour follows a set path. A virtual visit is free-roam 3D, booked as an add-on.',
  },
  {
    q: 'How fast is delivery?',
    a: 'We aim to deliver edited, MLS-ready photos in 24 hours, and other media in 24–48 hours. Rush delivery is faster, for a flat fee.',
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
              'Professional real estate photography and MLS listing photos for Canadian agents — HDR, licensed drone, floor plan, photos in 24h, other media on a 24–48h target.',
            provider: ORG_REF,
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
          <span className="badge">Listing media</span>
          <h1>Real estate photography &amp; listing photos, Canada-wide.</h1>
          <p className="sub">
            HDR photos, licensed drone and a floor plan on every standard shoot.
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
              <h2>What&apos;s in every shoot.</h2>
            </div>
          </div>
          <div className="incl">
            <div className="c rvl">
              <span className="ic">01</span>
              <h4>HDR listing photos</h4>
              <p>Bracketed interiors and exteriors, edited for MLS.</p>
            </div>
            <div className="c rvl">
              <span className="ic">02</span>
              <h4>Licensed drone</h4>
              <p>Aerial photos by Advanced RPAS certified pilots.</p>
            </div>
            <div className="c rvl">
              <span className="ic">03</span>
              <h4>Floor plan included</h4>
              <p>A branded 2D floor plan on every standard shoot.</p>
            </div>
            <div className="c rvl">
              <span className="ic">04</span>
              <h4>Fast delivery</h4>
              <p>We aim to deliver photos in 24 hours. Rush is faster.</p>
            </div>
          </div>
        </section>

        <section className="block rvl" aria-label="Sample listing photos">
          <div className="sec-head">
            <div>
              <span className="over">Work</span>
              <h2>Recent shoots.</h2>
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
            <Link href="/gallery">See more work →</Link>
          </p>
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">Pricing</span>
              <h2>Priced by home size.</h2>
            </div>
          </div>
          <div className="incl">
            <div className="c rvl"><span className="ic">{PHOTO_RANGE}</span><h4>HDR photography</h4><p>Interiors and exteriors.</p></div>
            <div className="c rvl"><span className="ic">{DRONE_RANGE}</span><h4>Licensed drone</h4><p>Aerial photos.</p></div>
            <div className="c rvl"><span className="ic">Included</span><h4>Floor plan</h4><p>On every standard shoot.</p></div>
            <div className="c rvl"><span className="ic">{TOUR_RANGE}</span><h4>{TOUR_NAME}</h4><p>Path walkthrough.</p></div>
          </div>
          <p style={{ marginTop: 16, fontSize: 14, color: 'var(--inkMute)' }}>
            CAD, before travel and HST. <Link href="/pricing">Full pricing →</Link>
          </p>
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
                <p>What listing photos, drone, floor plans and tours cost.</p>
              </div>
            </Link>
            <Link className="card np rvl" href="/blog/gta-real-estate-media-cost-2026">
              <div className="meta">
                <span className="t">Regional</span>
                <h3>GTA real estate media cost (2026)</h3>
                <p>Market ranges for Greater Toronto Area agents.</p>
              </div>
            </Link>
            <Link className="card np rvl" href="/blog/whats-included-listing-shoot">
              <div className="meta">
                <span className="t">The shoot</span>
                <h3>What&apos;s included in a listing photo shoot?</h3>
                <p>What comes standard and what&apos;s optional.</p>
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
            <h2>Book your listing photos.</h2>
            <p className="lead">
              Get a quote from the address and pick an exact time.
            </p>
            <div className="cta-row">
              <Link className="btn btn-brick" href="/book">
                Book a shoot
              </Link>
              <Link className="btn btn-sec" href="/pricing" style={{ color: 'var(--moon)', borderColor: 'var(--moonMute)' }}>
                See pricing
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
