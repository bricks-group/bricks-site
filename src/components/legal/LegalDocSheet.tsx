'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { LEGAL_DOCS, type LegalDocKey, type LoadedLegalDoc, isScrolledToEnd, loadLegalDoc } from '@/lib/legal-docs'

type Props = {
  doc: LegalDocKey | null
  /** Origin that serves /terms and /privacy. Same origin on www. */
  base?: string
  read: boolean
  onRead: (doc: LegalDocKey) => void
  onClose: () => void
}

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])'

/**
 * A legal document as a pop-up: centred dialog on desktop, full-height bottom
 * sheet on phones. Reaching the end (within 24px) marks it read and unlocks
 * "I've read this". Focus is trapped, Esc closes, page scroll is locked.
 */
export default function LegalDocSheet({ doc, base = '', read, onRead, onClose }: Props) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<{ status: 'loading' | 'ready' | 'error'; data?: LoadedLegalDoc; doc?: LegalDocKey }>({ status: 'loading' })
  const [endDoc, setEndDoc] = useState<LegalDocKey | null>(null)
  const [attempt, setAttempt] = useState(0)
  const open = doc !== null
  const meta = doc ? LEGAL_DOCS[doc] : null

  useEffect(() => {
    if (!doc) return
    let live = true
    setState({ status: 'loading', doc })
    loadLegalDoc(doc, base).then(
      (data) => { if (live) setState({ status: 'ready', data, doc }) },
      () => { if (live) setState({ status: 'error', doc }) },
    )
    return () => { live = false }
  }, [doc, base, attempt])

  const check = useCallback(() => {
    const box = bodyRef.current
    if (!box || !doc || state.status !== 'ready' || state.doc !== doc) return
    if (isScrolledToEnd(box)) {
      setEndDoc(doc)
      if (!read) onRead(doc)
    }
  }, [doc, read, onRead, state.status, state.doc])

  // Short documents that do not overflow count as read straight away; re-check on resize.
  useEffect(() => {
    if (state.status !== 'ready') return
    const box = bodyRef.current
    if (!box) return
    const raf = requestAnimationFrame(check)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(check) : null
    ro?.observe(box)
    if (box.firstElementChild) ro?.observe(box.firstElementChild)
    return () => { cancelAnimationFrame(raf); ro?.disconnect() }
  }, [state.status, check])

  // Lock page scroll (iOS-safe), remember and restore focus.
  useEffect(() => {
    if (!open) return
    const prevFocus = document.activeElement as HTMLElement | null
    const y = window.scrollY
    const b = document.body.style
    const prev = { position: b.position, top: b.top, left: b.left, right: b.right, width: b.width, overflow: b.overflow }
    b.position = 'fixed'; b.top = `-${y}px`; b.left = '0'; b.right = '0'; b.width = '100%'; b.overflow = 'hidden'
    const t = window.setTimeout(() => bodyRef.current?.focus({ preventScroll: true }), 0)
    return () => {
      window.clearTimeout(t)
      Object.assign(b, prev)
      window.scrollTo(0, y)
      prevFocus?.focus?.({ preventScroll: true })
    }
  }, [open])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); return }
    if (e.key !== 'Tab' || !panelRef.current) return
    const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement)
    if (!items.length) return
    const first = items[0], last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }

  if (!open || !meta) return null
  // Ignore state left over from the previous document until this one has loaded.
  const view: typeof state = state.doc === doc ? state : { status: 'loading' }
  const done = endDoc === doc || read
  const fullUrl = (base.replace(/\/$/, '') || '') + meta.path

  return createPortal(
    <div className="ldoc-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div ref={panelRef} className="ldoc-panel" role="dialog" aria-modal="true" aria-labelledby={titleId} onKeyDown={onKeyDown} data-testid={`legal-sheet-${doc}`}>
        <div className="ldoc-grip" aria-hidden="true" />
        <header className="ldoc-head">
          <div className="ldoc-headtxt">
            <h2 id={titleId}>{meta.title}</h2>
            {view.data?.updated ? <p className="ldoc-updated">{view.data.updated.replace(/\s*·\s*/g, ' · ')}</p> : null}
          </div>
          <button type="button" className="ldoc-x" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </header>
        <div ref={bodyRef} className="ldoc-body" tabIndex={0} onScroll={check} aria-label={`${meta.title} text`} data-testid="legal-sheet-body">
          {view.status === 'ready' && view.data ? (
            <div className="ldoc-content" dangerouslySetInnerHTML={{ __html: view.data.html }} />
          ) : view.status === 'error' ? (
            <div className="ldoc-msg" role="alert">
              <p>This document didn&apos;t load.</p>
              <p>
                <button type="button" className="ldoc-link" onClick={() => setAttempt((n) => n + 1)}>Try again</button>
                {' or '}
                <a className="ldoc-link" href={fullUrl} target="_blank" rel="noopener noreferrer" onClick={() => onRead(meta.key)}>open the full page</a>.
              </p>
            </div>
          ) : (
            <div className="ldoc-msg" aria-live="polite"><p>Loading…</p></div>
          )}
        </div>
        <footer className="ldoc-foot">
          <p className={`ldoc-cue${done ? ' is-done' : ''}`} aria-live="polite" data-testid="legal-sheet-cue">
            {done ? (<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>Read</>) : 'Scroll to the end to continue'}
          </p>
          <button type="button" className="ldoc-done" disabled={!done} onClick={() => { onRead(meta.key); onClose() }} data-testid="legal-sheet-done">
            I&apos;ve read this
          </button>
        </footer>
      </div>
      <style>{LEGAL_SHEET_CSS}</style>
    </div>,
    document.body,
  )
}

const LEGAL_SHEET_CSS = `
.ldoc-overlay{position:fixed;inset:0;z-index:1000;background:rgba(20,17,14,.46);display:flex;align-items:center;justify-content:center;padding:24px;animation:ldocFade .18s ease-out;overscroll-behavior:contain;}
.ldoc-panel{position:relative;display:flex;flex-direction:column;width:100%;max-width:720px;height:min(86vh,880px);background:var(--paper);color:var(--ink);border:1px solid var(--hairStrong);border-radius:4px;box-shadow:0 24px 64px rgba(20,17,14,.22);overflow:hidden;font-family:'General Sans',ui-sans-serif,-apple-system,BlinkMacSystemFont,sans-serif;animation:ldocRise .22s cubic-bezier(.2,.8,.2,1);}
.ldoc-grip{display:none;}
.ldoc-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:20px 24px 16px;border-bottom:1px solid var(--hair);}
.ldoc-headtxt{min-width:0;}
.ldoc-head h2{margin:0;font-size:19px;font-weight:500;letter-spacing:-.3px;line-height:1.25;color:var(--ink);}
.ldoc-updated{margin:6px 0 0;font-family:'Ioskeley Mono','IoskeleyMono',ui-monospace,'SF Mono',Menlo,monospace;font-size:11.5px;color:var(--inkMute);letter-spacing:0;}
.ldoc-x{flex:none;display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;margin:-6px -8px 0 0;border:0;border-radius:2px;background:transparent;color:var(--inkSoft);cursor:pointer;}
.ldoc-x:hover{background:var(--paperDeep);color:var(--ink);}
.ldoc-body{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding:8px 24px 28px;outline:none;}
.ldoc-body:focus-visible{box-shadow:inset 0 0 0 2px var(--hairStrong);}
.ldoc-content{font-size:14px;line-height:1.62;color:var(--inkSoft);overflow-wrap:anywhere;}
.ldoc-content section + section{border-top:1px solid var(--hair);margin-top:20px;padding-top:4px;}
.ldoc-content h2{font-size:16px;font-weight:500;letter-spacing:-.2px;color:var(--ink);margin:20px 0 10px;}
.ldoc-content h3{font-size:14.5px;font-weight:500;color:var(--ink);margin:18px 0 6px;}
.ldoc-content p{margin:0 0 10px;}
.ldoc-content ul,.ldoc-content ol{margin:0 0 10px 18px;padding:0;}
.ldoc-content li{margin-bottom:4px;}
.ldoc-content a{color:var(--ink);text-decoration:underline;text-underline-offset:2px;text-decoration-color:var(--hairStrong);}
.ldoc-content table{width:100%;border-collapse:collapse;margin:0 0 14px;font-size:13px;display:block;overflow-x:auto;}
.ldoc-content th,.ldoc-content td{text-align:left;padding:8px 10px;border:1px solid var(--hair);vertical-align:top;}
.ldoc-content th{font-weight:500;color:var(--ink);}
.ldoc-text{white-space:pre-wrap;font-size:13.5px;padding-top:12px;}
.ldoc-msg{padding:32px 0;color:var(--inkMute);font-size:14px;}
.ldoc-msg p{margin:0 0 8px;}
.ldoc-link{background:none;border:0;padding:0;font:inherit;color:var(--ink);text-decoration:underline;text-underline-offset:2px;cursor:pointer;}
.ldoc-foot{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 24px;border-top:1px solid var(--hair);background:var(--paper);}
.ldoc-cue{margin:0;display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--inkMute);}
.ldoc-cue.is-done{color:var(--ink);}
.ldoc-done{flex:none;min-height:44px;padding:0 20px;border:0;border-radius:2px;background:var(--ink);color:var(--paper);font:500 14px/1 'General Sans',ui-sans-serif,-apple-system,sans-serif;cursor:pointer;transition:opacity .15s;}
.ldoc-done:disabled{opacity:.32;cursor:not-allowed;}
.ldoc-done:focus-visible,.ldoc-x:focus-visible,.ldoc-link:focus-visible{outline:2px solid var(--ink);outline-offset:2px;}
@keyframes ldocFade{from{opacity:0}to{opacity:1}}
@keyframes ldocRise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes ldocSheet{from{transform:translateY(100%)}to{transform:none}}
@media (max-width:640px){
  .ldoc-overlay{align-items:flex-end;padding:0;padding-top:max(12px,env(safe-area-inset-top));}
  .ldoc-panel{max-width:none;height:100%;border-radius:2px 2px 0 0;border-bottom:0;animation:ldocSheet .26s cubic-bezier(.2,.8,.2,1);}
  .ldoc-grip{display:block;width:36px;height:4px;border-radius:2px;background:var(--hairStrong);margin:8px auto 0;}
  .ldoc-head{padding:12px 20px 14px;}
  .ldoc-body{padding:4px 20px 24px;}
  .ldoc-foot{padding:12px 20px calc(12px + env(safe-area-inset-bottom));}
  .ldoc-done{padding:0 18px;}
}
@media (prefers-reduced-motion:reduce){.ldoc-overlay,.ldoc-panel{animation:none;}}
`
