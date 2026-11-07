import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import RevealObserver from '@/components/RevealObserver'
import { Head, Close } from '@/components/calm/Calm'
import ModuleVisual, { PAINTS } from '@/components/software/ModuleVisual'
import ModuleGrid from '@/components/software/ModuleGrid'
import { SOFTWARE_MODULES, moduleBySlug } from '@/lib/software-modules'
import { OS_LOGIN } from '@/lib/brand'
import { OG_IMAGE } from '@/lib/og'
import '@/components/software/software.css'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return SOFTWARE_MODULES.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const m = moduleBySlug(slug)
  if (!m) return {}
  const url = `https://www.brxs.ca/software/${m.slug}`
  return {
    title: m.metaTitle,
    description: m.metaDescription,
    alternates: { canonical: `/software/${m.slug}` },
    openGraph: { type: 'website', siteName: 'Bricks', url, locale: 'en_CA', title: m.metaTitle, description: m.metaDescription, images: [OG_IMAGE] },
    twitter: { title: m.metaTitle, description: m.metaDescription, images: [OG_IMAGE] },
  }
}

export default async function SoftwareModulePage({ params }: Props) {
  const { slug } = await params
  const m = moduleBySlug(slug)
  if (!m) notFound()
  const url = `https://www.brxs.ca/software/${m.slug}`

  return (
    <>
      <RevealObserver />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              { '@type': 'WebPage', '@id': url, url, name: m.metaTitle, description: m.metaDescription, isPartOf: { '@id': 'https://www.brxs.ca/#website' }, about: { '@type': 'SoftwareApplication', name: 'Bricks', applicationCategory: 'BusinessApplication', operatingSystem: 'Web' } },
              { '@type': 'FAQPage', mainEntity: m.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
            ],
          }),
        }}
      />

      <section className="hero hero-tight sw-hero">
        <div className="wrap">
          <span className="sw-kicker"><Link href="/platform">Software</Link> / {m.name}</span>
          <h1>{m.h1}</h1>
          <p className="sub">{m.sub}</p>
          <div className="cta-row">
            <a className="btn btn-night btn-primary" href={OS_LOGIN}>Try Bricks free</a>
            {m.cta ? <Link className="cm-link" href={m.cta.href}>{m.cta.label}</Link> : <Link className="cm-link" href="/why-bricks">With and without Bricks</Link>}
          </div>
        </div>
      </section>

      <section className="cm-sec sw-first" aria-label="Product">
        <ModuleVisual v={m.visuals[0]} paint={paintFor(m.slug, 0)} />
      </section>

      <section className="cm-sec rvl" aria-label="What it replaces">
        <Head title="What it replaces." lede="The separate tools, threads and handoffs this part of Bricks takes over." />
        <ul className="sw-replaces">
          {m.replaces.map((r) => <li key={r}>{r}</li>)}
        </ul>
      </section>

      <section id="how" className="cm-sec rvl" aria-label="How it works">
        <Head title="How it works." />
        <ol className="sw-steps">
          {m.steps.map((s) => (
            <li key={s.title}><h3>{s.title}</h3><p>{s.body}</p></li>
          ))}
        </ol>
      </section>

      {m.visuals.length > 1 ? (
        <section className="cm-sec rvl" aria-label="More of the product">
          <div className="sw-visuals">
            {m.visuals.slice(1).map((v, i) => <ModuleVisual key={i} v={v} paint={paintFor(m.slug, i + 1)} />)}
          </div>
        </section>
      ) : null}

      <section className="cm-sec rvl" aria-label="Details">
        <Head title="The details." />
        <dl className="sw-details">
          {m.details.map((d) => (
            <div key={d.title}><dt>{d.title}</dt><dd>{d.body}</dd></div>
          ))}
        </dl>
        <p className="sw-plan">{m.plan} <Link href="/pricing">See pricing</Link>.</p>
      </section>

      <section className="cm-sec rvl faq-split" aria-label="Frequently asked questions">
        <Head title="Common questions." />
        <div className="faq faq-home">
          {m.faqs.map((f) => (
            <details key={f.q} className="qa">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="cm-sec rvl" aria-label="Related parts of Bricks">
        <Head title="Works with the rest of Bricks." link={{ href: '/platform', label: 'All of the software' }} />
        <ModuleGrid only={m.related} label="Related parts of Bricks" />
      </section>

      <Close title="Start with the software." href={OS_LOGIN} label="Try Bricks free" external />
      <style>{`
        .sw-hero .wrap{max-width:var(--container);padding-left:var(--gutter);padding-right:var(--gutter);}
        .sw-first{padding-top:24px;}
      `}</style>
    </>
  )
}

/** Each module page starts on a different painting and rotates from there, so neighbouring panels never repeat. */
function paintFor(slug: string, i: number) {
  const base = SOFTWARE_MODULES.findIndex((x) => x.slug === slug)
  return PAINTS[(base * 2 + i) % PAINTS.length]
}
