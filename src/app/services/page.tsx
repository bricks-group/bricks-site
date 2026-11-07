import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import { Head, Rows } from '@/components/calm/Calm'
import { TradeGrid, TradeSection } from '@/components/home-services/TradePage'
import { TRADES, isTradeEnabled, tradeListPhrase } from '@/lib/services'
import ServiceQuoteForm from '@/components/home-services/ServiceQuoteForm'
import '@/components/home-services/home-services.css'
import { OG_IMAGE } from '@/lib/og'

const title = 'Home services | Bricks'
const LIST = tradeListPhrase()
const NUM = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'][TRADES.length] || String(TRADES.length)
const description = `${LIST.charAt(0).toUpperCase()}${LIST.slice(1)}, requested inside Bricks and quoted in writing.`

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
          <h1>Book home services inside Bricks.</h1>
          <p className="sub">
            {LIST.charAt(0).toUpperCase() + LIST.slice(1)}, requested from the same system as your listings and units. A person at Bricks quotes every job in writing, and the results are kept with the property.
          </p>
          <div className="cta-row">
            <a className="btn btn-sec" href="#quote">Request a quote</a>
            <Link className="btn btn-sec" href="/help/home-services/how-quote-requests-work">How quote requests work</Link>
          </div>
        </div>
      </section>

      <section className="cm-sec rvl" aria-label="Services">
        <Head title={`${NUM} services, one system.`} lede="Pick a service to read what it covers, or go straight to the quote form." />
        <TradeGrid />
      </section>

      {TRADES.map((t) => <TradeSection key={t.slug} trade={t} />)}

      <section className="cm-sec rvl" aria-label="How it works">
        <Head title="How it works." />
        <Rows
          items={[
            { title: 'Request a quote', detail: 'Tell us the service, the address and what you need. We email you a copy.' },
            { title: 'Get a written quote', detail: 'A person at Bricks reviews the request and replies with the scope, timing and price.' },
            { title: 'Approve it', detail: 'Nothing is booked or charged until you approve the quote. Then Bricks schedules a vetted vendor.' },
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

      <section className="cm-sec hs-quote" id="quote" aria-label="Request a quote">
        {TRADES.map((t) => <span key={t.slug} id={`quote-${t.slug}`} className="hs-anchor" aria-hidden="true" />)}
        <Head title="Request a quote." lede="Pick a service and tell us about the property. No prices are listed yet. A person at Bricks quotes every job in writing, and nothing is booked until you approve it." />
        <ServiceQuoteForm />
      </section>
    </div>
  )
}
