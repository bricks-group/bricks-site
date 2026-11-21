import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import { Head, Rows } from '@/components/calm/Calm'
import { TradeGrid, TradeSection } from '@/components/home-services/TradePage'
import { TRADES, isTradeEnabled, tradeListPhrase } from '@/lib/services'
import ServiceQuoteForm from '@/components/home-services/ServiceQuoteForm'
import '@/components/home-services/home-services.css'
import { OG_IMAGE } from '@/lib/og'

const title = 'Home Staging, Cleaning & Inspections, Set Prices | Bricks'
const LIST = tradeListPhrase()
const NUM = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'][TRADES.length] || String(TRADES.length)
const description = `${LIST.charAt(0).toUpperCase()}${LIST.slice(1)}, for listings, rentals and sales, booked inside Bricks at set prices.`

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/services' },
  openGraph: { images: [OG_IMAGE], title, description },
}

export default function ServicesPage() {
  return (
    <div className="hs">
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <h1>Book home services.</h1>
          <p className="sub">
            {`${LIST.charAt(0).toUpperCase() + LIST.slice(1)}.`} Set prices. Kept with the property.
          </p>
          <div className="cta-row">
            <a className="btn btn-sec" href="#book">See prices and book</a>
            <Link className="btn btn-sec" href="/help/home-services/how-quote-requests-work">How booking works</Link>
          </div>
        </div>
      </section>

      <section className="cm-sec rvl" aria-label="Services">
        <Head title={`${NUM} services.`} lede="Pick one. See the price. Book." />
        <TradeGrid />
      </section>

      {TRADES.map((t) => <TradeSection key={t.slug} trade={t} />)}

      <section className="cm-sec rvl" aria-label="How it works">
        <Head title="How it works." />
        <Rows
          items={[
            { title: 'Pick the service', detail: 'Every service has a set price before HST.' },
            { title: 'Pay the set price', detail: 'On this page. Nothing is charged until you finish.' },
            { title: 'Get your time', detail: 'After you pay, Bricks matches a vetted vendor and emails the time.' },
            { title: 'Get the results inside Bricks', detail: 'Reports, photos, checklists and measurements are kept with the property in your Bricks account.' },
          ]}
        />
        <p className="hs-note">Inspections are available in Ontario only.{isTradeEnabled('repairs') ? ' Repairs don’t include electrical, plumbing or gas work.' : ''} A measurement is not a legal survey.</p>
      </section>

      <section className="cm-sec rvl" aria-label="Service guides">
        <Head title="Read more by service." />
        <Rows
          items={[
            { title: 'Home staging', detail: 'Vacant and lived-in homes, timed with the listing photos.', href: '/home-staging' },
            { title: 'Move-out and turnover cleaning', detail: 'Empty units and pre-listing deep cleans, with photo proof.', href: '/move-out-cleaning' },
            { title: 'Home inspections in Ontario', detail: 'Pre-listing, pre-purchase, condo and new-build.', href: '/home-inspection-ontario' },
            { title: 'Home inspection cost in Ontario', detail: 'Typical ranges and what moves the price.', href: '/blog/home-inspection-cost-ontario' },
            { title: 'Move-out cleaning checklist', detail: 'Room by room.', href: '/blog/move-out-cleaning-checklist' },
          ]}
        />
      </section>

      <section className="cm-sec hs-quote" id="book" aria-label="Book a service">
        <span id="quote" className="hs-anchor" aria-hidden="true" />
        {TRADES.map((t) => <span key={t.slug} id={`book-${t.slug}`} className="hs-anchor" aria-hidden="true" />)}
        <Head title="Book." lede="Pick the service and price. Pay here. We email the time." />
        <ServiceQuoteForm />
      </section>
    </div>
  )
}
