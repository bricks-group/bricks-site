'use client'

import { useEffect, useState } from 'react'
import { track } from '@vercel/analytics'

// Best-effort funnel analytics via Vercel Web Analytics. Never throws into the flow.
type TrackProps = Record<string, string | number | boolean | null | undefined>
function evt(name: string, props?: TrackProps) {
  try { track(name, props) } catch { /* analytics is best-effort */ }
}

const SUPABASE = 'https://ctqwxwrcxwruaqojohpf.supabase.co/functions/v1/'
const ANON = 'sb_publishable_dsC8pvo5X9ZVZGbkaotrGQ_VhRINFod'

export default function NewsletterPopup() {
  const [show, setShow] = useState(false)
  const [seen, setSeen] = useState(true) // default true until we check sessionStorage, avoids SSR flash
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    let alreadySeen = false
    try { alreadySeen = sessionStorage.getItem('nl_seen') === '1' } catch {}
    setSeen(alreadySeen)
    if (alreadySeen) return

    const timer = setTimeout(() => setShow(true), 4000)
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY < 10) setShow(true)
    }
    document.addEventListener('mouseout', onMouseOut)
    return () => { clearTimeout(timer); document.removeEventListener('mouseout', onMouseOut) }
  }, [])

  function hide() {
    setShow(false)
    try { sessionStorage.setItem('nl_seen', '1') } catch {}
    setSeen(true)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^@\s]+@[^@\s]+.[^@\s]+$/.test(email)) { setMsg('Enter a valid email.'); return }
    evt('newsletter_subscribe_started', { source: 'popup' })
    setMsg('Subscribing…')
    fetch(SUPABASE + 'newsletter-signup', {
      method: 'POST', headers: { 'Content-Type': 'application/json', apikey: ANON },
      body: JSON.stringify({ email, source: 'popup' }),
    })
      .then((r) => r.json().then((j) => ({ ok: r.ok && j.ok !== false })))
      .then((res) => {
        if (!res.ok) { setMsg('Could not subscribe — try booking@brxs.ca'); return }
        evt('newsletter_subscribed', { source: 'popup' })
        setMsg('✓ You are on the list.')
        setEmail('')
        try { sessionStorage.setItem('nl_seen', '1') } catch {}
        setTimeout(() => setShow(false), 1500)
      })
      .catch(() => setMsg('Network error — try again.'))
  }

  return (
    <>
      {!seen && !show && (
        <button className="nl-pill" aria-label="Join the newsletter for launch updates and founder pricing" onClick={() => setShow(true)}>
          Founder pricing
        </button>
      )}
      <div className={`nl-pop${show ? ' show' : ''}`} role="dialog" aria-label="Newsletter signup for launch updates and founder pricing">
        <button className="x" aria-label="Dismiss" onClick={hide}>×</button>
        <h4>Get founder pricing.</h4>
        <p>Join the newsletter for launch updates — and lock in a discounted founder rate before Bricks opens to everyone. No spam.</p>
        <form onSubmit={submit}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@brokerage.com" aria-label="Email" required />
          <button type="submit" className="btn btn-brick">Claim founder rate</button>
          <div className="nlmsg">{msg}</div>
          <div className="consent">By subscribing you agree to receive Bricks newsletter and launch update emails. Unsubscribe anytime. CASL-compliant.</div>
        </form>
      </div>
    </>
  )
}
