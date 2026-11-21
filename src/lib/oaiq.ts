/**
 * ChatGPT ads pixel (oaiq), loaded on demand only.
 *
 * The SDK sets first-party cookies (__obref 365d, __oppref 30d), so it is NOT
 * loaded for ordinary visitors (the privacy page promises no tracking cookies
 * for them). It loads only when:
 *   (a) the landing URL carries ?oppref= (the visitor clicked a ChatGPT ad), or
 *   (b) the booking confirmation return fires order_created.
 *
 * No debug flag.
 */
const SDK_URL = 'https://bzrcdn.openai.com/sdk/oaiq.min.js'
const PIXEL_ID = '7BsqozXG56vx2MaJfWMquA'

type Oaiq = ((...args: unknown[]) => void) & { q?: unknown[] }

function loadOaiq(): Oaiq | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { oaiq?: Oaiq }
  if (w.oaiq) return w.oaiq
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
  q('init', { pixelId: PIXEL_ID })
  return q
}

/** Ad-click landing: load the pixel only when ?oppref= is present. */
export function oaiqOnAdLanding() {
  if (typeof window === 'undefined') return
  try {
    if (new URLSearchParams(window.location.search).get('oppref')) loadOaiq()
  } catch {
    // ignore
  }
}

/**
 * Booking confirmation: load the pixel and record order_created once per
 * Stripe Checkout session id (sessionStorage dedupe, as before).
 */
export function oaiqOrderCreated(sessionId?: string) {
  if (typeof window === 'undefined') return
  try {
    const key = `oaiq-order-created:${sessionId || 'noid'}`
    if (window.sessionStorage.getItem(key)) return
    window.sessionStorage.setItem(key, '1')
  } catch {
    // sessionStorage unavailable (private mode, etc.) — fire anyway.
  }
  const oaiq = loadOaiq()
  if (!oaiq) return
  oaiq('measure', 'order_created', { type: 'contents' })
}
