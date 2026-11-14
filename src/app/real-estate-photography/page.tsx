import type { Metadata } from 'next'
import Link from 'next/link'
import { Head, Rows, Close } from '@/components/calm/Calm'
import Image from 'next/image'
import RevealObserver from '@/components/RevealObserver'
import PublicFaqs from '@/components/PublicFaqs'
import { COVERAGE_LINE, TOUR_NAME, VISIT_NAME, VISIT_PACKAGING, WORK_PHOTOS } from '@/lib/brand'
import {
  PHOTO_RATE, DRONE_RATE, REEL_RATE, TOUR_RATE, TWILIGHT_RATE, VISIT_RATE, BAND_LABELS, bandCells,
  PHOTO_RANGE, DRONE_RANGE, TOUR_RANGE, REEL_RANGE, CORE_FROM, FLOOR_PLAN_ONLY_RATE, RUSH_FLAT,
} from '@/lib/pricing'
import { mediaServiceSchema } from '@/lib/schema'
import { BAND_DETAIL, sumRates } from '@/lib/landing'
import { CITY_PAGES } from '@/lib/city-pages'
import { OG_IMAGE } from '@/lib/og'

const URL = 'https://www.brxs.ca/real-estate-photography'
const TITLE = 'Real Estate Photography in Canada: Photos & Drone | Bricks'
const DESC = `Real estate photography across Canada: HDR photos from $${PHOTO_RATE[0]}, licensed drone, floor plans, film and virtual tours. Exact times, one quoted price.`

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/real-estate-photography' },
  robots: { index: true, follow: true },
  openGraph: { type: 'website', title: TITLE, description: DESC, images: [OG_IMAGE], url: URL },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE] },
}

const cad = (n: number) => `$${n.toLocaleString('en-CA')}`
const PACKAGES = [
  { name: 'Photos only', what: 'HDR photos, interiors and exteriors', rates: sumRates(PHOTO_RATE) },
  { name: 'Essentials', what: 'HDR photos, licensed drone and a floor plan', rates: sumRates(PHOTO_RATE, DRONE_RATE) },
  { name: 'Story', what: 'Essentials plus a 30–45 second film', rates: sumRates(PHOTO_RATE, DRONE_RATE, REEL_RATE) },
  { name: 'Showcase', what: `Story plus a ${TOUR_NAME.toLowerCase()}`, rates: sumRates(PHOTO_RATE, DRONE_RATE, REEL_RATE, TOUR_RATE) },
  { name: 'Full suite', what: 'Showcase plus twilight exteriors', rates: sumRates(PHOTO_RATE, DRONE_RATE, REEL_RATE, TOUR_RATE, TWILIGHT_RATE) },
]

const FAQS = [
  { q: 'What is included in Bricks real estate photography?', a: 'HDR interiors and exteriors, edited in-house and MLS®-safe. Essentials adds licensed drone and a branded 2D floor plan in the same visit. Photos are typically delivered within 24 hours.' },
  { q: 'How much does real estate photography cost in Canada?', a: `Bricks HDR photography is ${bandCells(PHOTO_RATE).join(' / ')} CAD before tax, by footprint. Essentials (photos, drone and floor plan) starts at $${CORE_FROM}. Travel is $0 for properties inside the no-travel-fee area shown on our coverage map. Outside that area, travel is priced from the assigned photographer’s location: the first 25 km are free, then $0.75 per additional km. Your assigned photographer and final travel fee are confirmed before payment.` },
  { q: 'Do you shoot MLS® photos Canada-wide?', a: 'Yes. The GTA and Golden Horseshoe are the home base. In other markets, including Ottawa, Calgary and Vancouver, a local photographer is confirmed when you book, before you pay.' },
  { q: 'Virtual tour or Virtual Visit?', a: `A ${TOUR_NAME.toLowerCase()} follows a set path and is included in Showcase and Full suite. ${VISIT_NAME} is free-roam 3D. ${VISIT_PACKAGING}` },
  { q: 'How fast is delivery?', a: `Photos are typically delivered within 24 hours, and other media within 24–48 hours. Rush delivery is faster, for a flat $${RUSH_FLAT}.` },
  { q: 'Do you replace skies or window views?', a: 'Not by default. Bricks keeps real window views and doesn’t add fake skies, so photos stay MLS®-safe. Twilight is shot for real at blue hour.' },
]

export default function RealEstatePhotographyPage() {
  const samples = WORK_PHOTOS.filter((p) => !p.alt.startsWith('Drone view')).slice(0, 6)

  return (
    <>
      <RevealObserver />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(mediaServiceSchema({ url: URL, name: 'Real estate photography and listing photos', offers: ['photos_only', 'essentials', 'story', 'showcase', 'suite', 'floor_plan_only', 'drone', 'reel', 'tour', 'visit', 'twilight', 'rush'] })) }} />

      <section className="hero">
        <div className="wrap">
          <h1>Real estate photography, Canada-wide.</h1>
          <p className="sub">HDR listing photos, licensed drone, floor plans, film and tours. Pick an exact time, see one quoted price, and get photos back in about a day.</p>
          <div className="cta-row">
            <Link className="btn btn-night btn-primary" href="/book">Book a shoot</Link>
            <Link className="btn btn-sec" href="#pricing">See prices</Link>
          </div>
        </div>
      </section>

      <section className="cm-sec rvl" aria-label="What you get">
        <Head title="What you get." />
        <Rows
          items={[
            { title: 'HDR listing photos', detail: 'Bracketed interiors and exteriors, edited in-house. Real window views, no fake skies.' },
            { title: 'Licensed drone', detail: 'Aerials by Transport Canada certified pilots.', href: '/drone-photography' },
            { title: 'Floor plan', detail: `A branded 2D floor plan, from Essentials up, or $${FLOOR_PLAN_ONLY_RATE} on its own.` },
            { title: 'Film', detail: 'A calm 30–45 second listing film.', href: '/real-estate-video' },
            { title: 'Virtual tour and Virtual Visit', detail: 'A guided path through the home, or free-roam 3D.', href: '/virtual-tours' },
            { title: 'Delivered to the listing', detail: 'A media link sized for MLS®, web and print, plus a property website.' },
          ]}
        />
      </section>

      <section className="cm-sec rvl" aria-label="Sample listing photos">
        <div className="rep-grid">
          {samples.map((p) => (
            <div key={p.src} className="rvl">
              <Image src={p.src} alt={p.alt} width={1200} height={900} quality={90} sizes="(max-width:900px) 100vw, 33vw" loading="lazy" />
            </div>
          ))}
        </div>
        <p className="cm-note"><Link href="/gallery">See more work</Link></p>
      </section>

      <section className="cm-sec rvl" aria-label="How booking works">
        <Head title="How booking works." />
        <Rows
          items={[
            { title: '1. Enter the address', detail: 'The home’s size sets the band. You see the price before anything else.' },
            { title: '2. Pick an exact time', detail: 'Times come live from photographers’ calendars.' },
            { title: '3. Photographer assigned, then pay', detail: 'Travel and the final price are on the quote before checkout.' },
            { title: '4. Shoot and delivery', detail: 'Photos typically within 24 hours, other media within 24–48 hours.' },
          ]}
        />
        <p className="cm-note">Getting the home ready? Use the <Link href="/help/booking/prepare-for-a-shoot">shoot prep checklist</Link>.</p>
      </section>

      <section className="cm-sec rvl" id="pricing" aria-label="Pricing">
        <Head title="Packages, priced by home size." link={{ href: '/pricing', label: 'All pricing' }} />
        <div className="prose landing-prose">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Package</th>{BAND_LABELS.map((b) => <th key={b} className="num">{b}</th>)}</tr></thead>
              <tbody>
                {PACKAGES.map((p) => (
                  <tr key={p.name}><td><strong>{p.name}</strong><br />{p.what}</td>{p.rates.map((r, i) => <td key={i} className="num">{cad(r)}</td>)}</tr>
                ))}
                <tr><td><strong>{VISIT_NAME}</strong><br />Free-roam 3D, add-on only</td>{bandCells(VISIT_RATE).map((v) => <td key={v} className="num">+{v}</td>)}</tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="cm-note">Bands: {BAND_DETAIL.join(' · ')}. Add-ons on their own: drone {DRONE_RANGE}, film {REEL_RANGE}, {TOUR_NAME.toLowerCase()} {TOUR_RANGE}. Photos {PHOTO_RANGE}. CAD, before travel and tax.</p>
      </section>

      <section className="cm-sec rvl" aria-label="Cities">
        <Head title="Where we shoot." lede={COVERAGE_LINE} link={{ href: '/service-areas', label: 'Service areas' }} />
        <Rows
          items={CITY_PAGES.map((c) => ({
            title: `Real estate photography in ${c.city}`,
            detail: c.coverage === 'base' ? 'Home base. No travel fee in GTA major markets.' : 'Local photographer confirmed when you book.',
            href: `/real-estate-photography/${c.slug}`,
          }))}
        />
      </section>

      <section className="cm-sec rvl" aria-label="Guides">
        <Head title="Read before you book." link={{ href: '/blog', label: 'All guides' }} />
        <Rows
          items={[
            { title: 'How much does real estate photography cost in Canada? (2026)', href: '/blog/canada-real-estate-photography-cost-2026' },
            { title: 'GTA real estate media cost (2026)', href: '/blog/gta-real-estate-media-cost-2026' },
            { title: 'What’s included in a listing photo shoot?', href: '/blog/whats-included-listing-shoot' },
            { title: 'Drone photography rules for real estate in Ontario', href: '/blog/drone-photography-rules-ontario' },
          ]}
        />
      </section>

      <PublicFaqs title="Listing photos, answered." faqs={FAQS} />

      <Close title="Book your listing photos." href="/book" label="Book a shoot" />

      <style>{`
        .rep-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--gap);}
        .rep-grid img{width:100%;height:auto;display:block;}
        @media (max-width:680px){.rep-grid{grid-template-columns:1fr 1fr;gap:8px;}}
      `}</style>
    </>
  )
}
