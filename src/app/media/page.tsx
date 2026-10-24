import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import MediaShowcase from '@/components/media-showcase/MediaShowcase'
import './media-page.css'
import { Head, Rows, Close } from '@/components/calm/Calm'
import { CORE_FROM } from '@/lib/pricing'

export const metadata: Metadata = {
  title: 'Listing media — photos, drone, floor plans, film and 3D | Bricks',
  description: 'HDR listing photos, licensed drone, floor plans, cinematic reels and virtual tours, booked online and delivered inside Bricks. Virtual Visit 3D on request.',
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
  { t: 'Virtual Visit', d: 'Free-roam 3D, quoted on request.' },
  { t: 'Twilight', d: 'The exterior at blue hour.' },
  { t: 'Virtual staging', d: 'Furnished rooms, per photo.' },
  { t: 'One listing file', d: 'Media lands in the listing file in Bricks.' },
] as const

export default function MediaPage() {
  return (
    <>
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <h1>Listing media, booked inside Bricks.</h1>
          <p className="sub">Photos, drone, floor plans, film and 3D at an exact time. Delivery lands on the listing.</p>
          <div className="cta-row">
            <Link className="btn btn-night btn-primary" href="/book">Book media</Link>
          </div>
        </div>
      </section>

      <MediaShowcase />

      <section className="cm-sec rvl" aria-label="What's included">
        <Head title="Every part of the listing." link={{ href: '/pricing', label: 'See pricing' }} />
        <Rows items={PARTS.map((p) => ({ title: p.t, detail: p.d }))} />
        <p className="cm-note">Essentials, from ${CORE_FROM}, covers HDR photos, licensed drone and a floor plan. Prices scale with home size.</p>
      </section>

      <Close title="Ready when the listing is." href="/book" label="Book media" />
    </>
  )
}
