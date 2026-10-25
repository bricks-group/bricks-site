import type { Metadata } from 'next'
import { Suspense } from 'react'
import PropertyRequestForm from './PropertyRequestForm'

export const metadata: Metadata = {
  title: 'Request property media, condition reports or captures | Bricks',
  description:
    'Ask for leasing sets, condition reports, turnovers, acquisition captures or portfolio checks. We confirm the price for your property before anything is booked.',
  alternates: { canonical: '/book/property' },
  robots: { index: true, follow: true },
}

export default function PropertyRequestPage() {
  return (
    <section className="block">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <h1 style={{ fontSize: 'clamp(32px,4vw,48px)', letterSpacing: '-.03em', margin: '6px 0 0' }}>Request a visit.</h1>
          </div>
          <p>Tell us the property and what you need. We reply with the price and a time, and nothing is booked until you say yes.</p>
        </div>
        <Suspense fallback={null}>
          <PropertyRequestForm />
        </Suspense>
      </div>
    </section>
  )
}
