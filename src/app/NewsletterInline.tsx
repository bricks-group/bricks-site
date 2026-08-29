'use client'

import { useState } from 'react'
import { track } from '@vercel/analytics'

type TrackProps = Record<string, string | number | boolean | null | undefined>
function evt(name: string, props?: TrackProps) {
  try { track(name, props) } catch { /* analytics is best-effort */ }
}

export default function NewsletterInline() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setMsg('Enter a valid email.'); return }
    evt('newsletter_subscribe_started', { source: 'inline' })
    setMsg('Subscribing…')
    fetch('/api/newsletter', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'inline' }),
    })
      .then((r) => r.json().then((j) => ({ ok: r.ok && j.ok !== false })))
      .then((res) => {
        if (!res.ok) { setMsg('Could not subscribe — try booking@brxs.ca'); return }
        evt('newsletter_subscribed', { source: 'inline' })
        setMsg('✓ You are on the list.')
        setEmail('')
      })
      .catch(() => setMsg('Network error — try again.'))
  }

  return (
    <form className="newsletter" onSubmit={submit}>
      <input
        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="you@office.com" aria-label="Email for launch updates" required
      />
      <button type="submit" className="btn btn-sec">Get launch updates</button>
      <span className="nl-msg">{msg}</span>
    </form>
  )
}
