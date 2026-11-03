import type { Metadata } from 'next'
import Link from 'next/link'
import { Head, Rows, Close } from '@/components/calm/Calm'
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
import { OG_IMAGE } from '@/lib/og'

const OG = OG_IMAGE

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
          <h1>Real estate photography, Canada-wide.</h1>
          <p className="sub">HDR photos, licensed drone and a floor plan on every standard shoot, delivered to the listing in Bricks.</p>
          <div className="cta-row">
            <Link className="btn btn-night btn-primary" href="/book">Book media</Link>
          </div>
        </div>
      </section>

      <section className="cm-sec rvl" aria-label="What's in every shoot">
        <Head title="What’s in every shoot." />
        <Rows
          items={[
            { title: 'HDR listing photos', detail: 'Bracketed interiors and exteriors, edited for MLS.' },
            { title: 'Licensed drone', detail: 'Aerial photos by Advanced RPAS certified pilots.' },
            { title: 'Floor plan', detail: 'A branded 2D floor plan on every standard shoot.' },
            { title: 'Fast delivery', detail: 'We aim to deliver photos in 24 hours. Rush is faster.' },
          ]}
        />
      </section>

      <section className="cm-sec rvl" aria-label="Sample listing photos">
        <div className="rep-grid">
          {samples.map((p) => (
            <div key={p.src} className="rvl">
              <Image src={p.src} alt={p.alt} width={640} height={480} loading="lazy" />
            </div>
          ))}
        </div>
        <p className="cm-note"><Link href="/gallery">See more work</Link></p>
      </section>

      <section className="cm-sec rvl" aria-label="Pricing">
        <Head title="Priced by home size." link={{ href: '/pricing', label: 'See pricing' }} />
        <Rows
          items={[
            { title: 'HDR photography', detail: 'Interiors and exteriors.', value: PHOTO_RANGE },
            { title: 'Licensed drone', detail: 'Aerial photos.', value: DRONE_RANGE },
            { title: TOUR_NAME, detail: 'Path walkthrough.', value: TOUR_RANGE },
          ]}
        />
        <p className="cm-note">Floor plan included on every standard shoot. CAD, before travel and HST.</p>
      </section>

      <section className="cm-sec rvl" aria-label="Guides">
        <Head title="Read before you book." link={{ href: '/blog', label: 'All guides' }} />
        <Rows
          items={[
            { title: 'How much does real estate photography cost in Canada? (2026)', href: '/blog/canada-real-estate-photography-cost-2026' },
            { title: 'GTA real estate media cost (2026)', href: '/blog/gta-real-estate-media-cost-2026' },
            { title: 'What’s included in a listing photo shoot?', href: '/blog/whats-included-listing-shoot' },
          ]}
        />
      </section>

      <section className="cm-sec rvl" aria-label="Questions">
        <Head title="Listing photos, answered." />
        <div className="faq">
          {faqs.map((f) => (
            <div className="qa" key={f.q}>
              <h4>{f.q}</h4>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <Close title="Book your listing photos." href="/book" label="Book media" />

      <style>{`
        .rep-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--gap);}
        .rep-grid img{width:100%;height:auto;display:block;}
        @media (max-width:680px){.rep-grid{grid-template-columns:1fr 1fr;gap:8px;}}
      `}</style>
    </>
  )
}
