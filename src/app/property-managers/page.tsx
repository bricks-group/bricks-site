import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import { Head, Rows, Close } from '@/components/calm/Calm'
import { SystemBand, Photo, HeroPlate, PlateImg } from '@/components/clientele/Clientele'
import { signupUrl } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Unit photos and Virtual Visit for property managers and landlords | Bricks',
  description:
    'Unit photos, floor plans and Virtual Visit free-roam 3D for leasing, booked by address, with units and leasing status for every building in one Bricks account.',
  alternates: { canonical: '/property-managers' },
  openGraph: {
    title: 'Show every unit before the viewing | Bricks',
    description: 'Unit media, Virtual Visit for leasing, and your units in one system.',
  },
}

export default function PropertyManagersPage() {
  return (
    <>
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <h1>Show every unit before the viewing.</h1>
          <p className="sub">
            Bricks is the system that brings it all together: unit photos, floor plans and Virtual Visit for leasing, with your buildings and units in one account.
          </p>
          <div className="cta-row">
            <a className="btn btn-night btn-primary" href={signupUrl('property_manager')}>Create a property manager account</a>
            <Link className="btn btn-sec" href="/book">Book unit media</Link>
          </div>
          <HeroPlate sheet="P-00" title="Condo rooftop amenity, listing photo" note="From our gallery">
            <PlateImg src="/media/mf-20george-rooftop.jpg" alt="Rooftop amenity space of a condo building" />
          </HeroPlate>
        </div>
      </section>

      <SystemBand
        title="One system, every unit."
        label="The system"
        lede="Book media for a unit by address, then keep each building’s units and their status in Bricks."
        tiles={[
          { icon: 'camera', title: 'Unit photos', body: 'HDR photos of the unit and the building’s shared spaces. Photos in 24 hours.' },
          { icon: 'plan', title: 'Floor plans', body: 'Measured floor plans renters can read at a glance.' },
          { icon: 'visit', title: 'Virtual Visit for leasing', body: 'Free-roam 3D of the unit, so renters can walk it before they book a viewing. A paid add-on.' },
          { icon: 'calendar', title: 'Booked by address', body: 'Pick the services and an exact time. We assign the photographer.' },
          { icon: 'units', title: 'Units and leasing status', body: 'Unit number, rent and size by building, marked available, reserved or leased.' },
          { icon: 'compare', title: 'Site Progress for new buildings', body: 'Dated drone visits and progress reports while a building is going up.' },
        ]}
      />

      <section className="cm-sec rvl" aria-label="Sample work">
        <Head title="Units and the spaces around them." link={{ href: '/gallery', label: 'See more work' }} />
        <div className="cl-pair">
          <Photo src="/media/work/04.jpg" alt="Condo living room photographed for a listing" note="From our gallery" ratio="square" />
          <Photo src="/media/mf-riverbend-lobby.jpg" alt="Lobby of a multifamily building" note="From our gallery" ratio="square" />
        </div>
      </section>

      <section className="cm-sec rvl" aria-label="Accounts">
        <Head title="Start where you are." />
        <Rows
          items={[
            { title: 'One or two units', detail: 'Book media online. You don’t need an account to book.', href: '/book' },
            { title: 'Condition reports and turnovers', detail: 'Dated move-in and move-out reports, and a turnover visit that relists the unit. We confirm the price first.', href: '/book/property?for=property_manager' },
            { title: 'Buildings with many units', detail: 'A property manager account keeps units, reports and leasing status by building.', href: signupUrl('property_manager'), external: true },
            { title: 'Leasing agents', detail: 'Start free as an individual and book media from the listing.', href: signupUrl('solo'), external: true },
          ]}
        />
        <p className="cl-note">Your team updates unit status in Bricks. It doesn’t sync with a property management system yet.</p>
      </section>

      <Close title="See the work first." href="/gallery" label="See multifamily work" primary={false} />
    </>
  )
}
