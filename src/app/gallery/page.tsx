import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Bricks — Work (GTA listing media)',
  description: 'Selected Bricks listing media from across the GTA — photo, drone, floor plans, twilight, with optional 3D tours.',
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: 'Bricks — Work (GTA listing media)',
    description: 'Selected Bricks listing media from across the GTA — photo, drone, floor plans, twilight, with optional 3D tours.',
  },
  twitter: {
    title: 'Bricks — Work (GTA listing media)',
    description: 'Selected Bricks listing media from across the GTA — photo, drone, floor plans, twilight, with optional 3D tours.',
  },
}

const residential = [
  { src: '/media/work/01.jpg', alt: 'GTA residence', t: 'GTA residence' },
  { src: '/media/work/02.jpg', alt: 'Residential interior', t: 'Residential interior' },
  { src: '/media/work/03.jpg', alt: 'Residential interior', t: 'Residential interior' },
  { src: '/media/work/04.jpg', alt: 'Residential interior', t: 'Residential interior' },
  { src: '/media/work/05.jpg', alt: 'Residential interior', t: 'Residential interior' },
  { src: '/media/work/06.jpg', alt: 'Residential interior', t: 'Residential interior' },
  { src: '/media/work/07.jpg', alt: 'Residential interior', t: 'Residential interior' },
  { src: '/media/work/08.jpg', alt: 'Residential exterior', t: 'Residential exterior' },
]

const commercial = [
  { src: '/media/comm-aerial-1.jpg', alt: 'Commercial — aerial', t: 'Commercial — aerial', d: 'Drone · Advanced RPAS' },
  { src: '/media/comm-interior-1.jpg', alt: 'Commercial interior', t: 'Commercial interior' },
  { src: '/media/comm-ext-1.jpg', alt: 'Commercial exterior', t: 'Commercial exterior' },
  { src: '/media/comm-ext-2.jpg', alt: 'Commercial exterior', t: 'Commercial exterior' },
  { src: '/media/comm-unit-1.jpg', alt: 'Commercial unit', t: 'Commercial unit' },
  { src: '/media/work/09.jpg', alt: 'Retail — HDR', t: 'Retail — HDR' },
  { src: '/media/work/10.jpg', alt: 'Building HDR', t: 'Building HDR' },
  { src: '/media/work/11.jpg', alt: 'Interior HDR', t: 'Interior HDR' },
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
            name: 'Bricks — Selected GTA listing media',
            description: 'Real estate listing photography, drone, and interior/exterior captures from across the Greater Toronto Area.',
            url: 'https://www.brxs.ca/gallery',
          }),
        }}
      />

      <div className="wrap">
        <section className="hero">
          <span className="badge">Selected work · GTA</span>
          <h1>The work.</h1>
          <p className="sub">Listing media captured across the Greater Toronto Area — HDR photography, Advanced RPAS-licensed drone, floor plans, twilight, and 3D virtual tours.</p>
        </section>

        <div className="groups">
          <h3 className="grp">Residential</h3>
          <div className="grid">
            {residential.map((img) => (
              <div key={img.src} className="card">
                <div className="img"><img src={img.src} alt={img.alt} width={480} height={360} loading="lazy" /></div>
                <div className="meta"><div className="t">{img.t}</div></div>
              </div>
            ))}
          </div>

          <h3 className="grp">Commercial &amp; aerial</h3>
          <div className="grid">
            {commercial.map((img) => (
              <div key={img.src} className="card">
                <div className="img"><img src={img.src} alt={img.alt} width={480} height={360} loading="lazy" /></div>
                <div className="meta"><div className="t">{img.t}</div>{img.d && <div className="d">{img.d}</div>}</div>
              </div>
            ))}
          </div>

          <h3 className="grp">The edit — before / after</h3>
          <div className="grid">
            {beforeAfter.map((p) => (
              <div key={p.t} className="card">
                <div className="img" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--hair)' }}>
                  <img src={p.before} alt={`${p.t} before`} width={240} height={360} loading="lazy" />
                  <img src={p.after} alt={`${p.t} after`} width={240} height={360} loading="lazy" />
                </div>
                <div className="meta"><div className="t">{p.t}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .wrap{max-width:1080px;margin:0 auto;padding:0 36px;}
        .hero{padding:48px 0 28px;}
        .hero h1{font-weight:500;font-size:34px;letter-spacing:-1px;color:var(--ink);}
        .hero p.sub{font-size:15px;color:var(--inkSoft);margin-top:12px;max-width:620px;}
        .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:18px 0 44px;}
        .grp{font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--ink);margin:34px 0 0;padding-bottom:10px;border-bottom:1px solid var(--hair);}
        .grp:first-child{margin-top:14px;}
        .card{border:1px solid var(--hair);border-radius:2px;overflow:hidden;background:var(--paper);transition:border-color .2s ease;}
        .card:hover{border-color:var(--brick);}
        .card .img{aspect-ratio:4/3;background:var(--paperDeep);overflow:hidden;}
        .card .img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s ease;}
        .card:hover .img img{transform:scale(1.04);}
        .card .meta{padding:12px 13px;}
        .card .meta .t{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--brickDeep);background:var(--brickTint);border-radius:2px;padding:4px 8px;}
        .card .meta .d{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--inkMute);margin-top:7px;}
        @media (max-width:820px){.grid{grid-template-columns:repeat(2,1fr);}}
        @media (max-width:560px){.grid{grid-template-columns:1fr;} .hero h1{font-size:28px;}}
      `}</style>
    </>
  )
}
