import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import RevealObserver from '@/components/RevealObserver'

export const metadata: Metadata = {
  title: 'Real Estate Photography Gallery — Listing Photos Canada | Bricks',
  description:
    'Selected Bricks real estate photography and listing photos — HDR stills, drone real estate photos, and floor plans across residential, multifamily, commercial, and industrial.',
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: 'Real Estate Photography Gallery | Bricks',
    description: 'HDR listing photos, drone, and floor plans — Canadian residential and commercial work samples.',
    images: ['/media/work/02.jpg'],
    url: 'https://www.brxs.ca/gallery',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Photography Gallery | Bricks',
    description: 'Listing photo samples — residential, multifamily, commercial, industrial.',
    images: ['/media/work/02.jpg'],
  },
}

type Shot = { src: string; alt: string; t: string; d?: string }

const residential: Shot[] = [
  { src: '/media/work/02.jpg', alt: 'HDR listing photo — residential exterior for MLS', t: 'Exterior' },
  { src: '/media/res-ext-1.jpg', alt: 'Real estate photography — brick house exterior listing photo', t: 'Exterior' },
  { src: '/media/res-dining-1.jpg', alt: 'Listing photos — residential dining room interior HDR', t: 'Dining' },
  { src: '/media/res-living-1.jpg', alt: 'MLS photos — open living and kitchen interior', t: 'Living' },
  { src: '/media/res-living-2.jpg', alt: 'Real estate photography — living room listing photo', t: 'Living' },
  { src: '/media/work/07.jpg', alt: 'Real estate photography — living room listing photo', t: 'Living' },
  { src: '/media/work/08.jpg', alt: 'Listing photos — bedroom interior', t: 'Bedroom' },
]

const multifamily: Shot[] = [
  { src: '/media/mf-riverbend-lobby.jpg', alt: 'Multifamily lobby — amenity listing photo', t: 'Lobby' },
  { src: '/media/mf-20george-rooftop.jpg', alt: 'Condo rooftop amenity listing photo', t: 'Rooftop' },
  { src: '/media/mf-dialogue-balcony.jpg', alt: 'Balcony amenity — multifamily listing still', t: 'Balcony' },
  { src: '/media/mf-trillium-amenity.jpg', alt: 'Multifamily amenity interior listing photo', t: 'Amenity' },
  { src: '/media/work/03.jpg', alt: 'Multifamily listing photos — condo bedroom', t: 'Bedroom' },
  { src: '/media/work/04.jpg', alt: 'Multifamily listing photos — condo living room', t: 'Living' },
]

const commercial: Shot[] = [
  { src: '/media/drone-cre-0439.jpg', alt: 'Drone real estate photos — CRE aerial (Advanced RPAS)', t: 'Aerial' },
  { src: '/media/drone-cre-2267.jpg', alt: 'Licensed drone — commercial industrial aerial', t: 'Aerial' },
  { src: '/media/drone-cre-2263.jpg', alt: 'CRE rooftop and site drone still', t: 'Aerial' },
  { src: '/media/drone-cre-2241.jpg', alt: 'Industrial park drone listing photo', t: 'Aerial' },
  { src: '/media/drone-cre-2236.jpg', alt: 'Commercial site drone still for listing media', t: 'Aerial' },
  { src: '/media/drone-cre-1570.jpg', alt: 'CRE exterior drone — listing media sample', t: 'Aerial' },
]

const industrial: Shot[] = [
  { src: '/media/cre-harvester-exterior.jpg', alt: 'Commercial industrial exterior — HDR listing photo', t: 'Exterior' },
  { src: '/media/cre-harvester-dock.jpg', alt: 'Loading dock exterior — commercial listing photo', t: 'Dock' },
  { src: '/media/cre-hanlon-exterior.jpg', alt: 'Industrial park exterior listing photo', t: 'Exterior' },
  { src: '/media/cre-industrial-1.jpg', alt: 'Industrial building exterior — MLS-ready still', t: 'Exterior' },
  { src: '/media/cre-industrial-2.jpg', alt: 'Industrial facade listing photo', t: 'Facade' },
  { src: '/media/cre-industrial-3.jpg', alt: 'Industrial site exterior listing photo', t: 'Site' },
  { src: '/media/cre-portfolio-flex.jpg', alt: 'Flex / industrial exterior listing photo', t: 'Flex' },
  { src: '/media/cre-harvester-office.jpg', alt: 'Commercial office interior — CRE listing still', t: 'Interior' },
]

const beforeAfter = [
  { before: '/media/proof/Sky Before.png', after: '/media/proof/Sky After.png', label: 'Sky enhance (on request) before and after' },
  { before: '/media/proof/HDR Before.png', after: '/media/proof/HDR After.png', label: 'HDR blending before and after' },
  { before: '/media/proof/Twilight before.png', after: '/media/proof/twilight After.png', label: 'Twilight before and after' },
  { before: '/media/proof/Staging Before.png', after: '/media/proof/Staging After.png', label: 'Virtual staging before and after' },
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
      <Script src="/assets/ba.js" strategy="afterInteractive" />
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

      <div className="wrap work-wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">Examples</span><h2>Before and after.</h2></div>
          </div>
          <p className="ba-hint">Drag to compare.</p>
          <div className="ba-grid">
            {beforeAfter.map((p) => {
              const name = p.label.replace(/ before and after$/i, '')
              return (
                <div
                  key={p.label}
                  className="ba"
                  data-pos="50"
                  tabIndex={0}
                  role="slider"
                  aria-label={p.label}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={50}
                >
                  <img className="ba-after" src={p.after} alt={`${name} — after`} />
                  <img className="ba-before" src={p.before} alt={`${name} — before`} />
                  <span className="ba-tag ba-tag-before">Before</span>
                  <span className="ba-tag ba-tag-after">After</span>
                  <div className="ba-handle" aria-hidden="true"><span className="ba-knob">↔</span></div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">Residential</span><h2>Homes, inside and out.</h2></div>
          </div>
          <Grid images={residential} />
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">Multifamily</span><h2>Lobbies, amenities and units.</h2></div>
          </div>
          <Grid images={multifamily} />
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">Commercial</span><h2>Commercial sites from above.</h2></div>
          </div>
          <Grid images={commercial} />
        </section>

        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">Industrial</span><h2>Docks, facades and sites.</h2></div>
          </div>
          <Grid images={industrial} />
        </section>

        <section className="block rvl" style={{ borderTop: 'none', paddingTop: 8 }}>
          <div className="book">
            <span className="over">Book a shoot</span>
            <h2>Ready when the listing is.</h2>
            <p className="lead">Book online and get a quote from the address.</p>
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
        .ba-hint{margin:0 0 4px;font-size:15px;color:var(--inkMute);}
        .ba-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:8px;}
        .ba{position:relative;aspect-ratio:4/3;overflow:hidden;background:var(--paperDeep);
          border:1px solid var(--hairStrong);border-radius:2px;cursor:ew-resize;user-select:none;-webkit-user-select:none;touch-action:pan-y;}
        .ba img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;-webkit-user-drag:none;filter:none;}
        .ba-before{clip-path:inset(0 50% 0 0);}
        .ba-handle{position:absolute;top:0;bottom:0;left:50%;width:2px;background:rgba(244,241,235,.92);
          transform:translateX(-1px);box-shadow:0 0 0 1px rgba(14,11,9,.25);pointer-events:none;z-index:2;}
        .ba-knob{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
          width:30px;height:30px;border-radius:2px;background:rgba(14,11,9,.72);color:#F4F1EB;
          border:1px solid rgba(244,241,235,.28);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
          display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:500;
          font-family:'JetBrains Mono',monospace;box-shadow:none;}
        .ba-tag{position:absolute;bottom:12px;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;
          letter-spacing:.14em;text-transform:uppercase;padding:6px 10px;border-radius:2px;pointer-events:none;z-index:3;
          color:#F4F1EB;background:rgba(14,11,9,.55);border:1px solid rgba(244,241,235,.22);
          backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 1px 2px rgba(0,0,0,.18);}
        .ba-tag-before{left:12px;}
        .ba-tag-after{right:12px;}
        @media (max-width:820px){
          .work-grid{grid-template-columns:1fr;gap:28px;}
        }
        @media (max-width:720px){
          .ba-grid{grid-template-columns:1fr;}
        }
      `}</style>
    </>
  )
}
