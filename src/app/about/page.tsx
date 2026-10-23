import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FOUNDER_NAME, FOUNDER_PERSON, STATUS, TOUR_SHORT, VISIT_SHORT } from '@/lib/brand'
import { ORG_REF, SITE_ID } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'About Bricks — Canadian Real Estate Photography & Software',
  description:
    'Bricks Group builds the system for Canadian real estate. Founder experience: 14,000+ properties shot (CoStar regional creative lead lineage). HDR listing photos, MLS delivery, licensed drone, floor plans, optional virtual tour and virtual visit. The Bricks app is live in preview at app.brxs.ca.',
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'website',
    title: 'About Bricks — Real Estate Photography & Software',
    description: 'Media first, system destination. 14,000+ properties in founder experience. Founded by Raphael Merchant.',
    images: ['/media/raphael-merchant-640.jpg'],
    url: 'https://www.brxs.ca/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Bricks — Real Estate Photography & Software',
    description: 'Canadian listing media and real estate software. Founded by Raphael Merchant.',
    images: ['/media/raphael-merchant-640.jpg'],
  },
}

const posts = [
  { href: '/blog/canada-real-estate-photography-cost-2026', tag: 'Pricing · Canada', title: 'How much does real estate photography cost in Canada? (2026)' },
  { href: '/blog/gta-real-estate-media-cost-2026', tag: 'Pricing · Regional', title: 'How much does real estate photography cost in the GTA? (2026)' },
  { href: '/blog/3d-tour-vs-video-walkthrough', tag: 'Strategy', title: 'Virtual tour vs. video walkthrough: which sells faster?' },
  { href: '/blog/drone-photography-rules-ontario', tag: 'Rules & safety', title: 'Drone photography rules for real estate in Ontario' },
  { href: '/blog/whats-included-listing-shoot', tag: 'The shoot', title: "What's included in a professional listing photo shoot?" },
]

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            url: 'https://www.brxs.ca/about',
            about: ORG_REF,
            mainEntity: FOUNDER_PERSON,
            isPartOf: { '@id': SITE_ID },
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <span className="badge">About</span>
          <h1>Bricks</h1>
          <p className="sub">The system for Canadian real estate. Media first. Capture to close.</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="brand-story rvl">
            <p>Bricks is the system for the deal — property to listing to book to dispatch to media to MLS to close. We started with the shoot because that is the first thing a listing needs, and the last thing that should live in a separate tool.</p>
            <p>Four people on the deal. Brokerage, team, agent, photographer. Each gets a surface. System for the shop and the pipeline. Companion for the agent ordering media. The Bricks app for the photographer in the field.</p>
            <p>Media is live to book. HDR, licensed drone, floor plan, plus optional virtual tour ({TOUR_SHORT}) and virtual visit ({VISIT_SHORT}). {STATUS.os}</p>
          </div>

          <div className="creds">
            <div className="c"><div className="n">14,000+</div><div className="l">Properties shot — founder career experience (CoStar regional creative lead)</div></div>
            <div className="c"><div className="n">Apartments.com</div><div className="l">Photography lineage from CoStar work behind the Greater Golden Horseshoe launch</div></div>
            <div className="c"><div className="n">Advanced RPAS</div><div className="l">Legal commercial drone — including the airspace around Toronto, Mississauga, and Pearson</div></div>
          </div>

          <div className="founder rvl">
            <div className="photo">
              <Image src="/media/raphael-merchant-640.jpg" alt="Founder of Bricks" width={640} height={640} />
            </div>
            <div className="bio">
              <span className="role">The standard</span>
              <p>Before Bricks, Raphael shot and profiled <strong>14,000+</strong> properties as a regional creative lead at CoStar — architectural photography and portfolio work at a volume that shaped the standard. That work helped power Apartments.com&apos;s launch across the Greater Golden Horseshoe, which aired during Super Bowl LVIII. That volume is where the standard comes from: accurate, measured, and built to move listings — not just look pretty.</p>
              <p>Transport Canada Advanced RPAS is what lets Bricks fly legally for commercial aerial work in the complex airspace around Toronto and Mississauga — including near Pearson.</p>
              <p>Started by {FOUNDER_NAME}. Same standard, every shoot.</p>
            </div>
          </div>

          <div className="sec-head" style={{ marginTop: 40 }}>
            <div><span className="over">Writing</span><h2>Guides from Bricks</h2></div>
          </div>
          <div className="posts">
            {posts.map((p) => (
              <Link key={p.href} href={p.href}><span className="t">{p.tag}</span><h4>{p.title}</h4></Link>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="book">
            <span className="over">Work with Bricks</span>
            <h2>Book a listing shoot.</h2>
            <p className="lead">One standard, every time. Pick your services à la carte and get MLS-ready photos in 24 hours and other media on a 24–48h target.</p>
            <div className="cta-row">
              <Link className="btn btn-brick" href="/book">Book listing media</Link>
              <Link className="btn btn-sec" href="/platform" style={{ color: 'var(--moon)', borderColor: 'var(--moonMute)' }}>See the platform</Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .brand-story{max-width:640px;margin-top:8px;}
        .brand-story p{font-size:16px;color:var(--inkSoft);line-height:1.65;margin-bottom:16px;}
        .founder{display:grid;grid-template-columns:240px 1fr;gap:36px;align-items:start;margin-top:8px;}
        .founder .photo{border:1px solid var(--hair);border-radius:2px;overflow:hidden;background:var(--paperDeep);}
        .founder .photo img{width:100%;height:auto;display:block;}
        .founder .bio .role{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--brickDeep);margin-bottom:18px;display:block;}
        .founder .bio p{font-size:15px;color:var(--inkSoft);line-height:1.65;margin-bottom:14px;}
        .creds{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;margin:40px 0;}
        .creds .c{background:var(--paper);padding:26px 22px;}
        .creds .c .n{font-family:'JetBrains Mono',monospace;font-size:22px;color:var(--ink);letter-spacing:-1px;}
        .creds .c .l{font-size:12px;color:var(--inkMute);margin-top:4px;line-height:1.4;}
        .posts{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:20px;}
        .posts a{border:1px solid var(--hair);border-radius:2px;padding:16px 18px;text-decoration:none;background:var(--paper);transition:border-color .2s ease;display:block;}
        .posts a:hover{border-color:var(--brick);}
        .posts a .t{font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--brickDeep);}
        .posts a h4{font-weight:500;font-size:15px;color:var(--ink);margin:7px 0 0;line-height:1.25;}
        @media (max-width:680px){
          .founder{grid-template-columns:1fr;gap:20px;}
          .founder .photo{max-width:240px;}
          .creds,.posts{grid-template-columns:1fr;}
        }
      `}</style>
    </>
  )
}
