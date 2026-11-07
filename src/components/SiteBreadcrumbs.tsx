import Link from 'next/link'
import { siteBreadcrumbItems } from '@/lib/schema'
import { breadcrumbLd } from '@/lib/help/jsonld'

export default function SiteBreadcrumbs({ pathname }: { pathname: string }) {
  const items = siteBreadcrumbItems(pathname)
  if (!items.length) return null
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(items)) }} />
      <nav className="site-crumbs wrap" aria-label="Breadcrumb">
        <ol>{items.map((item, i) => <li key={item.path}>
          {i < items.length - 1 ? <Link href={item.path}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}
        </li>)}</ol>
      </nav>
    </>
  )
}
