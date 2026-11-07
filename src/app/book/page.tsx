import type { Metadata } from 'next'
import Link from 'next/link'
import BookingWizard from './BookingWizard'
import { TOUR_NAME, VISIT_NAME, VISIT_PACKAGING } from '@/lib/brand'
import { TOUR_RANGE, TWILIGHT_RANGE, VISIT_PRICE_LABEL, FOOTPRINT_BANDS, VIRTUAL_STAGING_ENABLED } from '@/lib/pricing'
import { mediaServiceSchema } from '@/lib/schema'
import { OG_IMAGE } from '@/lib/og'

const OG = OG_IMAGE

export const metadata: Metadata = {
  title: "Book Real Estate Photography & Listing Media | Bricks",
  description: "Book listing media through Bricks: choose HDR photos, licensed drone, floor plans and optional 3D or video. Enter your property address to see a live quote.",
  alternates: { canonical: '/book' },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Book Real Estate Photography & Listing Media | Bricks",
    description: "Book listing media through Bricks: choose HDR photos, licensed drone, floor plans and optional 3D or video. Enter your property address to see a live quote.",
    images: [OG],
    url: 'https://www.brxs.ca/book',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Book Real Estate Photography & Listing Media | Bricks",
    description: "Book listing media through Bricks: choose HDR photos, licensed drone, floor plans and optional 3D or video. Enter your property address to see a live quote.",
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
                  text: `No. It's an add-on, ${VISIT_PRICE_LABEL.toLowerCase()}, that you can pick in Step 2.`,
                },
              },
              {
                '@type': 'Question',
                name: 'Can I reschedule after booking?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'More than 24 hours before the shoot window is free. Inside 24 hours we will try; if we cannot, the cancellation schedule applies. Email help@brxs.ca.',
                },
              },
              {
                '@type': 'Question',
                name: 'What if I need to cancel?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'More than 24 hours before the shoot window: full refund. Inside 24 hours, or no-show / no access: no refund. If we cancel on our side: full refund or a free reshoot, your choice. No callout fee.',
                },
              },
              {
                '@type': 'Question',
                name: 'How do refunds work?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Back to your original payment method, typically within 5–10 business days.',
                },
              },
              {
                '@type': 'Question',
                name: 'How fast is delivery?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'We aim to deliver edited, MLS-ready photos in 24 hours, and other media in 24–48 hours. Rush delivery is faster.',
                },
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mediaServiceSchema({
            url: 'https://www.brxs.ca/book',
            name: 'Book Bricks listing photos',
            // Only what the booking form visibly prices.
            offers: ['essentials', 'floor_plan_only', 'reel', 'tour', 'visit', 'twilight', ...(VIRTUAL_STAGING_ENABLED ? (['staging'] as const) : []), 'rush'],
          })) }}
      />
      <section className="hero">
        <div className="wrap">
          <span className="badge">Book</span>
          <h1>Book a listing shoot.</h1>
          <p className="sub">
            Get a live quote from the address, then pick an exact time.{' '}
            <Link href="/real-estate-photography">What&apos;s included</Link>
          </p>
        </div>
      </section>
      <BookingWizard />
    </>
  )
}

