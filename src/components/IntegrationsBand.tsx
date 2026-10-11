/**
 * Home — Integrations band (#integrations).
 * Status source: Brixton, 2026-10-11. Show ONLY what is listed here.
 * Logo files + source/usage URLs: public/integrations/SOURCES.md.
 * Vendors whose public rules require written permission for logo/icon use
 * (Google, Apple) render as plain text wordmark tiles — never a fabricated logo.
 * Wording rule: "Works with" / "Connects to" only — never partner/certified/official.
 */

import type { CSSProperties } from 'react'

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
  { name: 'Follow Up Boss', what: 'Two-way contact sync', logo: { src: '/integrations/follow-up-boss.png', w: 720, h: 139 } },
  { name: 'BoldTrail', what: 'kvCORE / BoldTrail contact sync', logo: { src: '/integrations/boldtrail.png', w: 720, h: 134 } },
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
  { name: 'Follow Up Boss', what: 'Deal sync', logo: { src: '/integrations/follow-up-boss.png', w: 720, h: 139 } },
]

function Mark({ t, soon = false }: { t: Tile; soon?: boolean }) {
  if (!t.logo) {
    return <span className="integ-wordmark">{t.name}</span>
  }
  const { src, w, h, scale, alt } = t.logo
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      width={w}
      height={h}
      alt={alt ?? `${t.name} logo`}
      loading="lazy"
      decoding="async"
      className={soon ? 'integ-img integ-img-s' : 'integ-img'}
      style={scale ? ({ '--s': scale } as CSSProperties) : undefined}
    />
  )
}

export default function IntegrationsBand() {
  return (
    <section className="integ-band rvl" id="integrations" aria-label="Integrations">
      <div className="wrap">
        <div className="section-head section-head-stack">
          <span className="over">Integrations</span>
          <h2>Works with the tools your brokerage already runs.</h2>
          <p className="lede">Plug Bricks into your current stack today. Move to Bricks-native when you&rsquo;re ready.</p>
        </div>

        <ul className="integ-grid" aria-label="Works with now">
          {LIVE.map((t) => (
            <li key={t.name} className="integ-tile">
              <div className="integ-plate"><Mark t={t} /></div>
              <div className="integ-meta">
                <span className="integ-what">{t.what}</span>
                <span className="integ-tag">Live</span>
              </div>
            </li>
          ))}
          <li className="integ-tile integ-soon" aria-label="Coming soon">
            <span className="integ-tag integ-tag-soon">Coming soon</span>
            <ul className="integ-soon-list">
              {SOON.map((t) => (
                <li key={`${t.name}-${t.what}`}>
                  <span className="integ-soon-mark"><Mark t={t} soon /></span>
                  <span className="integ-what">{t.what}</span>
                </li>
              ))}
            </ul>
          </li>
        </ul>

        <a className="learn-link integ-link" href="https://app.brxs.ca/login">Connect yours in Bricks OS →</a>
        <p className="integ-fine">Logos are trademarks of their respective owners. No endorsement implied.</p>
      </div>
    </section>
  )
}
