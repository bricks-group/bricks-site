import type { Metadata } from 'next'
import Link from 'next/link'
import BlogPostLayout from '@/components/BlogPostLayout'
import { blogPostingSchema, faqPageSchema } from '@/lib/schema'
import { OG_IMAGE, OG_IMAGE_URL } from '@/lib/og'

const PATH = '/blog/what-is-an-orthomosaic'
const TITLE = 'What Is an Orthomosaic? Drone Maps Explained | Bricks'
const DESC = 'What an orthomosaic is, how a drone makes one, how it differs from an aerial photo, and what builders use orthomosaic maps for on a construction site.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
  openGraph: { type: 'article', title: TITLE, description: DESC, images: [OG_IMAGE], url: `https://www.brxs.ca${PATH}` },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE] },
}

const FAQS = [
  { q: 'What is an orthomosaic?', a: 'A single map-like image stitched from many overlapping drone photos and corrected so the scale is the same everywhere. You can measure distances and areas on it, which you can’t do reliably on an ordinary aerial photo.' },
  { q: 'What file format is an orthomosaic?', a: 'Usually a GeoTIFF: an image with geographic coordinates built in, so it lines up with maps, site plans and other GIS and CAD data.' },
  { q: 'Is an orthomosaic a survey?', a: 'No. It’s a measured image, and measurements taken from it are estimates. Where a legal or survey-grade result is required, that is separate work.' },
  { q: 'How is an orthomosaic different from a 3D model?', a: 'Both come from the same flight. The orthomosaic is a flat, top-down image. The 3D model and the elevation data from the same photos are what you use for heights, volumes, cut and fill.' },
]

export default function Post() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema({ path: PATH, headline: 'What is an orthomosaic?', description: DESC, datePublished: '2026-11-07', keywords: 'orthomosaic, what is an orthomosaic, orthomosaic map, drone mapping, orthophoto, construction drone map', image: OG_IMAGE_URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQS)) }} />
      <BlogPostLayout
        badge="Guides · Site Progress"
        title="What is an orthomosaic?"
        sub="The drone map builders use to measure, compare and report on a site, explained without the jargon."
        cta={{ href: '/drone-mapping', label: 'See drone mapping' }}
        related={[
          { href: '/blog/photogrammetry-for-construction', label: 'Photogrammetry for construction' },
          { href: '/drone-mapping', label: 'Drone mapping and orthomosaics' },
          { href: '/builders', label: 'Site Progress for builders' },
          { href: '/book/site', label: 'Book a site visit' },
        ]}
      >
        <p className="lead">
          An <strong>orthomosaic</strong> is one large, top-down image of a site, stitched together from hundreds of overlapping drone photos and corrected so that every part of it is at the same scale. Because the scale is true, you can measure on it: distances, areas, the footprint of a slab or a stockpile.
        </p>

        <h2>Why an ordinary aerial photo isn’t a map</h2>
        <p>A single aerial photo is taken from one point, so it has perspective. Things closer to the camera look bigger, tall objects lean away from the centre, and the scale changes across the frame. That’s fine for a listing, but you can’t measure on it.</p>
        <p>An orthomosaic removes that distortion. Each photo is <em>orthorectified</em>, meaning corrected as if it were taken from directly above every point at once, and the corrected photos are blended into one seamless image. The result reads like a map.</p>

        <h2>How a drone makes one</h2>
        <ol>
          <li><strong>Plan the flight.</strong> The pilot sets a grid over the site, the height and the overlap between photos.</li>
          <li><strong>Set ground control.</strong> Marked points on the ground, measured precisely, tie the map to real coordinates and improve accuracy.</li>
          <li><strong>Fly the grid.</strong> The drone takes photos with heavy overlap, so every point on the ground appears in several of them.</li>
          <li><strong>Process.</strong> Photogrammetry software matches points across photos, rebuilds the terrain and produces the orthomosaic, an elevation model and a 3D model.</li>
        </ol>
        <p>More on that last step in <Link href="/blog/photogrammetry-for-construction">photogrammetry for construction</Link>.</p>

        <h2>What builders use orthomosaics for</h2>
        <ul>
          <li><strong>Progress documentation.</strong> A dated map of the whole site, visit after visit.</li>
          <li><strong>Measuring.</strong> Lengths, areas and, with the elevation data, cut, fill and volumes.</li>
          <li><strong>Overlaying plans.</strong> Lining up drawings with what’s actually in the ground.</li>
          <li><strong>Reporting.</strong> Lenders, investors and owners get a clear picture without a site walk.</li>
        </ul>

        <h2>What affects accuracy</h2>
        <p>Flight height and camera set the ground sample distance, the size of one pixel on the ground. Overlap, light, wind, vegetation and ground control all matter too. An orthomosaic is still a measured image, not a survey, so treat its numbers as estimates unless survey-grade work was specified.</p>

        <h2>How Bricks handles it</h2>
        <p>
          A Bricks <Link href="/drone-mapping">mapped capture</Link> delivers an orthomosaic, a 3D model and a measurable site map, kept as a dated visit in Site Progress. The first mapped flight on a site includes ground control setup. Measurements show their method, and survey-grade accuracy is quoted separately. Two mapped visits can be compared in 3D to show what changed.
        </p>

        <h2>FAQ</h2>
        <div className="faq">
          {FAQS.map((f) => <div className="qa" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
        </div>
      </BlogPostLayout>
    </>
  )
}
