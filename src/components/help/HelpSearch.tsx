'use client'
import Link from 'next/link'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { search, type Hit, type SearchDoc } from '@/lib/help/search'
import HelpIcon from './HelpIcon'

let cache: Promise<SearchDoc[]> | null = null
function loadIndex(): Promise<SearchDoc[]> {
  if (!cache) cache = fetch('/help/search-index.json').then((r) => (r.ok ? r.json() : Promise.reject(r.status))).catch((e) => { cache = null; throw e })
  return cache
}

export default function HelpSearch({ syncUrl = false, compact = false }: { syncUrl?: boolean; compact?: boolean }) {
  const [q, setQ] = useState('')
  const [docs, setDocs] = useState<SearchDoc[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [hits, setHits] = useState<Hit[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const id = useId()

  const ensure = useCallback(() => {
    if (docs) return
    loadIndex().then(setDocs).catch(() => setFailed(true))
  }, [docs])

  useEffect(() => {
    if (!syncUrl) return
    const initial = new URLSearchParams(window.location.search).get('q') || ''
    if (initial) { setQ(initial); ensure() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setHits(docs && q.trim() ? search(docs, q) : [])
    if (syncUrl) {
      const url = new URL(window.location.href)
      if (q.trim()) url.searchParams.set('q', q.trim())
      else url.searchParams.delete('q')
      window.history.replaceState(null, '', url.pathname + url.search)
    }
  }, [q, docs, syncUrl])

  const action = compact ? '/help' : undefined
  const showing = q.trim().length > 0

  return (
    <div className={`hc-search${compact ? ' hc-search-compact' : ''}`}>
      <form
        role="search"
        action={action}
        onSubmit={(e) => {
          if (!compact) { e.preventDefault(); return }
        }}
      >
        <label htmlFor={`${id}-q`} className="hc-sr">Search the help centre</label>
        <span className="hc-search-icon" aria-hidden="true"><HelpIcon name="search" size={20} /></span>
        <input
          ref={inputRef}
          id={`${id}-q`}
          name="q"
          type="search"
          autoComplete="off"
          placeholder={compact ? 'Search help' : 'Search: refunds, drone, invite a teammate…'}
          value={q}
          onFocus={ensure}
          onChange={(e) => { setQ(e.target.value); ensure() }}
          aria-controls={`${id}-results`}
        />
      </form>
      {!compact ? (
        <div id={`${id}-results`} className="hc-results" aria-live="polite">
          {showing && failed ? <p className="hc-results-empty">Search didn&rsquo;t load. Browse the collections below, or email support@brxs.ca.</p> : null}
          {showing && !failed && !docs ? <p className="hc-results-empty">Searching…</p> : null}
          {showing && docs ? (
            hits.length ? (
              <>
                <p className="hc-results-count">{hits.length === 20 ? 'Top 20 results' : `${hits.length} result${hits.length === 1 ? '' : 's'}`} for &ldquo;{q.trim()}&rdquo;</p>
                <ul className="hc-results-list">
                  {hits.map((h) => (
                    <li key={h.doc.u}>
                      <Link href={h.doc.u}>
                        <span className="hc-results-c">{h.doc.c}</span>
                        <span className="hc-results-t">{h.doc.t}</span>
                        <span className="hc-results-s">{h.snippet}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="hc-results-empty">No articles match &ldquo;{q.trim()}&rdquo;. Try fewer words, or <Link href="/help/contact/contact-us">contact us</Link>.</p>
            )
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
