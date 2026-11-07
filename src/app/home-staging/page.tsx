import type { Metadata } from 'next'
import Link from 'next/link'
import Landing from '@/components/seo/Landing'
import ServiceQuoteForm from '@/components/home-services/ServiceQuoteForm'
import '@/components/home-services/home-services.css'
import { tradeBySlug } from '@/lib/services'
import { focusedServiceSchema } from '@/lib/schema'
import { OG_IMAGE } from '@/lib/og'

const URL = 'https://www.brxs.ca/home-staging'
const T = tradeBySlug('staging')!
const TITLE = 'Home Staging for Listings, Quoted in Writing | Bricks'
const DESC = 'Home staging for vacant and lived-in homes, booked inside Bricks. A written quote first, install before the photo visit, removal when the listing closes.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/home-staging' },
  openGraph: { title: TITLE, description: DESC, url: URL, images: [OG_IMAGE] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE] },
}

const FAQS = [
  { q: 'How much does home staging cost?', a: 'It depends on the rooms staged, the inventory, the install and removal dates and how long the furniture stays. Bricks doesn’t list prices: every job is quoted in writing, and nothing is booked or charged until you approve the quote.' },
  { q: 'Can you stage a home that people still live in?', a: 'Yes. For occupied homes the stager edits and restyles what’s there, with accent pieces where they help.' },
  { q: 'When is the furniture installed and removed?', a: 'Install is scheduled before the photo visit, so the rooms are ready for the photographer. Removal is when the listing closes or the rental period ends.' },
  { q: 'Who is staging for?', a: 'Agents and teams with listings, builders with model suites and inventory homes, and investors or property managers with units between tenants.' },
]

export default function HomeStagingPage() {
  return (
    <Landing
      schemas={[focusedServiceSchema({ url: URL, id: '/home-staging#service', name: 'Home staging', serviceType: 'Home staging', description: T.description })]}
      h1="Home staging, timed with your listing photos."
      sub="Staging for vacant and lived-in homes, quoted in writing and scheduled so the rooms are ready when the photographer arrives."
      primary={{ href: '#quote', label: 'Request a staging quote' }}
      secondary={{ href: '/services', label: 'All home services' }}
      sections={[
        { title: 'What the stager handles.', rows: T.handles },
        {
          title: 'How a staging job runs.',
          body: (
            <ol>
              <li><strong>Request a quote</strong> with the address, the rooms and your listing date.</li>
              <li><strong>Get a written quote</strong> covering rooms, inventory, install and removal dates and the rental period.</li>
              <li><strong>Approve it.</strong> Nothing is booked or charged before you do.</li>
              <li><strong>Install</strong> happens before the photo visit. You get photos of each staged room.</li>
              <li><strong>Photos and showings.</strong> Book the <Link href="/real-estate-photography">listing shoot</Link> for after the install.</li>
              <li><strong>Removal</strong> when the listing closes or the rental ends. All dates stay with the property in your Bricks account.</li>
            </ol>
          ),
        },
        { title: 'What you get back.', rows: T.receive },
        {
          title: 'Vacant or lived-in?',
          body: (
            <>
              <p>An empty home photographs as bare floors and walls, and buyers struggle to judge room sizes. Staging a vacant home brings in furniture, rugs, art and accessories to show how each room works.</p>
              <p>A lived-in home usually needs editing more than furniture: fewer things on surfaces, a clearer layout, a few accent pieces. Either way, pair it with a <Link href="/move-out-cleaning">pre-listing deep clean</Link> before the install.</p>
            </>
          ),
        },
        {
          id: 'quote',
          title: 'Request a staging quote.',
          lede: 'Tell us about the property. A person at Bricks quotes every job in writing.',
          raw: <div className="hs hs-quote"><ServiceQuoteForm trade="staging" /></div>,
          note: <>How it works: <Link href="/help/home-services/how-quote-requests-work">quote requests</Link> · <Link href="/help/home-services/home-staging">home staging help</Link></>,
        },
      ]}
      faqTitle="Home staging, answered."
      faqs={FAQS}
      close={{ title: 'Stage it before the shoot.', href: '#quote', label: 'Request a staging quote' }}
    />
  )
}
