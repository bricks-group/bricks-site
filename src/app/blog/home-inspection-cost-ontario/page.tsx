import type { Metadata } from 'next'
import Link from 'next/link'
import BlogPostLayout from '@/components/BlogPostLayout'
import { blogPostingSchema, faqPageSchema } from '@/lib/schema'
import { OG_IMAGE, OG_IMAGE_URL } from '@/lib/og'

const PATH = '/blog/home-inspection-cost-ontario'
const TITLE = 'Home Inspection Cost in Ontario (2026): Prices | Bricks'
const DESC = 'What a home inspection costs in Ontario in 2026, from published price guides, what moves the price, which add-ons cost extra, and how to get a written quote.'
const HOMESTARS = 'https://www.homestars.com/green-energy-diagnostics/price-guides/home-inspection-cost-toronto'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
  openGraph: { type: 'article', title: TITLE, description: DESC, images: [OG_IMAGE], url: `https://www.brxs.ca${PATH}` },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE] },
}

const FAQS = [
  { q: 'How much does a home inspection cost in Ontario?', a: 'HomeStars’ Toronto price guide puts most home inspections between about $350 and $600, with condos lower and large or older homes higher. Size, age, type of home and add-on tests move the price.' },
  { q: 'Who pays for a home inspection?', a: 'Whoever orders it. Sellers pay for a pre-listing inspection, and buyers pay for a pre-purchase inspection.' },
  { q: 'Is a condo inspection cheaper?', a: 'Usually. There is less to inspect inside a unit, and the building’s shared systems are managed by the condo corporation. Published guides list condo inspections below detached homes.' },
  { q: 'How does Bricks price an inspection?', a: 'Bricks quotes every inspection in writing based on the type of inspection, the home and the report. Inspections are Ontario only, and nothing is booked or charged until you approve the quote.' },
]

export default function Post() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema({ path: PATH, headline: 'Home inspection cost in Ontario (2026): what sets the price', description: DESC, datePublished: '2026-11-07', keywords: 'home inspection cost Ontario, home inspection cost Toronto, home inspection price, pre-listing inspection, pre-purchase inspection', image: OG_IMAGE_URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQS)) }} />
      <BlogPostLayout
        badge="Guides · Home services · Ontario"
        title="Home inspection cost in Ontario (2026): what sets the price"
        sub="Typical ranges from published price guides, what moves the number, and how to get a written quote before you book."
        cta={{ href: '/home-inspection-ontario', label: 'Request an inspection quote' }}
        related={[
          { href: '/home-inspection-ontario', label: 'Home inspections in Ontario' },
          { href: '/home-staging', label: 'Home staging' },
          { href: '/move-out-cleaning', label: 'Move-out and pre-listing cleaning' },
          { href: '/help/home-services/how-quote-requests-work', label: 'How quote requests work' },
        ]}
      >
        <p className="lead">
          A home inspection is one of the smaller costs in an Ontario sale, and one of the most useful. Prices aren’t regulated and vary by inspector, but published price guides give a fair picture of what to expect.
        </p>

        <h2>Typical ranges</h2>
        <p>
          These are third-party figures from <a href={HOMESTARS} rel="noopener">HomeStars’ Toronto home inspection price guide</a>, not Bricks prices. Other Ontario markets are in a similar range, but always check a written quote.
        </p>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Home</th><th className="num">Typical range (CAD)</th></tr></thead>
            <tbody>
              <tr><td>Condo or apartment</td><td className="num">$275–$400</td></tr>
              <tr><td>Townhouse</td><td className="num">$350–$500</td></tr>
              <tr><td>Detached home</td><td className="num">$400–$600</td></tr>
              <tr><td>Large or older home</td><td className="num">$550–$700+</td></tr>
            </tbody>
          </table>
        </div>
        <p>The same guide lists common add-ons separately: thermal imaging around $100–$250, radon testing around $200–$300, mould inspection around $250–$400 and a sewer line scope around $250–$400.</p>

        <h2>What moves the price</h2>
        <ul>
          <li><strong>Size.</strong> More rooms and more square footage mean more time on site and a longer report.</li>
          <li><strong>Age.</strong> Older homes have more systems to trace: wiring, plumbing, foundations, past renovations.</li>
          <li><strong>Type.</strong> A condo unit has less to inspect than a detached house with a roof, a basement and a yard.</li>
          <li><strong>Add-on tests.</strong> Radon, mould, sewer scope and thermal imaging are usually extra.</li>
          <li><strong>Timing.</strong> A buyer in a short conditional period may need the inspector quickly.</li>
          <li><strong>Distance.</strong> Rural properties can add travel.</li>
        </ul>

        <h2>Pre-listing or pre-purchase?</h2>
        <p><strong>Pre-listing</strong> inspections are ordered by sellers to find and fix issues before buyers do, and to hand buyers a report up front. <strong>Pre-purchase</strong> inspections are ordered by buyers, usually as a condition of the offer. Condo and new-build inspections before possession usually produce a deficiency list for the builder.</p>

        <h2>What a good report includes</h2>
        <ul>
          <li>Findings organised by system and area: structure, roof, exterior, electrical, plumbing, heating and cooling, interior.</li>
          <li>Photos of each finding.</li>
          <li>What needs attention now, what to watch, and what to have a specialist look at.</li>
        </ul>

        <h2>Getting a quote through Bricks</h2>
        <p>
          Bricks arranges <Link href="/home-inspection-ontario">home and building inspections in Ontario</Link>: pre-listing, pre-purchase, condo and new-build. $2M commercial general liability insurance is required for inspection vendors, and a person at Bricks checks the certificate. Every job is quoted in writing, and nothing is booked or charged until you approve. The written report with photos is kept with the property in your Bricks account.
        </p>

        <h2>FAQ</h2>
        <div className="faq">
          {FAQS.map((f) => <div className="qa" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
        </div>
      </BlogPostLayout>
    </>
  )
}
