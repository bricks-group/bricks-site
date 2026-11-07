import Link from 'next/link'
import type { ReactNode } from 'react'

type LinkItem = { href: string; label: string }

const DEFAULT_RELATED: LinkItem[] = [
  { href: '/real-estate-photography', label: 'Real estate photography & listing photos (Canada)' },
  { href: '/blog/canada-real-estate-photography-cost-2026', label: 'Canada listing photo cost guide (2026)' },
  { href: '/blog/gta-real-estate-media-cost-2026', label: 'GTA real estate media cost (2026)' },
  { href: '/blog/whats-included-listing-shoot', label: 'What\'s included in a listing photo shoot' },
  { href: '/drone-photography', label: 'Real estate drone photography' },
  { href: '/virtual-tours', label: 'Virtual tours for listings' },
  { href: '/photographers', label: 'Photographers — applications open' },
  { href: '/book', label: 'Book listing photos' },
]

/** cta and related default to the listing-media path; site and home-services posts pass their own. */
export default function BlogPostLayout({
  badge, title, sub, children, cta = { href: '/book', label: 'Book a listing shoot' }, related = DEFAULT_RELATED,
}: { badge: string; title: string; sub: string; children: ReactNode; cta?: LinkItem; related?: readonly LinkItem[] }) {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <span className="badge">{badge}</span>
          <h1>{title}</h1>
          <p className="sub">{sub}</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <article className="prose">
            {children}

            <p style={{ marginTop: 32 }}><Link href={cta.href} className="btn btn-brick">{cta.label} →</Link></p>

            <div className="related" style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--hair)' }}>
              <p className="over" style={{ marginBottom: 12 }}>Keep reading</p>
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
                {related.map((r) => <li key={r.href}><Link href={r.href}>{r.label}</Link></li>)}
              </ul>
            </div>

            <p style={{ marginTop: 16, fontSize: 13, color: 'var(--inkMute)' }}>Written by the Bricks team. Figures that cite regional market research are labelled as such; Bricks rates are starting points and tailored per booking.</p>
            <Link className="author-card" href="/about">
              <div className="ac-bio">
                <div className="ac-name">Bricks</div>
                <div className="ac-role">Canadian real estate media · software</div>
                <p>Listing media, booking and the tools agents run their business on. <span className="ac-more">About Bricks →</span></p>
              </div>
            </Link>
          </article>
        </div>
      </section>
    </>
  )
}
