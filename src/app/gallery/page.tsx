import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import RevealObserver from '@/components/RevealObserver'

export const metadata: Metadata = {
  title: 'Bricks — Work (Canadian listing media)',
  description: 'Selected Bricks listing media — photo, drone, and floor plans across residential, multifamily, commercial, and industrial.',
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: 'Bricks — Work (Canadian listing media)',
    description: 'Selected Bricks listing media — photo, drone, and floor plans across residential, multifamily, commercial, and industrial.',
  },
  twitter: {
    title: 'Bricks — Work (Canadian listing media)',
    description: 'Selected Bricks listing media — photo, drone, and floor plans across residential, multifamily, commercial, and industrial.',
  },
}

const featured = [
  { src: '/media/work/01.jpg', alt: 'Residential street exterior', t: 'Exterior' },
  { src: '/media/res-living-1.jpg', alt: 'Residential living room', t: 'Interior' },
]

type Shot = { src: string; alt: string; t: string; d?: string }

const residential: Shot[] = [
  { src: '/media/work/02.jpg', alt: 'Residential exterior', t: 'Exterior' },
  { src: '/media/res-ext-1.jpg', alt: 'Brick house exterior', t: 'Exterior' },
  { src: '/media/res-dining-1.jpg', alt: 'Dining room', t: 'Dining' },
  { src: '/media/res-living-1.jpg', alt: 'Open living and kitchen', t: 'Living' },
  { src: '/media/res-living-2.jpg', alt: 'Living room', t: 'Living' },
  { src: '/media/work/07.jpg', alt: 'Living room', t: 'Living' },
  { src: '/media/work/08.jpg', alt: 'Bedroom', t: 'Bedroom' },
]

const multifamily: Shot[] = [
  { src: '/media/work/03.jpg', alt: 'Condo bedroom', t: 'Bedroom' },
  { src: '/media/work/04.jpg', alt: 'Condo living room', t: 'Living' },
  { src: '/media/work/09.jpg', alt: 'Building lobby', t: 'Lobby' },
]

const commercial: Shot[] = [
  { src: '/media/comm-aerial-1.jpg', alt: 'Commercial aerial', t: 'Aerial', d: 'Drone · Advanced RPAS' },
  { src: '/media/comm-ext-1.jpg', alt: 'Commercial exterior', t: 'Exterior' },
  { src: '/media/work/05.jpg', alt: 'Urban mixed-use aerial', t: 'Urban' },
]

const industrial: Shot[] = [
  { src: '/media/work/06.jpg', alt: 'Industrial aerial', t: 'Aerial', d: 'Drone · Advanced RPAS' },
  { src: '/media/comm-unit-1.jpg', alt: 'Industrial unit', t: 'Unit' },
  { src: '/media/comm-interior-1.jpg', alt: 'Industrial suite', t: 'Suite' },
  { src: '/media/work/11.jpg', alt: 'Construction aerial', t: 'Site' },
]

const beforeAfter = [
  { before: '/media/proof/Sky Before.png', after: '/media/proof/Sky After.png', t: 'Sky replacement' },
  { before: '/media/proof/HDR Before.png', after: '/media/proof/HDR After.png', t: 'HDR blending' },
  { before: '/media/proof/Twilight before.png', after: '/media/proof/twilight After.png', t: 'Twilight' },
  { before: '/media/proof/Staging Before.png', after: '/media/proof/Staging After.png', t: 'Virtual staging' },
]

function Grid({ images }: { images: Shot[] }) {
  return (
    <div className="work-grid">
      {images.map((img) => (
        <div key={img.src} className="work-card">
          <div className="img"><Image src={img.src} alt={img.alt} width={720} height={540} loading="lazy" /></div>
          <div className="meta"><div className="t">{img.t}</div>{img.d && <div className="d">{img.d}</div>}</div>
        </div>
      ))}
    </div>
  )
}

export default function GalleryPage() {
  return (
    <>
      <RevealObserver />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ImageGallery',
            name: 'Bricks — Selected listing media',
            description: 'Real estate listing photography, drone, and interior/exterior captures for Canadian real estate.',
            url: 'https://www.brxs.ca/gallery',
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <span className="badge">Selected work</span>
          <h1>Real shoots, not stock.</h1>
          <p className="sub">Residential, multifamily, commercial, and industrial — the same standard every listing gets.</p>
        </div>
      </section>

      <section className="rvl" aria-label="Featured stills">
        <div className="tray tray-os tray-still">
          <div className="tray-stage">
            {featured.map((img) => (
              <div key={img.src} className="pwin">
                <div className="pwin-bar">
                  <div className="pwin-dots" aria-hidden="true"><i /><i /><i /></div>
                  <span>{img.t}</span>
                </div>
                <Image className="still" src={img.src} alt={img.alt} width={800} height={600} priority />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="wrap work-wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">Residential</span><h2>Houses, interiors, the street.</h2></div>
          </div>
          <Grid images={residential} />
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">Multifamily</span><h2>Units, amenity, the lobby.</h2></div>
          </div>
          <Grid images={multifamily} />
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">Commercial</span><h2>Offices, flex, and the roof.</h2></div>
          </div>
          <Grid images={commercial} />
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">Industrial</span><h2>Units, docks, and the site.</h2></div>
          </div>
          <Grid images={industrial} />
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">The edit</span><h2>Before and after.</h2></div>
          </div>
          <div className="ba-grid">
            {beforeAfter.map((p) => (
              <div key={p.t} className="pwin ba-card">
                <div className="pwin-bar">
                  <div className="pwin-dots" aria-hidden="true"><i /><i /><i /></div>
                  <span>{p.t}</span>
                </div>
                <div className="ba-split">
                  <figure>
                    <Image src={p.before} alt={`${p.t} before`} width={480} height={360} loading="lazy" />
                    <figcaption>Before</figcaption>
                  </figure>
                  <figure>
                    <Image src={p.after} alt={`${p.t} after`} width={480} height={360} loading="lazy" />
                    <figcaption>After</figcaption>
                  </figure>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="block rvl" style={{ borderTop: 'none', paddingTop: 8 }}>
          <div className="book">
            <span className="over">Book a shoot</span>
            <h2>Ready when the listing is.</h2>
            <p className="lead">Confirm a slot. We send pricing by footprint — edited and MLS-ready in 24–48 hours.</p>
            <div className="cta-row">
              <Link className="btn btn-brick" href="/book">Book a shoot →</Link>
              <Link className="btn btn-sec" href="/pricing" style={{ color: 'var(--moon)', borderColor: 'var(--moonMute)' }}>Pricing</Link>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .work-wrap{max-width:980px;}
        .work-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:36px;margin-top:8px;}
        .work-card{border:1px solid var(--hair);border-radius:12px;overflow:hidden;background:var(--paper);}
        .work-card .img{aspect-ratio:4/3;background:var(--paperDeep);overflow:hidden;}
        .work-card .img img{width:100%;height:100%;object-fit:cover;display:block;filter:none;}
        .work-card .meta{padding:16px 18px 18px;}
        .work-card .meta .t{font-weight:500;font-size:15px;color:var(--ink);letter-spacing:-0.2px;}
        .work-card .meta .d{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--inkMute);margin-top:6px;letter-spacing:.06em;}
        .ba-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:36px;margin-top:8px;}
        .ba-card{overflow:hidden;}
        .ba-split{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--hair);}
        .ba-split figure{margin:0;background:var(--paper);}
        .ba-split img{width:100%;height:auto;aspect-ratio:4/3;object-fit:cover;display:block;filter:none;}
        .ba-split figcaption{font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--inkMute);padding:10px 14px 14px;}
        @media (max-width:820px){
          .work-grid,.ba-grid{grid-template-columns:1fr;gap:28px;}
        }
      `}</style>
    </>
  )
}
