import type { Metadata } from 'next'
import Link from 'next/link'
import { OG_SHARE_IMAGE } from '@/lib/site-media'

const OG = OG_SHARE_IMAGE

export const metadata: Metadata = {
  title: 'Real Estate Photography Guides & Listing Media Blog | Bricks',
  description:
    'Canadian real estate photography guides by Bricks — Canada-wide and GTA listing photo costs, drone rules, virtual tour vs video, and what’s included in a pro MLS shoot.',
  alternates: { canonical: '/blog' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Real Estate Photography Guides & Listing Media Blog | Bricks',
    description:
      'Canada-wide listing media guides — photography cost, drone rules, virtual tours, and what’s in a pro shoot.',
    images: [OG],
    url: 'https://www.brxs.ca/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Photography Guides | Bricks',
    description: 'Listing photos, MLS media, drone rules, and shoot inclusions for Canadian agents.',
    images: [OG],
  },
}

const posts = [
  {
    href: '/blog/canada-real-estate-photography-cost-2026',
    tag: 'Pricing · Canada',
    title: 'How much does real estate photography cost in Canada? (2026)',
    desc: 'Canada-wide cost overview for listing photos, MLS media, drone, floor plans, and tours — expands the GTA cluster.',
    read: '8 min',
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
    desc: 'The core set every Bricks shoot ships: HDR, licensed drone, floor plan, and 24–48h delivery.',
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
            publisher: {
              '@type': 'Organization',
              name: 'Bricks',
              legalName: 'Bricks Group',
              logo: { '@type': 'ImageObject', url: 'https://www.brxs.ca/favicon.svg' },
            },
            blogPost: posts.map((p) => ({
              '@type': 'BlogPosting',
              headline: p.title,
              url: `https://www.brxs.ca${p.href}`,
              author: { '@type': 'Person', name: 'Raphael Merchant' },
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
            Practical guides for Canadian agents — listing photo costs, MLS media, drone rules, and what a shoot includes. By Raphael Merchant.
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
                  <div className="d">Raphael Merchant · {p.read}</div>
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
            <p className="lead">Pick your services à la carte, get a tailored quote, and your MLS-ready media in 24–48 hours.</p>
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
