import type { Metadata } from 'next'
import Image from 'next/image'
import { WORK_PHOTOS } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Bricks — Work (Canadian listing media)',
  description: 'Selected Bricks listing media — photo, drone, floor plans, twilight, with optional virtual tour and virtual visit.',
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: 'Bricks — Work (Canadian listing media)',
    description: 'Selected Bricks listing media — photo, drone, floor plans, twilight, with optional virtual tour and virtual visit.',
  },
  twitter: {
    title: 'Bricks — Work (Canadian listing media)',
    description: 'Selected Bricks listing media — photo, drone, floor plans, twilight, with optional virtual tour and virtual visit.',
  },
}

const residential = WORK_PHOTOS.slice(0, 8).map((p) => ({ ...p, t: p.alt }))
const commercial = [
  { src: '/media/comm-aerial-1.jpg', alt: 'Commercial — aerial', t: 'Commercial — aerial', d: 'Drone · Advanced RPAS' },
  { src: '/media/comm-interior-1.jpg', alt: 'Commercial interior', t: 'Commercial interior' },
  { src: '/media/comm-ext-1.jpg', alt: 'Commercial exterior', t: 'Commercial exterior' },
  { src: '/media/comm-ext-2.jpg', alt: 'Commercial exterior', t: 'Commercial exterior' },
  { src: '/media/comm-unit-1.jpg', alt: 'Commercial unit', t: 'Commercial unit' },
  { src: '/media/work/09.jpg', alt: 'Retail — HDR', t: 'Retail — HDR' },
  { src: '/media/work/10.jpg', alt: 'Building HDR', t: 'Building HDR' },
  { src: '/media/work/11.jpg', alt: 'Interior HDR', t: 'Interior HDR' },
  { src: '/media/work/12.jpg', alt: 'Residential interior', t: 'Residential interior' },
]

const beforeAfter = [
  { before: '/media/proof/Sky Before.png', after: '/media/proof/Sky After.png', t: 'Sky replacement' },
  { before: '/media/proof/HDR Before.png', after: '/media/proof/HDR After.png', t: 'HDR blending' },
  { before: '/media/proof/Twilight before.png', after: '/media/proof/twilight After.png', t: 'Twilight' },
  { before: '/media/proof/Staging Before.png', after: '/media/proof/Staging After.png', t: 'Virtual staging' },
]

export default function GalleryPage() {
  return (
    <>
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
          <h1>The work.</h1>
          <p className="sub">Residential, commercial, and the edit — real shoots, not stock.</p>
        </div>
      </section>

      <div className="wrap work-wrap">
        <div className="groups">
          <h3 className="grp">Residential</h3>
          <div className="grid">
            {residential.map((img) => (
              <div key={img.src} className="card">
                <div className="img"><Image src={img.src} alt={img.alt} width={480} height={360} loading="lazy" /></div>
                <div className="meta"><div className="t">{img.t}</div></div>
              </div>
            ))}
          </div>

          <h3 className="grp">Commercial &amp; aerial</h3>
          <div className="grid">
            {commercial.map((img) => (
              <div key={img.src} className="card">
                <div className="img"><Image src={img.src} alt={img.alt} width={480} height={360} loading="lazy" /></div>
                <div className="meta"><div className="t">{img.t}</div>{img.d && <div className="d">{img.d}</div>}</div>
              </div>
            ))}
          </div>

          <h3 className="grp">The edit — before / after</h3>
          <div className="grid">
            {beforeAfter.map((p) => (
              <div key={p.t} className="card">
                <div className="img" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--hair)' }}>
                  <Image src={p.before} alt={`${p.t} before`} width={240} height={360} loading="lazy" />
                  <Image src={p.after} alt={`${p.t} after`} width={240} height={360} loading="lazy" />
                </div>
                <div className="meta"><div className="t">{p.t}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .work-wrap{max-width:1080px;}
        .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin:22px 0 64px;}
        .grp{font-family:'JetBrains Mono',monospace;font-size:10.5px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--inkMute);margin:40px 0 0;padding-bottom:12px;border-bottom:1px solid var(--hair);}
        .grp:first-child{margin-top:8px;}
        .card{border:1px solid var(--hair);border-radius:2px;overflow:hidden;background:var(--paper);}
        .card .img{aspect-ratio:4/3;background:var(--paperDeep);overflow:hidden;}
        .card .img img{width:100%;height:100%;object-fit:cover;display:block;}
        .card .meta{padding:8px 2px 0;}
        .card .meta .t{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--inkMute);}
        .card .meta .d{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--inkFaint);margin-top:4px;}
        @media (max-width:820px){.grid{grid-template-columns:repeat(2,1fr);gap:16px;}}
        @media (max-width:560px){.grid{grid-template-columns:1fr;}}
      `}</style>
    </>
  )
}
