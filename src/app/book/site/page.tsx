import type { Metadata } from 'next'
import { Suspense } from 'react'
import SiteBookingForm from './SiteBookingForm'
import { SITE_PRODUCT } from '@/lib/commercial'

export const metadata: Metadata = {
  title: 'Book a construction progress visit or site plan | Bricks',
  description:
    'Book a drone progress visit ($375) or mapped capture ($1,499), or start a monthly site monitoring plan. Vetted, insured, certified pilots. CAD, plus HST.',
  alternates: { canonical: '/book/site' },
  robots: { index: true, follow: true },
}

export default function SiteBookingPage() {
  return (
    <section className="block">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="over">{SITE_PRODUCT} · Book</span>
            <h1 style={{ fontSize: 'clamp(32px,4vw,48px)', letterSpacing: '-.03em', margin: '6px 0 0' }}>Book a site.</h1>
          </div>
          <p>
            One visit or a monthly plan. You pay by card at checkout; Bricks assigns a vetted, insured, certified pilot who
            meets your insurance minimum and confirms the flight with your site contact.
          </p>
        </div>
        <Suspense fallback={null}>
          <SiteBookingForm />
        </Suspense>
      </div>
    </section>
  )
}
