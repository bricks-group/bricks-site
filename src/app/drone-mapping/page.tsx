import type { Metadata } from 'next'
import Link from 'next/link'
import Landing from '@/components/seo/Landing'
import { PER_VISIT, PLANS, PLAN_NOTE, fmt } from '@/lib/commercial'
import { siteProgressServiceSchema } from '@/lib/schema'
import { signupUrl } from '@/lib/brand'
import { OG_IMAGE } from '@/lib/og'

const URL = 'https://www.brxs.ca/drone-mapping'
const MAPPED = PER_VISIT.find((x) => x.key === 'mapped')!
const SETUP = PER_VISIT.find((x) => x.key === 'setup')!
const MAPPED_PLAN = PLANS.find((p) => p.kind === 'Mapped')!
const TITLE = 'Drone Mapping & Orthomosaics for Construction | Bricks'
const DESC = `Drone mapping for construction in Canada: orthomosaics, 3D models and measurable site maps from certified pilots. Mapped capture ${fmt(MAPPED.price)} or a monthly plan.`

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/drone-mapping' },
  openGraph: { title: TITLE, description: DESC, url: URL, images: [OG_IMAGE] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG_IMAGE] },
}

const FAQS = [
  { q: 'What do I get from a mapped capture?', a: 'An orthomosaic, a 3D model and a measurable site map, kept as a dated visit on the site’s timeline in your builder account.' },
  { q: 'Is drone mapping a legal survey?', a: 'No. Cut, fill, volume and area measurements are estimates, and the method is shown with each number. They are not a survey. Survey-grade accuracy is quoted separately.' },
  { q: 'What does drone mapping cost?', a: `A mapped capture is ${fmt(MAPPED.price)} ${MAPPED.unit}, plus a one-time ${fmt(SETUP.price)} mapping setup for ground control on the first mapped flight. Monthly mapped plans start at ${fmt(MAPPED_PLAN.rows[0].price)} per site. CAD, plus tax.` },
  { q: 'Who flies the site?', a: 'Vetted pilots with a Transport Canada Advanced Operations certificate. Builder-site pilots must also carry at least $2,000,000 drone liability insurance per occurrence, or the higher minimum you set on the order.' },
  { q: 'Can I bring my own files?', a: 'Yes. Import GeoTIFF, LAS, LAZ, E57, PLY, OBJ, GLB, photos, video and PDF, up to 5 GB a file. Imported files are marked as imported.' },
]

export default function DroneMappingPage() {
  return (
    <Landing
      schemas={[siteProgressServiceSchema(URL)]}
      h1="Drone mapping for construction sites."
      sub="Orthomosaics, 3D models and measurable site maps, flown on a schedule and kept as dated visits in Site Progress."
      primary={{ href: '/book/site', label: 'Book a mapped capture' }}
      secondary={{ href: '/builders', label: 'About Site Progress' }}
      sections={[
        {
          title: 'What a mapped capture gives you.',
          rows: [
            { title: 'Orthomosaic', detail: 'One scaled, top-down image of the whole site, stitched from hundreds of overlapping photos.' },
            { title: '3D model', detail: 'The site as a model you can orbit, section and compare.' },
            { title: 'Measurable site map', detail: 'Cut, fill, net volume and area estimates, with the method shown.' },
            { title: '3D compare', detail: 'Change between two mapped visits on a 0.5 m grid. Changes under 10 cm are left out.' },
          ],
        },
        {
          title: 'Dated evidence, not just pictures.',
          body: (
            <>
              <p>Each visit keeps an evidence index with SHA-256 fingerprints, the weather on the day and the capture details. Progress reports and investor updates are drafted from the visits in a date range, shared as a PDF or an expiring read-only link.</p>
              <p>Reports are visual documentation of site conditions, not a cost, quantity or completion certification. Each report says so.</p>
            </>
          ),
        },
        {
          title: 'Pricing.',
          link: { href: '/help/builders/site-progress-pricing', label: 'Pricing details' },
          rows: [
            ...PER_VISIT.map((x) => ({ title: x.name, detail: x.what, value: `${fmt(x.price)} ${x.unit}` })),
            ...MAPPED_PLAN.rows.map((r) => ({ title: `Mapped plan, ${r.cadence.toLowerCase()}`, detail: `${r.visits} mapped visit${r.visits === 1 ? '' : 's'} a month`, value: `${fmt(r.price)} a month` })),
          ],
          note: PLAN_NOTE,
        },
        {
          title: 'New to mapping?',
          body: <p>Start with <Link href="/blog/what-is-an-orthomosaic">what an orthomosaic is</Link> and <Link href="/blog/photogrammetry-for-construction">how photogrammetry works on a construction site</Link>. For reporting, see <Link href="/blog/drone-progress-reports-ontario-builders">drone progress reports for Ontario builders</Link>. For aerial photos of a finished property, see <Link href="/drone-photography">drone photography</Link>.</p>,
        },
      ]}
      faqTitle="Drone mapping, answered."
      faqs={FAQS}
      close={{ title: 'Map your site on a schedule.', href: signupUrl('builder'), label: 'Create a builder account' }}
    />
  )
}
