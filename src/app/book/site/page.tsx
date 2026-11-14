import type { Metadata } from 'next'
import { Suspense } from 'react'
import { siteProgressServiceSchema } from '@/lib/schema'
import SiteBookingForm from './SiteBookingForm'
import { PER_VISIT, SITE_PRODUCT, fmt } from '@/lib/commercial'

export const metadata: Metadata = {
  title: 'Book a construction progress visit or site plan | Bricks',
  description:
    `Book a drone progress visit (${fmt(PER_VISIT[0].price)}) or mapped capture (${fmt(PER_VISIT[1].price)}), or start a monthly site plan. Dated evidence for every draw. CAD, plus tax.`,
  alternates: { canonical: '/book/site' },
  robots: { index: true, follow: true },
}

export default function SiteBookingPage() {
  return (
    <section className="block">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteProgressServiceSchema('https://www.brxs.ca/book/site')) }} />
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="over">{SITE_PRODUCT}</span>
            <h1 style={{ fontSize: 'clamp(32px,4vw,48px)', letterSpacing: '-.03em', margin: '6px 0 0' }}>Book a site.</h1>
          </div>
          <p>
            One visit or a monthly plan. We confirm the flight with your site contact.
          </p>
        </div>
        <Suspense fallback={null}>
          <SiteBookingForm />
        </Suspense>
      </div>
    </section>
  )
}
