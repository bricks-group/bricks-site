import type { Metadata } from 'next'
import Link from 'next/link'
import Landing from '@/components/seo/Landing'
import VirtualVisitEmbed from '@/components/VirtualVisitEmbed'
import { TOUR_RATE, TOUR_RANGE, VISIT_RATE, VISIT_RANGE, SHOWCASE_FROM, bandCells } from '@/lib/pricing'
import { TOUR_NAME, VISIT_NAME, VISIT_PACKAGING } from '@/lib/brand'
import { focusedServiceSchema, virtualVisitServiceSchema } from '@/lib/schema'
import { BAND_DETAIL } from '@/lib/landing'
import { OG_IMAGE } from '@/lib/og'

const URL = 'https://www.brxs.ca/virtual-tours'
const TITLE = '3D Virtual Tours for Real Estate Listings in Canada | Bricks'
const DESC = `Virtual tours for real estate listings, ${TOUR_RANGE} by home size, and Virtual Visit free-roam 3D, ${VISIT_RANGE}. Captured on the listing shoot and booked inside Bricks.`

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/virtual-tours' },
  openGraph: { title: TITLE, description: DESC, url: URL, images: [OG_IMAGE] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE] },
}

const FAQS = [
  { q: 'What is the difference between a virtual tour and a Virtual Visit?', a: `A ${TOUR_NAME.toLowerCase()} moves viewers along a set path through the home. A ${VISIT_NAME} is free-roam 3D: viewers move anywhere in the space. They are separate products with separate prices.` },
  { q: 'How much does a virtual tour cost?', a: `A ${TOUR_NAME.toLowerCase()} is ${bandCells(TOUR_RATE).join(' / ')} CAD before HST by footprint. It is included in Showcase (from $${SHOWCASE_FROM}) and Full suite.` },
  { q: 'Is Virtual Visit included in a package?', a: `No. ${VISIT_NAME} is ${bandCells(VISIT_RATE).join(' / ')} by footprint. ${VISIT_PACKAGING}` },
  { q: 'Can I put the tour on MLS and my listing site?', a: 'Yes. Media arrives as a link you can use on MLS®, your website and social, along with a property website for the listing.' },
]

export default function VirtualToursPage() {
  return (
    <Landing
      schemas={[
        focusedServiceSchema({ url: URL, id: '/virtual-tours#service', name: 'Real estate virtual tours', serviceType: 'Virtual tour for real estate listings', description: 'A path-confined virtual tour captured on the listing shoot, plus Virtual Visit free-roam 3D as a separate add-on.', offers: ['tour', 'showcase', 'visit'] }),
        virtualVisitServiceSchema(`${URL}#virtual-visit`),
      ]}
      h1="Virtual tours for real estate listings."
      sub="Let buyers walk the home before they book a showing. Choose a guided virtual tour, or Virtual Visit, free-roam 3D they can explore on their own."
      primary={{ href: '/book', label: 'Book a virtual tour' }}
      secondary={{ href: '/pricing', label: 'See pricing' }}
      sections={[
        {
          title: 'Two ways to walk a home online.',
          body: (
            <div className="table-wrap">
              <table>
                <thead><tr><th></th><th>{TOUR_NAME}</th><th>{VISIT_NAME}</th></tr></thead>
                <tbody>
                  <tr><td>How viewers move</td><td>Along a set path through the home</td><td>Anywhere, in free-roam 3D</td></tr>
                  <tr><td>Best for</td><td>A guided walk through the layout</td><td>Buyers or renters exploring on their own</td></tr>
                  <tr><td>In a package</td><td>Showcase and Full suite</td><td>Never. Always an add-on</td></tr>
                  <tr><td>Price by band</td><td className="num">{bandCells(TOUR_RATE).join(' / ')}</td><td className="num">{bandCells(VISIT_RATE).join(' / ')}</td></tr>
                </tbody>
              </table>
            </div>
          ),
          note: <>Bands: {BAND_DETAIL.join(' · ')}. CAD, before travel and HST.</>,
        },
        {
          id: 'virtual-visit',
          title: 'Try a Virtual Visit.',
          lede: 'Drag to look around and move through the space. This is a live capture, not a mock-up.',
          body: <div className="landing-embed"><VirtualVisitEmbed /></div>,
        },
        {
          title: 'Captured on the same visit.',
          rows: [
            { title: 'One booking', detail: 'Photos, drone, floor plan and the tour are shot in one visit at a time you pick.' },
            { title: 'Delivered with the listing', detail: 'The tour link lands with the rest of the media, with a property website for the listing.' },
            { title: 'Works anywhere', detail: 'Share it on MLS®, your site, email and social.' },
          ],
        },
        {
          title: 'Choosing between a tour and video?',
          body: <p>A tour helps buyers understand the layout. A film sells the feeling of the place. Read <Link href="/blog/3d-tour-vs-video-walkthrough">virtual tour vs. video walkthrough</Link>, or see <Link href="/real-estate-video">real estate video</Link>.</p>,
        },
      ]}
      faqTitle="Virtual tours, answered."
      faqs={FAQS}
      close={{ title: 'Add a tour to your next listing.', href: '/book', label: 'Book a virtual tour' }}
    />
  )
}
