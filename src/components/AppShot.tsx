/**
 * A real Bricks screen, captured from the app running on demo data (fictional names, streets and emails).
 * Files live in public/media/app as <name>-<w>.avif/.webp at 1x and 2x. Thin graphite frame, lazy-loaded.
 * Brick-orange buttons are recoloured to graphite at capture, so the site keeps one orange action per page.
 */
const SHOTS = {
  'builder-overview': { kind: 'desk', h: 1800 },
  'builder-timeline': { kind: 'desk', h: 1800 },
  'builder-report': { kind: 'desk', h: 1800 },
  'builder-sharelinks': { kind: 'desk', h: 1300 },
  'builder-share': { kind: 'desk', h: 1800 },
  'brokerage-overview': { kind: 'desk', h: 1800 },
  'brokerage-transactions': { kind: 'desk', h: 1800 },
  'agent-crm': { kind: 'phone', h: 1520 },
  'agent-media': { kind: 'phone', h: 1520 },
} as const
export type AppShotName = keyof typeof SHOTS

const WIDTHS = { desk: [1100, 2200], phone: [360, 720] } as const
const RAW_W = { desk: 2880, phone: 780 } as const

export default function AppShot({ name, alt, caption, sizes }: { name: AppShotName; alt: string; caption?: string; sizes?: string }) {
  const { kind, h } = SHOTS[name]
  const ws = WIDTHS[kind]
  const set = (fmt: string) => ws.map((w) => `/media/app/${name}-${w}.${fmt} ${w}w`).join(', ')
  const s = sizes ?? (kind === 'desk' ? '(max-width:900px) 100vw, 1100px' : '300px')
  const w0 = ws[0]
  return (
    <figure className={`appshot appshot-${kind}`}>
      <style>{CSS}</style>
      <div className="appshot-frame">
        <picture>
          <source type="image/avif" srcSet={set('avif')} sizes={s} />
          <source type="image/webp" srcSet={set('webp')} sizes={s} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/media/app/${name}-${w0}.webp`} width={w0} height={Math.round((w0 * h) / RAW_W[kind])} alt={alt} loading="lazy" decoding="async" />
        </picture>
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

const CSS = `
.appshot{margin:0;min-width:0}
.appshot-frame{border:1px solid #3a3836;border-radius:4px;overflow:hidden;background:#f4f1ea;line-height:0}
.appshot-phone{max-width:300px}
.appshot-phone .appshot-frame{border:5px solid #2b2a28;border-radius:28px}
.appshot img{display:block;width:100%;height:auto}
.appshot figcaption{margin-top:10px;font-size:13px;line-height:1.45;color:var(--inkMute)}
.appshot-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px 24px}
.appshot-phones{display:flex;gap:24px;justify-content:center;align-items:flex-start}
.appshot-phones .appshot{flex:1 1 0}
@media (max-width:760px){
  .appshot-grid{grid-template-columns:1fr}
  .appshot-phones{gap:14px}
  .appshot-phone .appshot-frame{border-width:4px;border-radius:22px}
}
`
