import type { Metadata } from 'next'
import Link from 'next/link'
import { ARTICLES, COLLECTIONS, POPULAR, articleHref, articlesIn, collectionHref, getCollection } from '@/lib/help'
import HelpIcon from '@/components/help/HelpIcon'
import HelpSearch from '@/components/help/HelpSearch'
import { ContactBand, JsonLd } from '@/components/help/Parts'
import { BASE } from '@/lib/help/jsonld'
import { OG_IMAGE } from '@/lib/og'

const TITLE = 'Bricks help centre'
const DESC = 'Answers about booking listing media, plans and billing, the Bricks app, integrations, privacy, and shooting for Bricks.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/help' },
  openGraph: { images: [OG_IMAGE], title: TITLE, description: DESC, url: '/help' },
  twitter: { card: 'summary', title: TITLE, description: DESC },
}

const SHORTCUTS: { label: string; href: string; icon: string }[] = [
  { label: 'Agent', href: '/help/agents', icon: 'person' },
  { label: 'Team', href: '/help/teams', icon: 'people' },
  { label: 'Brokerage', href: '/help/brokerages', icon: 'building' },
  { label: 'Builder or developer', href: '/help/builders', icon: 'crane' },
  { label: 'Property manager', href: '/help/property-managers', icon: 'key' },
  { label: 'Commercial', href: '/help/commercial', icon: 'tower' },
  { label: 'Investor', href: '/help/investors', icon: 'chart' },
  { label: 'REIT', href: '/help/reits', icon: 'grid' },
  { label: 'Photographer or pilot', href: '/help/photographers', icon: 'aperture' },
]

export default function HelpHome() {
  const general = COLLECTIONS.filter((c) => !c.audience)
  const audience = COLLECTIONS.filter((c) => c.audience)
  const popular = POPULAR.filter((a) => !getCollection(a.collection)?.audience).slice(0, 8)
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Bricks help centre',
          url: `${BASE}/help`,
          potentialAction: { '@type': 'SearchAction', target: `${BASE}/help?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
        }}
      />
      <section className="hc-hero">
        <div className="wrap">
          <span className="hc-over">Help centre</span>
          <h1>How can we help?</h1>
          <p className="hc-lede">{ARTICLES.length} articles on booking, billing, the Bricks app and shooting for Bricks. Search, or start with who you are.</p>
          <HelpSearch syncUrl />
        </div>
      </section>

      <div className="wrap">
        <section className="hc-sec" aria-labelledby="hc-who">
          <h2 id="hc-who">I&rsquo;m a&hellip;</h2>
          <p className="hc-sec-sub">Guides for how you use Bricks.</p>
          <ul className="hc-chips">
            {SHORTCUTS.map((s) => (
              <li key={s.href}><Link className="hc-chip" href={s.href}><HelpIcon name={s.icon} size={20} />{s.label}</Link></li>
            ))}
          </ul>
        </section>

        <section className="hc-sec" aria-labelledby="hc-pop">
          <h2 id="hc-pop">Popular articles</h2>
          <p className="hc-sec-sub">What people ask most.</p>
          <ul className="hc-list hc-cols">
            {popular.map((a) => (
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

        <section className="hc-sec" aria-labelledby="hc-topics">
          <h2 id="hc-topics">Browse by topic</h2>
          <p className="hc-sec-sub">Everything, grouped.</p>
          <CollectionGrid items={general} />
        </section>

        <section className="hc-sec" aria-labelledby="hc-biz">
          <h2 id="hc-biz">Help for your business</h2>
          <p className="hc-sec-sub">How each kind of client uses Bricks.</p>
          <CollectionGrid items={audience} />
        </section>

        <ContactBand />
      </div>
    </>
  )
}

function CollectionGrid({ items }: { items: typeof COLLECTIONS }) {
  return (
    <div className="hc-grid">
      {items.map((c) => {
        const n = articlesIn(c.slug).length
        return (
          <Link key={c.slug} href={collectionHref(c.slug)} className="hc-card">
            <HelpIcon name={c.icon} />
            <span className="hc-card-t">{c.title}</span>
            <span className="hc-card-s">{c.summary}</span>
            <span className="hc-card-n">{n} article{n === 1 ? '' : 's'}</span>
          </Link>
        )
      })}
    </div>
  )
}
