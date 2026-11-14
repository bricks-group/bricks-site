import type { Metadata } from 'next'
import Link from 'next/link'
import { LOGO_SCHEMA, ORG_REF } from '@/lib/schema'
import { OG_IMAGE } from '@/lib/og'

const OG = OG_IMAGE

export const metadata: Metadata = {
  title: 'Real Estate Photography Guides & Listing Media Blog | Bricks',
  description: "Read Bricks guides to Canadian listing media: photography costs, drone rules, virtual tours, video walkthroughs and what to expect from a listing shoot.",
  alternates: { canonical: '/blog' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Real Estate Photography Guides & Listing Media Blog | Bricks',
    description: "Read Bricks guides to Canadian listing media: photography costs, drone rules, virtual tours, video walkthroughs and what to expect from a listing shoot.",
    images: [OG],
    url: 'https://www.brxs.ca/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Photography Guides | Bricks',
    description: "Read Bricks guides to Canadian listing media: photography costs, drone rules, virtual tours, video walkthroughs and what to expect from a listing shoot.",
    images: [OG],
  },
}

const posts = [
  {
    href: '/blog/what-is-a-real-estate-operating-system',
    tag: 'Software',
    title: 'What is a real estate operating system?',
    desc: 'One record for builders, agents, property managers and vendors, with services booked inside.',
    read: '4 min',
    date: '2026-11-14',
  },
  {
    href: '/blog/drone-licence-canada',
    tag: 'Drone · Canada',
    title: 'Drone licence in Canada: Basic vs Advanced (2026)',
    desc: 'Transport Canada’s Basic, Advanced and Level 1 Complex certificates: ages, exams, flight reviews, registration and what real estate needs.',
    read: '7 min',
    date: '2026-11-07',
  },
  {
    href: '/blog/home-inspection-cost-ontario',
    tag: 'Home services · Ontario',
    title: 'Home inspection cost in Ontario (2026): what sets the price',
    desc: 'Typical ranges from published price guides, what moves the number, add-on tests and how to get a written quote.',
    read: '6 min',
    date: '2026-11-07',
  },
  {
    href: '/blog/move-out-cleaning-checklist',
    tag: 'Home services',
    title: 'Move-out cleaning checklist, room by room',
    desc: 'Everything to clean before handing back the keys or turning a unit over, and how to document it.',
    read: '5 min',
    date: '2026-11-07',
  },
  {
    href: '/blog/what-is-an-orthomosaic',
    tag: 'Site Progress',
    title: 'What is an orthomosaic?',
    desc: 'The drone map builders measure, compare and report on, and how it differs from an aerial photo.',
    read: '5 min',
    date: '2026-11-07',
  },
  {
    href: '/blog/photogrammetry-for-construction',
    tag: 'Site Progress',
    title: 'Photogrammetry for construction: a practical guide',
    desc: 'What drone photogrammetry produces on a job site, where it helps, its limits, and running it on a schedule.',
    read: '6 min',
    date: '2026-11-07',
  },
  {
    href: '/blog/canada-real-estate-photography-cost-2026',
    tag: 'Pricing · Canada',
    title: 'How much does real estate photography cost in Canada? (2026)',
    desc: 'Canada-wide cost overview for listing photos, MLS media, drone, floor plans, and tours, with a full price table by home size.',
    read: '9 min',
    date: '2026-09-12',
  },
  {
    href: '/blog/gta-real-estate-media-cost-2026',
    tag: 'Pricing · Regional',
    title: 'How much does real estate photography cost in the GTA? (2026)',
    desc: 'What agents actually pay for HDR, drone, floor plans, virtual tours and video — with real regional market ranges.',
    read: '7 min',
    date: '2026-07-22',
  },
  {
    href: '/blog/3d-tour-vs-video-walkthrough',
    tag: 'Strategy',
    title: 'Virtual tour vs. video walkthrough: which sells faster?',
    desc: 'When a path-confined virtual tour beats a cinematic reel — and when the reverse is true. Virtual visit is separate.',
    read: '6 min',
    date: '2026-07-22',
  },
  {
    href: '/blog/drone-photography-rules-ontario',
    tag: 'Rules & safety',
    title: 'Drone photography rules for real estate in Ontario',
    desc: 'Transport Canada Advanced RPAS rules, no-fly zones, and what a compliant aerial shoot looks like.',
    read: '8 min',
    date: '2026-07-22',
  },
  {
    href: '/blog/whats-included-listing-shoot',
    tag: 'The shoot',
    title: "What's included in a professional listing photo shoot?",
    desc: 'The core set every Bricks shoot ships: HDR, licensed drone, floor plan, photos in 24h and other media on a 24–48h target.',
    read: '5 min',
    date: '2026-07-22',
  },
]

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Bricks Resources',
            description: 'Canadian real estate photography and listing media guides.',
            url: 'https://www.brxs.ca/blog',
            publisher: { ...ORG_REF, logo: LOGO_SCHEMA },
            blogPost: posts.map((p) => ({
              '@type': 'BlogPosting',
              headline: p.title,
              url: `https://www.brxs.ca${p.href}`,
              author: { '@type': 'Organization', name: 'Bricks', url: 'https://www.brxs.ca' },
              datePublished: p.date,
            })),
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <span className="badge">Resources</span>
          <h1>Real estate photography &amp; listing media, explained.</h1>
          <p className="sub">
            Practical guides for Canadian agents, builders and property owners — listing photo costs, drone rules and licences, site mapping, inspections and cleaning.
          </p>
          <div className="cta-row">
            <Link className="btn btn-brick" href="/book">
              Book listing photos
            </Link>
            <Link className="btn btn-sec" href="/real-estate-photography">
              Photography overview
            </Link>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="over">Latest</span>
              <h2>Guides &amp; breakdowns</h2>
            </div>
          </div>
          <div className="grid3">
            {posts.map((p) => (
              <Link key={p.href} className="card np rvl" href={p.href}>
                <div className="meta">
                  <span className="t">{p.tag}</span>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="d">{p.read}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="book">
            <span className="over">Ready?</span>
            <h2>Book a listing shoot.</h2>
            <p className="lead">Pick your services à la carte, get a tailored quote, and your MLS-ready photos in 24 hours, other media on a 24–48h target.</p>
            <div className="cta-row">
              <Link className="btn btn-brick" href="/book">
                Book listing media
              </Link>
              <Link className="btn btn-sec" href="/photographers" style={{ color: 'var(--moon)', borderColor: 'var(--moonMute)' }}>
                Photographers apply
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
