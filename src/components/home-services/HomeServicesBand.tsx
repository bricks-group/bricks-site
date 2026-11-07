import { Head } from '@/components/calm/Calm'
import { TradeGrid } from './TradePage'
import type { CSSProperties } from 'react'
import { TRADES, tradeListPhrase } from '@/lib/services'
import './home-services.css'

/** Homepage band: the software stays first; services are booked from inside it. No orange button here. */
export default function HomeServicesBand() {
  return (
    <section className="cm-sec rvl hs-home" style={{ '--hs-columns': TRADES.length } as CSSProperties} aria-label="Book services inside Bricks">
      <Head
        title="Bring your service providers together."
        lede={`${tradeListPhrase().charAt(0).toUpperCase()}${tradeListPhrase().slice(1)}. Request the people you need in one place, with a written quote and the results kept with the property.`}
        link={{ href: '/services', label: 'All home services' }}
      />
      <TradeGrid />
    </section>
  )
}
