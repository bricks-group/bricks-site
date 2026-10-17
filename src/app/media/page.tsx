import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import MediaShowcase from '@/components/media-showcase/MediaShowcase'
import './media-page.css'

export const metadata: Metadata = {
  title: 'Listing media — photos, drone, floor plans, film and 3D | Bricks',
  description: 'HDR listing photos, licensed drone, floor plans, cinematic reels and Virtual Visit 3D, booked online and delivered inside Bricks.',
  alternates: { canonical: '/media' },
  openGraph: {
    title: 'Listing media, inside Bricks',
    description: 'HDR photos, licensed drone, floor plans, film and 3D. Booked online, priced by home size.',
  },
}

const PARTS = [
  { t: 'HDR photos', d: 'Balanced HDR on every shoot.' },
  { t: 'Licensed drone', d: 'Aerials of the property.' },
  { t: 'Floor plans', d: 'Included from Essentials up.' },
  { t: 'Cinematic reel', d: 'A short film for the listing.' },
  { t: 'Virtual Visit', d: 'Free-roam 3D, booked as an add-on.' },
  { t: 'Twilight', d: 'The exterior at blue hour.' },
  { t: 'Virtual staging', d: 'Furnished rooms, per photo.' },
  { t: 'One listing file', d: 'Media lands in the listing file in Bricks OS.' },
] as const

export default function MediaPage() {
  return (
    <>
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <h1>Media, inside Bricks.</h1>
          <p className="sub">HDR photos, licensed drone, floor plans, film and 3D. Booked online, priced by home size.</p>
          <div className="cta-row">
            <Link className="btn btn-night" href="/book">Book a shoot</Link>
            <Link className="learn-link" href="/pricing">See pricing →</Link>
          </div>
        </div>
      </section>

      <MediaShowcase />

      <section className="block rvl" aria-label="What's included">
        <div className="wrap">
          <div className="sec-head"><div><h2>Every part of the listing.</h2></div></div>
          <ul className="mp-grid">
            {PARTS.map((p) => (
              <li key={p.t}><b>{p.t}</b><span>{p.d}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="closer closer-simple rvl" aria-label="Book a shoot">
        <div className="closer-simple-inner">
          <h2>Ready when the listing is.</h2>
          <Link className="btn btn-night btn-l" href="/book">Book a shoot →</Link>
          <div className="closer-alt"><Link href="/gallery">See more work →</Link><Link href="/pricing">See pricing →</Link></div>
        </div>
      </section>
    </>
  )
}
