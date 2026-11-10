'use client'

import { useEffect, useState } from 'react'

type TrackProps = Record<string, string | number | boolean | null | undefined>
function evt(_name: string, _props?: TrackProps) {
  /* Vercel analytics removed */
}

export default function NewsletterPopup() {
  const [show, setShow] = useState(false)
  const [seen, setSeen] = useState(true)
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setMsg('Enter a valid email.'); return }
    evt('newsletter_subscribe_started', { source: 'popup' })
    setMsg('Subscribing…')
    fetch('/api/newsletter', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'popup' }),
    })
      .then((r) => r.json().then((j) => ({ ok: r.ok && j.ok !== false })))
      .then((res) => {
        if (!res.ok) { setMsg('Could not subscribe — try help@brxs.ca'); return }
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
        <button className="nl-pill" aria-label="Join the Bricks list for platform and pricing updates" onClick={() => setShow(true)}>
          Platform updates
        </button>
      )}
      <div className={`nl-pop${show ? ' show' : ''}`} role="dialog" aria-label="Newsletter signup for platform and pricing updates">
        <button className="x" aria-label="Dismiss" onClick={hide}>×</button>
        <h4>Stay on the list.</h4>
        <p>Product and pricing news from Bricks. No spam.</p>
        <form onSubmit={submit}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@brokerage.com" aria-label="Email" required />
          <button type="submit" className="btn btn-brick">Get updates</button>
          <div className="nlmsg">{msg}</div>
          <div className="consent">By subscribing you agree to receive Bricks newsletter and launch update emails. Unsubscribe anytime.</div>
        </form>
      </div>
    </>
  )
}
