import type { Metadata } from 'next'
import Link from 'next/link'
import BlogPostLayout from '@/components/BlogPostLayout'
import { blogPostingSchema, faqPageSchema } from '@/lib/schema'
import { OG_IMAGE, OG_IMAGE_URL } from '@/lib/og'
import { postMeta } from '@/lib/content/posts'

const SLUG = 'home-inspection-cost-ontario'
const META = postMeta(SLUG)
const PATH = `/blog/${SLUG}`
const HEADLINE = 'Home inspection cost in Ontario: what sets the price'
const TITLE = `${HEADLINE} | Bricks`
const DESC = 'What moves the price of a home inspection in Ontario, which tests cost extra, what to check before you hire an inspector, and what Bricks charges.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
  openGraph: { type: 'article', title: TITLE, description: DESC, images: [OG_IMAGE], url: `https://www.brxs.ca${PATH}` },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE] },
}

const FAQS = [
  { q: 'How much does a home inspection cost in Ontario?', a: 'Prices aren’t regulated and vary by inspector. Size, age and type of home, plus any add-on tests, move the price most. A condo usually costs less than a large or older detached home. Always get the price in writing first.' },
  { q: 'Do home inspectors need a licence in Ontario?', a: 'Not today. Ontario passed the Home Inspection Act, 2017, but it is not yet in force, so there is no provincial licence. Ask about training, insurance and a sample report.' },
  { q: 'Who pays for a home inspection?', a: 'Whoever orders it. Sellers pay for a pre-listing inspection, and buyers pay for a pre-purchase inspection.' },
  { q: 'Is a condo inspection cheaper?', a: 'Usually. There is less to inspect inside a unit, and the building’s shared systems are managed by the condo corporation. ' },
  { q: 'How does Bricks price an inspection?', a: 'Set prices before HST: $349 for a condo, $399 for a townhouse or semi, and $449 to $629 for a detached home by size. Inspections are Ontario only.' },
]

export default function Post() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema({ path: PATH, headline: HEADLINE, description: DESC, datePublished: META.published, dateModified: META.reviewedOn, keywords: 'home inspection cost Ontario, home inspection cost Toronto, home inspection price, pre-listing inspection, pre-purchase inspection', image: OG_IMAGE_URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQS)) }} />
      <BlogPostLayout
        slug={SLUG}
        badge="Resources · Home services"
        title={HEADLINE}
        sub="What moves the price, which tests cost extra, and what to check before you hire an inspector."
        cta={{ href: '/home-inspection-ontario', label: 'Book an inspection' }}
        related={[
          { href: '/home-inspection-ontario', label: 'Home inspections in Ontario' },
          { href: '/home-staging', label: 'Home staging' },
          { href: '/move-out-cleaning', label: 'Move-out and pre-listing cleaning' },
          { href: '/help/home-services/how-quote-requests-work', label: 'How booking works' },
        ]}
      >
        <p className="lead">
          A home inspection is one of the smaller costs in an Ontario sale, and one of the most useful. Prices aren’t regulated and vary by inspector, so ask for the full price before you book.
        </p>

        <h2>What moves the price</h2>
        <ul>
          <li><strong>Size.</strong> More rooms and more square footage mean more time on site and a longer report.</li>
          <li><strong>Age.</strong> Older homes have more systems to trace: wiring, plumbing, foundations, past renovations.</li>
          <li><strong>Type.</strong> A condo unit has less to inspect than a detached house with a roof, a basement and a yard.</li>
          <li><strong>Add-on tests.</strong> Radon, mould, sewer scope and thermal imaging are usually extra.</li>
          <li><strong>Timing.</strong> A buyer in a short conditional period may need the inspector quickly.</li>
          <li><strong>Distance.</strong> Rural properties can add travel.</li>
        </ul>

        <h2>Before you hire an inspector</h2>
        <p>Ontario has no licence for home inspectors yet. The Home Inspection Act, 2017 was passed but has not come into force. That means you should ask each inspector about their training, their insurance and what their report looks like. Ask for a sample.</p>

        <h2>Pre-listing or pre-purchase?</h2>
        <p><strong>Pre-listing</strong> inspections are ordered by sellers to find and fix issues before buyers do, and to hand buyers a report up front. <strong>Pre-purchase</strong> inspections are ordered by buyers, usually as a condition of the offer. Condo and new-build inspections before possession usually produce a deficiency list for the builder.</p>

        <h2>What a good report includes</h2>
        <ul>
          <li>Findings organised by system and area: structure, roof, exterior, electrical, plumbing, heating and cooling, interior.</li>
          <li>Photos of each finding.</li>
          <li>What needs attention now, what to watch, and what to have a specialist look at.</li>
        </ul>

        <h2>Booking through Bricks</h2>
        <p>
          Bricks arranges <Link href="/home-inspection-ontario">home and building inspections in Ontario</Link>: pre-listing, pre-purchase, condo and new-build. Inspectors come from a vetted network: a person at Bricks reviews every application and checks proof of insurance before they take jobs. Every inspection has a set price, from $349 for a condo. The written report with photos is kept with the property in your Bricks account.
        </p>

        <h2>FAQ</h2>
        <div className="faq">
          {FAQS.map((f) => <div className="qa" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
        </div>
      </BlogPostLayout>
    </>
  )
}
