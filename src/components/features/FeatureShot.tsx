/**
 * Cropped, real product screenshots (demo data) in public/media/features.
 * Sources: /workspace/ship/features/* evidence shots, cropped by scripts outside the repo.
 * Always caption as sample data; never present the demo projects, deals or people as clients.
 */
const SHOTS = {
  'progress-report': { w: 960, h: 790, widths: [640, 960] },
  'report-measure': { w: 960, h: 592, widths: [640, 960] },
  'report-issues': { w: 960, h: 460, widths: [640, 960] },
  'report-evidence': { w: 960, h: 420, widths: [640, 960] },
  'investor-update': { w: 980, h: 766, widths: [640, 980] },
  'compare-3d': { w: 790, h: 804, widths: [640, 790] },
  'capture-import': { w: 670, h: 566, widths: [640, 670] },
  'esign-audit': { w: 960, h: 529, widths: [640, 960] },
  'launch-kit': { w: 914, h: 824, widths: [640, 914] },
  'deal-room': { w: 1068, h: 900, widths: [640, 1000] },
} as const

export type FeatureShotName = keyof typeof SHOTS

type Props = { name: FeatureShotName; alt: string; sizes?: string; caption?: string }

/** Bare responsive picture of one shot (AVIF, WebP, JPG), light and dark captures.
 * The dark set (name-dark-W) is the same capture with UI luma flipped onto the dark tokens;
 * photographic regions (orthophotos, site photos, 3D viewers) are left untouched.
 * html[data-theme] picks which one shows (visual-tokens.css, .fp-light / .fp-dark). */
export function FeaturePic({ name, alt, sizes = '(max-width:900px) 100vw, 640px' }: { name: FeatureShotName; alt: string; sizes?: string }) {
  const p = SHOTS[name]
  const fw = p.widths[p.widths.length - 1]
  const fh = Math.round((p.h * fw) / p.w)
  return (
    <>
      {(['light', 'dark'] as const).map((t) => {
        const stem = t === 'light' ? name : `${name}-dark`
        const set = (ext: string) => p.widths.map((w) => `/media/features/${stem}-${w}.${ext} ${w}w`).join(', ')
        return (
          <picture key={t} className={`fp-${t}`}>
            <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
            <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/media/features/${stem}-${fw}.jpg`} srcSet={set('jpg')} sizes={sizes} width={fw} height={fh} alt={t === 'light' ? alt : ''} aria-hidden={t === 'dark' ? true : undefined} loading="lazy" decoding="async" />
          </picture>
        )
      })}
    </>
  )
}

/** Framed shot with corner ticks and a "Sample data" caption. Styles live in features.css. */
export default function FeatureShot({ name, alt, sizes, caption = 'Sample data' }: Props) {
  return (
    <figure className="fx-shot">
      <div className="fx-frame">
        <FeaturePic name={name} alt={alt} sizes={sizes} />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}
