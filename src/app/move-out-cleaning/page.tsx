import type { Metadata } from 'next'
import Link from 'next/link'
import Landing from '@/components/seo/Landing'
import ServiceQuoteForm from '@/components/home-services/ServiceQuoteForm'
import '@/components/home-services/home-services.css'
import { tradeBySlug } from '@/lib/services'
import { focusedServiceSchema } from '@/lib/schema'
import { OG_IMAGE } from '@/lib/og'

const URL = 'https://www.brxs.ca/move-out-cleaning'
const T = tradeBySlug('cleaning')!
const TITLE = 'Move-Out, Turnover & Pre-Listing Cleaning | Bricks'
const DESC = 'Move-out cleaning, rental turnovers and pre-listing deep cleans, at set prices from $229, booked in Bricks, with room-by-room photo proof when it’s done.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/move-out-cleaning' },
  openGraph: { title: TITLE, description: DESC, url: URL, images: [OG_IMAGE] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE] },
}

const FAQS = [
  { q: 'How much does a move-out clean cost?', a: 'Set prices before HST: $229 for a studio or 1 bed, $279 for 2 beds, $369 for 3 beds or a townhouse, and $449 to $649 for a house by size.' },
  { q: 'Do I get proof the clean was done?', a: 'Yes. Room-by-room photos when the clean is done, plus the completed checklist, kept with the property in your Bricks account.' },
  { q: 'Can you clean between tenants on my own checklist?', a: 'Yes. Rental turnovers are cleaned on a checklist you approve.' },
]

export default function MoveOutCleaningPage() {
  return (
    <Landing
      schemas={[focusedServiceSchema({ url: URL, id: '/move-out-cleaning#service', name: 'Move-out and turnover cleaning', serviceType: 'Move-out cleaning', description: T.description })]}
      h1="Move-out and turnover cleaning, with photo proof."
      sub="Empty units cleaned top to bottom between owners or tenants, and deep cleans timed before listing photos. Set prices, tracked in Bricks."
      primary={{ href: '#book', label: 'Book a clean' }}
      secondary={{ href: '/blog/move-out-cleaning-checklist', label: 'Move-out checklist' }}
      sections={[
        { title: 'Cleans Bricks arranges.', rows: T.handles },
        {
          title: 'Built for turnovers.',
          body: (
            <>
              <p>Between tenants, the clean is one step of several: the move-out condition report, the clean, any touch-ups, then the move-in report and new listing photos. Bricks keeps them on the same unit, so the clean’s photos and checklist sit next to the reports.</p>
              <p>Property managers can book move-out condition reports and listing sets online at <Link href="/property-managers">property managers</Link>, and request the clean here. What to photograph is in our guide to <Link href="/blog/move-out-condition-report-ontario">move-in and move-out condition reports</Link>.</p>
            </>
          ),
        },
        { title: 'What you get back.', rows: T.receive },
        {
          id: 'book',
          title: 'Book a clean.',
          lede: 'Tell us the address, the type of clean and the date you need it done by.',
          raw: <div className="hs hs-quote"><ServiceQuoteForm trade="cleaning" /></div>,
          note: <>How it works: <Link href="/help/home-services/how-quote-requests-work">booking home services</Link> · <Link href="/help/home-services/cleaning-and-turnovers">cleaning help</Link></>,
        },
      ]}
      faqTitle="Move-out cleaning, answered."
      faqs={FAQS}
      close={{ title: 'Get the unit ready.', href: '#book', label: 'Book a clean' }}
    />
  )
}
