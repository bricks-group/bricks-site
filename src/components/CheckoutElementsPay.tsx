'use client'

import { useEffect, useRef, useState } from 'react'
import {
  loadStripe,
  type StripeCheckoutElementsSdk,
  type StripeCheckoutLoadActionsSuccess,
  type StripeCheckoutSession,
} from '@stripe/stripe-js'
import { bricksAppearance, readSiteColors, siteFonts } from '@/lib/checkout-theme'
import type { EmbeddedSession } from './EmbeddedPay'

/**
 * Same-page payment drawn by Bricks (Kam 2026-11-21, "It's white."): a
 * Checkout Session in `elements` mode. Stripe still owns the session (amount,
 * tax lines, promotion codes, metadata, webhook); we draw the summary, the
 * code field and the Book button, and theme the card fields to the site.
 */
export default function CheckoutElementsPay({
  session,
  onBack,
  backLabel = 'Change details',
  detail,
}: {
  session: EmbeddedSession
  onBack?: () => void
  backLabel?: string
  /** One quiet line under the item, e.g. the shoot time. */
  detail?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const payRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<StripeCheckoutLoadActionsSuccess | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [cs, setCs] = useState<StripeCheckoutSession | null>(null)
  const [code, setCode] = useState('')
  const [codeOpen, setCodeOpen] = useState(false)
  const [codeMsg, setCodeMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    let checkout: StripeCheckoutElementsSdk | null = null
    let cancelled = false
    setState('loading')
    const root = getComputedStyle(document.documentElement)
    const colors = readSiteColors((n) => root.getPropertyValue(n))
    loadStripe(session.publishableKey)
      .then(async (stripe) => {
        if (!stripe) throw new Error('stripe')
        checkout = stripe.initCheckoutElementsSdk({
          clientSecret: session.clientSecret,
          elementsOptions: { appearance: bricksAppearance(colors), fonts: siteFonts(window.location.origin), loader: 'never' },
        })
        checkout.on('change', (s) => { if (!cancelled) setCs(s) })
        const res = await checkout.loadActions()
        if (res.type !== 'success') throw new Error('actions')
        if (cancelled) return
        actionsRef.current = res.actions
        setCs(res.actions.getSession())
        const pe = checkout.createPaymentElement({ layout: { type: 'tabs' } })
        if (payRef.current) pe.mount(payRef.current)
        pe.on('ready', () => { if (!cancelled) setState('ready') })
      })
      .catch(() => { if (!cancelled) setState('error') })
    wrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return () => {
      cancelled = true
      try { checkout?.getPaymentElement()?.destroy() } catch { /* gone */ }
    }
  }, [session.clientSecret, session.publishableKey])

  async function applyCode(e?: React.FormEvent) {
    e?.preventDefault()
    const a = actionsRef.current
    const c = code.trim()
    if (!a || !c) return
    setCodeMsg('')
    const r = await a.applyPromotionCode(c)
    if (r.type === 'error') setCodeMsg(r.error.message || 'That code didn’t work.')
    else { setCode(''); setCodeOpen(false) }
  }

  async function removeCode() {
    const a = actionsRef.current
    if (a) await a.removePromotionCode()
  }

  async function book() {
    const a = actionsRef.current
    if (!a || busy) return
    setBusy(true)
    setErr('')
    const r = await a.confirm()
    // On success the browser goes to the return address (paid=1 confirmation).
    if (r.type === 'error') { setErr(r.error.message || 'Payment didn’t go through. Try again.'); setBusy(false) }
  }

  const item = cs?.lineItems?.[0]
  const total = cs?.total?.total?.amount
  const discounts = cs?.discountAmounts || []
  const line = '1px solid var(--hairStrong)'
  const row: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'baseline' }

  return (
    <div ref={wrapRef} data-testid="embedded-pay" data-ui="elements" style={{ marginTop: 32, scrollMarginTop: 96 }}>
      <div style={{ ...row, marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 500, color: 'var(--ink)' }}>Payment</h3>
        <span style={{ fontSize: 12.5, color: 'var(--inkMute)' }}>Secure, on this page</span>
      </div>

      <div style={{ borderTop: line, borderBottom: line, padding: '16px 0', marginBottom: 24 }}>
        <div style={row}>
          <span style={{ fontSize: 14.5, color: 'var(--ink)', minWidth: 0 }}>{item?.name || 'Bricks listing media'}</span>
          <span style={{ fontSize: 14.5, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{item?.subtotal?.amount || ''}</span>
        </div>
        {detail && <div style={{ fontSize: 13, color: 'var(--inkMute)', marginTop: 4 }}>{detail}</div>}
        {discounts.map((d) => (
          <div key={d.displayName} style={{ ...row, marginTop: 10, fontSize: 13.5, color: 'var(--inkSoft)' }}>
            <span>{d.promotionCode || d.displayName} <button type="button" onClick={removeCode} style={{ background: 'none', border: 0, padding: 0, marginLeft: 8, color: 'var(--inkMute)', textDecoration: 'underline', cursor: 'pointer', font: 'inherit' }}>Remove</button></span>
            <span>−{d.amount}</span>
          </div>
        ))}
        <div style={{ ...row, marginTop: 12, paddingTop: 12, borderTop: line }}>
          <span style={{ fontSize: 14, color: 'var(--inkSoft)' }}>Total <span style={{ color: 'var(--inkMute)' }}>CAD, tax included</span></span>
          <span style={{ fontSize: 20, fontWeight: 500, color: 'var(--ink)' }}>{total || ''}</span>
        </div>
        <div style={{ marginTop: 12 }}>
          {codeOpen ? (
            <form onSubmit={applyCode} style={{ display: 'flex', gap: 8 }}>
              <input
                aria-label="Launch code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Launch code"
                autoFocus
                style={{ flex: 1, minWidth: 0, padding: '10px 12px', border: line, borderRadius: 0, background: 'var(--paper)', color: 'var(--ink)', font: 'inherit', fontSize: 14 }}
              />
              <button type="submit" className="btn btn-ghost" style={{ borderRadius: 0 }}>Apply</button>
            </form>
          ) : discounts.length === 0 ? (
            <button type="button" onClick={() => setCodeOpen(true)} style={{ background: 'none', border: 0, padding: 0, color: 'var(--inkSoft)', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer', font: 'inherit', fontSize: 13.5 }}>Have a launch code?</button>
          ) : null}
          {codeMsg && <div role="status" style={{ marginTop: 8, fontSize: 13, color: 'var(--brickDeep)' }}>{codeMsg}</div>}
        </div>
      </div>

      {state === 'loading' && <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--inkMute)' }}>Loading the payment form…</p>}
      {state === 'error' && <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--inkSoft)' }}>The payment form didn&apos;t load. Refresh the page and try again, or email help@brxs.ca.</p>}
      <div ref={payRef} />

      {err && <div role="alert" style={{ marginTop: 16, fontSize: 14, color: 'var(--brickDeep)' }}>{err}</div>}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 24 }}>
        {onBack ? <button type="button" className="btn btn-ghost" onClick={onBack} style={{ borderRadius: 0 }}>← {backLabel}</button> : <span />}
        <button
          type="button"
          className="btn btn-brick"
          data-testid="pay-book"
          disabled={state !== 'ready' || busy || cs?.canConfirm === false}
          onClick={book}
          style={{ borderRadius: 0, minWidth: 200 }}
        >
          {busy ? 'Booking…' : total ? `Book · ${total}` : 'Book'}
        </button>
      </div>
      <p style={{ margin: '16px 0 0', fontSize: 12, color: 'var(--inkMute)', textAlign: 'right' }}>Payments by Stripe. Card details never touch Bricks.</p>
    </div>
  )
}
