import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import MediaShowcase from '@/components/media-showcase/MediaShowcase'
import './media-page.css'
import { Head, Rows, Close } from '@/components/calm/Calm'
import { CORE_FROM, VIRTUAL_STAGING_ENABLED } from '@/lib/pricing'
import PublicFaqs from '@/components/PublicFaqs'
import { MEDIA_FAQS } from '@/lib/public-content'
import { mediaServiceSchema, virtualVisitServiceSchema } from '@/lib/schema'
import { OG_IMAGE } from '@/lib/og'

export const metadata: Metadata = {
  title: "Listing Media: Photos, Drone, Floor Plans & 3D | Bricks",
  description: "Explore listing media services inside Bricks, including HDR photos, licensed drone, floor plans, cinematic reels and Virtual Visit 3D for your next listing.",
  alternates: { canonical: '/media' },
  openGraph: { images: [OG_IMAGE],
    title: "Listing Media: Photos, Drone, Floor Plans & 3D | Bricks",
    description: "Explore listing media services inside Bricks, including HDR photos, licensed drone, floor plans, cinematic reels and Virtual Visit 3D for your next listing.",
  },
}

const PARTS = [
  { t: 'HDR photos', d: 'Balanced HDR on every shoot.' },
  { t: 'Licensed drone', d: 'Aerials of the property.' },
  { t: 'Floor plans', d: 'Included from Essentials up.' },
  { t: 'Cinematic reel', d: 'A short film for the listing.' },
  { t: 'Virtual Visit', d: 'Free-roam 3D, booked as an add-on.' },
  { t: 'Twilight', d: 'The exterior at blue hour.' },
  ...(VIRTUAL_STAGING_ENABLED ? [{ t: 'Virtual staging', d: 'Furnished rooms, per photo.' }] : []),
  { t: 'One listing file', d: 'Media lands in the listing file in Bricks.' },
] as const

export default function MediaPage() {
  return (
    <>
      <RevealObserver />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(mediaServiceSchema({ url: 'https://www.brxs.ca/media', offers: ['essentials'] })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(virtualVisitServiceSchema('https://www.brxs.ca/media#virtual-visit')) }} />
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

      <div id="virtual-visit"><PublicFaqs title="Questions about listing media." faqs={MEDIA_FAQS} /></div>
      <Close title="Ready when the listing is." href="/book" label="Book media" />
    </>
  )
}
