import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import { Head, Rows } from '@/components/calm/Calm'
import { TradeGrid } from '@/components/home-services/TradePage'
import ServiceQuoteForm from '@/components/home-services/ServiceQuoteForm'
import '@/components/home-services/home-services.css'

const title = 'Home services | Bricks'
const description = 'Staging, cleaning and turnovers, inspections, measurement and repairs, requested inside Bricks and quoted in writing.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/services' },
  openGraph: { title, description },
}

export default function ServicesPage() {
  return (
    <div className="hs">
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <h1>Book home services inside Bricks.</h1>
          <p className="sub">
            Staging, cleaning, inspections, measurement and repairs, requested from the same system as your listings and units. A person at Bricks quotes every job in writing, and the results are kept with the property.
          </p>
          <div className="cta-row">
            <a className="btn btn-sec" href="#quote">Request a quote</a>
            <Link className="btn btn-sec" href="/help/home-services/how-quote-requests-work">How quote requests work</Link>
          </div>
        </div>
      </section>

      <section className="cm-sec rvl" aria-label="Services">
        <Head title="Five services, one system." />
        <TradeGrid />
      </section>

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
        <p className="hs-note">Inspections are available in Ontario only. Repairs don’t include electrical, plumbing or gas work. A measurement is not a legal survey.</p>
      </section>

      <section className="cm-sec hs-quote" id="quote" aria-label="Request a quote">
        <Head title="Request a quote." lede="Pick a service and tell us about the property. No prices are listed yet." />
        <ServiceQuoteForm />
      </section>
    </div>
  )
}
