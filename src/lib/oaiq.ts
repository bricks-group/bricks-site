/**
 * ChatGPT ads pixel (oaiq), loaded on demand only.
 *
 * The SDK sets first-party cookies (__obref 365d, __oppref 30d), so ordinary
 * visitors never load it. It loads only when:
 *   (a) the landing URL carries ?oppref= (the visitor clicked a ChatGPT ad), or
 *   (b) the paid booking confirmation fires order_created AND the visitor
 *       already has the ad cookie (__oppref).
 * Quebec (and any visitor whose region cannot be determined) is asked first;
 * the SDK is not loaded until they allow. Everyone else loads as before.
 * Hashed email/phone (advanced matching) are sent only on the confirmation.
 * No debug flag.
 */
const SDK_URL = 'https://bzrcdn.openai.com/sdk/oaiq.min.js'
const PIXEL_ID = '7BsqozXG56vx2MaJfWMquA'
const PREF_KEY = 'bricks-ad-measure' // 'yes' | 'no'
const GEO_KEY = 'bricks-geo'

type Oaiq = ((...args: unknown[]) => void) & { q?: unknown[] }
export type OaiqUser = { email?: string; phone?: string }

export function hasAdCookie(): boolean {
  try { return /(?:^|;\s*)__oppref=/.test(document.cookie) } catch { return false }
}

function pref(): string {
  try { return localStorage.getItem(PREF_KEY) || '' } catch { return '' }
}

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** OpenAI normalisation: email trimmed + lowercased; phone digits only, no leading + or zeroes, 8-15 digits. */
async function userHashes(u?: OaiqUser): Promise<Record<string, string> | undefined> {
  if (!u || typeof crypto === 'undefined' || !crypto.subtle) return undefined
  const out: Record<string, string> = {}
  const email = (u.email || '').trim().toLowerCase()
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) out.email_sha256 = await sha256(email)
  let phone = (u.phone || '').replace(/[\s().\-+]/g, '').replace(/^0+/, '')
  if (/^\d{10}$/.test(phone)) phone = '1' + phone // NANP: add country code
  if (/^\d{8,15}$/.test(phone)) out.phone_number_sha256 = await sha256(phone)
  return Object.keys(out).length ? out : undefined
}

function loadOaiq(user?: Record<string, string>): Oaiq | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { oaiq?: Oaiq }
  if (w.oaiq) {
    if (user) w.oaiq('init', { user }) // user data arriving after first init
    return w.oaiq
  }
  // Same queue shape as OpenAI's official snippet (pushes `arguments`).
  const q: Oaiq = function () {
    // eslint-disable-next-line prefer-rest-params
    ;(q.q = q.q || []).push(arguments)
  }
  q.q = []
  w.oaiq = q
  const js = document.createElement('script')
  js.async = true
  js.src = SDK_URL
  document.head.appendChild(js)
  q('init', user ? { pixelId: PIXEL_ID, user } : { pixelId: PIXEL_ID })
  return q
}

/** true = consent needed first (Quebec or unknown region). Only called when the pixel would load. */
async function needsConsent(): Promise<boolean> {
  try {
    const cached = sessionStorage.getItem(GEO_KEY)
    if (cached) return cached === 'ask'
  } catch { /* ignore */ }
  let ask = true // fail safe: unknown region is asked
  try {
    const ctl = new AbortController()
    const t = setTimeout(() => ctl.abort(), 3000)
    const r = await fetch('/api/geo', { cache: 'no-store', signal: ctl.signal })
    clearTimeout(t)
    const j = (await r.json()) as { c?: string; r?: string }
    if (j.c) ask = j.c === 'CA' ? (j.r === 'QC' || !j.r) : false
  } catch { /* keep ask */ }
  try { sessionStorage.setItem(GEO_KEY, ask ? 'ask' : 'ok') } catch { /* ignore */ }
  return ask
}

/** Quebec prompt (Counsel r2 copy, EN + FR; FR when the browser language is French). Accept and Refuse are equal. Resolves true on Accept. */
function askConsent(): Promise<boolean> {
  return new Promise((resolve) => {
    const fr = /^fr/i.test(navigator.language || '')
    const t = fr
      ? { h: 'Mesurer les résultats des publicités ChatGPT?', p: 'Nous utilisons OpenAI pour mesurer si une publicité ChatGPT a mené à votre visite ou à votre réservation. Cela peut créer des témoins (cookies) sur ce site (__oppref, __obref) et, si vous terminez une réservation, envoyer à OpenAI votre courriel et votre téléphone hachés (SHA-256 dans votre navigateur, jamais les valeurs brutes). OpenAI peut traiter ces données aux États-Unis.', l: 'Confidentialité : témoins et analytique', y: 'Accepter', n: 'Refuser' }
      : { h: 'Measure ChatGPT ad results?', p: 'We use OpenAI to measure whether a ChatGPT ad led to your visit or booking. That may set cookies on this site (__oppref, __obref) and, if you complete a booking, send hashed email and phone (SHA-256 in your browser, not the raw values) to OpenAI. OpenAI may process this in the United States.', l: 'Privacy: cookies and analytics', y: 'Accept', n: 'Refuse' }
    const root = document.createElement('div')
    root.setAttribute('role', 'dialog')
    root.setAttribute('aria-label', t.h)
    root.className = 'bx-adm'
    root.innerHTML =
      '<style>.bx-adm{position:fixed;left:16px;bottom:16px;z-index:90;max-width:380px;background:var(--paper,#F4F1EB);color:var(--inkSoft,#3B332A);border:1px solid var(--hairStrong,#14111020);border-radius:0;padding:16px;font-size:14px;line-height:1.5;box-shadow:none}' +
      '.bx-adm b{display:block;color:var(--ink,#14110E);font-weight:500;margin-bottom:6px}' +
      '.bx-adm p{margin:0 0 10px}.bx-adm .r{display:flex;gap:8px;margin-top:12px}' +
      '.bx-adm button{flex:1;min-height:44px;padding:0 16px;border-radius:0;border:1px solid var(--ink,#14110E);background:transparent;color:var(--ink,#14110E);font:inherit;font-weight:500;cursor:pointer}' +
      '.bx-adm button:hover{background:var(--paperSoft,#EDE8DF)}' +
      '.bx-adm a{color:var(--inkMute,#6B6054)}' +
      '@media(max-width:480px){.bx-adm{left:0;right:0;bottom:0;max-width:none;border-width:1px 0 0}}</style>' +
      '<b></b><p class="d"></p><p><a href="/privacy#cookies"></a></p>' +
      '<div class="r"><button type="button" class="y"></button><button type="button" class="n"></button></div>'
    const set = (sel: string, txt: string) => { (root.querySelector(sel) as HTMLElement).textContent = txt }
    set('b', t.h); set('p.d', t.p); set('a', t.l); set('.y', t.y); set('.n', t.n)
    const done = (v: boolean) => {
      try { localStorage.setItem(PREF_KEY, v ? 'yes' : 'no') } catch { /* ignore */ }
      root.remove()
      resolve(v)
    }
    root.querySelector('.y')!.addEventListener('click', () => done(true))
    root.querySelector('.n')!.addEventListener('click', () => done(false))
    document.body.appendChild(root)
  })
}

/** Ad-click landing: only with ?oppref=. Quebec/unknown: asks first. */
export async function oaiqOnAdLanding() {
  if (typeof window === 'undefined') return
  try {
    if (!new URLSearchParams(window.location.search).get('oppref')) return
    const p = pref()
    if (p === 'no') return
    if (p === 'yes' || !(await needsConsent()) || (await askConsent())) loadOaiq()
  } catch { /* ignore */ }
}

/**
 * Paid confirmation: records order_created once per Stripe session id
 * (sessionStorage dedupe) and only for visitors who already carry the ad
 * cookie. Hashed email/phone go with init (advanced matching), here only.
 */
export async function oaiqOrderCreated(sessionId?: string, user?: OaiqUser) {
  if (typeof window === 'undefined') return
  try {
    if (!hasAdCookie() || pref() === 'no') return
    if (pref() !== 'yes' && (await needsConsent())) return // never prompt at confirmation
    const key = `oaiq-order-created:${sessionId || 'noid'}`
    try {
      if (window.sessionStorage.getItem(key)) return
      window.sessionStorage.setItem(key, '1')
    } catch { /* sessionStorage unavailable: fire anyway */ }
    const hashes = await userHashes(user)
    const oaiq = loadOaiq(hashes)
    if (!oaiq) return
    oaiq('measure', 'order_created', { type: 'contents' })
  } catch { /* ignore */ }
}
