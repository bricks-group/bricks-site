import type { Metadata } from 'next'
import { Suspense } from 'react'
import BookPropertySwitch from './BookPropertySwitch'
import BookPriceList from '@/components/BookPriceList'
import { PROPERTY_PRICE_GROUPS } from '@/lib/propertyCheckout'

export const metadata: Metadata = {
  title: "Book Property Visits, Reports & Leasing Media | Bricks",
  description:
    'Book and pay for one visit: condition reports, turnover media bundles, listing and leasing sets, aerials and acquisition captures. CAD, plus tax.',
  alternates: { canonical: '/book/property' },
  robots: { index: true, follow: true },
}

export default function PropertyBookPage() {
  return (
    <section className="block">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <h1 style={{ fontSize: 'clamp(32px,4vw,48px)', letterSpacing: '-.03em', margin: '6px 0 0' }}>Book a visit.</h1>
          </div>
          <p>Pick the service, the property and a date, then pay. Prices in CAD, plus tax.</p>
        </div>
        <BookPriceList groups={PROPERTY_PRICE_GROUPS} note="One visit, booked and paid online. CAD, plus tax. Plans and spaces over 20,000 sq ft are by request." />
        <Suspense fallback={null}>
          <BookPropertySwitch />
        </Suspense>
      </div>
    </section>
  )
}
