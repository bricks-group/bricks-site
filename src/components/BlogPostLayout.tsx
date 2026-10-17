import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'

export default function BlogPostLayout({
  badge, title, sub, children,
}: { badge: string; title: string; sub: string; children: ReactNode }) {
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

            <p style={{ marginTop: 28 }}><Link href="/book" className="btn btn-brick">Book a listing shoot →</Link></p>

            <div className="related" style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--hair)' }}>
              <p className="over" style={{ marginBottom: 12 }}>Keep reading</p>
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
                <li><Link href="/real-estate-photography">Real estate photography &amp; listing photos (Canada)</Link></li>
                <li><Link href="/blog/canada-real-estate-photography-cost-2026">Canada listing photo cost guide (2026)</Link></li>
                <li><Link href="/blog/gta-real-estate-media-cost-2026">GTA real estate media cost (2026)</Link></li>
                <li><Link href="/blog/whats-included-listing-shoot">What&apos;s included in a listing photo shoot</Link></li>
                <li><Link href="/photographers">Photographers — applications open</Link></li>
                <li><Link href="/book">Book listing photos</Link></li>
              </ul>
            </div>

            <p style={{ marginTop: 18, fontSize: 13, color: 'var(--inkMute)' }}>Written by <strong>Raphael Merchant</strong>, founder of Bricks. Figures that cite regional market research are labelled as such; Bricks rates are starting points and tailored per booking.</p>
            <Link className="author-card" href="/about">
              <Image src="/media/raphael-merchant-640.jpg" alt="Raphael Merchant, founder of Bricks — Canadian real estate photography" loading="lazy" width={56} height={56} />
              <div className="ac-bio">
                <div className="ac-name">Bricks</div>
                <div className="ac-role">Canadian real estate media · OS</div>
                <p>Before Bricks, Raphael shot 14,000+ properties at CoStar. Same standard, every shoot. <span className="ac-more">About Bricks →</span></p>
              </div>
            </Link>
          </article>
        </div>
      </section>
    </>
  )
}
