import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ARTICLES, articleHref, collectionHref, getArticle, getCollection, headings, relatedTo } from '@/lib/help'
import Blocks from '@/components/help/Blocks'
import Feedback from '@/components/help/Feedback'
import HelpIcon from '@/components/help/HelpIcon'
import { ContactBand, Crumbs, JsonLd, formatDate } from '@/components/help/Parts'
import { articleLd } from '@/lib/help/jsonld'

export const dynamicParams = false

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ collection: a.collection, article: a.slug }))
}

type Props = { params: Promise<{ collection: string; article: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection, article } = await params
  const a = getArticle(collection, article)
  if (!a) return {}
  const title = `${a.title} · Bricks help centre`
  return {
    title,
    description: a.summary,
    alternates: { canonical: articleHref(a) },
    openGraph: { title, description: a.summary, url: articleHref(a), type: 'article' },
    twitter: { card: 'summary', title, description: a.summary },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { collection, article } = await params
  const a = getArticle(collection, article)
  if (!a) notFound()
  const c = getCollection(a.collection)!
  const toc = headings(a)
  const related = relatedTo(a)
  return (
    <>
      {articleLd(a).map((d, i) => <JsonLd key={i} data={d} />)}
      <section className="hc-article-hero">
        <div className="wrap">
          <Crumbs items={[{ href: '/help', label: 'Help centre' }, { href: collectionHref(c.slug), label: c.title }, { label: a.title }]} />
          <h1>{a.title}</h1>
          <p className="hc-lede">{a.summary}</p>
          <p className="hc-updated">Last updated <time dateTime={a.updated}>{formatDate(a.updated)}</time></p>
        </div>
      </section>
      <div className="wrap">
        <div className="hc-layout">
          <article className="hc-body">
            {toc.length >= 2 ? (
              <details className="hc-toc-m">
                <summary>On this page</summary>
                <ol>{toc.map((t) => <li key={t.id}><a href={`#${t.id}`}>{t.text}</a></li>)}</ol>
              </details>
            ) : null}
            <Blocks body={a.body} />
            <Feedback path={articleHref(a)} />
            {related.length ? (
              <section className="hc-related" aria-labelledby="hc-rel">
                <h2 id="hc-rel">Related articles</h2>
                <ul className="hc-list">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={articleHref(r)}>
                        <span className="hc-list-t">{r.title}</span>
                        <HelpIcon name="chevron" size={20} />
                        <span className="hc-list-s">{r.summary}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </article>
          {toc.length >= 2 ? (
            <aside className="hc-toc" aria-label="On this page">
              <p>On this page</p>
              <ol>{toc.map((t) => <li key={t.id}><a href={`#${t.id}`}>{t.text}</a></li>)}</ol>
            </aside>
          ) : <div aria-hidden="true" />}
        </div>
        <ContactBand />
      </div>
    </>
  )
}
