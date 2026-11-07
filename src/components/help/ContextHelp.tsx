import Link from 'next/link'
import { contextHelpFor } from '@/lib/help/context-links'

/** "Help for this page": specific articles for the page the visitor is on. */
export default function ContextHelp({ pathname }: { pathname: string }) {
  const links = contextHelpFor(pathname)
  if (!links.length) return null
  return (
    <aside className="context-help" aria-label="Help for this page">
      <div className="context-help-inner">
        <h2 className="context-help-title">Help for this page</h2>
        <ul className="context-help-list">
          {links.map((l) => (
            <li key={l.href}><Link href={l.href}>{l.title}</Link></li>
          ))}
        </ul>
        <Link href="/help" className="context-help-all">All help articles</Link>
      </div>
    </aside>
  )
}
