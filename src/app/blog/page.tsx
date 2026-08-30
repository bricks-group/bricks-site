import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'GTA Real Estate Media Resources & Blog | Bricks',
  description: "GTA real estate media guides by Bricks — 2026 pricing, drone rules in Ontario, 3D tour vs video walkthrough, and what's included in a pro listing shoot. By Raphael Merchant.",
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'GTA Real Estate Media Resources & Blog | Bricks',
    description: "GTA real estate media guides — 2026 pricing, drone rules in Ontario, 3D tour vs video walkthrough, what's in a pro listing shoot.",
  },
  twitter: {
    title: 'GTA Real Estate Media Resources & Blog | Bricks',
    description: 'GTA real estate media guides by Bricks — pricing, drone rules, 3D tours, and what\'s in a pro shoot.',
  },
}

const posts = [
  { href: '/blog/gta-real-estate-media-cost-2026', tag: 'Pricing', title: 'How much does real estate photography cost in the GTA? (2026)', desc: 'What agents actually pay for HDR, drone, floor plans, 3D tours and video — with real GTA market ranges.', read: '7 min' },
  { href: '/blog/3d-tour-vs-video-walkthrough', tag: 'Strategy', title: '3D virtual tour vs. video walkthrough: which sells faster?', desc: 'When a navigable 3D tour beats a cinematic reel — and when the reverse is true.', read: '6 min' },
  { href: '/blog/drone-photography-rules-ontario', tag: 'Rules & safety', title: 'Drone photography rules for real estate in Ontario', desc: 'Transport Canada Advanced RPAS rules, no-fly zones, and what a compliant aerial shoot looks like.', read: '8 min' },
  { href: '/blog/whats-included-listing-shoot', tag: 'The shoot', title: "What's included in a professional listing photo shoot?", desc: 'The core set every Bricks shoot ships: HDR, licensed drone, floor plan, and 24–48h delivery.', read: '5 min' },
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
            url: 'https://www.brxs.ca/blog',
            publisher: { '@type': 'Organization', name: 'Bricks', logo: { '@type': 'ImageObject', url: 'https://www.brxs.ca/favicon.svg' } },
            blogPost: posts.map((p) => ({
              '@type': 'BlogPosting',
              headline: p.title,
              url: `https://www.brxs.ca${p.href}`,
              author: { '@type': 'Person', name: 'Raphael Merchant' },
              datePublished: '2026-07-22',
            })),
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <span className="badge">Resources · GTA</span>
          <h1>Real estate media, explained.</h1>
          <p className="sub">Practical guides for GTA listing agents — what things cost, what the rules are, and how to get media that moves listings. Written by Raphael Merchant, Bricks founder and Transport Canada Advanced RPAS (drone) certificate holder.</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div><span className="over">Latest</span><h2>Guides &amp; breakdowns</h2></div>
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
            <h2>Book a GTA listing shoot.</h2>
            <p className="lead">Pick your services à la carte, get a tailored quote, and your MLS-ready media in 24–48 hours.</p>
            <div className="cta-row">
              <Link className="btn btn-brick" href="/book">Book listing media</Link>
              <Link className="btn btn-sec" href="/pricing" style={{ color: 'var(--moon)', borderColor: 'var(--moon-mute)' }}>View pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
