import Link from 'next/link'
import { CORE_FROM } from '@/lib/pricing'
import { PER_VISIT, fmt } from '@/lib/commercial'
import { fromPriceFor } from '@/lib/propertyCheckout'
import { OFFICE_SEAT_PRICE_PER_MONTH } from '@/lib/catalog'
import './software.css'

/**
 * "Who Bricks is for": four audiences with equal weight. Builders and developers first (the expected main income).
 * Every line is a shipped feature; every figure comes from the price modules, never typed here.
 */
const AUDIENCES = [
  {
    id: 'builders',
    who: 'Builders and developers',
    benefit: 'Every site visit dated, mapped and reported, for everyone with a stake in the project.',
    does: [
      `Site Progress drone visits from ${fmt(PER_VISIT[0].price)}, and mapped captures with an orthomosaic and 3D model from ${fmt(PER_VISIT[1].price)}`,
      'Progress reports and investor updates drafted from the visits, shared as a PDF or an expiring link',
      'Photos, drone, video and Virtual Visit for sales and leasing, booked in the same place',
    ],
    cta: { href: '/builders', label: 'Bricks for builders' },
  },
  {
    id: 'agents',
    who: 'Agents and brokerages',
    benefit: 'Listings, bookings and deals on one file, from the first shoot to closing.',
    does: [
      'A listing file, listing site and launch kit with an MLS® required-field checklist, free on Clay',
      `Listing media booked at an exact time, from $${CORE_FROM}, delivered to the listing`,
      `Deals with e-sign and deal rooms, and brokerage seats from $${OFFICE_SEAT_PRICE_PER_MONTH.franchise} a month with compliance review and trust accounting`,
    ],
    cta: { href: '/agents', label: 'Bricks for agents' },
  },
  {
    id: 'pm',
    who: 'Property managers',
    benefit: 'Every unit’s turnover, condition report and next step in one account.',
    does: [
      `Condition reports from ${fromPriceFor('property_manager')}, compared room by room with the last one`,
      'Turnover media bundles: move-out report, listing photos and floor plan in one visit',
      'An owner report for any period, printed from the account',
    ],
    cta: { href: '/property-managers', label: 'Bricks for property managers' },
  },
  {
    id: 'vendors',
    who: 'Photographers and vendors',
    benefit: 'Steady jobs at a fixed rate, without chasing clients or invoices.',
    does: [
      'Jobs offered only when they fit your schedule',
      'A fixed rate per completed job, paid automatically through Stripe Connect',
      'Bricks edits every photo and film, so you shoot and move on',
    ],
    cta: { href: '/photographers', label: 'Apply to work with Bricks' },
  },
] as const

export default function WhoFor() {
  return (
    <section className="cm-sec who" aria-label="Who Bricks is for" id="who">
      <div className="cm-head"><div><h2>Who Bricks is for.</h2><p>One system, linking the people who build, sell, manage and serve property.</p></div></div>
      <ul className="who-grid">
        {AUDIENCES.map((a, i) => (
          <li key={a.id} className="who-card">
            <span className="sw-card-num">{String(i + 1).padStart(2, '0')}</span>
            <h3>{a.who}</h3>
            <p className="who-benefit">{a.benefit}</p>
            <ul className="who-does">
              {a.does.map((d) => <li key={d}>{d}</li>)}
            </ul>
            <Link className="who-cta" href={a.cta.href}>{a.cta.label}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
