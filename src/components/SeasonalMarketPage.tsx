import type { Metadata } from 'next'
import Link from 'next/link'
import { OG_IMAGE } from '@/lib/og'
import { faqPageSchema } from '@/lib/schema'
import { SEASONS, type SeasonKey } from '@/lib/seasonal-market'

// Layout and classes carried over from the retired /fall-market page (0ee98eb).

export function seasonMetadata(key: SeasonKey): Metadata {
  const s = SEASONS[key]
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: s.slug },
    openGraph: { title: s.title, description: s.description, images: [OG_IMAGE], url: `https://www.brxs.ca${s.slug}` },
    twitter: { card: 'summary_large_image', title: s.title, description: s.description, images: [OG_IMAGE] },
  }
}

export default function SeasonalMarketPage({ season }: { season: SeasonKey }) {
  const s = SEASONS[season]
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(s.faqs)) }} />

      <section className="hero">
        <div className="wrap">
          <span className="badge">{s.badge}</span>
          <h1>{s.h1}</h1>
          <p className="sub">{s.sub}</p>
          <div className="cta-row">
            <Link className="btn btn-brick" href="/book">{s.cta}</Link>
            <Link className="btn btn-sec" href="/pricing">View pricing</Link>
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">{s.reasonsOver}</span><h2>{s.reasonsH2}</h2></div>
          </div>
          <div className="reasons">
            {s.reasons.map((r, i) => (
              <div key={r.title} className="r"><span className="ic">{String(i + 1).padStart(2, '0')}</span><h3>{r.title}</h3><p>{r.body}</p></div>
            ))}
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">Every shoot</span><h2>Same standard, same prices.</h2></div>
          </div>
          <div className="incl">
            <div className="c"><span className="ic">01</span><h3>HDR photography</h3><p>Interiors and exteriors, edited for MLS®.</p></div>
            <div className="c"><span className="ic">02</span><h3>Licensed drone</h3><p>Aerial photos of the lot, roofline and surroundings.</p></div>
            <div className="c"><span className="ic">03</span><h3>Floor plan</h3><p>Branded 2D layout with room dimensions, included on every standard shoot.</p></div>
            <div className="c"><span className="ic">04</span><h3>Fast delivery</h3><p>We aim to deliver photos in 24 hours, in one branded portal.</p></div>
          </div>
          <p className="note">{s.note} <Link href="/pricing" style={{ color: 'var(--brickDeep)' }}>See pricing →</Link></p>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl" id="priority">
          <div className="book">
            <div>
              <span className="over">{s.closingOver}</span>
              <h2 style={{ color: 'var(--moon)', marginTop: 8 }}>{s.closingH2}</h2>
              <p className="lead" style={{ color: 'var(--moonSoft)' }}>{s.closingLead}</p>
              <div className="cta-row">
                <Link className="btn btn-brick" href="/book">{s.cta}</Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">FAQ</span><h2>Before you book.</h2></div>
          </div>
          <div className="faq">
            {s.faqs.map((f) => (
              <div key={f.q} className="qa"><h3>{f.q}</h3><p>{f.a}</p></div>
            ))}
          </div>
          <p className="note"><Link href="/service-areas" style={{ color: 'var(--brickDeep)' }}>Service areas →</Link></p>
        </section>
      </div>

      <style>{`
        .reasons{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--hair);
          border:1px solid var(--hair);border-radius:2px;}
        .reasons .r{background:var(--paper);padding:24px;}
        .reasons .r .ic{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0;
          text-transform:none;color:var(--brickDeep);display:block;margin-bottom:8px;}
        .reasons .r h3{font-weight:500;font-size:16px;color:var(--ink);margin-bottom:6px;}
        .reasons .r p{font-size:13px;color:var(--inkMute);line-height:1.5;}
        @media (max-width:680px){.reasons{grid-template-columns:1fr;}}
      `}</style>
    </>
  )
}
