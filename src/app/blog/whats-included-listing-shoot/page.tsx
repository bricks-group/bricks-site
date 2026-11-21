import type { Metadata } from 'next'
import Link from 'next/link'
import BlogPostLayout from '@/components/BlogPostLayout'
import { REEL_RANGE, TOUR_RANGE, TWILIGHT_RANGE, RUSH_FLAT, VISIT_PRICE_LABEL, PHOTO_RATE, CORE_FROM } from '@/lib/pricing'
import { TOUR_NAME, VISIT_NAME } from '@/lib/brand'
import { LOGO_SCHEMA, ORG_REF, faqPageSchema } from '@/lib/schema'
import { OG_IMAGE } from '@/lib/og'
import { BOOKING_LINE, DELIVERY, DELIVERY_LINE, DRONE_PILOT_LINE, REFUND_LINE, VISIT_PLAIN } from '@/lib/content/facts'
import { postMeta } from '@/lib/content/posts'

const SLUG = 'whats-included-listing-shoot'
const META = postMeta(SLUG)
const TITLE = 'What’s included in a Bricks listing shoot'
const DESC = 'What comes with each Bricks listing package, the add-ons, how booking works, and when your photos arrive.'

const FAQS: { q: string; a: string }[] = [
  { q: 'Is the floor plan included?', a: `Yes, from Essentials up. Photos only (from $${PHOTO_RATE[0]}) is HDR photos without drone or a floor plan.` },
  { q: 'Can I skip the drone?', a: `Yes. Book Photos only. If you book Essentials and the drone can’t fly safely or legally on the day, the rest of the shoot is still delivered.` },
  { q: 'When do my photos arrive?', a: DELIVERY_LINE },
  { q: 'What if I need to cancel?', a: REFUND_LINE },
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
            keywords: "what's included in a real estate photo shoot, listing media package, listing photography Canada",
          }),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQS)) }} />
      <BlogPostLayout
        slug={SLUG}
        badge="Resources · Listing media"
        title={TITLE}
        sub="What each package includes, the add-ons, and when your files arrive."
      >
        <p className="lead">Every Bricks listing package is built from the same parts. Pick the package that fits the home, add what the listing needs, and see the full price before you pay.</p>

        <h2>The packages</h2>
        <ul>
          <li><strong>Photos only:</strong> HDR photos, inside and out. From ${PHOTO_RATE[0]}.</li>
          <li><strong>Essentials:</strong> HDR photos, drone and a floor plan. From ${CORE_FROM}.</li>
          <li><strong>Story:</strong> Essentials plus a short reel.</li>
          <li><strong>Showcase:</strong> Story plus a {TOUR_NAME.toLowerCase()}.</li>
          <li><strong>Full suite:</strong> Showcase plus twilight exteriors.</li>
        </ul>
        <p>Prices scale with the size of the home. <Link href="/pricing">See every price →</Link></p>

        <h2>What each part is</h2>
        <h3>HDR photos</h3>
        <p>Interiors and exteriors, edited for MLS®. Real window views, and no fake skies by default. Larger homes get more photos.</p>
        <h3>Drone</h3>
        <p>Aerial photos of the lot, the roofline and what is nearby. {DRONE_PILOT_LINE}</p>
        <h3>Floor plan</h3>
        <p>A branded 2D plan with room sizes.</p>

        <h2>Add-ons</h2>
        <ul>
          <li><strong>Reel</strong> (+{REEL_RANGE}): a 30 to 45 second film for social media and the listing page.</li>
          <li><strong>{TOUR_NAME}</strong> (+{TOUR_RANGE}): buyers click room to room along a set path.</li>
          <li><strong>{VISIT_NAME}</strong> ({VISIT_PRICE_LABEL}): free-roam 3D. {VISIT_PLAIN}</li>
          <li><strong>Twilight</strong> (+{TWILIGHT_RANGE}): exteriors shot at blue hour with the lights on.</li>
          <li><strong>Rush delivery</strong> (+${RUSH_FLAT}): faster than the usual delivery times below.</li>
        </ul>

        <h2>How a shoot works</h2>
        <ol>
          <li><strong>Book:</strong> enter the address, choose the package and add-ons, then pick an exact time. {BOOKING_LINE}</li>
          <li><strong>Pay:</strong> in full at checkout, by card, Apple Pay or Google Pay.</li>
          <li><strong>Shoot:</strong> the photographer gets the address, your notes and a checklist for your package.</li>
          <li><strong>Delivery:</strong> {DELIVERY.photos} {DELIVERY.other} {DELIVERY.note}</li>
        </ol>
        <p>{REFUND_LINE}</p>

        <h2>FAQ</h2>
        <div className="faq">
          {FAQS.map((f) => <div className="qa" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
        </div>
      </BlogPostLayout>
    </>
  )
}
