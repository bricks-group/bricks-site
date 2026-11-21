import type { Metadata } from 'next'
import Link from 'next/link'
import { LOGO_SCHEMA, ORG_REF } from '@/lib/schema'
import { OG_IMAGE } from '@/lib/og'
import { OS_LOGIN } from '@/lib/brand'
import { postMeta } from '@/lib/content/posts'

const OG = OG_IMAGE

const TITLE = 'Guides for running your real estate business | Bricks'
const DESC = 'Plain guides for Canadian agents, brokerages, builders and property managers: deals and trust, site progress, rentals, listing media and the rules that apply.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/blog' },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESC, images: [OG], url: 'https://www.brxs.ca/blog' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
}

const LIST = [
  {
    href: '/blog/what-is-a-real-estate-operating-system',
    tag: 'Software',
    desc: 'Deals, listings, bookings, vendors, documents, team and payments in one place, and what to look for.',
    read: '4 min',
  },
  {
    href: '/blog/brokerage-software-ontario',
    tag: 'Brokerages',
    desc: 'Trust, commissions, roster, deal files and MLS® feeds on one record, with the questions to ask before you move your agents.',
    read: '4 min',
  },
  {
    href: '/blog/drone-progress-reports-ontario-builders',
    tag: 'Site Progress',
    desc: 'What a dated drone visit captures, how often to fly, and what a progress report can and can’t say.',
    read: '4 min',
  },
  {
    href: '/blog/move-out-condition-report-ontario',
    tag: 'Property managers',
    desc: 'What to photograph, when to do it, and how to keep a record you can compare from one tenant to the next.',
    read: '3 min',
  },
  {
    href: '/blog/drone-licence-canada',
    tag: 'Drone',
    desc: 'Transport Canada’s Basic, Advanced and Level 1 Complex certificates: ages, exams, flight reviews, registration and what real estate needs.',
    read: '7 min',
  },
  {
    href: '/blog/home-inspection-cost-ontario',
    tag: 'Home services',
    desc: 'What moves the price, add-on tests, what to check before you hire, and how to get a written quote.',
    read: '6 min',
  },
  {
    href: '/blog/move-out-cleaning-checklist',
    tag: 'Home services',
    desc: 'Everything to clean before handing back the keys or turning a unit over, and how to document it.',
    read: '5 min',
  },
  {
    href: '/blog/what-is-an-orthomosaic',
    tag: 'Site Progress',
    desc: 'The drone map builders measure, compare and report on, and how it differs from an aerial photo.',
    read: '5 min',
  },
  {
    href: '/blog/photogrammetry-for-construction',
    tag: 'Site Progress',
    desc: 'What drone photogrammetry produces on a job site, where it helps, its limits, and running it on a schedule.',
    read: '6 min',
  },
  {
    href: '/blog/canada-real-estate-photography-cost-2026',
    tag: 'Listing media',
    desc: 'What listing photos, drone, floor plans and tours cost, with a full Bricks price table by home size.',
    read: '9 min',
  },
  {
    href: '/blog/gta-real-estate-media-cost-2026',
    tag: 'Listing media',
    desc: 'Published GTA rates for photos, drone, floor plans, tours and video, and what moves the price.',
    read: '7 min',
  },
  {
    href: '/blog/3d-tour-vs-video-walkthrough',
    tag: 'Listing media',
    desc: 'What a virtual tour, a reel and a Virtual Visit each do, and how to choose for the home.',
    read: '6 min',
  },
  {
    href: '/blog/drone-photography-rules-ontario',
    tag: 'Drone',
    desc: 'The 250 g line, Basic or Advanced, controlled airspace, height limits and what changed in November 2025.',
    read: '8 min',
  },
  {
    href: '/blog/whats-included-listing-shoot',
    tag: 'Listing media',
    desc: 'What each package includes, the add-ons, how booking works and when your files arrive.',
    read: '5 min',
  },
]

// Titles and dates come from the one post registry so the index never drifts from the posts.
const posts = LIST.map((p) => {
  const m = postMeta(p.href.replace('/blog/', ''))
  return { ...p, title: m.title, date: m.published }
})

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
            description: DESC,
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
          <h1>Guides for running your real estate business.</h1>
          <p className="sub">
            Plain guides for Canadian agents, brokerages, builders and property managers: deals and trust, site progress, rentals, listing media and the rules that apply. Each one shows when it was last reviewed and where outside facts come from.
          </p>
          <div className="cta-row">
            <a className="btn btn-brick" href={OS_LOGIN}>
              Try Bricks free
            </a>
            <Link className="btn btn-sec" href="/platform">
              See the software
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
            <span className="over">Bricks</span>
            <h2>Run your whole business in one place.</h2>
            <p className="lead">Deals, listings, bookings, vendors, documents, team and payments. Book photos, drone and site visits from the same account. Start free.</p>
            <div className="cta-row">
              <a className="btn btn-brick" href={OS_LOGIN}>
                Try Bricks free
              </a>
              <Link className="btn btn-sec" href="/book" style={{ color: 'var(--moon)', borderColor: 'var(--moonMute)' }}>
                Book a shoot
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
