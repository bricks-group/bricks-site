import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import { Head, Rows, Stats, Close } from '@/components/calm/Calm'
import { SystemBand, Photo, HeroPlate, PlateImg } from '@/components/clientele/Clientele'
import { PER_VISIT, fmt } from '@/lib/commercial'
import { signupUrl } from '@/lib/brand'
import { OG_IMAGE } from '@/lib/og'

export const metadata: Metadata = {
  title: "Commercial Property Media, 3D Visits & Mapping | Bricks",
  description: "Manage commercial property work in Bricks and book listing photos, drone, floor plans, Virtual Visit 3D and site mapping for your buildings and spaces.",
  alternates: { canonical: '/commercial' },
  openGraph: { images: [OG_IMAGE],
    title: "Commercial Property Media, 3D Visits & Mapping | Bricks",
    description: "Manage commercial property work in Bricks and book listing photos, drone, floor plans, Virtual Visit 3D and site mapping for your buildings and spaces.",
  },
}

const MAPPED = PER_VISIT.find((x) => x.key === 'mapped')!
const SETUP = PER_VISIT.find((x) => x.key === 'setup')!
const VISUAL = PER_VISIT.find((x) => x.key === 'visual')!

export default function CommercialPage() {
  return (
    <>
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <h1>Commercial property, shown properly.</h1>
          <p className="sub">
            Bricks is the system that brings it all together: listing media, Virtual Visit and mapped site captures, booked online and delivered into one listing file.
          </p>
          <div className="cta-row">
            <a className="btn btn-night btn-primary" href={signupUrl('commercial')}>Create a commercial account</a>
            <Link className="btn btn-sec" href="/book/property?for=commercial">Book a leasing set</Link>
          </div>
          <HeroPlate sheet="C-00" title="Industrial building exterior, HDR listing photo" note="From our gallery">
            <PlateImg src="/media/cre-harvester-exterior.jpg" alt="Exterior of an industrial building photographed for a listing" />
          </HeroPlate>
        </div>
      </section>

      <SystemBand
        title="One system, from shoot to listing."
        label="The system"
        lede="Book by address, pick an exact time and we assign the photographer. The media lands on the listing in Bricks."
        tiles={[
          { icon: 'camera', title: 'Listing photos', body: 'HDR photos of offices, retail, industrial and multi-unit property. Photos in 24 hours.' },
          { icon: 'map', title: 'Licensed drone', body: 'Aerials of the building, the lot and the access, flown by certified pilots.' },
          { icon: 'plan', title: 'Floor plans', body: 'Measured floor plans for leasing and sale listings.' },
          { icon: 'visit', title: 'Virtual Visit', body: 'Free-roam 3D of the space, so tenants and buyers can walk it from anywhere. A paid add-on.' },
          { icon: 'compare', title: 'Mapped capture', body: 'An orthomosaic, a 3D model and a measurable site map of the property.' },
          { icon: 'report', title: 'One listing file', body: 'Every delivery filed to the listing in Bricks.' },
        ]}
      />

      <section className="cm-sec rvl" aria-label="Sample work">
        <Head title="Built for big footprints." lede="Docks, yards, rooftops and the site around them." link={{ href: '/gallery', label: 'See more work' }} />
        <div className="cl-pair">
          <Photo src="/media/drone-cre-2241.jpg" alt="Drone photo of an industrial park" note="From our gallery" ratio="square" />
          <Photo src="/media/cre-harvester-dock.jpg" alt="Loading dock exterior of a commercial building" note="From our gallery" ratio="square" />
        </div>
      </section>

      <section className="cm-sec rvl" aria-label="Virtual Visit">
        <Head title="Virtual Visit, for the first walkthrough." lede="A free-roam 3D capture of the space. It is not a path tour: people move anywhere they like." />
        <Rows
          items={[
            { title: 'Booked as an add-on', detail: 'Add it to any media booking for the property.' },
            { title: 'Walk a sample', detail: 'Try a Virtual Visit on the media page.', href: '/media#visit' },
          ]}
        />
      </section>

      <section className="cm-sec rvl" aria-label="Mapping">
        <Head title="Mapping the whole site." lede="Measured maps and a 3D model of the property, booked like any other visit." link={{ href: '/book/site', label: 'Book a site visit' }} />
        <Stats
          label="Mapping prices"
          items={[
            { fig: fmt(MAPPED.price), label: `${MAPPED.name}, ${MAPPED.unit}` },
            { fig: fmt(SETUP.price), label: `${SETUP.name}, ${SETUP.unit}` },
            { fig: fmt(VISUAL.price), label: `${VISUAL.name}, ${VISUAL.unit}` },
          ]}
        />
        <p className="cm-note">CAD, plus tax. Survey-grade accuracy is quoted separately. Maps and models are visual documentation, not a survey.</p>
      </section>

      <section className="cm-sec rvl" aria-label="Accounts">
        <Head title="Which account to open." />
        <Rows
          items={[
            { title: 'Commercial brokers and agents', detail: 'Start free as an individual. Team and brokerage plans are on the pricing page.', href: signupUrl('solo'), external: true },
            { title: 'Owners and developers mapping a site', detail: 'A builder account keeps every visit, map and report for the property.', href: signupUrl('builder'), external: true },
            { title: 'Landlords and leasing teams', detail: 'A commercial account shows which spaces have leasing media and which need it, with a printable leasing package and a CSV listing sheet for each property.', href: signupUrl('commercial'), external: true },
            { title: 'Leasing sets, booked online', detail: '$595 up to 2,500 sq ft, $895 up to 7,500 sq ft, $1,450 up to 20,000 sq ft. Aerial sets $349. CAD plus tax.', href: '/book/property?for=commercial' },
            { title: 'Leasing desk plan', detail: '$1,590 a month, CAD plus tax: two leasing sets a month for spaces up to 7,500 sq ft, and hosted Virtual Visits for every space.', href: signupUrl('commercial'), external: true },
          ]}
        />
      </section>

      <Close title="See the work first." href="/gallery" label="See commercial work" primary={false} />
    </>
  )
}
