import type React from 'react'
import './clientele.css'

/**
 * Shared pieces for the audience pages (/investors, /commercial, /property-managers).
 * Drawing-set look: hairlines, thin 1.5px line icons, no fills, no gradients.
 * Only list things the app or the booking flow really does today.
 */

export type IconName = 'report' | 'evidence' | 'compare' | 'map' | 'visit' | 'camera' | 'units' | 'calendar' | 'share' | 'plan'

const PATHS: Record<IconName, string> = {
  report: 'M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h7',
  evidence: 'M6 3h12v18H6zM9 12l2 2 4-4M9 7h6',
  compare: 'M3 7l9-4 9 4-9 4zM3 12l9 4 9-4M3 17l9 4 9-4',
  map: 'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14',
  visit: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5',
  camera: 'M4 7h4l2-2h4l2 2h4v12H4zM12 16a3 3 0 100-6 3 3 0 000 6z',
  units: 'M4 3h16v18H4zM4 9h16M4 15h16M12 3v18',
  calendar: 'M4 5h16v15H4zM4 10h16M8 3v4M16 3v4',
  share: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
  plan: 'M3 3h18v18H3zM3 12h8v9M11 3v5M15 12h6',
}

export function LineIcon({ name }: { name: IconName }) {
  return (
    <svg className="cl-ico" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={PATHS[name]} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter" strokeLinecap="square" />
    </svg>
  )
}

export type SystemTile = { icon: IconName; title: string; body: string }

/** The software lead: one sentence, then the parts of the system that matter to this audience. */
export function SystemBand({ title = 'Bricks is the system that brings it all together.', lede, tiles, label }: { title?: string; lede: string; tiles: readonly SystemTile[]; label: string }) {
  return (
    <section className="cm-sec cl-system" aria-label={label}>
      <div className="cm-head"><div><h2>{title}</h2><p>{lede}</p></div></div>
      <ul className="cl-tiles">
        {tiles.map((t) => (
          <li key={t.title}>
            <LineIcon name={t.icon} />
            <h3>{t.title}</h3>
            <p>{t.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Plain photo, no overlay text. `note` is a quiet caption under it (e.g. stock vs our work). */
export function Photo({ src, alt, note, ratio = 'wide' }: { src: string; alt: string; note?: string; ratio?: 'wide' | 'square' }) {
  return (
    <figure className={`cl-photo cl-photo-${ratio}`}>
      <div className="cl-photo-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
      {note ? <figcaption>{note}</figcaption> : null}
    </figure>
  )
}

/**
 * Hero plate: the page's lead photo set like a drawing sheet. A hairline frame with
 * corner ticks, and a title block under it (sheet number, what it shows, where it's from).
 * No overlay text on the photo itself.
 */
export function HeroPlate({ sheet, title, note, children }: { sheet: string; title: string; note: string; children: React.ReactNode }) {
  return (
    <figure className="cl-plate">
      <div className="cl-plate-frame">{children}</div>
      <figcaption className="cl-plate-block">
        <span className="cl-plate-no">{sheet}</span>
        <span className="cl-plate-title">{title}</span>
        <span className="cl-plate-note">{note}</span>
      </figcaption>
    </figure>
  )
}

/** Eager hero image for a HeroPlate (plain jpg from public/media). */
export function PlateImg({ src, alt }: { src: string; alt: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} width={1600} height={1066} loading="eager" fetchPriority="high" decoding="async" />
}
