import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { COLLECTIONS, articleHref, articlesIn, collectionHref, getCollection } from '@/lib/help'
import HelpIcon from '@/components/help/HelpIcon'
import HelpSearch from '@/components/help/HelpSearch'
import { ContactBand, Crumbs, JsonLd } from '@/components/help/Parts'
import { breadcrumbLd } from '@/lib/help/jsonld'
import { COLLECTION_DESCRIPTIONS } from '@/lib/help/collections'
import { OG_IMAGE } from '@/lib/og'

export const dynamicParams = false

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ collection: c.slug }))
}

type Props = { params: Promise<{ collection: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection } = await params
  const c = getCollection(collection)
  if (!c) return {}
  const title = `${c.title} · Bricks help centre`
  const description = COLLECTION_DESCRIPTIONS[c.slug] ?? c.summary
  return {
    title,
    description,
    alternates: { canonical: collectionHref(c.slug) },
    openGraph: { images: [OG_IMAGE], title, description, url: collectionHref(c.slug) },
    twitter: { card: 'summary', title, description },
  }
}

export default async function CollectionPage({ params }: Props) {
  const { collection } = await params
  const c = getCollection(collection)
  if (!c) notFound()
  const items = articlesIn(c.slug)
  const others = COLLECTIONS.filter((x) => x.slug !== c.slug && !!x.audience === !!c.audience)
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Help centre', path: '/help' }, { name: c.title, path: collectionHref(c.slug) }])} />
      <section className="hc-article-hero">
        <div className="wrap">
          <Crumbs items={[{ href: '/help', label: 'Help centre' }, { label: c.title }]} />
          <h1>{c.title}</h1>
          <p className="hc-lede">{c.summary}</p>
          <div style={{ marginTop: 24 }}><HelpSearch compact /></div>
        </div>
      </section>
      <div className="wrap">
        <section className="hc-sec" aria-labelledby="hc-list">
          <h2 id="hc-list" className="hc-sr">Articles</h2>
          <ul className="hc-list">
            {items.map((a) => (
              <li key={a.slug}>
                <Link href={articleHref(a)}>
                  <span className="hc-list-t">{a.title}</span>
                  <HelpIcon name="chevron" size={20} />
                  <span className="hc-list-s">{a.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="hc-sec" aria-labelledby="hc-more">
          <h2 id="hc-more">{c.audience ? 'Other kinds of client' : 'More topics'}</h2>
          <ul className="hc-chips" style={{ marginTop: 14 }}>
            {others.map((x) => (
              <li key={x.slug}><Link className="hc-chip" href={collectionHref(x.slug)}><HelpIcon name={x.icon} size={20} />{x.title}</Link></li>
            ))}
          </ul>
        </section>
        <ContactBand />
      </div>
    </>
  )
}
