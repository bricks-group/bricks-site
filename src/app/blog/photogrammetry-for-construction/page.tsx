import type { Metadata } from 'next'
import Link from 'next/link'
import BlogPostLayout from '@/components/BlogPostLayout'
import { blogPostingSchema, faqPageSchema } from '@/lib/schema'
import { PER_VISIT, PLANS, fmt } from '@/lib/commercial'
import { OG_IMAGE, OG_IMAGE_URL } from '@/lib/og'

const PATH = '/blog/photogrammetry-for-construction'
const TITLE = 'Photogrammetry for Construction: Drone Mapping | Bricks'
const DESC = 'How drone photogrammetry works on a construction site, what it produces, what it’s good for, its limits, and how to run it on a schedule for progress reporting.'
const MAPPED = PER_VISIT.find((x) => x.key === 'mapped')!
const SETUP = PER_VISIT.find((x) => x.key === 'setup')!
const MAPPED_PLAN = PLANS.find((p) => p.kind === 'Mapped')!

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
  openGraph: { type: 'article', title: TITLE, description: DESC, images: [OG_IMAGE], url: `https://www.brxs.ca${PATH}` },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE] },
}

const FAQS = [
  { q: 'What is photogrammetry in construction?', a: 'Measuring a site from overlapping photos. A drone photographs the site from many positions, and software rebuilds it as an orthomosaic, an elevation model and a 3D model you can measure on.' },
  { q: 'How often should a site be mapped?', a: 'Often enough to catch the changes you report on. Many sites map monthly, and busy phases such as earthworks may justify every two weeks or weekly.' },
  { q: 'Can photogrammetry replace a surveyor?', a: 'No. It gives fast, repeatable estimates for documentation and planning. Legal surveys and survey-grade work are separate.' },
  { q: 'What does drone photogrammetry cost with Bricks?', a: `A mapped capture is ${fmt(MAPPED.price)} ${MAPPED.unit}, plus ${fmt(SETUP.price)} one-time mapping setup per site. Monthly mapped plans start at ${fmt(MAPPED_PLAN.rows[0].price)} per site. CAD, plus tax.` },
]

export default function Post() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema({ path: PATH, headline: 'Photogrammetry for construction: a practical guide', description: DESC, datePublished: '2026-11-07', keywords: 'photogrammetry construction, drone photogrammetry, construction drone mapping, drone survey construction, orthomosaic, cut and fill', image: OG_IMAGE_URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQS)) }} />
      <BlogPostLayout
        badge="Guides · Site Progress"
        title="Photogrammetry for construction: a practical guide"
        sub="What drone photogrammetry produces on a job site, where it helps, where it doesn’t, and how to run it on a schedule."
        cta={{ href: '/drone-mapping', label: 'See drone mapping' }}
        related={[
          { href: '/blog/what-is-an-orthomosaic', label: 'What is an orthomosaic?' },
          { href: '/drone-mapping', label: 'Drone mapping and orthomosaics' },
          { href: '/builders', label: 'Site Progress for builders' },
          { href: '/blog/drone-licence-canada', label: 'Drone licence in Canada' },
        ]}
      >
        <p className="lead">
          <strong>Photogrammetry</strong> is measurement from photographs. On a construction site, a drone flies a grid and takes hundreds of overlapping photos. Software finds the same points in many of them, works out where each photo was taken, and rebuilds the site in 3D. What you get back is a set of measurable outputs, not just pictures.
        </p>

        <h2>What a mapping flight produces</h2>
        <ul>
          <li><strong>Orthomosaic.</strong> A scaled, top-down image of the whole site. <Link href="/blog/what-is-an-orthomosaic">What an orthomosaic is</Link>.</li>
          <li><strong>Elevation model and point cloud.</strong> The height of the ground and everything on it, used for grades, cut, fill and volumes.</li>
          <li><strong>3D model.</strong> A textured mesh you can orbit, section and share.</li>
        </ul>

        <h2>Where it helps</h2>
        <ul>
          <li><strong>Progress reports.</strong> The same view of the site, dated, every visit. Lenders and owners see what changed without a site walk.</li>
          <li><strong>Earthworks.</strong> Cut, fill and stockpile volume estimates between visits.</li>
          <li><strong>Coordination.</strong> Overlay drawings on the map to check layout and staging areas.</li>
          <li><strong>A record.</strong> If something is questioned later, there is a dated capture of how the site looked.</li>
        </ul>

        <h2>Limits worth knowing</h2>
        <ul>
          <li><strong>It isn’t a survey.</strong> Measurements are estimates. Legal surveys and survey-grade accuracy are separate work.</li>
          <li><strong>It sees surfaces.</strong> Photos can’t see under dense vegetation, tarps or inside structures.</li>
          <li><strong>Weather and airspace.</strong> Wind, rain and low light stop flights, and sites near airports need NAV CANADA authorization.</li>
          <li><strong>Ground control matters.</strong> Without measured control points, absolute accuracy drops, even if the map looks sharp.</li>
        </ul>

        <h2>Running it on a schedule</h2>
        <p>The value is in the series. One map is a snapshot. Monthly or weekly maps flown the same way let you compare visits and report change with confidence. Pick a cadence that matches how fast the site moves, and keep the flight plan and ground control consistent.</p>

        <h2>How Bricks runs it</h2>
        <p>
          With <Link href="/drone-mapping">Bricks drone mapping</Link>, a certified pilot flies the site, and the first mapped flight includes ground control setup. Each mapped capture delivers an orthomosaic, a 3D model and a measurable site map as a dated visit in Site Progress. Two mapped visits can be compared on a 0.5 m grid, leaving out changes under 10 cm. Cut, fill, net volume and area show their method and are estimates. You can also import your own GeoTIFF, LAS, LAZ, E57, PLY, OBJ or GLB files.
        </p>
        <p>A mapped capture is {fmt(MAPPED.price)} {MAPPED.unit}, with a {fmt(SETUP.price)} one-time setup. Mapped plans per site: {MAPPED_PLAN.rows.map((r) => `${r.cadence.toLowerCase()} visits ${fmt(r.price)} a month`).join(', ')}. CAD, plus tax.</p>

        <h2>FAQ</h2>
        <div className="faq">
          {FAQS.map((f) => <div className="qa" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
        </div>
      </BlogPostLayout>
    </>
  )
}
