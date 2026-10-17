import Link from 'next/link'
import './audience-cards.css'

/**
 * Homepage audience router — ONE row of links that replaces both the old
 * Brokerage/Team/Agent/Vendors tiles and the two builder/agent cards.
 * `.trust-tiles` keeps the MotionLayer stagger on the buttons.
 */
const ROUTES = [
  { href: '/agents', label: 'Agents' },
  { href: '/agents#team', label: 'Teams' },
  { href: '/brokerage', label: 'Brokerages' },
  { href: '/builders', label: 'Builders & developers' },
  { href: '/photographers', label: 'Photographers' },
] as const

export default function AudienceCards() {
  return (
    <section className="hxa rvl" aria-label="Who Bricks is for">
      <div className="wrap">
        <h2 className="hxa-h">Who it&apos;s for.</h2>
        <nav className="hxa-row trust-tiles" aria-label="Choose your path">
          {ROUTES.map((r) => (
            <Link key={r.href} href={r.href} className="hxa-btn">
              <span>{r.label}</span><span className="hxa-ar" aria-hidden="true">→</span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}
