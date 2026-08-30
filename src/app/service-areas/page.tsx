import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'GTA Service Areas | Bricks — real estate media across the Greater Toronto Area',
  description: 'Bricks shoots listing media across the Greater Toronto Area — Toronto, Mississauga, Brampton, Oakville, Milton, Halton Hills, Vaughan, Richmond Hill. Licensed drone, HDR, floor plans, with optional 3D tours.',
  alternates: { canonical: '/service-areas' },
  openGraph: {
    title: 'GTA Service Areas | Bricks',
    description: 'Bricks shoots listing media across the Greater Toronto Area — Toronto, Mississauga, Brampton, Oakville, Milton, Halton Hills, Vaughan, Richmond Hill.',
  },
  twitter: {
    title: 'GTA Service Areas | Bricks',
    description: 'Real estate media across the Greater Toronto Area.',
  },
}

const areas = [
  { name: 'Toronto', desc: 'Condos, semis, and detached across the city — including Etobicoke and North York, where controlled airspace near Pearson and Buttonville means certified drone work matters most.' },
  { name: 'Mississauga', desc: 'Our base. Quick turnarounds across the city, from lakefront condos to large detached in the north end.' },
  { name: 'Brampton', desc: 'Detached and new-build heavy — great candidates for drone exteriors and floor plans.' },
  { name: 'Oakville', desc: 'Premium detached and waterfront — twilight and 3D tours earn their keep here.' },
  { name: 'Milton', desc: 'Growing family-home market; standard shoots with drone and floor plan cover most listings.' },
  { name: 'Halton Hills', desc: 'Georgetown and Acton — rural-urbanish properties that benefit from aerial context shots.' },
  { name: 'Vaughan', desc: '3D tours and cinematic reels perform well on higher-value listings.' },
  { name: 'Richmond Hill', desc: 'Established detached market; HDR + drone + floor plan is the reliable baseline.' },
  { name: 'Greater Toronto Area', desc: "Shooting outside the core municipalities above? Ask — if it's within reasonable range we'll quote travel and confirm before you book." },
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
            description: 'GTA real estate listing media — HDR photography, licensed drone, floor plans, 3D virtual tours. Serving the Greater Toronto Area.',
            url: 'https://www.brxs.ca/',
            telephone: '+1-343-453-4578',
            email: 'booking@brxs.ca',
            priceRange: '$$ (à la carte from $149)',
            areaServed: [
              { '@type': 'City', name: 'Greater Toronto Area' },
              { '@type': 'City', name: 'Toronto' },
              { '@type': 'City', name: 'Mississauga' },
              { '@type': 'City', name: 'Brampton' },
              { '@type': 'City', name: 'Oakville' },
              { '@type': 'City', name: 'Milton' },
              { '@type': 'City', name: 'Halton Hills' },
              { '@type': 'City', name: 'Vaughan' },
              { '@type': 'City', name: 'Richmond Hill' },
            ],
            knowsAbout: ['Real estate photography', 'Aerial photography', 'Floor plans', '3D virtual tours', 'Real estate media', 'Drone photography'],
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <span className="badge">Service areas · GTA</span>
          <h1>Real estate media across the Greater Toronto Area.</h1>
          <p className="sub">Bricks shoots listing photography, licensed drone, floor plans, and 3D virtual tours throughout the GTA. Base is Mississauga — the first 25 km of travel is free, then $0.75/km, quoted up front.</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div><span className="over">Where we shoot</span><h2>Municipalities we serve</h2></div>
            <p>Each area gets the same core set — HDR, licensed drone, floor plan, 24–48h delivery.</p>
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
            <p>Agents search by city for a reason — local media that understands the housing stock converts. If you&apos;re looking for any of these, we shoot them all across the GTA:</p>
            <ul>
              <li>Real estate photographer Mississauga</li>
              <li>Real estate photography Toronto</li>
              <li>GTA real estate drone photography</li>
              <li>Listing photos Brampton / Oakville / Milton</li>
              <li>3D virtual tour GTA</li>
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
            <h2>Shoot anywhere in the GTA.</h2>
            <p className="lead">Pick your services à la carte, get a tailored quote with travel included, and MLS-ready media in 24–48 hours.</p>
            <div className="cta-row">
              <Link className="btn btn-brick" href="/book">Book listing media</Link>
              <Link className="btn btn-sec" href="/pricing" style={{ color: 'var(--moon)', borderColor: 'var(--moon-mute)' }}>View pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
