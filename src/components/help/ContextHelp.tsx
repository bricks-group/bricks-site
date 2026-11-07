'use client'
import { HELP_URL } from '@/lib/nav'
import { usePathname } from 'next/navigation'
import type { ContextLink } from '@/lib/help/context-links'

/** Same lookup as contextHelpFor(): exact path, then closest mapped parent. Table is built on the server. */
export function lookupContextHelp(pathname: string, table: Record<string, ContextLink[]>): ContextLink[] {
  const clean = (pathname || '/').split(/[?#]/)[0].replace(/\/+$/, '') || '/'
  let key = clean
  while (!table[key] && key.lastIndexOf('/') > 0) key = key.slice(0, key.lastIndexOf('/'))
  return table[key] ?? []
}

/** Help lives on help.brxs.ca: plain absolute links, so no cross-origin RSC prefetch (www /help 308s there). */
const helpAbs = (href: string) => HELP_URL + (href.replace(/^\/help/, '') || '/')

/** "Help for this page": specific articles for the page the visitor is on. */
export default function ContextHelp({ table }: { table: Record<string, ContextLink[]> }) {
  const links = lookupContextHelp(usePathname() || '/', table)
  if (!links.length) return null
  return (
    <aside className="context-help" aria-label="Help for this page">
      <div className="context-help-inner">
        <h2 className="context-help-title">Help for this page</h2>
        <ul className="context-help-list">
          {links.map((l) => (
            <li key={l.href}><a href={helpAbs(l.href)}>{l.title}</a></li>
          ))}
        </ul>
        <a href={HELP_URL} className="context-help-all">All help articles</a>
      </div>
    </aside>
  )
}
