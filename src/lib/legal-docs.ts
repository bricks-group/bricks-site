// In-app reading of the legal documents.
//
// One source of truth: the pop-ups load the live /terms and /privacy pages
// (and /legal/ic-agreement.txt) and show their document body, so the text
// can never drift from the standalone pages. Other Bricks apps load the same
// URLs cross-origin (next.config.ts sends Access-Control-Allow-Origin).

export type LegalDocKey = 'terms' | 'privacy' | 'ic'

export type LegalDocMeta = { key: LegalDocKey; title: string; path: string; kind: 'html' | 'text' }

export const LEGAL_DOCS: Record<LegalDocKey, LegalDocMeta> = {
  terms: { key: 'terms', title: 'Terms of service', path: '/terms', kind: 'html' },
  privacy: { key: 'privacy', title: 'Privacy policy', path: '/privacy', kind: 'html' },
  ic: { key: 'ic', title: 'Independent contractor agreement', path: '/legal/ic-agreement.txt', kind: 'text' },
}

/** Within this many px of the end counts as read. */
export const READ_END_SLACK_PX = 24

/** True once a scroll box is at (or within slack of) its end. A box that does not overflow is already at its end. */
export function isScrolledToEnd(box: { scrollTop: number; scrollHeight: number; clientHeight: number }, slack = READ_END_SLACK_PX): boolean {
  return box.scrollHeight - box.scrollTop - box.clientHeight <= slack
}

/** Every required document has been read. */
export function allRead(required: readonly LegalDocKey[], read: Partial<Record<LegalDocKey, boolean>>): boolean {
  return required.length > 0 && required.every((k) => read[k] === true)
}

/** Reason the agree control is still locked, or '' when it is not. */
export function lockedReason(required: readonly LegalDocKey[], read: Partial<Record<LegalDocKey, boolean>>): string {
  const left = required.filter((k) => !read[k]).map((k) => LEGAL_DOCS[k].title.toLowerCase())
  if (!left.length) return ''
  if (left.length === 1) return `Open the ${left[0]} and scroll to the end to continue.`
  return `Open the ${left.slice(0, -1).join(', ')} and the ${left[left.length - 1]}, and scroll each to the end to continue.`
}

export type LoadedLegalDoc = { html: string; updated: string }

const cache = new Map<string, Promise<LoadedLegalDoc>>()

/** Browser only: fetch a legal page and keep just its document body. */
export function loadLegalDoc(key: LegalDocKey, base = ''): Promise<LoadedLegalDoc> {
  const meta = LEGAL_DOCS[key]
  const url = base.replace(/\/$/, '') + meta.path
  const hit = cache.get(url)
  if (hit) return hit
  const p = fetch(url, { credentials: 'omit', cache: 'no-cache' })
    .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
    .then((body) => (meta.kind === 'text' ? textDoc(body) : htmlDoc(body, new URL(url, window.location.href).href)))
  p.catch(() => cache.delete(url))
  cache.set(url, p)
  return p
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function textDoc(body: string): LoadedLegalDoc {
  const t = body.trim()
  if (!t) throw new Error('empty document')
  return { html: `<div class="ldoc-text">${escapeHtml(t)}</div>`, updated: '' }
}

function htmlDoc(body: string, pageUrl: string): LoadedLegalDoc {
  const doc = new DOMParser().parseFromString(body, 'text/html')
  const parts = Array.from(doc.querySelectorAll('.legal-body'))
  if (!parts.length) throw new Error('no document body')
  const updated = (doc.querySelector('.hero .updated')?.textContent || '').replace(/\s+/g, ' ').trim()
  const out = doc.createElement('div')
  for (const part of parts) {
    part.querySelectorAll('script,style,iframe,object,embed,form,button,input').forEach((n) => n.remove())
    part.querySelectorAll('*').forEach((el) => {
      for (const attr of Array.from(el.attributes)) {
        if (/^on/i.test(attr.name) || attr.name === 'style' || attr.name === 'class') el.removeAttribute(attr.name)
      }
    })
    part.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href') || ''
      if (/^\s*javascript:/i.test(href)) { a.removeAttribute('href'); return }
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        if (href.startsWith('#')) a.setAttribute('href', new URL(href, pageUrl).href)
      } else {
        a.setAttribute('href', new URL(href, pageUrl).href)
      }
      if (!href.startsWith('mailto:') && !href.startsWith('tel:')) {
        a.setAttribute('target', '_blank')
        a.setAttribute('rel', 'noopener noreferrer')
      }
    })
    const wrap = doc.createElement('section')
    wrap.innerHTML = part.innerHTML
    out.appendChild(wrap)
  }
  return { html: out.innerHTML, updated }
}
