'use client'

import { useCallback, useState } from 'react'
import { LEGAL_DOCS, type LegalDocKey, allRead } from '@/lib/legal-docs'
import LegalDocSheet from './LegalDocSheet'

/** Session-only record of which documents were read to the end. */
export function useLegalReads(required: readonly LegalDocKey[]) {
  const [read, setRead] = useState<Partial<Record<LegalDocKey, boolean>>>({})
  const [open, setOpen] = useState<LegalDocKey | null>(null)
  const markRead = useCallback((k: LegalDocKey) => setRead((r) => (r[k] ? r : { ...r, [k]: true })), [])
  return { read, open, setOpen, markRead, done: allRead(required, read) }
}

type Rows = {
  docs: readonly LegalDocKey[]
  read: Partial<Record<LegalDocKey, boolean>>
  onOpen: (k: LegalDocKey) => void
}

/** One quiet row per document: opens the pop-up and shows whether it has been read. */
export function LegalDocRows({ docs, read, onOpen }: Rows) {
  return (
    <div className="ldoc-rows">
      {docs.map((k) => (
        <button key={k} type="button" className={`ldoc-row${read[k] ? ' is-read' : ''}`} onClick={() => onOpen(k)} aria-haspopup="dialog" data-testid={`legal-open-${k}`}>
          <span className="ldoc-row-title">{LEGAL_DOCS[k].title}</span>
          <span className="ldoc-row-state">
            {read[k] ? (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>Read</>
            ) : 'Open'}
            {!read[k] ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg> : null}
          </span>
        </button>
      ))}
      <style>{`
        .ldoc-rows{display:grid;gap:0;border:1px solid var(--hairStrong);border-radius:2px;background:var(--paperDeep);margin:8px 0 12px;min-width:0;}
        .ldoc-row{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;min-height:52px;padding:12px 16px;border:0;background:transparent;color:var(--ink);font:400 14px/1.35 'General Sans',ui-sans-serif,-apple-system,sans-serif;text-align:left;cursor:pointer;letter-spacing:0;text-transform:none;box-sizing:border-box;}
        .ldoc-row + .ldoc-row{border-top:1px solid var(--hair);}
        .ldoc-row:hover{background:var(--paperSoft);}
        .ldoc-row:focus-visible{outline:2px solid var(--ink);outline-offset:-2px;}
        .ldoc-row-title{min-width:0;text-decoration:underline;text-underline-offset:3px;text-decoration-color:var(--hairStrong);}
        .ldoc-row.is-read .ldoc-row-title{text-decoration:none;}
        .ldoc-row-state{flex:none;display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--inkMute);}
        .ldoc-row.is-read .ldoc-row-state{color:var(--ink);}
      `}</style>
    </div>
  )
}

export { LegalDocSheet }
