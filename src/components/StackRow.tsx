/**
 * Home — compact "Works with your stack" logo row (Linear/Stripe-style).
 * Live integrations only (same status source as IntegrationsBand).
 * Vendors whose logo rules need written permission (Follow Up Boss,
 * kvCORE/BoldTrail, Google, Apple) render as monochrome text wordmarks —
 * never a fabricated logo. See public/integrations/SOURCES.md.
 */
import Link from 'next/link'
import type { CSSProperties } from 'react'

type Item = { name: string; src?: string; w?: number; h?: number; s?: number }

const ITEMS: Item[] = [
  { name: 'Follow Up Boss' },
  { name: 'kvCORE / BoldTrail' },
  { name: 'PropTx', src: '/integrations/proptx-symbol.svg', w: 102, h: 92, s: 1.25 },
  { name: 'Bridge Interactive', src: '/integrations/bridge-interactive.png', w: 263, h: 80, s: 0.95 },
  { name: 'Repliers', src: '/integrations/repliers.png', w: 401, h: 101, s: 0.85 },
  { name: 'Stripe', src: '/integrations/stripe.svg', w: 360, h: 150, s: 1.15 },
  { name: 'Google Calendar' },
  { name: 'Apple Calendar' },
]

export default function StackRow() {
  return (
    <section className="stack-row rvl" aria-label="Works with your stack">
      <div className="wrap">
        <span className="over stack-over">Works with your stack</span>
        <ul className="stack-logos stagger">
          {ITEMS.map((t, i) => (
            <li key={t.name} style={{ '--i': i } as CSSProperties}>
              {t.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.src} width={t.w} height={t.h} alt={t.name} loading="lazy" decoding="async"
                  style={{ '--s': t.s ?? 1 } as CSSProperties} />
              ) : (
                <span className="stack-word">{t.name}</span>
              )}
            </li>
          ))}
        </ul>
        <Link className="learn-link stack-link" href="/platform#integrations">See all integrations →</Link>
      </div>
    </section>
  )
}
