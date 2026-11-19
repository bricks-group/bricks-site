/**
 * ChatGPT ads pixel (oaiq) conversion helper.
 *
 * The pixel snippet in src/app/layout.tsx defines window.oaiq as a queue
 * function the moment it runs, so calls made before the oaiq SDK finishes
 * loading are queued and delivered once it loads. The guard below only
 * skips the call when the pixel itself never ran (e.g. script blocked).
 *
 * Fires exactly: oaiq("measure", "order_created", { type: "contents" })
 *
 * Dedupe: the booking success page re-runs its paid effect on refresh, so
 * the event is recorded once per Stripe Checkout session id in
 * sessionStorage. A new booking (new session id) fires again.
 */
export function oaiqOrderCreated(sessionId?: string) {
  if (typeof window === 'undefined') return
  const oaiq = (window as unknown as { oaiq?: unknown }).oaiq
  if (typeof oaiq !== 'function') return
  try {
    const key = `oaiq-order-created:${sessionId || 'noid'}`
    if (window.sessionStorage.getItem(key)) return
    window.sessionStorage.setItem(key, '1')
  } catch {
    // sessionStorage unavailable (private mode, etc.) — fire anyway.
  }
  ;(
    oaiq as (
      cmd: 'measure',
      event: 'order_created',
      data: { type: 'contents' },
    ) => void
  )('measure', 'order_created', { type: 'contents' })
}
