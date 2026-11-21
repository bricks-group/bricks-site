'use client'

import { useEffect, useRef, useState } from 'react'
import { loadStripe, type StripeEmbeddedCheckout } from '@stripe/stripe-js'

/**
 * Same-page payment (Kam 2026-11-21): Stripe's embedded Checkout mounted
 * inside a plain, square-edged Bricks panel. When payment finishes, Stripe
 * returns the browser to the session's return address (the same paid=1
 * confirmation the hosted page used), so the confirmation flow is unchanged.
 */
export type EmbeddedSession = { clientSecret: string; publishableKey: string; uiMode: 'elements' | 'embedded' }

/** Reads an API reply; returns the embedded session when the server sent one. */
export function embeddedFrom(j: unknown): EmbeddedSession | null {
  const r = (j || {}) as { client_secret?: unknown; publishable_key?: unknown; ui_mode?: unknown }
  const clientSecret = typeof r.client_secret === 'string' ? r.client_secret : ''
  const publishableKey = typeof r.publishable_key === 'string' ? r.publishable_key : ''
  const uiMode = r.ui_mode === 'elements' ? 'elements' : 'embedded'
  return clientSecret && publishableKey.startsWith('pk_') ? { clientSecret, publishableKey, uiMode } : null
}

export default function EmbeddedPay({
  session,
  onBack,
  backLabel = 'Change details',
  title = 'Payment',
  note = 'Card or Link. Have a launch code? Add it below.',
}: {
  session: EmbeddedSession
  onBack?: () => void
  backLabel?: string
  title?: string
  note?: string
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let checkout: StripeEmbeddedCheckout | null = null
    let cancelled = false
    setState('loading')
    loadStripe(session.publishableKey)
      .then((stripe) => {
        if (!stripe) throw new Error('stripe')
        return stripe.createEmbeddedCheckoutPage({ clientSecret: session.clientSecret })
      })
      .then((c) => {
        if (cancelled) { c.destroy(); return }
        checkout = c
        if (hostRef.current) c.mount(hostRef.current)
        setState('ready')
      })
      .catch(() => { if (!cancelled) setState('error') })
    wrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return () => {
      cancelled = true
      try { checkout?.destroy() } catch { /* already gone */ }
    }
  }, [session.clientSecret, session.publishableKey])

  return (
    <div ref={wrapRef} className="embedded-pay" data-testid="embedded-pay" style={{ marginTop: 24, scrollMarginTop: 96 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 500, color: 'var(--ink)' }}>{title}</h3>
        <span style={{ fontSize: 12.5, color: 'var(--inkMute)' }}>Secure, on this page</span>
      </div>
      {note && <p style={{ margin: '0 0 16px', fontSize: 13.5, color: 'var(--inkSoft)' }}>{note}</p>}
      <div
        style={{
          border: '1px solid var(--hairStrong)',
          borderRadius: 0,
          background: '#F4F1EB',
          padding: 'clamp(8px, 2vw, 20px)',
          minHeight: state === 'ready' ? undefined : 320,
          overflow: 'hidden',
        }}
      >
        {state === 'loading' && <p style={{ margin: 0, padding: 24, fontSize: 14, color: '#6B6054' }}>Loading the payment form…</p>}
        {state === 'error' && (
          <p style={{ margin: 0, padding: 24, fontSize: 14, color: '#3B332A' }}>
            The payment form didn&apos;t load. Refresh the page and try again, or email help@brxs.ca.
          </p>
        )}
        <div ref={hostRef} />
      </div>
      {onBack && (
        <div className="nav-btns" style={{ marginTop: 16 }}>
          <button type="button" className="btn btn-ghost" onClick={onBack}>← {backLabel}</button>
        </div>
      )}
    </div>
  )
}
