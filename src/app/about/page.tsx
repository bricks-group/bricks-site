import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Raphael Merchant | Bricks — Canadian real estate media',
  description: "Raphael Merchant is the founder of Bricks, a Canadian real estate media company. 14,000+ properties shot as Regional Visual Director / Architectural Photographer at CoStar, photography work behind Apartments.com's launch across the Greater Golden Horseshoe, and a Transport Canada Advanced RPAS drone certificate. Bricks shoots HDR, licensed drone, floor plans, optional virtual tour and virtual visit.",
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'profile',
    title: 'About Raphael Merchant | Bricks',
    description: "Founder of Bricks — listing media for Canadian real estate. 14,000+ properties shot as Regional Visual Director / Architectural Photographer at CoStar, photography work behind Apartments.com's Greater Golden Horseshoe launch, Advanced RPAS certified.",
    images: ['/media/raphael-merchant-640.jpg'],
  },
  twitter: {
    title: 'About Raphael Merchant | Bricks',
    description: "Founder of Bricks — listing media for Canadian real estate. 14,000+ properties shot as Regional Visual Director / Architectural Photographer at CoStar, work behind Apartments.com's Greater Golden Horseshoe launch.",
    images: ['/media/raphael-merchant-640.jpg'],
  },
}

const posts = [
  { href: '/blog/gta-real-estate-media-cost-2026', tag: 'Pricing', title: 'How much does real estate photography cost in the GTA? (2026)' },
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
            '@type': 'Person',
            name: 'Raphael Merchant',
            jobTitle: 'Founder, Bricks',
            description: "Founder of Bricks, listing media for Canadian real estate. Shot and profiled 14,000+ properties as Regional Visual Director / Architectural Photographer at CoStar; photography work behind Apartments.com's launch across the Greater Golden Horseshoe. Transport Canada Advanced RPAS drone certificate holder.",
            image: 'https://www.brxs.ca/media/raphael-merchant-640.jpg',
            url: 'https://www.brxs.ca/about',
            email: 'booking@brxs.ca',
            sameAs: ['https://www.linkedin.com/company/bricksbybricks'],
            knowsAbout: ['Real estate photography', 'Aerial photography', 'Floor plans', 'Virtual tours', 'Virtual visits', 'Drone photography', 'Transport Canada RPAS regulations'],
            worksFor: { '@type': 'Organization', name: 'Bricks', legalName: 'Bricks Group', url: 'https://www.brxs.ca/' },
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <span className="badge">About</span>
          <h1>Raphael Merchant</h1>
          <p className="sub">Founder of Bricks — listing media for Canadian real estate, built on 14,000+ properties shot as Regional Visual Director / Architectural Photographer at CoStar and photography work behind Apartments.com&apos;s launch across the Greater Golden Horseshoe.</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="author rvl">
            <div className="photo">
              <Image src="/media/raphael-merchant-640.jpg" alt="Portrait of Raphael Merchant, founder of Bricks and Transport Canada Advanced RPAS drone certificate holder" width={640} height={618} />
            </div>
            <div className="bio">
              <span className="role">Founder · Bricks</span>
              <p>Raphael Merchant started Bricks to give Canadian listing agents one consistent standard of media — HDR photography, licensed drone, floor plans, plus optional virtual tour and virtual visit — booked direct, delivered in 24–48 hours.</p>
              <p>Before Bricks, Raphael shot and profiled <strong>14,000+ properties</strong> as Regional Visual Director / Architectural Photographer at CoStar — architectural photography and portfolio work at a volume most photographers never reach. That work helped power Apartments.com&apos;s launch across the Greater Golden Horseshoe, which aired during Super Bowl LVIII. That volume is where the standard comes from: accurate, measured, and built to move listings — not just look pretty.</p>
              <p>Raphael also holds a <strong>Transport Canada Advanced RPAS (Remotely Piloted Aircraft Systems) certificate</strong>, which is what lets Bricks fly legally for commercial aerial work in the complex airspace around Toronto and Mississauga — including near Pearson.</p>
            </div>
          </div>

          <div className="creds">
            <div className="c"><div className="n">14,000+</div><div className="l">Properties shot &amp; profiled as Regional Visual Director / Architectural Photographer at CoStar</div></div>
            <div className="c"><div className="n">Apartments.com</div><div className="l">Photography work behind the platform&apos;s Greater Golden Horseshoe launch</div></div>
            <div className="c"><div className="n">Advanced RPAS</div><div className="l">Transport Canada certified — commercial drone operations</div></div>
          </div>

          <div className="sec-head" style={{ marginTop: 40 }}>
            <div><span className="over">Writing</span><h2>Guides by Raphael</h2></div>
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
            <span className="over">Work with Raphael</span>
            <h2>Book a listing shoot.</h2>
            <p className="lead">One standard, every time. Pick your services à la carte and get MLS-ready media in 24–48 hours.</p>
            <div className="cta-row">
              <Link className="btn btn-brick" href="/book">Book listing media</Link>
              <Link className="btn btn-sec" href="/pricing" style={{ color: 'var(--moon)', borderColor: 'var(--moonMute)' }}>View pricing</Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .author{display:grid;grid-template-columns:280px 1fr;gap:40px;align-items:start;margin-top:8px;}
        .author .photo{border:1px solid var(--hair);border-radius:2px;overflow:hidden;background:var(--paperDeep);}
        .author .photo img{width:100%;height:auto;display:block;}
        .author .bio h2{font-weight:500;font-size:26px;letter-spacing:-0.6px;color:var(--ink);margin-bottom:4px;}
        .author .bio .role{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--brickDeep);margin-bottom:18px;display:block;}
        .author .bio p{font-size:15px;color:var(--inkSoft);line-height:1.65;margin-bottom:14px;}
        .creds{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;margin:26px 0;}
        .creds .c{background:var(--paper);padding:20px;}
        .creds .c .n{font-family:'JetBrains Mono',monospace;font-size:22px;color:var(--ink);letter-spacing:-1px;}
        .creds .c .l{font-size:12px;color:var(--inkMute);margin-top:4px;line-height:1.4;}
        .posts{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:20px;}
        .posts a{border:1px solid var(--hair);border-radius:2px;padding:16px 18px;text-decoration:none;background:var(--paper);transition:border-color .2s ease;display:block;}
        .posts a:hover{border-color:var(--brick);}
        .posts a .t{font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--brickDeep);}
        .posts a h4{font-weight:500;font-size:15px;color:var(--ink);margin:7px 0 0;line-height:1.25;}
        @media (max-width:680px){
          .author{grid-template-columns:1fr;gap:20px;}
          .author .photo{max-width:240px;}
          .creds,.posts{grid-template-columns:1fr;}
        }
      `}</style>
    </>
  )
}
