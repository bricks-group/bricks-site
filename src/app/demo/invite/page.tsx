'use client'

import { FormEvent, useState } from 'react'

export default function DemoInviteMintPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [send, setSend] = useState(true)
  const [days, setDays] = useState(7)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [url, setUrl] = useState('')
  const [emailed, setEmailed] = useState<boolean | null>(null)
  const [exp, setExp] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setUrl('')
    setEmailed(null)
    setExp(null)
    setCopied(false)
    setPending(true)
    try {
      const res = await fetch('/api/demo/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          send,
          days,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        url?: string
        emailed?: boolean
        exp?: number
        error?: string
        mail_error?: string
      }
      if (!res.ok || !data.ok || !data.url) {
        setError(data.error || 'Could not mint invite.')
        return
      }
      setUrl(data.url)
      setEmailed(Boolean(data.emailed))
      setExp(typeof data.exp === 'number' ? data.exp : null)
      if (send && !data.emailed && data.mail_error) {
        setError(`Link ready — email did not send (${data.mail_error}). Copy the link.`)
      }
    } catch {
      setError('Network error.')
    } finally {
      setPending(false)
    }
  }

  async function copyLink() {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Could not copy — select the link manually.')
    }
  }

  const expLabel =
    exp != null
      ? new Date(exp * 1000).toLocaleString('en-CA', {
          timeZone: 'America/Toronto',
          dateStyle: 'medium',
          timeStyle: 'short',
        }) + ' ET'
      : null

  return (
    <main className="demo-page">
      <div className="demo-page-head wrap">
        <span className="badge">Internal</span>
        <h1>Mint demo invite.</h1>
        <p className="sub">Prospects open the link — no account needed.</p>
      </div>
      <section className="block">
        <div className="wrap">
          <form className="cform" onSubmit={onSubmit}>
            <div>
              <label htmlFor="invEmail">Email</label>
              <input
                id="invEmail"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prospect@brokerage.com"
              />
            </div>
            <div>
              <label htmlFor="invName">Name (optional)</label>
              <input
                id="invName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First name"
              />
            </div>
            <div>
              <label htmlFor="invDays">Expires in</label>
              <select
                id="invDays"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                style={{
                  width: '100%',
                  fontFamily: "'General Sans', sans-serif",
                  fontSize: 15,
                  color: 'var(--ink)',
                  background: 'var(--paperDeep)',
                  border: '1px solid var(--hairStrong)',
                  borderRadius: 2,
                  padding: '12px 14px',
                }}
              >
                {[1, 3, 7, 14, 30].map((d) => (
                  <option key={d} value={d}>
                    {d} day{d === 1 ? '' : 's'}
                  </option>
                ))}
              </select>
            </div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: "'General Sans', sans-serif",
                fontSize: 14,
                color: 'var(--ink)',
                cursor: 'pointer',
                textTransform: 'none',
                letterSpacing: 0,
              }}
            >
              <input
                type="checkbox"
                checked={send}
                onChange={(e) => setSend(e.target.checked)}
                style={{ width: 16, height: 16 }}
              />
              Email invite
            </label>
            <div className="cta-row">
              <button type="submit" className="btn btn-brick" disabled={pending}>
                {pending ? 'Minting…' : 'Mint invite'}
              </button>
            </div>
            {error ? (
              <div className="nlmsg" role="alert">
                {error}
              </div>
            ) : null}
          </form>

          {url ? (
            <div style={{ marginTop: 28, maxWidth: 640 }}>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--inkMute)',
                  marginBottom: 8,
                }}
              >
                Unlock link
                {emailed === true ? ' · emailed' : emailed === false ? ' · not emailed' : ''}
                {expLabel ? ` · expires ${expLabel}` : ''}
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                  alignItems: 'stretch',
                }}
              >
                <input
                  readOnly
                  value={url}
                  onFocus={(e) => e.currentTarget.select()}
                  style={{
                    flex: '1 1 240px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: 'var(--ink)',
                    background: 'var(--paperDeep)',
                    border: '1px solid var(--hairStrong)',
                    borderRadius: 2,
                    padding: '12px 14px',
                  }}
                />
                <button type="button" className="btn btn-sec" onClick={copyLink}>
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          ) : null}

          <style>{`
            .cform{display:grid;gap:14px;max-width:540px;margin-top:6px;}
            .cform label{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.12em;
              text-transform:uppercase;color:var(--inkMute);display:block;margin-bottom:6px;}
            .cform input[type=email],.cform input[type=text]{width:100%;font-family:'General Sans',sans-serif;font-size:15px;
              color:var(--ink);background:var(--paperDeep);border:1px solid var(--hairStrong);
              border-radius:2px;padding:12px 14px;outline:none;}
            .cform input:focus{border-color:var(--brick);}
            .nlmsg{font-size:13px;color:var(--brickDeep);min-height:18px;}
          `}</style>
        </div>
      </section>
    </main>
  )
}
