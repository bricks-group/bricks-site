'use client'

import { useState } from 'react'
import { NlMessage } from './NlShell'

type Kind = 'confirm' | 'unsubscribe'
const COPY = {
  confirm: {
    title: 'Confirm your email', lead: (e: string) => <>Get Bricks updates at <strong>{e}</strong>. About once a month.</>, button: 'Confirm',
    doneTitle: "You're in", done: <>Thanks. Your first update comes with the next issue.</>,
  },
  unsubscribe: {
    title: 'Unsubscribe', lead: (e: string) => <>Stop Bricks updates to <strong>{e}</strong>?</>, button: 'Unsubscribe',
    doneTitle: "You're unsubscribed", done: <>You won&rsquo;t get more updates. Changed your mind? <a href="/newsletter">Sign up again</a>.</>,
  },
}

export default function TokenAction({ kind, token, masked }: { kind: Kind; token: string; masked: string }) {
  const c = COPY[kind]
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  async function go() {
    setBusy(true); setErr('')
    try {
      const r = await fetch(`/api/newsletter/${kind}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ t: token }) })
      const j = await r.json().catch(() => ({}))
      if (r.ok && j.ok) { setDone(true); return }
      setErr(j.state === 'expired' ? 'This link has expired. Sign up again for a fresh one.' : "That didn't work. Try again, or write to hello@brxs.ca.")
    } catch {
      setErr("We couldn't reach Bricks. Try again.")
    } finally { setBusy(false) }
  }

  if (done) return <NlMessage title={c.doneTitle}>{c.done}</NlMessage>
  return (
    <NlMessage
      title={c.title}
      action={<button type="button" className="btn pv-btn pv-primary" onClick={go} disabled={busy}>{busy ? 'One moment…' : c.button}</button>}
    >
      {c.lead(masked)}
      {err ? <span className="pv-err" role="alert" style={{ display: 'block' }}>{err}</span> : null}
    </NlMessage>
  )
}
