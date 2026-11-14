import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import { Head, Rows, Close } from '@/components/calm/Calm'
import { Photo, HeroPlate, PlateImg } from '@/components/clientele/Clientele'
import { signupUrl } from '@/lib/brand'
import { OG_IMAGE } from '@/lib/og'
import PublicFaqs from '@/components/PublicFaqs'
import { PM_FAQS } from '@/lib/public-content'

const TITLE = 'Property Manager Software: Turnovers & Unit Media | Bricks'
const DESC = 'Condition reports, turnover media and unit status for every building, booked by address. Condition report $145, turnover bundle $295. CAD plus tax.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/property-managers' },
  openGraph: { images: [OG_IMAGE], title: TITLE, description: DESC },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE] },
}

export default function PropertyManagersPage() {
  return (
    <>
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <h1>Turnovers, condition reports and unit media, on one record.</h1>
          <p className="sub">For property managers, landlords and leasing teams in the GTA.</p>
          <p className="sub">
            Bricks is the system that brings it all together: property manager software for condition reports, turnover media and unit status in every building. Book a dated condition report for $145 or a turnover bundle for $295 by address, compare each report with the last, and print an owner report for any period. It sits beside your property management system.
          </p>
          <div className="cta-row">
            <a className="btn btn-night btn-primary" href={signupUrl('property_manager')}>Create a property manager account</a>
            <Link className="btn btn-sec" href="/book/property?for=property_manager&service=pm_condition_report">Book a condition report</Link>
          </div>
          <HeroPlate sheet="P-00" title="Condo rooftop amenity, listing photo" note="From our gallery">
            <PlateImg src="/media/mf-20george-rooftop.jpg" alt="Rooftop amenity space of a condo building" />
          </HeroPlate>
        </div>
      </section>

      <section className="cm-sec pm-sec rvl" aria-label="Turnovers">
        <Head title="Turnovers in one visit." link={{ href: '/book/property?for=property_manager&service=pm_turnover', label: 'Book a turnover' }} />
        <p className="pm-body">A turnover media bundle is a move-out condition report, new listing photos and a measured floor plan in one visit: $295, CAD plus tax. Media only: cleaning, repairs and other physical turnover work are not included. Need <Link href="/move-out-cleaning">move-out cleaning</Link> too? Request a cleaning quote.</p>
      </section>

      <section className="cm-sec pm-sec rvl" aria-label="Condition reports">
        <Head title="Condition reports you can compare." link={{ href: '/book/property?for=property_manager&service=pm_condition_report', label: 'Book a condition report' }} />
        <p className="pm-body">A dated move-in or move-out condition report is $145. In a property manager account, each report is compared room by room with the last one for that unit. <Link href="/blog/move-out-condition-report-ontario">How to document a unit in Ontario</Link>.</p>
      </section>

      <section className="cm-sec pm-sec rvl" aria-label="Units">
        <Head title="Every unit and its next step." />
        <p className="pm-body">Unit number, rent and size by building, marked available, reserved or leased, with each unit’s turnover and next step. Print an owner report for any period.</p>
      </section>

      <section className="cm-sec pm-sec rvl" aria-label="Leasing media">
        <Head title="Leasing media." link={{ href: '/book/property?for=property_manager&service=pm_listing_set', label: 'Book unit media' }} />
        <p className="pm-body">HDR photos of the unit and the building’s shared spaces, floor plans renters can read at a glance, and Virtual Visit free-roam 3D as a paid add-on, so renters can walk the unit before they book a viewing. Photos in 24 hours.</p>
      </section>

      <section className="cm-sec rvl" aria-label="Sample work">
        <Head title="Units and the spaces around them." link={{ href: '/gallery', label: 'See more work' }} />
        <div className="cl-pair">
          <Photo src="/media/work/04.jpg" alt="Condo living room photographed for a listing" note="From our gallery" ratio="square" />
          <Photo src="/media/mf-riverbend-lobby.jpg" alt="Lobby of a multifamily building" note="From our gallery" ratio="square" />
        </div>
      </section>

      <section className="cm-sec pm-sec rvl" aria-label="Rentals plans">
        <Head title="Rentals plans." />
        <p className="pm-body">Rentals 5, 12 or 25 cover that many turnover media bundles a month: $1,325, $2,990 or $5,875 a month, CAD plus tax. Chosen in your property manager account.</p>
        <Rows
          items={[
            { title: 'Condition reports and turnovers, booked online', detail: 'A dated move-in or move-out condition report for $145, or a turnover media bundle for $295. You don’t need an account for one or two units.', href: '/book/property?for=property_manager&service=pm_turnover' },
            { title: 'Monthly rentals plans', detail: 'Cleaning and repairs are not included. Chosen in your property manager account.', href: signupUrl('property_manager'), external: true },
            { title: 'Leasing agents', detail: 'Start free as an individual and book media from the listing.', href: signupUrl('solo'), external: true },
          ]}
        />
      </section>

      <section className="cm-sec pm-sec rvl" aria-label="What Bricks isn’t">
        <Head title="What Bricks isn’t, yet." />
        <p className="pm-body">Bricks doesn’t replace your property management or accounting system, and it doesn’t sync with one yet. Your team updates unit status in Bricks. More for <Link href="/reits">REITs</Link> and <Link href="/commercial">commercial property</Link>, or see <Link href="/pricing">pricing</Link>.</p>
      </section>

      <PublicFaqs title="Questions from property managers." faqs={PM_FAQS} />

      <Close title="See the work first." href="/gallery" label="See multifamily work" primary={false} />
      <style>{`
        .pm-sec{--vs-sec:64px;}
        .pm-sec .cm-head{--head-gap:16px;}
        .pm-body{font-size:var(--vs-fs-body);color:var(--vs-fg-2);line-height:1.55;max-width:66ch;margin:0;}
        .pm-sec .cm-rows{margin-top:24px;}
      `}</style>
    </>
  )
}
