import type { Metadata } from 'next'
import Link from 'next/link'
import BookingWizard from './BookingWizard'
import { TOUR_NAME, VISIT_NAME, VISIT_PACKAGING } from '@/lib/brand'
import { TOUR_RANGE, TWILIGHT_RANGE, VISIT_PRICE_LABEL, FOOTPRINT_BANDS } from '@/lib/pricing'

const OG =
  'https://rbywjnnctjglhcdemnnj.supabase.co/storage/v1/object/public/Bricks%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'

export const metadata: Metadata = {
  title: 'Book Real Estate Photography & Listing Photos Canada | Bricks',
  description:
    'Book Bricks listing photos online: HDR real estate photography, licensed drone, floor plan on standard shoots, 24–48h MLS target. Instant quote by footprint + travel.',
  alternates: { canonical: '/book' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Book Real Estate Photography & Listing Photos | Bricks',
    description:
      'Book Canadian listing media online — HDR photos, drone, floor plan, 24–48h target. Pay to lock an exact clock time.',
    images: [OG],
    url: 'https://www.brxs.ca/book',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Listing Photos Canada | Bricks',
    description: 'HDR real estate photography, drone, floor plan — book online with a live quote.',
    images: [OG],
  },
}

export default function BookPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: "What's included with twilight?",
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Exterior photography shot during blue hour -- windows lit, sky still holding color. It's an optional add-on (+${TWILIGHT_RANGE} by footprint) on any shoot; pick it in Step 2.`,
                },
              },
              {
                '@type': 'Question',
                name: `Is the ${TOUR_NAME.toLowerCase()} included?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `À la carte, no — it's a ${TOUR_RANGE} add-on. Showcase and Full suite include it.`,
                },
              },
              {
                '@type': 'Question',
                name: `Is the ${VISIT_NAME.toLowerCase()} included?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Never. ${VISIT_PACKAGING} ${VISIT_PRICE_LABEL} (${FOOTPRINT_BANDS}). The book-a-shoot form collects the request and sqft; it is not charged in Stripe checkout.`,
                },
              },
              {
                '@type': 'Question',
                name: 'Can I reschedule after booking?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'More than 48 hours before the shoot window is free. Inside 48 hours we will try; if we cannot, the cancellation schedule applies. Email booking@brxs.ca.',
                },
              },
              {
                '@type': 'Question',
                name: 'What if I need to cancel?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'More than 48 hours before the shoot window: full refund. 48 hours down to 4 hours: 50% refund. Inside 4 hours, or no-show / no access: no refund (100% retained). If we cancel on our side: full refund or a free reshoot, your choice.',
                },
              },
              {
                '@type': 'Question',
                name: 'How do refunds work?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Back to your original payment method via Stripe, typically within 5-10 business days.',
                },
              },
              {
                '@type': 'Question',
                name: 'How fast is delivery?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Edited MLS-ready listing photos target 24–48 hours on standard shoots. Floor plan included on every standard HDR shoot. Rush aims faster than that window.',
                },
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Book Bricks listing photos',
            serviceType: 'Real estate photography booking',
            provider: { '@type': 'Organization', name: 'Bricks', legalName: 'Bricks Group', url: 'https://www.brxs.ca/' },
            areaServed: { '@type': 'Country', name: 'Canada' },
            url: 'https://www.brxs.ca/book',
          }),
        }}
      />
      <section className="hero">
        <div className="wrap">
          <span className="badge">Book · Canada</span>
          <h1>Book real estate photography &amp; listing photos.</h1>
          <p className="sub">
            Four steps. Live quote from the address — Essentials from $248 is HDR + licensed drone + floor plan. 24–48h MLS target (not a guarantee). Pay to lock the exact clock; assignee and travel are final on the quote before Stripe.{' '}
            <Link href="/real-estate-photography">What&apos;s included</Link> · <Link href="/blog">Guides</Link>
          </p>
        </div>
      </section>
      <BookingWizard />
    </>
  )
}
