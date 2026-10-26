'use client'
import { useState } from 'react'

type State = 'idle' | 'no' | 'sending' | 'done' | 'error'

export default function Feedback({ path }: { path: string }) {
  const [state, setState] = useState<State>('idle')
  const [helpful, setHelpful] = useState<boolean | null>(null)
  const [note, setNote] = useState('')
  const [email, setEmail] = useState('')
  const [err, setErr] = useState('')

  async function send(h: boolean, n = '', e = '') {
    setState('sending')
    setErr('')
    try {
      const r = await fetch('/api/help-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, helpful: h, note: n, email: e }),
      })
      const d = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (r.ok && d.ok) setState('done')
      else { setErr(d.error || 'Could not send. Email help@brxs.ca.'); setState('error') }
    } catch {
      setErr('Could not send. Email help@brxs.ca.')
      setState('error')
    }
  }

  if (state === 'done') {
    return <section className="hc-feedback" aria-live="polite"><p className="hc-feedback-q">Thanks. Your feedback went to the Bricks team.</p></section>
  }

  return (
    <section className="hc-feedback" aria-labelledby="hc-feedback-q">
      <p id="hc-feedback-q" className="hc-feedback-q">Was this helpful?</p>
      {state === 'idle' || (state === 'error' && helpful !== false) ? (
        <div className="hc-feedback-row">
          <button type="button" className="hc-chip" onClick={() => { setHelpful(true); send(true) }}>Yes</button>
          <button type="button" className="hc-chip" onClick={() => { setHelpful(false); setState('no') }}>No</button>
        </div>
      ) : null}
      {state === 'no' || state === 'sending' || (state === 'error' && helpful === false) ? (
        helpful === false ? (
          <form
            className="hc-feedback-form"
            onSubmit={(ev) => { ev.preventDefault(); send(false, note, email) }}
          >
            <label htmlFor="hc-note">What were you looking for? (optional)</label>
            <textarea id="hc-note" rows={3} maxLength={2000} value={note} onChange={(e) => setNote(e.target.value)} />
            <label htmlFor="hc-email">Email, if you&rsquo;d like a reply (optional)</label>
            <input id="hc-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" className="hc-chip" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send feedback'}</button>
          </form>
        ) : <p className="hc-feedback-q" aria-live="polite">Sending…</p>
      ) : null}
      {state === 'error' ? <p className="hc-feedback-err" role="alert">{err}</p> : null}
    </section>
  )
}
