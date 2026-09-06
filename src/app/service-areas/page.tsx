import type { Metadata } from 'next'
import Link from 'next/link'
import { AREA_SERVED_SCHEMA, COVERAGE_LINE, KNOWS_ABOUT, TOUR_NAME, VISIT_NAME } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Service Areas | Bricks — listing media in Canada',
  description: `Bricks shoots listing media in Canada. ${COVERAGE_LINE} Licensed drone, HDR, floor plans, with optional virtual tour and virtual visit.`,
  alternates: { canonical: '/service-areas' },
  openGraph: {
    title: 'Service Areas | Bricks',
    description: `Bricks shoots listing media in Canada. ${COVERAGE_LINE}`,
  },
  twitter: {
    title: 'Service Areas | Bricks',
    description: 'Listing media for Canadian real estate — Canada-wide.',
  },
}

const areas = [
  { name: 'Toronto', desc: 'Condos, semis, and detached across the city — including Etobicoke and North York, where controlled airspace near Pearson and Buttonville means certified drone work matters most.' },
  { name: 'Mississauga', desc: 'Our base. Quick turnarounds across the city, from lakefront condos to large detached in the north end.' },
  { name: 'Hamilton', desc: 'Current coverage west of the core — travel quoted from Mississauga before you book.' },
  { name: 'Durham', desc: 'Current coverage east of Toronto — travel quoted up front.' },
  { name: 'York', desc: 'Current coverage north of the city — same core set, travel quoted before you confirm.' },
  { name: 'Niagara', desc: 'Current coverage toward the peninsula — ask and we confirm travel before you book.' },
  { name: 'Brampton', desc: 'Detached and new-build heavy — great candidates for drone exteriors and floor plans.' },
  { name: 'Oakville', desc: `Premium detached and waterfront — twilight and a ${TOUR_NAME.toLowerCase()} earn their keep here.` },
  { name: 'Milton', desc: 'Growing family-home market; standard shoots with drone and floor plan cover most listings.' },
  { name: 'Halton Hills', desc: 'Georgetown and Acton — rural-urbanish properties that benefit from aerial context shots.' },
  { name: 'Vaughan', desc: `${TOUR_NAME}s and cinematic reels perform well on higher-value listings.` },
  { name: 'Richmond Hill', desc: 'Established detached market; HDR + drone + floor plan is the reliable baseline.' },
]

export default function ServiceAreasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Bricks',
            legalName: 'Bricks Group',
            description: 'Listing media for Canadian real estate — HDR photography, licensed drone, floor plans, optional virtual tour and virtual visit.',
            url: 'https://www.brxs.ca/',
            telephone: '+1-343-453-4578',
            email: 'help@brxs.ca',
            priceRange: '$$ (à la carte from $149)',
            areaServed: AREA_SERVED_SCHEMA,
            knowsAbout: KNOWS_ABOUT,
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <span className="badge">Service areas · Canada</span>
          <h1>Canada-wide listing media.</h1>
          <p className="sub">Bricks is built for Canadian real estate. {COVERAGE_LINE} Travel is quoted before you confirm — first 25 km from Mississauga is free on GTA shoots.</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div><span className="over">Where we shoot</span><h2>Markets we know well</h2></div>
            <p>Same core set everywhere — HDR, licensed drone, floor plan, 24–48h delivery. Ask if your city isn&apos;t listed; we confirm coverage before you book.</p>
          </div>
          <div className="areas">
            {areas.map((a) => (
              <div key={a.name} className="a rvl"><h4>{a.name}</h4><p>{a.desc}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div><span className="over">Common searches</span><h2>Looking for a specific city?</h2></div>
          </div>
          <div className="prose">
            <p>Agents search by city for a reason — local media that understands the housing stock converts. We shoot these today:</p>
            <ul>
              <li>Real estate photographer Mississauga</li>
              <li>Real estate photography Toronto</li>
              <li>Canadian real estate drone photography</li>
              <li>Listing photos Hamilton / Durham / York / Niagara</li>
              <li>{TOUR_NAME} and {VISIT_NAME.toLowerCase()} for listings</li>
              <li>Floor plans for listings Ontario</li>
            </ul>
            <p>Not seeing your municipality? <Link href="/book">Book a shoot</Link> and we&apos;ll confirm coverage and quote travel up front.</p>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="book">
            <span className="over">Book your area</span>
            <h2>Shoot where we cover today.</h2>
            <p className="lead">Pick your services à la carte, get a tailored quote with travel included, and MLS-ready media in 24–48 hours.</p>
            <div className="cta-row">
              <Link className="btn btn-brick" href="/book">Book listing media</Link>
              <Link className="btn btn-sec" href="/pricing" style={{ color: 'var(--moon)', borderColor: 'var(--moonMute)' }}>View pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
