import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Landing from '@/components/seo/Landing'
import { PHOTO_RATE, DRONE_RANGE, TOUR_RANGE, REEL_RANGE, CORE_FROM, PHOTO_ONLY_FROM } from '@/lib/pricing'
import { focusedServiceSchema, cityAreaSchema } from '@/lib/schema'
import { bandRows } from '@/lib/landing'
import { CITY_PAGES, cityPage } from '@/lib/city-pages'
import { OG_IMAGE } from '@/lib/og'

export const dynamicParams = false

export function generateStaticParams() {
  return CITY_PAGES.map((c) => ({ city: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const c = cityPage((await params).city)
  if (!c) return {}
  const path = `/real-estate-photography/${c.slug}`
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: path },
    openGraph: { title: c.title, description: c.description, url: `https://www.brxs.ca${path}`, images: [OG_IMAGE] },
    twitter: { card: 'summary_large_image', title: c.title, description: c.description, images: [OG_IMAGE] },
  }
}

export default async function CityPhotographyPage({ params }: { params: Promise<{ city: string }> }) {
  const c = cityPage((await params).city)
  if (!c) notFound()
  const url = `https://www.brxs.ca/real-estate-photography/${c.slug}`
  const others = CITY_PAGES.filter((o) => o.slug !== c.slug)
  return (
    <Landing
      schemas={[focusedServiceSchema({
        url, id: `/real-estate-photography/${c.slug}#service`, name: `Real estate photography in ${c.city}`,
        serviceType: 'Real estate photography', description: c.description,
        offers: ['photos_only', 'essentials', 'drone', 'tour'], areaServed: cityAreaSchema(c.city, c.province),
      })]}
      h1={c.h1}
      sub={c.sub}
      primary={{ href: '/book', label: `Book a shoot in ${c.city}` }}
      secondary={{ href: '/pricing', label: 'See pricing' }}
      sections={[
        { title: c.coverage === 'base' ? 'Our home base.' : 'Confirmed when you book.', body: <><p>{c.coverageLine}</p><p>See every area on the <Link href="/service-areas">service areas map</Link>.</p></> },
        { title: `Shooting ${c.city} listings.`, rows: c.local, body: <>{c.localProse.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}</> },
        {
          title: 'HDR photos, priced by home size.',
          link: { href: '/pricing', label: 'Full pricing' },
          rows: bandRows(PHOTO_RATE),
          note: <>Photos only from ${PHOTO_ONLY_FROM}. Essentials (HDR photos, licensed drone and a floor plan) from ${CORE_FROM}. Add drone {DRONE_RANGE}, a virtual tour {TOUR_RANGE} or a film {REEL_RANGE}. CAD, before travel and tax.</>,
        },
        {
          title: 'More on listing media.',
          rows: [
            { title: 'Drone photography', href: '/drone-photography' },
            { title: 'Virtual tours', href: '/virtual-tours' },
            { title: 'Real estate video', href: '/real-estate-video' },
            { title: 'Real estate photography costs in Canada', href: '/blog/canada-real-estate-photography-cost-2026' },
            ...others.map((o) => ({ title: `Real estate photography in ${o.city}`, href: `/real-estate-photography/${o.slug}` })),
          ],
        },
      ]}
      faqTitle={`${c.city} listing photos, answered.`}
      faqs={c.faqs}
      close={{ title: `Book your ${c.city} listing shoot.`, href: '/book', label: `Book a shoot in ${c.city}` }}
    />
  )
}
