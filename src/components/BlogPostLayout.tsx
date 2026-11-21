import Link from 'next/link'
import type { ReactNode } from 'react'
import { postMeta, longDate } from '@/lib/content/posts'

type LinkItem = { href: string; label: string }

const DEFAULT_RELATED: LinkItem[] = [
  { href: '/real-estate-photography', label: 'Real estate photography & listing photos (Canada)' },
  { href: '/blog/canada-real-estate-photography-cost-2026', label: 'What listing photos cost in Canada' },
  { href: '/blog/gta-real-estate-media-cost-2026', label: 'What listing media costs in the GTA' },
  { href: '/blog/whats-included-listing-shoot', label: 'What\'s included in a listing photo shoot' },
  { href: '/drone-photography', label: 'Real estate drone photography' },
  { href: '/virtual-tours', label: 'Virtual tours for listings' },
  { href: '/platform', label: 'Run your whole business on Bricks' },
  { href: '/book', label: 'Book listing photos' },
]

/**
 * cta and related default to the listing-media path; site and home-services posts pass their own.
 * slug ties the post to src/lib/content/posts.ts: review date, owner and sources.
 */
export default function BlogPostLayout({
  slug, badge, title, sub, children, cta = { href: '/book', label: 'Book a listing shoot' }, related = DEFAULT_RELATED,
}: { slug: string; badge: string; title: string; sub: string; children: ReactNode; cta?: LinkItem; related?: readonly LinkItem[] }) {
  const meta = postMeta(slug)
  const self = `/blog/${slug}`
  const reading = related.filter((r) => r.href !== self)
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <span className="badge">{badge}</span>
          <h1>{title}</h1>
          <p className="sub">{sub}</p>
          <p className="reviewed" style={{ marginTop: 12, fontSize: 13, color: 'var(--inkMute)' }}>Last reviewed {longDate(meta.reviewedOn)}</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <article className="prose">
            {children}

            <p style={{ marginTop: 32 }}><Link href={cta.href} className="btn btn-brick">{cta.label} →</Link></p>

            {meta.sources.length > 0 && (
              <div className="sources" style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--hair)' }}>
                <p className="over" style={{ marginBottom: 12 }}>Sources</p>
                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7, fontSize: 14 }}>
                  {meta.sources.map((s) => (
                    <li key={s.label}>
                      {s.href ? <a href={s.href} rel="noopener" target="_blank">{s.label}</a> : s.label}
                      {s.note ? <span style={{ color: 'var(--inkMute)' }}> {s.note}</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="related" style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--hair)' }}>
              <p className="over" style={{ marginBottom: 12 }}>Keep reading</p>
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
                {reading.map((r) => <li key={r.href}><Link href={r.href}>{r.label}</Link></li>)}
              </ul>
            </div>

            <p style={{ marginTop: 16, fontSize: 13, color: 'var(--inkMute)' }}>Written by the Bricks team. Bricks prices on this page are the ones you see before you pay.</p>
            <Link className="author-card" href="/about">
              <div className="ac-bio">
                <div className="ac-name">Bricks</div>
                <div className="ac-role">The system Canadian real estate runs on</div>
                <p>Deals, listings, bookings, vendors, documents, team and payments in one place. <span className="ac-more">About Bricks →</span></p>
              </div>
            </Link>
          </article>
        </div>
      </section>
    </>
  )
}
