import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import { Head, Rows, Close } from '@/components/calm/Calm'
import { SystemBand } from '@/components/clientele/Clientele'
import { signupUrl } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Bricks for REITs | Leasing media, condition reports and site progress',
  description:
    'One account for a REIT portfolio: leasing media and Virtual Visit for units and spaces, condition reports, quarterly property checks and site progress for new buildings.',
  alternates: { canonical: '/reits' },
  openGraph: {
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
            <Link className="btn btn-sec" href="/book/property?for=reit_leasing">Request a visit</Link>
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
        <Head title="Priced by the property." lede="Building something? Site progress prices are on the builders page. For leasing media and reports, we confirm the price for each property before anything is booked." link={{ href: '/builders#pricing', label: 'Site progress prices' }} />
        <Rows
          items={[
            { title: 'Residential buildings', detail: 'Listing sets, condition reports and turnovers by unit.', href: '/property-managers' },
            { title: 'Office, retail and industrial', detail: 'Leasing sets priced by size, and aerial sets.', href: '/commercial' },
            { title: 'Acquisitions and watch', detail: 'A dated baseline when you buy, then a check every quarter.', href: '/investors' },
          ]}
        />
        <p className="cl-note">Your team updates unit status in Bricks. It doesn’t sync with a property management system yet.</p>
      </section>

      <Close title="Tell us about the portfolio." href="/book/property?for=reit_leasing" label="Request a visit" primary={false} />
    </>
  )
}
