/**
 * Responsive AVIF/WebP/JPG picture for the licensed construction stock photos in
 * public/media/construction (credits: public/IMAGE_CREDITS.md).
 * These are illustrative stock photos, not Bricks captures or client projects:
 * never caption them as our work, and never put text or overlays on them.
 */
const PHOTOS = {
  'crew-deck': { w: 3200, h: 2133, widths: [640, 960, 1280, 1600, 2000] },
  'two-workers-rebar': { w: 3200, h: 2119, widths: [640, 960, 1280, 1600, 2000] },
  'quarry-aerial': { w: 3200, h: 2398, widths: [640, 960, 1280, 1600, 2000] },
  'frame-building': { w: 3106, h: 3883, widths: [480, 640, 960, 1280] },
} as const

export type ConstructionPhoto = keyof typeof PHOTOS

type Props = {
  name: ConstructionPhoto
  alt: string
  sizes: string
  className?: string
}

export default function ConstructionPic({ name, alt, sizes, className }: Props) {
  const p = PHOTOS[name]
  const set = (ext: string) => p.widths.map((w) => `/media/construction/${name}-${w}.${ext} ${w}w`).join(', ')
  const fw = 960
  const fh = Math.round((p.h * fw) / p.w)
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/media/construction/${name}-960.jpg`}
        srcSet={set('jpg')}
        sizes={sizes}
        width={fw}
        height={fh}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </picture>
  )
}
