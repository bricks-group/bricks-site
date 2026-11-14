import type { Metadata } from 'next'
import Link from 'next/link'
import BlogPostLayout from '@/components/BlogPostLayout'
import { blogPostingSchema, faqPageSchema } from '@/lib/schema'
import { OG_IMAGE, OG_IMAGE_URL } from '@/lib/og'
import { OFFICE_PLANS, OFFICE_SEAT_PRICE_PER_MONTH } from '@/lib/catalog'
import { BROKERAGE_SOFTWARE_ONTARIO_FAQS as FAQS } from '@/lib/guide-faqs'

const PATH = '/blog/brokerage-software-ontario'
const TITLE = 'Brokerage Software in Ontario: What It Must Do | Bricks'
const DESC = 'What brokerage software needs to do for an Ontario office: trust accounting, commissions, roster, e-sign and MLS® feeds, and how Bricks prices seats.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
  openGraph: { type: 'article', title: TITLE, description: DESC, images: [OG_IMAGE], url: `https://www.brxs.ca${PATH}` },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE] },
}

export default function Post() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema({ path: PATH, headline: 'What brokerage software needs to do in Ontario', description: DESC, datePublished: '2026-11-14', keywords: 'brokerage software ontario, real estate brokerage software, brokerage back office software, trust accounting software real estate, commission tracking, RECO, TRESA, MLS® feed', image: OG_IMAGE_URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQS)) }} />
      <BlogPostLayout
        badge="Guides · Brokerages"
        title="What brokerage software needs to do in Ontario"
        sub="The five jobs an office system has to cover, and the questions to ask before you move your agents."
        cta={{ href: '/brokerage', label: 'Set up your brokerage' }}
        related={[
          { href: '/brokerage', label: 'Bricks for brokerages' },
          { href: '/software/payments', label: 'Payments, commissions and trust' },
          { href: '/software/teams-and-roles', label: 'Teams, brokerages and roles' },
          { href: '/software/integrations', label: 'Integrations: MLS® feeds and CRM' },
          { href: '/blog/what-is-a-real-estate-operating-system', label: 'What is a real estate operating system?' },
          { href: '/pricing', label: 'Pricing' },
        ]}
      >
        <p className="lead">
          Brokerage software in Ontario has to keep the office’s money, people and paperwork on one record: a trust ledger and commission plans, a roster with each agent’s seat and role, deal files with signed documents and an audit trail, and listing data pulled from your MLS® board. Bricks does this per seat, with trust accounting included.
        </p>
        <p>Most offices run these jobs in separate tools and reconcile them by hand at month end. The test of brokerage software is whether those jobs share one record, so a closed deal updates the commission, the agent’s statement and the trust ledger without anyone retyping it.</p>

        <h2>The five jobs</h2>
        <h3>1. Money: trust, commissions and statements</h3>
        <p>Commission plans with an effective date, records that appear as deals close, ready to approve and mark paid, agent statements by period, and the trust ledger in the same place. In Bricks this lives in the Finance section of a brokerage account. <Link href="/software/payments">How payments and trust work</Link>.</p>
        <h3>2. People: roster, seats and roles</h3>
        <p>Every agent, their seat, what they can see and who can book media on the office’s account. Teams inside the brokerage share a pipeline. <Link href="/software/teams-and-roles">Teams, brokerages and roles</Link>.</p>
        <h3>3. Deals and documents</h3>
        <p>One file per deal with price, commission, conditions, dates and documents. E-sign should leave evidence: Bricks keeps SHA-256 fingerprints of the original and the signed PDF, plus who sent, opened and signed, with times. Lawyers, mortgage brokers and inspectors get a private deal room that shows only their dates, conditions and documents. On a brokerage account, compliance shows incomplete deal files and documents waiting for review.</p>
        <h3>4. Listings and MLS® data</h3>
        <p>Listing details should come in from your board feed, not be typed twice. Bricks pulls from PropTx (TRREB) through the RESO Web API, Bridge Interactive (including Cornerstone and ITSO) or Repliers, on your own credentials. It never publishes or submits to your MLS®. Each listing gets an MLS® package, a feature sheet and a social pack you download and submit yourself. <Link href="/software/integrations">Integrations</Link>.</p>
        <h3>5. The work around the listing</h3>
        <p>Photos, drone, floor plans and video booked from the listing at an exact time, with the files delivered back to it. The roster sets who can book media on the office’s account.</p>

        <h2>What RECO expects, and what software can’t do for you</h2>
        {/* Counsel-cleared wording, 2026-11-14. */}
        <p>Ontario brokerages are regulated by RECO under the Trust in Real Estate Services Act, 2002. Money a brokerage holds in trust, like deposits, goes into a real estate trust account, and the records behind it have to be kept current and reconciled. Software helps keep those records in one place. It doesn’t replace the broker of record’s duties or your accountant, so check RECO’s current guidance for the exact rules.</p>

        <h2>Questions to ask any vendor</h2>
        <ul>
          <li>Is trust accounting included, or a separate product?</li>
          <li>Is pricing per seat or per office, and can we pay month to month?</li>
          <li>Does it pull from our MLS® feed, and does it ever post to it?</li>
          <li>Does e-sign keep an audit trail we could show if a signature is questioned?</li>
          <li>Can outside parties on a deal see only their part?</li>
          <li>Can agents book listing media from the listing, and see the full price first?</li>
        </ul>

        <h2>How Bricks prices it</h2>
        <p>Every seat gets all of <Link href="/brokerage">Bricks for brokerages</Link>, plus trust accounting for the office. Agents don’t pay separately. Listing media is billed separately. Prices are CAD, before tax.</p>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Tier</th><th>Seats</th><th className="num">Per seat, yearly</th><th className="num">Per seat, monthly</th></tr></thead>
            <tbody>
              {OFFICE_PLANS.map((p) => (
                <tr key={p.id}><td>{p.name}</td><td>{p.seats.replace(' seats', '')}</td><td className="num">${p.seatPricePerYear}</td><td className="num">${OFFICE_SEAT_PRICE_PER_MONTH[p.id]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>Fewer than five agents? A <Link href="/teams">team plan</Link> covers up to six agents on the lead’s plan. Full details on <Link href="/pricing">pricing</Link>. New to the idea? Read <Link href="/blog/what-is-a-real-estate-operating-system">what a real estate operating system is</Link>.</p>

        <h2>FAQ</h2>
        <div className="faq">
          {FAQS.map((f) => <div className="qa" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
        </div>
      </BlogPostLayout>
    </>
  )
}
