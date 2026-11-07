import Link from 'next/link'
import type { ReactNode } from 'react'
import RevealObserver from '@/components/RevealObserver'
import PublicFaqs from '@/components/PublicFaqs'
import { Head, Rows, Close, type Row } from '@/components/calm/Calm'

type Action = { href: string; label: string }

export type LandingSection = {
  id?: string
  title: string
  lede?: string
  link?: Action
  rows?: readonly Row[]
  /** Short prose paragraphs, lists or a table. Rendered in the shared .prose style. */
  body?: ReactNode
  note?: ReactNode
  /** Unstyled content such as a form, rendered outside .prose. */
  raw?: ReactNode
}

function Btn({ a, primary }: { a: Action; primary?: boolean }) {
  const cls = primary ? 'btn btn-night btn-primary' : 'btn btn-sec'
  return a.href.startsWith('http') ? <a className={cls} href={a.href}>{a.label}</a> : <Link className={cls} href={a.href}>{a.label}</Link>
}

/**
 * Single-service and city landing pages. Calm UI: one hero, quiet sections, FAQs with FAQPage JSON-LD,
 * one closing action. Each page passes its own copy so no two pages share a body.
 */
export default function Landing({
  schemas, h1, sub, primary, secondary, sections, faqTitle, faqs, close,
}: {
  schemas: readonly object[]
  h1: string
  sub: string
  primary: Action
  secondary?: Action
  sections: readonly LandingSection[]
  faqTitle: string
  faqs: readonly { q: string; a: string }[]
  close: { title: string } & Action
}) {
  return (
    <>
      <RevealObserver />
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <section className="hero">
        <div className="wrap">
          <h1>{h1}</h1>
          <p className="sub">{sub}</p>
          <div className="cta-row">
            <Btn a={primary} primary />
            {secondary ? <Btn a={secondary} /> : null}
          </div>
        </div>
      </section>

      {sections.map((s) => (
        <section key={s.title} id={s.id} className="cm-sec rvl" aria-label={s.title}>
          <Head title={s.title} lede={s.lede} link={s.link} />
          {s.rows ? <Rows items={s.rows} /> : null}
          {s.body ? <div className="prose landing-prose">{s.body}</div> : null}
          {s.raw ?? null}
          {s.note ? <p className="cm-note">{s.note}</p> : null}
        </section>
      ))}

      <PublicFaqs title={faqTitle} faqs={faqs} />
      <Close title={close.title} href={close.href} label={close.label} external={close.href.startsWith('http')} />
    </>
  )
}
