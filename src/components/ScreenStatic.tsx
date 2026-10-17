/**
 * Static capture of a product screen (public/media/screens, made by ship/visual-system/screens-capture.py).
 * Light and dark variants; the site theme (html[data-theme]) picks which one shows. Always painted,
 * no iframe, no scroll trigger, so it renders in iOS Safari and in full-page captures.
 */
const W = { desk: [340, 680, 1020], book: [240, 480, 720], disp: [240, 480, 720] } as const
const H = { desk: 620 / 820, book: 844 / 390, disp: 844 / 390 } as const
export type ScreenName = keyof typeof W

export default function ScreenStatic({ name, alt, sizes }: { name: ScreenName; alt: string; sizes: string }) {
  const set = (theme: string, fmt: string) => W[name].map((w) => `/media/screens/${name}-${theme}-${w}.${fmt} ${w}w`).join(', ')
  const w0 = W[name][1]
  return (
    <>
      {(['light', 'dark'] as const).map((t) => (
        <picture key={t} className={`scr-static scr-${t}`}>
          <source type="image/avif" srcSet={set(t, 'avif')} sizes={sizes} />
          <source type="image/webp" srcSet={set(t, 'webp')} sizes={sizes} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/media/screens/${name}-${t}-${w0}.webp`} width={w0} height={Math.round(w0 * H[name])} alt={t === 'light' ? alt : ''} aria-hidden={t === 'dark' ? true : undefined} decoding="async" />
        </picture>
      ))}
    </>
  )
}
