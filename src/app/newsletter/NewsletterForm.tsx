'use client'

import { useState } from 'react'

export const CONSENT_LABEL = 'Yes, email me Bricks updates. Unsubscribe anytime.'

export default function NewsletterForm({ source = 'page' }: { source?: string }) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [company, setCompany] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [sentTo, setSentTo] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setErr('Enter a valid email.'); return }
    if (!consent) { setErr('Tick the box to agree.'); return }
    setBusy(true)
    try {
      const r = await fetch('/api/newsletter', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), consent, source, company }),
      })
      const j = await r.json().catch(() => ({}))
      if (r.ok && j.ok) { setSentTo(email.trim()); return }
      setErr(j.error || "That didn't work. Try again.")
    } catch {
      setErr("We couldn't reach Bricks. Try again.")
    } finally {
      setBusy(false)
    }
  }

  if (sentTo) {
    return (
      <div className="nl-done" role="status">
        <strong>Check your email</strong>
        <p>We sent a link to {sentTo}. Tap it to confirm.</p>
      </div>
    )
  }

  return (
    <form className="nl-form" onSubmit={submit} noValidate>
      <div className="nl-row">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@brokerage.com"
          aria-label="Email" autoComplete="email" required />
        <button type="submit" className="btn btn-brick" disabled={busy}>{busy ? 'Sending…' : 'Sign up'}</button>
      </div>
      <label className="nl-hp" aria-hidden="true">Company
        <input tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
      </label>
      <label className="nl-consent">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>{CONSENT_LABEL}</span>
      </label>
      <p className={`nl-msg${err ? ' err' : ''}`} role="alert">{err}</p>
    </form>
  )
}
