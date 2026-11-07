'use client'

import { useRef, useState } from 'react'

type Citation = { url: string; title: string }
type Reply = { kind: 'answer' | 'escalate' | 'unsupported' | 'refused' | 'invalid'; text: string; citations: Citation[] }
type Msg = { role: 'user' | 'assistant'; text: string; citations?: Citation[]; kind?: Reply['kind'] }

const DISCLOSURE = 'This is an AI assistant. It answers only from the Bricks help articles, links its sources, and can’t make changes to bookings, payments or accounts. It can be wrong. For anything else, ask for a person.'

export default function HelpChat({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [q, setQ] = useState('')
  const [busy, setBusy] = useState(false)
  const [handoff, setHandoff] = useState(false)
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState('')
  const list = useRef<HTMLDivElement>(null)

  const scroll = () => requestAnimationFrame(() => list.current?.scrollTo({ top: list.current.scrollHeight }))

  async function ask(e: React.FormEvent) {
    e.preventDefault()
    const question = q.trim()
    if (!question || busy) return
    setQ('')
    setBusy(true)
    setMsgs((m) => [...m, { role: 'user', text: question }])
    scroll()
    try {
      const r = await fetch('/api/help-chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }) })
      const d = (await r.json().catch(() => ({}))) as { ok?: boolean; reply?: Reply; error?: string }
      if (d.ok && d.reply) {
        setMsgs((m) => [...m, { role: 'assistant', text: d.reply!.text, citations: d.reply!.citations, kind: d.reply!.kind }])
        if (d.reply.kind === 'escalate') setHandoff(true)
      } else {
        setMsgs((m) => [...m, { role: 'assistant', text: d.error || 'Something went wrong. Email help@brxs.ca.' }])
      }
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', text: 'Couldn’t reach the assistant. Email help@brxs.ca.' }])
    } finally {
      setBusy(false)
      scroll()
    }
  }

  async function sendToPerson(e: React.FormEvent) {
    e.preventDefault()
    if (!consent) { setStatus('Tick the box first.'); return }
    setStatus('Sending…')
    try {
      const r = await fetch('/api/help-chat/escalate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent: true, email, pagePath: pathname, transcript: msgs.map(({ role, text }) => ({ role, text })) }),
      })
      const d = (await r.json().catch(() => ({}))) as { ok?: boolean; ref?: string; error?: string }
      if (d.ok) {
        setHandoff(false)
        setStatus('')
        setMsgs((m) => [...m, { role: 'assistant', text: `Passed to the Bricks team (reference ${d.ref}). A person will reply to ${email}. Nothing about your booking or account has been changed.` }])
        scroll()
      } else setStatus(d.error || 'Couldn’t send. Email help@brxs.ca.')
    } catch {
      setStatus('Couldn’t send. Email help@brxs.ca.')
    }
  }

  return (
    <div className={`hchat${open ? ' is-open' : ''}`}>
      {open ? (
        <section className="hchat-panel" role="dialog" aria-label="Bricks AI help assistant">
          <header className="hchat-head">
            <div>
              <strong>Bricks AI assistant</strong>
              <span className="hchat-badge">AI</span>
            </div>
            <button type="button" className="hchat-x" onClick={() => setOpen(false)} aria-label="Close assistant">×</button>
          </header>
          <p className="hchat-disclosure">{DISCLOSURE}</p>
          <div className="hchat-list" ref={list} aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`hchat-msg hchat-${m.role}`}>
                <p>{m.text}</p>
                {m.citations?.length ? (
                  <ul className="hchat-cites" aria-label="Sources">
                    {m.citations.map((c) => <li key={c.url}><a href={c.url}>{c.title}</a></li>)}
                  </ul>
                ) : null}
              </div>
            ))}
            {busy ? <div className="hchat-msg hchat-assistant"><p>Checking the help articles…</p></div> : null}
          </div>
          {handoff ? (
            <form className="hchat-handoff" onSubmit={sendToPerson}>
              <label>Your email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
              <label className="hchat-consent"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /> I agree to send this conversation and my email to Bricks support so a person can reply.</label>
              <div className="hchat-row"><button type="submit">Send to a person</button><button type="button" className="hchat-ghost" onClick={() => setHandoff(false)}>Not now</button></div>
              {status ? <p className="hchat-status" role="status">{status}</p> : null}
            </form>
          ) : (
            <form className="hchat-form" onSubmit={ask}>
              <input value={q} onChange={(e) => setQ(e.target.value)} maxLength={600} placeholder="Ask about booking, pricing, media…" aria-label="Your question" />
              <button type="submit" disabled={busy}>Ask</button>
            </form>
          )}
          {!handoff ? <button type="button" className="hchat-person" onClick={() => setHandoff(true)}>Talk to a person instead</button> : null}
        </section>
      ) : (
        <button type="button" className="hchat-launch" onClick={() => setOpen(true)}>Ask Bricks AI</button>
      )}
    </div>
  )
}
