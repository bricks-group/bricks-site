import Link from 'next/link'
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
          <article className="prose rvl">
            {children}

            <p style={{ marginTop: 28 }}><Link href="/book" className="btn btn-brick">Book a tailored GTA shoot →</Link></p>
            <p style={{ marginTop: 18, fontSize: 13, color: 'var(--ink-3)' }}>Written by <strong>Raphael Merchant</strong>, founder of Bricks. Figures reflect 2026 GTA market research across major regional providers; Bricks rates are starting points and tailored per booking.</p>
            <Link className="author-card" href="/about">
              <img src="/media/raphael-merchant-640.jpg" alt="Raphael Merchant, founder of Bricks" loading="lazy" width={56} height={56} />
              <div className="ac-bio">
                <div className="ac-name">Raphael Merchant</div>
                <div className="ac-role">Founder · Bricks</div>
                <p>Transport Canada Advanced RPAS drone certificate holder. <span className="ac-more">Read more →</span></p>
              </div>
            </Link>
          </article>
        </div>
      </section>
    </>
  )
}
