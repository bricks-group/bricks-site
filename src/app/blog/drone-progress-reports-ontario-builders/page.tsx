import type { Metadata } from 'next'
import Link from 'next/link'
import BlogPostLayout from '@/components/BlogPostLayout'
import { postMeta } from '@/lib/content/posts'
import { blogPostingSchema, faqPageSchema } from '@/lib/schema'
import { OG_IMAGE, OG_IMAGE_URL } from '@/lib/og'
import { PER_VISIT, PLANS, fmt } from '@/lib/commercial'
import { DRONE_PROGRESS_REPORTS_ONTARIO_BUILDERS_FAQS as FAQS } from '@/lib/guide-faqs'

const PATH = '/blog/drone-progress-reports-ontario-builders'
const TITLE = 'Drone Progress Reports for Ontario Builders | Bricks'
const DESC = 'How drone progress reporting works for Ontario construction sites: rules, how often to fly, what a dated visit includes, and what a report can’t certify.'

const visit = (k: string) => PER_VISIT.find((x) => x.key === k)!
const planLine = (kind: 'Visual' | 'Mapped') => PLANS.find((p) => p.kind === kind)!.rows.map((r) => fmt(r.price)).join(' / ')

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema({ path: PATH, headline: 'Drone progress reporting for Ontario builders', description: DESC, datePublished: '2026-11-14', dateModified: postMeta('drone-progress-reports-ontario-builders').reviewedOn, keywords: 'drone progress reports, construction progress reporting, construction drone ontario, site progress, orthomosaic, draw inspection, investor update', image: OG_IMAGE_URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQS)) }} />
      <BlogPostLayout
        slug="drone-progress-reports-ontario-builders"
        badge="Guides · Site Progress"
        title="Drone progress reporting for Ontario builders"
        sub="What a dated drone visit captures, how often to fly, and how to turn it into a report your lender can check."
        cta={{ href: '/book/site', label: 'Book a site visit' }}
        related={[
          { href: '/builders', label: 'Site Progress for builders' },
          { href: '/software/site-progress', label: 'Site Progress software' },
          { href: '/drone-mapping', label: 'Drone mapping for construction' },
          { href: '/blog/what-is-an-orthomosaic', label: 'What is an orthomosaic?' },
          { href: '/blog/photogrammetry-for-construction', label: 'Photogrammetry for construction' },
          { href: '/investors', label: 'Reports for investors and lenders' },
        ]}
      >
        <p className="lead">
          Drone progress reporting means flying a construction site on a schedule, filing each visit by date, and building reports from what changed between visits. On an Ontario site that takes a pilot with a Transport Canada Advanced certificate, a consistent flight plan and software that keeps every visit on one timeline. The report documents conditions; it doesn’t certify quantities.
        </p>

        <h2>What a dated visit captures</h2>
        <p>A <strong>progress visit</strong> is drone photos and video of the site, dated. A <strong>mapped capture</strong> adds an <Link href="/blog/what-is-an-orthomosaic">orthomosaic</Link>, a 3D model and a measurable site map, so you can take distances, areas and elevation from it and compare one visit with the next. More on how the map is made in <Link href="/blog/photogrammetry-for-construction">photogrammetry for construction</Link>.</p>

        <h2>The rules on an Ontario site</h2>
        <p>Construction sites usually mean work near people, and much of the GTA sits in controlled airspace around Pearson and Billy Bishop. That needs a pilot with a Transport Canada Advanced certificate and, in controlled airspace, NAV CANADA authorization. Ask for proof of liability insurance valid on the flight date. Bricks requires a $2M minimum, or the higher minimum your contract sets. More in <Link href="/blog/drone-licence-canada">drone licences in Canada</Link>.</p>

        <h2>How often to fly</h2>
        <ul>
          <li><strong>Monthly</strong> suits most draw schedules and investor updates.</li>
          <li><strong>Every two weeks</strong> suits fast phases: excavation, foundations, framing.</li>
          <li><strong>Weekly</strong> suits sites where earthworks or a tight schedule need closer tracking.</li>
        </ul>
        <p>Keep the same flight plan and height each time, so visits compare cleanly.</p>

        <h2>From visits to a report</h2>
        <ol>
          <li>Each visit lands on the project timeline in <Link href="/software/site-progress">Site Progress</Link>, including captures you import from another flight.</li>
          <li>Pick a date range. Bricks drafts the report from the dated visits: true maps, before and after, milestones and what changed.</li>
          <li>Add your % complete by line item and log issues with a location and a photo. Your figures stay marked as yours.</li>
          <li>Share it as a PDF or a read-only link that expires. Readers don’t need an account.</li>
        </ol>

        <h2>What a report can and can’t say</h2>
        <p>Measurements like cut, fill and area changed are estimates for tracking progress, and each names its method. A progress report is visual documentation of site conditions, not a cost, quantity or completion certification. Survey-grade work is quoted separately.</p>

        <h2>Evidence a lender can check</h2>
        <p>Every file in the evidence index carries a SHA-256 checksum, with weather for each visit and the capture details. That gives a lender or quantity surveyor something to verify, not only something to look at. See <Link href="/investors">reports for investors and lenders</Link>.</p>

        <h2>What it costs with Bricks</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Option</th><th className="num">Price (CAD, plus tax)</th></tr></thead>
            <tbody>
              <tr><td>{visit('visual').name}</td><td className="num">{fmt(visit('visual').price)} {visit('visual').unit}</td></tr>
              <tr><td>{visit('mapped').name}</td><td className="num">{fmt(visit('mapped').price)} {visit('mapped').unit}</td></tr>
              <tr><td>{visit('setup').name} (first mapped flight)</td><td className="num">{fmt(visit('setup').price)} {visit('setup').unit}</td></tr>
              <tr><td>Visual plan: monthly / every two weeks / weekly</td><td className="num">{planLine('Visual')} per site a month</td></tr>
              <tr><td>Mapped plan: monthly / every two weeks / weekly</td><td className="num">{planLine('Mapped')} per site a month</td></tr>
            </tbody>
          </table>
        </div>
        <p><Link href="/builders">Site Progress for builders</Link> · <Link href="/drone-mapping">Drone mapping for construction</Link> · <Link href="/book/site">Book a site visit</Link></p>

        <h2>FAQ</h2>
        <div className="faq">
          {FAQS.map((f) => <div className="qa" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
        </div>
      </BlogPostLayout>
    </>
  )
}
