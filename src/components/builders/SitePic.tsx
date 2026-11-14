/** Responsive AVIF/WebP picture for the Site Progress construction shots (public/media/site-progress). */
type Props = {
  name: 'tower-cranes' | 'podium-formwork' | 'excavation-topdown'
  alt: string
  sizes: string
  eager?: boolean
  className?: string
  widths?: number[]
}

export default function SitePic({ name, alt, sizes, eager = false, className, widths = [640, 960, 1280, 1600] }: Props) {
  const set = (ext: string) => widths.map((w) => `/media/site-progress/${name}-${w}.${ext} ${w}w`).join(', ')
  return (
    <>
    {/* Eager = the page's LCP image. Hoisted to <head> by React so the AVIF is fetched before CSS and JS. */}
    {eager ? <link rel="preload" as="image" type="image/avif" imageSrcSet={set('avif')} imageSizes={sizes} fetchPriority="high" /> : null}
    <picture className={className}>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/media/site-progress/${name}-960.webp`}
        width={960}
        height={640}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
      />
    </picture>
    </>
  )
}
