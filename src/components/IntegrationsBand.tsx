/**
 * Home — Integrations band (#integrations).
 * Status source: Brixton, 2026-10-11. Show ONLY what is listed here.
 * Logo files + source/usage URLs: public/integrations/SOURCES.md.
 * Vendors whose rules require written permission / an agreement for logo use
 * (Follow Up Boss, kvCORE/BoldTrail, Google, Apple) render as plain text
 * wordmark tiles — never a fabricated logo.
 * Wording rule: "Works with" / "Connects to" only — never partner/certified/official.
 */

import type { CSSProperties } from 'react'
import './integrations-open.css'

/** scale: optical-size multiplier on the 30px logo height (uniform; never distorts). */
type Logo = { src: string; w: number; h: number; scale?: number; alt?: string }

type Tile = {
  /** Vendor / product name — used for alt text or the text wordmark. */
  name: string
  /** What Bricks does with it today. Keep MLS® with the ®; never brand a Bricks feature "MLS". */
  what: string
  /** Official asset. Omit to render a text wordmark tile (see SOURCES.md for why). */
  logo?: Logo
}

const LIVE: Tile[] = [
  { name: 'Follow Up Boss', what: 'Two-way contacts & deals' },
  { name: 'kvCORE / BoldTrail', what: 'Contact sync' },
  { name: 'PropTx', what: 'PropTx · TRREB MLS® feed via RESO Web API', logo: { src: '/integrations/proptx-symbol.svg', w: 102, h: 92, scale: 1.4, alt: 'PropTx logo symbol' } },
  { name: 'Bridge Interactive', what: 'Cornerstone & ITSO MLS® feeds', logo: { src: '/integrations/bridge-interactive.png', w: 263, h: 80, scale: 0.8 } },
  { name: 'Repliers', what: 'MLS® feed', logo: { src: '/integrations/repliers.png', w: 401, h: 101 } },
  { name: 'Google Calendar', what: 'Calendar sync' },
  { name: 'Apple Calendar', what: 'iCloud + private ICS feed' },
  { name: 'Stripe', what: 'Payments', logo: { src: '/integrations/stripe.svg', w: 360, h: 150, scale: 1.15 } },
  { name: 'Google', what: 'Sign-in' },
]

const SOON: Tile[] = [
  { name: 'Docusign', what: 'Send from the deal', logo: { src: '/integrations/docusign.svg', w: 70, h: 15 } },
]

function Mark({ t, soon = false }: { t: Tile; soon?: boolean }) {
  if (!t.logo) {
    return <span className={soon ? 'integ-wordmark integ-wordmark-s' : 'integ-wordmark'}>{t.name}</span>
  }
  const { src, w, h, scale, alt } = t.logo
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      width={w}
      height={h}
      alt={alt ?? `${t.name} logo`}
      loading="eager"
      decoding="async"
      className={soon ? 'integ-img integ-img-s' : 'integ-img'}
      style={scale ? ({ '--s': scale } as CSSProperties) : undefined}
    />
  )
}

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="integ-row" aria-hidden={hidden || undefined} aria-label={hidden ? undefined : 'Works with'}>
      {LIVE.map((t) => (
        <li key={t.name} className="integ-item"><Mark t={t} /></li>
      ))}
      {SOON.map((t) => (
        <li key={t.name} className="integ-item integ-item-soon">
          <Mark t={t} />
          <span className="integ-soon-pill">Soon</span>
        </li>
      ))}
    </ul>
  )
}

export default function IntegrationsBand() {
  return (
    <section className="integ-band integ-open rvl" id="integrations" aria-label="Integrations">
      <div className="wrap">
        <div className="integ-head">
          <h2>Works with the tools you already use.</h2>
          <a className="learn-link integ-link" href="https://app.brxs.ca/login">Connect yours in Bricks OS →</a>
        </div>
      </div>
      <div className="integ-strip">
        <div className="integ-track">
          <Row />
          <Row hidden />
        </div>
      </div>
      <div className="wrap">
        <p className="integ-fine">Logos are trademarks of their respective owners. No endorsement implied.</p>
      </div>
    </section>
  )
}
