import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import { Head, Rows, Close } from '@/components/calm/Calm'
import { SystemBand } from '@/components/clientele/Clientele'
import { signupUrl } from '@/lib/brand'
import { ONE_OFFS, ONE_OFFS_FOR, money } from '@/lib/propertyCheckout'
import { OG_IMAGE } from '@/lib/og'

/** REIT visit prices, from the same table /book/property charges (server recomputes). */
const SCOPE: Record<string, string> = { unit: 'per unit', space: 'per space', building: 'per building', property: 'per property' }
const REIT_VISITS = ONE_OFFS_FOR.reit_leasing.map((k) => ONE_OFFS[k])
const off = (cents: number, pct: number) => money(Math.round((cents * (100 - pct)) / 100))

export const metadata: Metadata = {
  title: 'Bricks for REITs | Leasing media, condition reports and site progress',
  description:
    'One account for a REIT portfolio: leasing media and Virtual Visit for units and spaces, condition reports, quarterly property checks and site progress for new buildings.',
  alternates: { canonical: '/reits' },
  openGraph: { images: [OG_IMAGE],
    title: 'Every property, on one record | Bricks',
    description: 'Leasing media, condition reports and dated property checks across the portfolio.',
  },
}

export default function ReitsPage() {
  return (
    <>
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <h1>Every property, on one record.</h1>
          <p className="sub">
            Leasing media for units and spaces, condition reports, quarterly property checks and site progress for new buildings, filed by property in one Bricks account.
          </p>
          <div className="cta-row">
            <a className="btn btn-night btn-primary" href={signupUrl('reit_leasing')}>Create a REIT account</a>
            <Link className="btn btn-sec" href="/book/property?for=reit_leasing">Book a visit</Link>
          </div>
        </div>
      </section>

      <SystemBand
        title="One account, the whole portfolio."
        label="The system"
        lede="Each building keeps its units, leasing media, reports and visits together."
        tiles={[
          { icon: 'units', title: 'Units and leasing status', body: 'Unit number, rent and size by building, marked available, reserved or leased.' },
          { icon: 'camera', title: 'Leasing media', body: 'Photos, measured floor plans and Virtual Visit for residential units and commercial spaces.' },
          { icon: 'report', title: 'Condition reports', body: 'Dated room-by-room photos at move-in and move-out, compared with the last report.' },
          { icon: 'compare', title: 'Quarterly property checks', body: 'A dated look at each property every quarter, compared with the last one.' },
          { icon: 'calendar', title: 'Site progress', body: 'Drone visits, maps, models, reports and comparisons for anything under construction.' },
          { icon: 'share', title: 'Shared with your team', body: 'Asset managers, leasing and property teams work from the same records.' },
        ]}
      />

      <section className="cm-sec rvl" aria-label="How pricing works">
        <Head title="Priced by the property." lede="Every visit is priced and booked online. With 10 or more properties in your account, every visit booked from it is 10% off, and 15% off at 25. Site progress prices are on the builders page." link={{ href: '/builders#pricing', label: 'Site progress prices' }} />
        <Rows
          items={[
            { title: 'Residential buildings', detail: 'Listing sets, condition reports and turnovers by unit.', href: '/property-managers' },
            { title: 'Office, retail and industrial', detail: 'Leasing sets priced by size, and aerial sets.', href: '/commercial' },
            { title: 'Acquisitions and watch', detail: 'A dated baseline when you buy, then a check every quarter.', href: '/investors' },
          ]}
        />
      </section>

      <section className="cm-sec rvl" aria-label="Visit prices">
        <Head title="Visit prices." lede="CAD, before HST. The second figure is the price at 10 or more properties, the third at 25 or more." />
        <Rows
          items={REIT_VISITS.map((v) => ({
            title: v.name,
            detail: `${v.what} ${SCOPE[v.scope]}. ${off(v.cents, 10)} at 10+, ${off(v.cents, 15)} at 25+.`,
            value: money(v.cents),
          }))}
        />
        <p className="cl-note">Your team updates unit status in Bricks. It doesn’t sync with a property management system yet.</p>
      </section>

      <Close title="Book the first visit." href="/book/property?for=reit_leasing" label="Book a visit" primary={false} />
    </>
  )
}
