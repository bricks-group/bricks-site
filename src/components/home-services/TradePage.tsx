import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import { Head, Arrow } from '@/components/calm/Calm'
import { TRADES, type Trade } from '@/lib/services'
import ServiceIcon from './ServiceIcon'
import ServiceQuoteForm from './ServiceQuoteForm'
import './home-services.css'

/** Grid of the five home services, each linking to its page. */
export function TradeGrid({ exclude, label = 'Home services' }: { exclude?: string; label?: string }) {
  return (
    <ul className="hs-grid" aria-label={label}>
      {TRADES.filter((t) => t.slug !== exclude).map((t) => (
        <li key={t.slug}>
          <Link className="hs-card" href={`/${t.slug}`}>
            <ServiceIcon name={t.icon} />
            <h3>{t.name}</h3>
            <p>{t.short}</p>
            <span className="hs-more">Request a quote <Arrow /></span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function List({ items }: { items: { title: string; detail: string }[] }) {
  return (
    <ul className="hs-list">
      {items.map((i) => <li key={i.title}><b>{i.title}</b>{i.detail}</li>)}
    </ul>
  )
}

/** One trade page: what Bricks handles, who it's for, what you get back, and the quote form. One orange button: the form's submit. */
export default function TradePage({ trade }: { trade: Trade }) {
  return (
    <div className="hs">
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow"><Link href="/services">Home services</Link> · {trade.name}</p>
          <h1>{trade.h1}</h1>
          <p className="sub">{trade.sub}</p>
          <div className="cta-row">
            <a className="btn btn-sec" href="#quote">Request a quote</a>
            <Link className="btn btn-sec" href="/services">All home services</Link>
          </div>
        </div>
      </section>

      <section className="cm-sec rvl" aria-label="What Bricks handles">
        <Head title="What Bricks handles." />
        <ul className="hs-grid">
          {trade.handles.map((x) => (
            <li key={x.title}>
              <div className="hs-card">
                <ServiceIcon name={trade.icon} />
                <h3>{x.title}</h3>
                <p>{x.detail}</p>
              </div>
            </li>
          ))}
        </ul>
        {trade.rules.length ? (
          <div className="hs-rules" role="note">
            {trade.rules.map((r) => <p key={r}><b>Good to know.</b> {r}</p>)}
          </div>
        ) : null}
      </section>

      <section className="cm-sec rvl" aria-label="Who it's for and what you get">
        <div className="hs-cols">
          <div><h3>Who it&apos;s for</h3><List items={trade.forWhom} /></div>
          <div className="hs-wide"><h3>What you get back inside Bricks</h3><List items={trade.receive} /></div>
        </div>
      </section>

      <section className="cm-sec hs-quote" id="quote" aria-label="Request a quote">
        <Head title="Request a quote." lede="No prices are listed yet. A person at Bricks quotes every job in writing, and nothing is booked until you approve it." />
        <ServiceQuoteForm trade={trade.slug} />
      </section>

      <section className="cm-sec rvl" aria-label="Other home services">
        <Head title="Other home services." link={{ href: '/services', label: 'All home services' }} />
        <TradeGrid exclude={trade.slug} label="Other home services" />
      </section>
    </div>
  )
}

export function tradeMetadata(t: Trade) {
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: `/${t.slug}` },
    openGraph: { title: t.title, description: t.description },
  }
}
