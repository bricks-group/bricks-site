'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Item = { name: string; path: string }
const BASE = 'https://www.brxs.ca'

/** Same items as siteBreadcrumbItems() in lib/schema; names table is passed from the server layout. */
export function breadcrumbItems(pathname: string, names: Record<string, string>): Item[] {
  const name = names[pathname]
  if (!name) return []
  const parent = pathname.startsWith('/blog/') ? '/blog'
    : pathname.startsWith('/work-with-bricks/') ? '/work-with-bricks'
    : pathname.startsWith('/real-estate-photography/') ? '/real-estate-photography' : undefined
  return [{ name: 'Home', path: '/' }, ...(parent ? [{ name: names[parent], path: parent }] : []), { name, path: pathname }]
}

export default function SiteBreadcrumbs({ names }: { names: Record<string, string> }) {
  const pathname = usePathname() || ''
  const items = breadcrumbItems(pathname, names)
  if (!items.length) return null
  const ld = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, item: BASE + x.path })) }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <nav className="site-crumbs wrap" aria-label="Breadcrumb">
        <ol>{items.map((item, i) => <li key={item.path}>
          {i < items.length - 1 ? <Link href={item.path}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}
        </li>)}</ol>
      </nav>
    </>
  )
}
