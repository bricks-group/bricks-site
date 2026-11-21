import Link from 'next/link'
import { Arrow } from '@/components/calm/Calm'
import { TRADES, type Trade } from '@/lib/services'
import { tradeFrom, tradePrices } from '@/lib/trade-pricing'
import ServiceIcon from './ServiceIcon'
import './home-services.css'

/** Where a trade lives: its section on the single /services page. */
export const tradeHref = (slug: string) => `/services#${slug}`

/** Grid of the five home services, each linking to its section on /services. */
export function TradeGrid({ label = 'Home services' }: { label?: string }) {
  return (
    <ul className="hs-grid" aria-label={label}>
      {TRADES.map((t) => (
        <li key={t.slug}>
          <Link className="hs-card" href={tradeHref(t.slug)}>
            <ServiceIcon name={t.icon} />
            <h3>{t.name}</h3>
            <p>{t.short}</p>
            <span className="hs-more">From {tradeFrom(t.slug)} <Arrow /></span>
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

export function PriceList({ trade }: { trade: Trade }) {
  return (
    <ul className="hs-list hs-price-list" data-testid={`prices-${trade.slug}`}>
      {tradePrices(trade.slug).map((p) => (
        <li key={p.key}><b>{p.price}{p.note ? ` ${p.note}` : ''}</b>{p.name}</li>
      ))}
    </ul>
  )
}

/** One trade's section on /services. No buttons: the only orange button on the page is the form submit. */
export function TradeSection({ trade }: { trade: Trade }) {
  return (
    <section className="cm-sec rvl hs-trade" id={trade.slug} aria-labelledby={`${trade.slug}-h`}>
      <div className="hs-trade-grid">
        <div className="hs-trade-intro">
          <ServiceIcon name={trade.icon} />
          <h2 id={`${trade.slug}-h`}>{trade.name}</h2>
          <p className="hs-trade-sub">{trade.sub}</p>
          {trade.rules.length ? (
            <div className="hs-rules" role="note">
              {trade.rules.map((r) => <p key={r}><b>Good to know.</b> {r}</p>)}
            </div>
          ) : null}
          <p className="hs-for"><b>For</b> {trade.forWhom.map((f) => f.title.toLowerCase()).join(', ')}.</p>
          <a className="hs-jump" href={`#book-${trade.slug}`}>Book {trade.name.toLowerCase()} <Arrow /></a>
        </div>
        <div><h3>What Bricks handles</h3><List items={trade.handles} /></div>
        <div><h3>What you get back inside Bricks</h3><List items={trade.receive} /></div>
        <div className="hs-prices"><h3>Set prices, before HST</h3><PriceList trade={trade} /></div>
      </div>
    </section>
  )
}
