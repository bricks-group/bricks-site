'use client'

import { useState } from 'react'
import { track } from '@vercel/analytics'

// Best-effort funnel analytics via Vercel Web Analytics. Never throws into the flow.
type TrackProps = Record<string, string | number | boolean | null | undefined>
function evt(name: string, props?: TrackProps) {
  try { track(name, props) } catch { /* analytics is best-effort */ }
}

const SUPABASE = 'https://ctqwxwrcxwruaqojohpf.supabase.co/functions/v1/'
const ANON = 'sb_publishable_dsC8pvo5X9ZVZGbkaotrGQ_VhRINFod'

export default function NewsletterInline() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^@\s]+@[^@\s]+.[^@\s]+$/.test(email)) { setMsg('Enter a valid email.'); return }
    evt('newsletter_subscribe_started', { source: 'inline' })
    setMsg('Subscribing…')
    fetch(SUPABASE + 'newsletter-signup', {
      method: 'POST', headers: { 'Content-Type': 'application/json', apikey: ANON },
      body: JSON.stringify({ email, source: 'bricks-prelaunch' }),
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
        placeholder="you@brokerage.com" aria-label="Email for launch updates" required
      />
      <button type="submit" className="btn btn-sec">Get launch updates</button>
      <span className="nl-msg">{msg}</span>
    </form>
  )
}
