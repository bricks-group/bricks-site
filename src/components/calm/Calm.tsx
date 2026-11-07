import Link from 'next/link'
import './calm.css'

/**
 * Calm UI standard (approved Oct 23): at most three plain stats per view, quiet one-line rows,
 * sentence-case labels, mono only for figures, dates and IDs. Colour only for things needing attention.
 */

export type Stat = { fig: string; label: string }

/** Up to three plain figures. Extra items are dropped on purpose. */
export function Stats({ items, label }: { items: readonly Stat[]; label?: string }) {
  return (
    <dl className="cm-stats" aria-label={label}>
      {items.slice(0, 3).map((s) => (
        <div key={s.label}>
          <dt>{s.label}</dt>
          <dd>{s.fig}</dd>
        </div>
      ))}
    </dl>
  )
}

export type Row = { title: string; detail?: string; value?: string; href?: string; external?: boolean }

/** Quiet one-line rows: title, short detail, optional figure on the right. */
export function Rows({ items, label }: { items: readonly Row[]; label?: string }) {
  return (
    <ul className="cm-rows" aria-label={label}>
      {items.map((r) => {
        const inner = (
          <>
            <span className="cm-row-t">{r.title}</span>
            {r.detail ? <span className="cm-row-d">{r.detail}</span> : null}
            {r.value ? <span className="cm-row-v">{r.value}</span> : null}
            {r.href ? <Arrow /> : null}
          </>
        )
        return (
          <li key={r.title}>
            {r.href ? (
              r.external ? <a className="cm-row" href={r.href}>{inner}</a> : <Link className="cm-row" href={r.href}>{inner}</Link>
            ) : (
              <div className="cm-row">{inner}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/** Thin 1.5px line arrow, drawn not typed. */
export function Arrow() {
  return (
    <svg className="cm-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

/** Section head: one sentence-case heading, optional one-line lede and one quiet link. */
export function Head({ title, lede, link }: { title: string; lede?: string; link?: { href: string; label: string } }) {
  return (
    <div className="cm-head">
      <div>
        <h2>{title}</h2>
        {lede ? <p>{lede}</p> : null}
      </div>
      {link ? <Link className="cm-link" href={link.href}>{link.label}</Link> : null}
    </div>
  )
}

/** Closing band: one heading, one action. Orange when it repeats the page's primary action; pass primary={false} otherwise. */
export function Close({ title, href, label, external, primary = true }: { title: string; href: string; label: string; external?: boolean; primary?: boolean }) {
  const cls = primary ? 'btn btn-night btn-primary' : 'btn btn-night'
  return (
    <section className="cm-close closer" aria-label={label}>
      <h2>{title}</h2>
      <div className="cm-close-cta">{external ? <a className={cls} href={href}>{label}</a> : <Link className={cls} href={href}>{label}</Link>}</div>
    </section>
  )
}
