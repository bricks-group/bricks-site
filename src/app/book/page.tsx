import type { Metadata } from 'next'
import Link from 'next/link'
import BookingWizard from './BookingWizard'
import { VIRTUAL_STAGING_ENABLED } from '@/lib/pricing'
import { mediaServiceSchema, faqPageSchema } from '@/lib/schema'
import { BOOK_FAQS } from '@/lib/faq-content'
import { OG_IMAGE } from '@/lib/og'

const OG = OG_IMAGE

export const metadata: Metadata = {
  title: "Book Real Estate Photography & Listing Media | Bricks",
  description: "Book real estate photography online: HDR photos, licensed drone, floor plans and optional 3D or video. Enter the address to see a live quote.",
  alternates: { canonical: '/book' },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Book Real Estate Photography & Listing Media | Bricks",
    description: "Book real estate photography online: HDR photos, licensed drone, floor plans and optional 3D or video. Enter the address to see a live quote.",
    images: [OG],
    url: 'https://www.brxs.ca/book',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Book Real Estate Photography & Listing Media | Bricks",
    description: "Book real estate photography online: HDR photos, licensed drone, floor plans and optional 3D or video. Enter the address to see a live quote.",
    images: [OG],
  },
}

export default function BookPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(BOOK_FAQS)) }} />
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

