import type { Metadata } from 'next'
import { Suspense } from 'react'
import BookPropertySwitch from './BookPropertySwitch'

export const metadata: Metadata = {
  title: "Book Property Visits, Reports & Leasing Media | Bricks",
  description:
    'Book and pay for one visit: turnovers, condition reports, listing sets, leasing sets, aerials and acquisition captures. Prices in CAD, plus HST.',
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
          <p>Pick the service, the property and a date, then pay. Prices in CAD, plus HST.</p>
        </div>
        <Suspense fallback={null}>
          <BookPropertySwitch />
        </Suspense>
      </div>
    </section>
  )
}
