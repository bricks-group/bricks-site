'use client'

import { useState } from 'react'
import { track } from '@vercel/analytics'

// Best-effort funnel analytics via Vercel Web Analytics. Never throws into the flow.
type TrackProps = Record<string, string | number | boolean | null | undefined>
function evt(name: string, props?: TrackProps) {
  try { track(name, props) } catch { /* analytics is best-effort */ }
}

export default function ContactForm() {
  const [msg, setMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = e.currentTarget
    const name = (f.elements.namedItem('name') as HTMLInputElement).value.trim()
    const email = (f.elements.namedItem('email') as HTMLInputElement).value.trim()
    const body = (f.elements.namedItem('msg') as HTMLTextAreaElement).value.trim()

    if (!name || !/^[^@\s]+@[^@\s]+.[^@\s]+$/.test(email) || !body) {
      setMsg('Fill in name, a valid email, and a message.')
      return
    }
    setSubmitting(true)
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: body }),
      })
      const data = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!r.ok || !data.ok) {
        setMsg(data.error || 'Could not send. Email us at booking@brxs.ca.')
      } else {
        evt('contact_submitted')
        setMsg('✓ Message sent — we’ll get back to you soon.')
        f.reset()
      }
    } catch {
      setMsg('Network error. Please email booking@brxs.ca directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="cform" onSubmit={submit}>
      <div>
        <label htmlFor="cName">Name</label>
        <input type="text" id="cName" name="name" placeholder="Your name" required />
      </div>
      <div>
        <label htmlFor="cEmail">Email</label>
        <input type="email" id="cEmail" name="email" placeholder="you@brokerage.com" required />
      </div>
      <div>
        <label htmlFor="cMsg">Message</label>
        <textarea id="cMsg" name="msg" placeholder="Property address, shoot type, preferred date — anything we should know." required />
      </div>
      <div className="cta-row">
        <button type="submit" className="btn btn-brick" disabled={submitting}>{submitting ? 'Sending…' : 'Send message'}</button>
        <a className="btn btn-sec" href="/book">Or book a shoot →</a>
      </div>
      <div className="nlmsg">{msg}</div>

      <style>{`
        .cform{display:grid;gap:14px;max-width:540px;margin-top:6px;}
        .cform label{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.12em;
          text-transform:uppercase;color:var(--inkMute);display:block;margin-bottom:6px;}
        .cform input,.cform textarea{width:100%;font-family:'General Sans',sans-serif;font-size:15px;
          color:var(--ink);background:var(--paperDeep);border:1px solid var(--hairStrong);
          border-radius:2px;padding:12px 14px;outline:none;}
        .cform input:focus,.cform textarea:focus{border-color:var(--brick);}
        .cform textarea{resize:vertical;min-height:120px;}
        .nlmsg{font-size:13px;color:var(--brickDeep);min-height:18px;}
      `}</style>
    </form>
  )
}
