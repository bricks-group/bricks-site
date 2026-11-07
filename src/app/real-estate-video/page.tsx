import type { Metadata } from 'next'
import Link from 'next/link'
import Landing from '@/components/seo/Landing'
import { REEL_RATE, REEL_RANGE, STORY_FROM } from '@/lib/pricing'
import { focusedServiceSchema } from '@/lib/schema'
import { bandRows } from '@/lib/landing'
import { OG_IMAGE } from '@/lib/og'

const URL = 'https://www.brxs.ca/real-estate-video'
const TITLE = 'Real Estate Video & Listing Films in Canada | Bricks'
const DESC = `Calm, editorial listing films for real estate, 30 to 45 seconds, edited in-house. ${REEL_RANGE} by home size, or in Story from $${STORY_FROM}. Booked inside Bricks.`

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/real-estate-video' },
  openGraph: { title: TITLE, description: DESC, url: URL, images: [OG_IMAGE] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE] },
}

const FAQS = [
  { q: 'How long is a Bricks listing film?', a: 'A cinematic reel runs 30 to 45 seconds. It is cut for MLS®, your website and social.' },
  { q: 'What does real estate video cost?', a: `A cinematic reel is ${REEL_RANGE} CAD before HST, by footprint. Story bundles it with HDR photos, drone and a floor plan from $${STORY_FROM}.` },
  { q: 'What style are the films?', a: 'Calm and editorial: slow, steady moving pictures of the home with natural light, not fast cuts or effects.' },
  { q: 'Who edits the video?', a: 'Every photo and film is edited by Bricks in-house. Other media, including film, is usually delivered within 24–48 hours.' },
]

export default function RealEstateVideoPage() {
  return (
    <Landing
      schemas={[focusedServiceSchema({ url: URL, id: '/real-estate-video#service', name: 'Real estate video', serviceType: 'Real estate videography', description: 'Calm, editorial listing films of 30 to 45 seconds, shot on the listing visit and edited in-house by Bricks.', offers: ['reel', 'story'] })]}
      h1="Real estate video, made like moving pictures."
      sub="Short, calm films of the home: steady movement, natural light, and room to breathe. Shot on the same visit as your photos."
      primary={{ href: '/book', label: 'Book a listing film' }}
      secondary={{ href: '/media#film', label: 'Watch a film' }}
      sections={[
        {
          title: 'What you get.',
          rows: [
            { title: 'A 30 to 45 second film', detail: 'The home in slow, steady shots, inside and out.' },
            { title: 'Shot with the stills', detail: 'One visit for photos, drone and film, at the time you pick.' },
            { title: 'Edited in-house', detail: 'Every photo and film is edited by Bricks, not outsourced.' },
            { title: 'Ready to post', detail: 'For MLS®, your listing site and social.' },
          ],
        },
        {
          title: 'Why calm works.',
          body: (
            <>
              <p>Buyers already scroll past fast cuts and transitions. A slow film gives them time to read a room: where the light comes in, how one space opens into the next, what the street feels like. That’s the job of a listing film, and it’s why Bricks films are editorial rather than flashy.</p>
              <p>If buyers need to understand the floor plan, a <Link href="/virtual-tours">virtual tour</Link> does that better. Many listings use both. See <Link href="/blog/3d-tour-vs-video-walkthrough">virtual tour vs. video walkthrough</Link>.</p>
            </>
          ),
        },
        {
          title: 'Priced by home size.',
          link: { href: '/pricing', label: 'Full pricing' },
          rows: bandRows(REEL_RATE),
          note: <>Story includes the film with HDR photos, licensed drone and a floor plan, from ${STORY_FROM}. CAD, before travel and HST.</>,
        },
      ]}
      faqTitle="Real estate video, answered."
      faqs={FAQS}
      close={{ title: 'Add a film to your next listing.', href: '/book', label: 'Book a listing film' }}
    />
  )
}
