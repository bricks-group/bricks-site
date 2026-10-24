import Link from 'next/link'
import type { CSSProperties } from 'react'
import { LIVE_INTEGRATIONS, SOON_INTEGRATIONS, LOGO_FINE_PRINT, type Integration } from '@/lib/integrations'
import { Head, Rows } from './Calm'

/** One small mark: official logo as a uniform grey silhouette, or the name as plain text in the same grey. */
function Mark({ t }: { t: Integration }) {
  if (!t.logo) return <span className="ci-word">{t.name}</span>
  const { src, w, h, scale, alt } = t.logo
  const style = scale ? ({ '--s': scale } as CSSProperties) : undefined
  return (
    <span className="ci-mark">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} width={w} height={h} alt={t.symbolOnly ? '' : (alt ?? `${t.name} logo`)} loading="lazy" decoding="async"
        style={style} />
      {t.symbolOnly ? <span className="ci-word">{t.name}</span> : null}
    </span>
  )
}

/** Homepage: quiet heading, one row of marks (live only), one quiet link. */
export function IntegrationsRow({ href = '/platform#integrations' }: { href?: string }) {
  const items = LIVE_INTEGRATIONS.filter((t) => !t.notOnHome)
  return (
    <section className="cm-sec ci-sec rvl" id="integrations" aria-label="Integrations">
      <Head title="Works with the tools you already use." link={{ href, label: 'See all integrations' }} />
      <ul className="ci-row" aria-label="Works with">
        {items.map((t) => (
          <li key={t.name} title={t.what}><Mark t={t} /></li>
        ))}
      </ul>
      <p className="cm-note ci-fine">{LOGO_FINE_PRINT}</p>
    </section>
  )
}

/** Platform: the full list as quiet rows. Not-yet-shipped items are a plain note, never in the list. */
export function IntegrationsList() {
  const soon = SOON_INTEGRATIONS.map((t) => t.name).join(', ')
  return (
    <section className="cm-sec rvl" id="integrations" aria-label="Integrations">
      <Head title="Works with the tools you already use." />
      <ul className="ci-row ci-row-list" aria-hidden="true">
        {LIVE_INTEGRATIONS.map((t) => (
          <li key={t.name}><Mark t={t} /></li>
        ))}
      </ul>
      <Rows label="Integrations that work today" items={LIVE_INTEGRATIONS.map((t) => ({ title: t.name, detail: t.what }))} />
      <p className="cm-note">{soon ? `Coming next: ${soon}. ` : ''}{LOGO_FINE_PRINT}</p>
    </section>
  )
}

export default IntegrationsRow
