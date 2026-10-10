import type { Metadata } from 'next'
import Link from 'next/link'
import BlogPostLayout from '@/components/BlogPostLayout'
import {
  PHOTO_RATE,
  DRONE_RATE,
  REEL_RANGE,
  TOUR_RANGE,
  TWILIGHT_RANGE,
  RUSH_FLAT,
  bandCells,
  VISIT_PRICE_LABEL,
  FOOTPRINT_BANDS,
  PHOTO_RANGE,
  DRONE_RANGE,
} from '@/lib/pricing'
import { COVERAGE_LINE, TOUR_NAME, VISIT_NAME, VISIT_PACKAGING } from '@/lib/brand'
import { LOGO_SCHEMA, ORG_REF } from '@/lib/schema'

const OG =
  'https://rbywjnnctjglhcdemnnj.supabase.co/storage/v1/object/public/Bricks%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'

export const metadata: Metadata = {
  title: 'How much does real estate photography cost in Canada? (2026) | Bricks',
  description:
    '2026 Canada-wide real estate photography pricing: what agents pay for listing photos, MLS media, drone, floor plans, virtual tours — and how Bricks quotes à la carte.',
  alternates: { canonical: '/blog/canada-real-estate-photography-cost-2026' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'article',
    title: 'How much does real estate photography cost in Canada? (2026)',
    description:
      'Canada-wide listing media cost guide — HDR photos, drone, floor plans, virtual tours — with Bricks à la carte ranges.',
    images: [OG],
    url: 'https://www.brxs.ca/blog/canada-real-estate-photography-cost-2026',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How much does real estate photography cost in Canada? (2026)',
    description: 'Canada-wide listing media pricing for agents — HDR, drone, floor plans, tours.',
    images: [OG],
  },
}

export default function Post() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: 'How much does real estate photography cost in Canada? (2026)',
            description:
              'Canada-wide guide to real estate photography and listing media costs for HDR photos, drone, floor plans, and virtual tours.',
            author: { '@type': 'Person', name: 'Raphael Merchant' },
            datePublished: '2026-09-12',
            dateModified: '2026-09-12',
            publisher: { ...ORG_REF, logo: LOGO_SCHEMA },
            mainEntityOfPage: 'https://www.brxs.ca/blog/canada-real-estate-photography-cost-2026',
            keywords:
              'real estate photography cost Canada, listing photos price, MLS photos Canada, real estate photographer Canada, drone real estate photos cost',
            image: OG,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How much do listing photos cost in Canada?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Competent HDR listing photography commonly runs about $150–$350 CAD before tax depending on footprint and market. Bricks HDR is ${PHOTO_RANGE} by footprint, with floor plan included on every standard shoot.`,
                },
              },
              {
                '@type': 'Question',
                name: 'Is real estate photography more expensive in Toronto than other Canadian cities?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Major metros (Toronto, Vancouver, Calgary) often sit at the higher end of national ranges because of travel density and demand. Smaller markets may price lower for stills but charge more for licensed drone if certified operators are scarce. Bricks publishes one Canada-facing à la carte menu with travel from the assigned photographer’s base.',
                },
              },
              {
                '@type': 'Question',
                name: 'Does a floor plan come with listing photos?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Many Canadian providers charge $99–$149 extra for a floor plan. Bricks includes a branded 2D floor plan on every standard shoot.',
                },
              },
            ],
          }),
        }}
      />
      <BlogPostLayout
        badge="Resources · Pricing · Canada"
        title="How much does real estate photography cost in Canada? (2026)"
        sub="A Canada-wide look at listing photos, MLS media, drone, floor plans, and virtual tours — then how Bricks prices the same work à la carte. Expands our GTA cost cluster without treating one metro as the whole country."
      >
        <p className="lead">
          Canadian agents buy <strong>listing photos</strong> the same way everywhere: by footprint, by service stack, and by how fast MLS-ready files need to land. Prices move with metro density, but the shopping list is national — HDR stills, optional drone real estate photos, a floor plan, and sometimes a path-confined virtual tour.
        </p>

        <h2>Canada-wide market ranges (2026)</h2>
        <p>
          Across Canadian listing-media desks (national platforms and regional studios), à la carte rates typically land in these CAD bands before HST/GST:
        </p>
        <ul>
          <li>
            <strong>HDR / listing photography:</strong> roughly $149–$350 for a full interior–exterior set. Condos sit lower; large detached and estates sit higher.
          </li>
          <li>
            <strong>Drone real estate photos:</strong> $75–$200 for a still set from a licensed Advanced RPAS operator. Aerial <em>video</em> runs higher.
          </li>
          <li>
            <strong>Floor plans:</strong> $99–$149 when sold alone — frequently bundled on mid/premium packages.
          </li>
          <li>
            <strong>Virtual tour (path-confined):</strong> $149–$350 depending on capture method. This is not a free-roam virtual visit.
          </li>
          <li>
            <strong>Cinematic / walkthrough video:</strong> $200–$500+ typical; social reels often $149–$250.
          </li>
          <li>
            <strong>Twilight exteriors:</strong> $150–$250 for a real blue-hour shoot.
          </li>
        </ul>
        <p>
          A competent <strong>photo + drone + floor plan</strong> booking for a typical Canadian detached home often totals <strong>$250–$600</strong> before tax. Full media with reel and tour commonly lands $500–$1,000 depending on city and footprint.
        </p>
        <p>
          For a metro-deep cut of the same math, see the regional companion:{' '}
          <Link href="/blog/gta-real-estate-media-cost-2026">GTA real estate media cost (2026)</Link>.
        </p>

        <h2>What moves the number (anywhere in Canada)</h2>
        <h3>1. Finished area / footprint</h3>
        <p>
          More rooms means more frames and edit time. Most serious desks tier small → mid → large → XL. That single lever usually dwarfs city-to-city differences on stills.
        </p>
        <h3>2. Services on the order</h3>
        <p>
          MLS photos alone are one line item. Licensed drone, twilight, cinematic reel, and {TOUR_NAME.toLowerCase()} stack on top. {VISIT_NAME} is always a separate paid add-on — {VISIT_PACKAGING}
        </p>
        <h3>3. Travel and access</h3>
        <p>
          Canada is large. Desks either include a free radius from base or quote travel up front. Bricks: first 25 km from the assigned photographer’s base free, then $0.75/km — confirmed at assignment. {COVERAGE_LINE}
        </p>
        <h3>4. Turnaround</h3>
        <p>
          Honest standard delivery for edited MLS listing photos is <strong>24–48 hours</strong>. Same-day rush is usually a flat add-on. Treat &quot;guaranteed next morning&quot; claims carefully unless the ops SLA is published and proven.
        </p>
        <h3>5. Compliance for aerial</h3>
        <p>
          Commercial drone in Canadian airspace needs a Transport Canada Advanced RPAS-certified operator. That cost shows up in drone line items near controlled airports — and it should.
        </p>

        <h2>How Bricks prices Canadian listing media</h2>
        <p>One à la carte menu, sized to the property — not a padded national &quot;package&quot; that hides line items:</p>
        <ul>
          <li>
            HDR photography: <strong>{bandCells(PHOTO_RATE).join(' / ')}</strong> ({PHOTO_RANGE})
          </li>
          <li>
            Licensed drone: <strong>{bandCells(DRONE_RATE).join(' / ')}</strong> ({DRONE_RANGE})
          </li>
          <li>
            Floor plan: <strong>included</strong> on every standard shoot
          </li>
          <li>
            Cinematic reel: <strong>+{REEL_RANGE}</strong>
          </li>
          <li>
            {TOUR_NAME}: <strong>+{TOUR_RANGE}</strong> (path-confined)
          </li>
          <li>
            {VISIT_NAME}: <strong>{VISIT_PRICE_LABEL}</strong> ({FOOTPRINT_BANDS}) — {VISIT_PACKAGING}
          </li>
          <li>
            Twilight: <strong>+{TWILIGHT_RANGE}</strong>
          </li>
          <li>
            Rush: <strong>+${RUSH_FLAT}</strong>
          </li>
        </ul>
        <p>
          Get a live tailored quote on <Link href="/book">Book a shoot</Link>. Product overview for agents:{' '}
          <Link href="/real-estate-photography">Real estate photography &amp; listing photos</Link>.
        </p>

        <h2>Regional notes (without a laundry list)</h2>
        <p>
          Toronto / GTA, Vancouver / Lower Mainland, Calgary / Edmonton, Ottawa / Montreal, and Atlantic markets all buy the same media stack. Where certified drone operators are scarce, aerial premiums rise. Where condo inventory dominates, average photo tickets fall but volume rises. Bricks recruits photographers Canada-wide so coverage can follow booked demand — confirm at booking rather than assuming a city page equals a guaranteed slot.
        </p>

        <h2>FAQ</h2>
        <div className="faq">
          <div className="qa">
            <h4>Is tax included?</h4>
            <p>Usually no. Bricks quotes media pre-tax and adds applicable HST/GST at checkout.</p>
          </div>
          <div className="qa">
            <h4>Why publish Canada-wide and GTA posts?</h4>
            <p>
              Agents search both ways. The <Link href="/blog/gta-real-estate-media-cost-2026">GTA cost guide</Link> is a regional deep-dive; this page is the national frame so we never imply Bricks only serves one metro.
            </p>
          </div>
          <div className="qa">
            <h4>Can photographers join from outside the GTA?</h4>
            <p>
              Yes — applications are open Canada-wide on <Link href="/photographers">/photographers</Link>.
            </p>
          </div>
        </div>
      </BlogPostLayout>
    </>
  )
}
