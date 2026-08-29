import type { Metadata } from 'next'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'
import NewsletterInline from '../NewsletterInline'

export const metadata: Metadata = {
  title: 'Bricks platform — OS, Booking, Dispatch (in development)',
  description: 'Bricks OS, the Booking companion app, and Dispatch are in development and not in the App Store or Google Play. Book a shoot is live today on the site.',
  alternates: { canonical: '/platform' },
  openGraph: {
    title: 'Bricks platform — OS, Booking, Dispatch (in development)',
    description: 'The apps are not in the App Store or Google Play yet. Book a shoot is live today.',
  },
  twitter: {
    title: 'Bricks platform — OS, Booking, Dispatch (in development)',
    description: 'The apps are not in the App Store or Google Play yet. Book a shoot is live today.',
  },
}

const apps = [
  { over: 'In development', title: 'OS', body: 'The desk — roster, jobs, and media in one place for the office.' },
  { over: 'In development', title: 'Booking', body: 'The agent companion. You can book a shoot now on the site; the app is not in any store yet.' },
  { over: 'In development', title: 'Dispatch', body: 'The field app for photographers on site — jobs, uploads, pay.' },
]

export default function PlatformPage() {
  return (
    <>
      <RevealObserver />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Bricks platform',
            description: 'Bricks OS, the Booking companion app, and Dispatch are in development and are not in the App Store or Google Play. Listing media and the website booking form are live. Software subscriptions: Clay, Keystone, Marble, Diamond.',
            url: 'https://www.brxs.ca/platform',
            isPartOf: { '@type': 'WebSite', name: 'Bricks', url: 'https://www.brxs.ca/' },
            publisher: { '@type': 'Organization', name: 'Bricks', legalName: 'Bricks Group' },
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <span className="badge">In development</span>
          <h1>The platform.</h1>
          <p className="sub">Book a shoot is live today. The apps are not in the App Store or Google Play yet.</p>
          <div className="cta-row">
            <Link className="btn btn-brick" href="/book">Book a shoot</Link>
            <Link className="btn btn-sec" href="/contact">Contact</Link>
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">The apps</span>
              <h2>OS, Booking, Dispatch.</h2>
            </div>
          </div>
          <div className="apps">
            {apps.map((a) => (
              <div key={a.title} className="c rvl">
                <span className="ic">{a.over}</span>
                <h4>{a.title}</h4>
                <p>{a.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">Subscriptions</span>
              <h2>Clay, Keystone, Marble, Diamond.</h2>
            </div>
          </div>
          <p className="sub-line">These are the software subscriptions. Details come when the platform opens.</p>
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div>
              <span className="over">While it&apos;s in development</span>
              <h2>Join the list.</h2>
            </div>
          </div>
          <NewsletterInline />
        </section>

        <section className="block rvl" style={{ borderTop: 'none', paddingTop: 8 }}>
          <div className="book">
            <span className="over">Book a shoot</span>
            <h2>Media is live today.</h2>
            <p className="lead">Listing media and the website booking form are available now. The apps are not in any store yet.</p>
            <div className="cta-row">
              <Link className="btn btn-brick" href="/book">Book a shoot →</Link>
              <Link className="btn btn-sec" href="/contact">Contact</Link>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .apps{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--hair);
          border:1px solid var(--hair);border-radius:2px;margin-top:4px;}
        .apps .c{background:var(--paper);padding:22px 22px;}
        .apps .c h4{font-weight:500;font-size:15px;color:var(--ink);margin-bottom:6px;}
        .apps .c p{font-size:12.5px;color:var(--inkMute);line-height:1.45;}
        .apps .c .ic{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.1em;
          text-transform:uppercase;color:var(--brickDeep);display:block;margin-bottom:8px;}
        .sub-line{font-size:15px;color:var(--inkSoft);line-height:1.5;max-width:520px;margin-top:-12px;}
        @media (max-width:680px){ .apps{grid-template-columns:1fr;} }
      `}</style>
    </>
  )
}
