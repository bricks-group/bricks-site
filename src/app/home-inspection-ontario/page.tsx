import type { Metadata } from 'next'
import Link from 'next/link'
import Landing from '@/components/seo/Landing'
import ServiceQuoteForm from '@/components/home-services/ServiceQuoteForm'
import '@/components/home-services/home-services.css'
import { tradeBySlug } from '@/lib/services'
import { focusedServiceSchema, ONTARIO_AREA_SCHEMA } from '@/lib/schema'
import { OG_IMAGE } from '@/lib/og'

const URL = 'https://www.brxs.ca/home-inspection-ontario'
const T = tradeBySlug('inspections')!
const TITLE = 'Home Inspections in Ontario: Pre-Listing & Purchase | Bricks'
const DESC = 'Pre-listing, pre-purchase, condo and new-build home inspections in Ontario by vetted inspectors, with a written photo report kept on the property file.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/home-inspection-ontario' },
  openGraph: { title: TITLE, description: DESC, url: URL, images: [OG_IMAGE] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE] },
}

const FAQS = [
  { q: 'Where do you offer home inspections?', a: 'In Ontario only. Send the address with your request and Bricks confirms an inspector for it when you book. Bricks does not arrange inspections outside Ontario.' },
  { q: 'How much does a home inspection cost?', a: 'Set prices before HST: $349 for a condo, $399 for a townhouse or semi, and $449 to $629 for a detached home by size.' },
  { q: 'Do inspectors need insurance?', a: 'Yes. Inspectors come from our vetted network: a person reviews every application. Insurance is required for inspection vendors, and Bricks checks the proof before they take jobs.' },
  { q: 'What’s in the report?', a: 'A written report with photos, organised by system and area, kept with the property in your Bricks account.' },
]

export default function HomeInspectionOntarioPage() {
  return (
    <Landing
      schemas={[focusedServiceSchema({ url: URL, id: '/home-inspection-ontario#service', name: 'Home and building inspections in Ontario', serviceType: 'Home inspection', description: T.description, areaServed: ONTARIO_AREA_SCHEMA })]}
      h1="Home inspections in Ontario."
      sub="Pre-listing, pre-purchase, condo and new-build inspections by vetted inspectors, with the report kept on the property in Bricks."
      primary={{ href: '#book', label: 'Book an inspection' }}
      secondary={{ href: '/blog/home-inspection-cost-ontario', label: 'What inspections cost' }}
      sections={[
        { title: 'Inspections Bricks arranges.', rows: T.handles, note: 'Available in Ontario only.' },
        {
          title: 'Pre-listing or pre-purchase?',
          body: (
            <>
              <p><strong>A pre-listing inspection</strong> is ordered by the seller before the home goes on the market. It surfaces issues while there’s still time to fix them or price them in, and gives buyers a report to read before they offer.</p>
              <p><strong>A pre-purchase inspection</strong> is ordered by the buyer, usually during the conditional period. It tells the buyer what they’re taking on before the deal firms up. Book it early: conditional periods are short.</p>
              <p><strong>Condo and new-build inspections</strong> cover a unit or a new home before possession, including a deficiency list for the builder.</p>
            </>
          ),
        },
        { title: 'What you get back.', rows: T.receive },
        {
          id: 'book',
          title: 'Book an inspection.',
          lede: 'Give us the Ontario address, the home type and your timing.',
          raw: <div className="hs hs-quote"><ServiceQuoteForm trade="inspections" /></div>,
          note: <>How it works: <Link href="/help/home-services/how-quote-requests-work">booking home services</Link> · <Link href="/help/home-services/home-inspections">inspections help</Link></>,
        },
      ]}
      faqTitle="Home inspections, answered."
      faqs={FAQS}
      close={{ title: 'Inspect before you list or buy.', href: '#book', label: 'Book an inspection' }}
    />
  )
}
