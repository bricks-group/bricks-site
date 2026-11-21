import type { Metadata } from 'next'
import Link from 'next/link'
import BlogPostLayout from '@/components/BlogPostLayout'
import { PHOTO_RATE, DRONE_RATE, REEL_RANGE, TOUR_RANGE, TWILIGHT_RANGE, RUSH_FLAT, bandCells, VISIT_PRICE_LABEL, CORE_FROM, FLOOR_PLAN_ONLY_RATE } from '@/lib/pricing'
import { TOUR_NAME, VISIT_NAME } from '@/lib/brand'
import { LOGO_SCHEMA, ORG_REF, faqPageSchema } from '@/lib/schema'
import { OG_IMAGE } from '@/lib/og'
import { DELIVERY_LINE, DRONE_PILOT_LINE, TAX_LINE, TRAVEL_LINE, VISIT_PLAIN } from '@/lib/content/facts'
import { postMeta, longDate } from '@/lib/content/posts'

const SLUG = 'gta-real-estate-media-cost-2026'
const META = postMeta(SLUG)
const TITLE = 'What real estate photography costs in the GTA'
const DESC = 'Published GTA rates for listing photos, drone, floor plans, tours and video, what moves the price, and what Bricks charges.'
const CHECKED = '22 July 2026'

const FAQS: { q: string; a: string }[] = [
  { q: 'Is HST included?', a: `No. Listing media is usually quoted before tax. ${TAX_LINE}` },
  { q: 'Why does drone vary so much in price?', a: `A few still photos from the air take minutes. Aerial video takes longer to fly and edit. ${DRONE_PILOT_LINE}` },
  { q: 'Are Bricks prices the same for everyone?', a: 'Yes. Every price is public and the same for every agent. You see the full price, including travel, before you pay.' },
]

export const metadata: Metadata = {
  title: `${TITLE} | Bricks`,
  description: DESC,
  alternates: { canonical: `/blog/${SLUG}` },
  robots: { index: true, follow: true },
  openGraph: { images: [OG_IMAGE], type: 'article', title: TITLE, description: DESC },
  twitter: { title: TITLE, description: DESC },
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
            headline: TITLE,
            description: DESC,
            author: { '@type': 'Organization', name: 'Bricks', url: 'https://www.brxs.ca' },
            datePublished: META.published,
            dateModified: META.reviewedOn,
            publisher: { ...ORG_REF, logo: LOGO_SCHEMA },
            mainEntityOfPage: `https://www.brxs.ca/blog/${SLUG}`,
            keywords: 'real estate photography cost GTA, GTA listing media pricing, Toronto real estate photographer price',
          }),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQS)) }} />
      <BlogPostLayout
        slug={SLUG}
        badge="Resources · Listing media"
        title={TITLE}
        sub="Published rates from GTA providers, what moves the price, and the Bricks menu."
      >
        <p className="lead">Most GTA agents buy a mix of services for each listing. The price follows the size of the home, what you add and how far the photographer travels.</p>

        <h2>Published GTA rates</h2>
        <p>These ranges come from the published starting rates of eight GTA listing-media providers, checked on {CHECKED}. CAD, before HST. Rates change, so treat them as a guide.</p>
        <ul>
          <li><strong>HDR photography:</strong> $149 to $329. Most sat between $200 and $289.</li>
          <li><strong>Drone photos:</strong> from $39 for a few frames; $100 to $149 for a full set. Drone video $90 to $325.</li>
          <li><strong>Floor plans:</strong> $99 to $149, often included.</li>
          <li><strong>Virtual tour:</strong> from $149 to $300 and up.</li>
          <li><strong>Walkthrough video:</strong> from $169; most between $289 and $400; up to $525 and more.</li>
          <li><strong>Twilight:</strong> $175 to $225 for a real blue-hour shoot. Some offer edited twilight for about $25 a photo.</li>
        </ul>
        <p>Most providers also sell bundles. Typical bundles ran $349 to $599 before tax.</p>

        <h2>What moves the price</h2>
        <h3>Size of the home</h3>
        <p>Bigger homes take longer to shoot and edit. Most providers, Bricks included, price by size band.</p>
        <h3>What you add</h3>
        <p>Drone, a reel, a {TOUR_NAME.toLowerCase()}, twilight and rush delivery are added as the listing needs them. {VISIT_PLAIN}</p>
        <h3>Travel</h3>
        <p>{TRAVEL_LINE}</p>
        <h3>Delivery</h3>
        <p>{DELIVERY_LINE}</p>

        <h2>What Bricks charges</h2>
        <p>Bricks sells set packages (Essentials from ${CORE_FROM}: photos, drone and a floor plan) and single add-ons. Prices by home size, small to XL:</p>
        <ul>
          <li>HDR photography: <strong>{bandCells(PHOTO_RATE).join(' / ')}</strong></li>
          <li>Licensed drone: <strong>{bandCells(DRONE_RATE).join(' / ')}</strong></li>
          <li>Floor plan: <strong>included</strong> from Essentials up, or ${FLOOR_PLAN_ONLY_RATE} on its own</li>
          <li>Cinematic reel: <strong>+{REEL_RANGE}</strong></li>
          <li>{TOUR_NAME}: <strong>+{TOUR_RANGE}</strong></li>
          <li>{VISIT_NAME}: <strong>{VISIT_PRICE_LABEL}</strong>, booked on its own</li>
          <li>Twilight: <strong>+{TWILIGHT_RANGE}</strong></li>
          <li>Rush: <strong>+${RUSH_FLAT}</strong></li>
        </ul>
        <p>{TAX_LINE} <Link href="/pricing">See every price →</Link></p>
        <p style={{ fontSize: 14, color: 'var(--inkMute)' }}>Market figures last checked {CHECKED}. This page was last reviewed {longDate(META.reviewedOn)}.</p>

        <h2>FAQ</h2>
        <div className="faq">
          {FAQS.map((f) => <div className="qa" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
        </div>
      </BlogPostLayout>
    </>
  )
}
