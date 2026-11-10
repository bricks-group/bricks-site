'use client'

import { useState } from 'react'
import BricksLoader from '@/components/BricksLoader'

type TrackProps = Record<string, string | number | boolean | null | undefined>
function evt(_name: string, _props?: TrackProps) {
  /* Vercel analytics removed */
}

const formCss = `
  .cform{display:grid;gap:14px;max-width:540px;margin-top:6px;}
  .cform label{font-family:'General Sans',sans-serif;font-size:13px;font-weight:500;letter-spacing:0;text-transform:none;color:var(--inkMute);display:block;margin-bottom:6px;}
  .cform input,.cform textarea{width:100%;font-family:'General Sans',sans-serif;font-size:15px;
    color:var(--ink);background:var(--paperDeep);border:1px solid var(--hairStrong);
    border-radius:2px;padding:12px 14px;outline:none;}
  .cform input:focus,.cform textarea:focus{border-color:var(--brick);}
  .cform textarea{resize:vertical;min-height:120px;}
  .nlmsg{font-size:13px;color:var(--brickDeep);min-height:18px;}
`

/** Construction / REIT / developer lead capture — same /api/contact inbox as Contact. */
export default function ConstructionForm() {
  const [msg, setMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = e.currentTarget
    const name = (f.elements.namedItem('name') as HTMLInputElement).value.trim()
    const email = (f.elements.namedItem('email') as HTMLInputElement).value.trim()
    const company = (f.elements.namedItem('company') as HTMLInputElement).value.trim()
    const phone = (f.elements.namedItem('phone') as HTMLInputElement).value.trim()
    const notes = (f.elements.namedItem('notes') as HTMLTextAreaElement).value.trim()

    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !notes) {
      setMsg('Fill in name, a valid email, and project notes.')
      return
    }

    const parts: Array<string | null> = [
      '[Construction / REIT / Developer inquiry]',
      company ? `Company: ${company}` : null,
      phone ? `Phone: ${phone}` : null,
      '',
      notes,
    ]
    const message = parts.filter((line): line is string => line !== null).join('\n')

    setSubmitting(true)
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      const data = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!r.ok || !data.ok) {
        setMsg(data.error || 'Could not send. Email us at help@brxs.ca.')
      } else {
        evt('construction_lead_submitted')
        setMsg('✓ Request received — a human replies within one business day.')
        f.reset()
      }
    } catch {
      setMsg('Network error. Please email help@brxs.ca directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="cform" onSubmit={submit}>
      <div>
        <label htmlFor="cxName">Name</label>
        <input type="text" id="cxName" name="name" placeholder="Your name" required />
      </div>
      <div>
        <label htmlFor="cxEmail">Email</label>
        <input type="email" id="cxEmail" name="email" placeholder="you@company.com" required />
      </div>
      <div>
        <label htmlFor="cxCompany">Company</label>
        <input type="text" id="cxCompany" name="company" placeholder="Developer / REIT / GC" />
      </div>
      <div>
        <label htmlFor="cxPhone">Phone</label>
        <input type="tel" id="cxPhone" name="phone" placeholder="Optional" />
      </div>
      <div>
        <label htmlFor="cxNotes">Project notes</label>
        <textarea id="cxNotes" name="notes" placeholder="Sites, visual or mapped, cadence, insurance minimum, timeline" required />
      </div>
      <div className="cta-row">
        <button type="submit" className="btn btn-night btn-primary" disabled={submitting}>{submitting && <BricksLoader variant="cycle" size={16} color="currentColor" style={{ marginRight: 8 }} />}{submitting ? 'Sending…' : 'Request a quote'}</button>
        <a className="btn btn-sec" href="/book">Or book listing media →</a>
      </div>
      <div className="nlmsg">{msg}</div>
      <style>{formCss}</style>
    </form>
  )
}
