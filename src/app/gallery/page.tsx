import type { Metadata } from 'next'
import Image from 'next/image'
import { Close } from '@/components/calm/Calm'
import Script from 'next/script'
import RevealObserver from '@/components/RevealObserver'

export const metadata: Metadata = {
  title: "Real Estate Photography & Listing Photo Gallery | Bricks",
  description: "Browse Bricks listing photo samples from homes, multifamily, commercial and industrial properties, with aerial images and before-and-after editing comparisons.",
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: "Real Estate Photography & Listing Photo Gallery | Bricks",
    description: "Browse Bricks listing photo samples from homes, multifamily, commercial and industrial properties, with aerial images and before-and-after editing comparisons.",
    images: ['/media/work/02.jpg'],
    url: 'https://www.brxs.ca/gallery',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Real Estate Photography & Listing Photo Gallery | Bricks",
    description: "Browse Bricks listing photo samples from homes, multifamily, commercial and industrial properties, with aerial images and before-and-after editing comparisons.",
    images: ['/media/work/02.jpg'],
  },
}

type Shot = { src: string; alt: string; t: string; d?: string }

const residential: Shot[] = [
  { src: '/media/work/02.jpg', alt: 'HDR listing photo — residential exterior for MLS', t: 'Exterior' },
  { src: '/media/res-ext-1.jpg', alt: 'Real estate photography — brick house exterior listing photo', t: 'Exterior' },
  { src: '/media/res-dining-1.jpg', alt: 'Listing photos — residential dining room interior HDR', t: 'Dining' },
  { src: '/media/work/07.jpg', alt: 'Condo living room listing photo in the GTA', t: 'Living' },
  { src: '/media/work/08.jpg', alt: 'Listing photos — bedroom interior', t: 'Bedroom' },
]

const multifamily: Shot[] = [
  { src: '/media/mf-riverbend-lobby.jpg', alt: 'Multifamily lobby — amenity listing photo', t: 'Lobby' },
  { src: '/media/mf-20george-rooftop.jpg', alt: 'Condo rooftop amenity listing photo', t: 'Rooftop' },
  { src: '/media/mf-dialogue-balcony.jpg', alt: 'Balcony amenity — multifamily listing still', t: 'Balcony' },
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
]

// Pre-sized AVIF/WebP of public/media/proof/*.png (scripts/proof-images.mjs). The PNGs were
// 1.3-9.8 MB each; React preloaded all six on every page that prefetched /gallery.
const proof = (slug: string) => ({
  avif: `/media/proof/${slug}-704.avif 704w, /media/proof/${slug}-1408.avif 1408w`,
  webp: `/media/proof/${slug}-704.webp 704w, /media/proof/${slug}-1408.webp 1408w`,
  src: `/media/proof/${slug}-1408.webp`,
})
const BA_SIZES = '(max-width:900px) 100vw, 33vw'

const beforeAfter = [
  { before: proof('sky-before'), after: proof('sky-after'), label: 'Sky enhance (on request) before and after' },
  { before: proof('hdr-before'), after: proof('hdr-after'), label: 'HDR blending before and after' },
  { before: proof('twilight-before'), after: proof('twilight-after'), label: 'Twilight before and after' },
]

function Grid({ images }: { images: Shot[] }) {
  return (
    <div className="work-grid">
      {images.map((img) => (
        <div key={img.src} className="work-card">
          <div className="img"><Image src={img.src} alt={img.alt} width={1200} height={900} quality={90} sizes="(max-width:900px) 100vw, 33vw" loading="lazy" /></div>
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
          <h1>Real shoots, not stock.</h1>
          <p className="sub">Homes, multifamily, commercial and industrial, shot to one standard. Explore interiors, exteriors and aerial views from Bricks listing media work.</p>
        </div>
      </section>

      <div className="wrap work-wrap">
        <section className="block rvl" aria-label="Before and after">
          <h2>Before and after</h2>
          <p className="ba-hint">Compare HDR blending, twilight editing and sky enhancement on request. Drag each divider to see the original image beside the edited version.</p>
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
                  <picture>
                    <source type="image/avif" srcSet={p.after.avif} sizes={BA_SIZES} />
                    <img className="ba-after" src={p.after.src} srcSet={p.after.webp} sizes={BA_SIZES} width={1408} height={768} alt={`${name} — after`} loading="lazy" decoding="async" />
                  </picture>
                  <picture>
                    <source type="image/avif" srcSet={p.before.avif} sizes={BA_SIZES} />
                    <img className="ba-before" src={p.before.src} srcSet={p.before.webp} sizes={BA_SIZES} width={1408} height={768} alt={`${name} — before`} loading="lazy" decoding="async" />
                  </picture>
                  <div className="ba-handle" aria-hidden="true"><span className="ba-knob">↔</span></div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="block rvl" aria-label="Work">
          <h2>Selected listing photography</h2>
          <p className="ba-hint">The gallery brings together residential rooms and exteriors, multifamily amenities, commercial aerials and industrial buildings. Use these samples to discuss the views and spaces your next property needs. Listing media is a service you can book inside Bricks.</p>
          <Grid images={[...residential, ...multifamily, ...commercial, ...industrial]} />
        </section>
      </div>

      <Close title="Ready when the listing is." href="/book" label="Book media" />

      <style>{`
        .work-wrap{max-width:980px;}
        .work-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--gap);}
        .work-card{border:1px solid var(--hair);border-radius:2px;overflow:hidden;background:var(--paper);}
        .work-card .img{aspect-ratio:4/3;background:var(--paperDeep);overflow:hidden;}
        .work-card .img img{width:100%;height:100%;object-fit:cover;display:block;filter:none;}
        .work-card .meta{padding:16px;}
        .work-card .meta .t{font-weight:500;font-size:15px;color:var(--ink);letter-spacing:-0.2px;}
        .work-card .meta .d{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--inkMute);margin-top:6px;letter-spacing:.06em;}
        .ba-hint{margin:0 0 var(--gap);font-size:15px;color:var(--inkMute);}
        .ba-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--gap);}
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
          letter-spacing:0;text-transform:none;padding:6px 10px;border-radius:2px;pointer-events:none;z-index:3;
          color:#F4F1EB;background:rgba(14,11,9,.55);border:1px solid rgba(244,241,235,.22);
          backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 1px 2px rgba(0,0,0,.18);}
        .ba-tag-before{left:12px;}
        .ba-tag-after{right:12px;}
        @media (max-width:820px){
          .work-grid{grid-template-columns:1fr;}
        }
        @media (max-width:720px){
          .ba-grid{grid-template-columns:1fr;}
        }
      `}</style>
    </>
  )
}
