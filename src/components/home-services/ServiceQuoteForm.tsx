'use client'

import { useEffect, useState } from 'react'
import { PROPERTY_TYPES, QUOTE_CLIENT_TYPES, TIMING_OPTIONS, TRADES, tradeBySlug, type TradeSlug } from '@/lib/services'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const css = `
  .sq{display:grid;grid-template-columns:1.25fr .75fr;gap:40px;align-items:start;margin-top:12px;}
  .sq form{display:grid;gap:18px;}
  .sq fieldset{border:1px solid var(--hair);border-radius:2px;padding:18px 18px 20px;margin:0;display:grid;gap:14px;background:var(--paper);min-width:0;}
  .sq legend{font-size:15px;font-weight:500;color:var(--ink);padding:0 6px;}
  .sq label.f{font-size:13px;font-weight:500;color:var(--inkMute);display:block;margin-bottom:6px;}
  .sq input[type=text],.sq input[type=email],.sq input[type=tel],.sq select,.sq textarea{width:100%;font:inherit;font-size:15px;color:var(--ink);background:var(--paperDeep);border:1px solid var(--hairStrong);border-radius:2px;padding:11px 13px;outline:none;min-height:44px;}
  .sq input:focus,.sq select:focus,.sq textarea:focus{border-color:var(--brick);}
  .sq textarea{resize:vertical;min-height:96px;}
  .sq .two{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .sq .hint{font-size:13px;color:var(--inkMute);line-height:1.45;margin:0;}
  .sq aside{position:sticky;top:96px;border:1px solid var(--hair);border-radius:2px;background:var(--paper);padding:20px;display:grid;gap:10px;font-size:14px;color:var(--inkSoft);line-height:1.5;}
  .sq aside h3{margin:0;font-size:16px;font-weight:500;color:var(--ink);}
  .sq aside ol{margin:0;padding-left:18px;display:grid;gap:6px;}
  .sq aside a{color:var(--ink);}
  .sq .msg{font-size:13.5px;color:var(--brickDeep);min-height:18px;}
  .sq .ok{border:1px solid var(--hair);background:var(--paper);padding:22px;border-radius:2px;display:grid;gap:12px;justify-items:start;}
  .sq .ok h3{margin:0;font-size:18px;font-weight:500;color:var(--ink);}
  .sq .btn{min-height:44px;}
  @media (max-width:900px){.sq{grid-template-columns:1fr;}.sq aside{position:static;}.sq .two{grid-template-columns:1fr;}}
`

export default function ServiceQuoteForm({ trade }: { trade?: TradeSlug }) {
  const [slug, setSlug] = useState<TradeSlug | ''>(trade || '')
  const t = slug ? tradeBySlug(slug) : undefined
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState<string | null>(null)

  // One form for every trade: #staging (old /staging links redirect here) or
  // #quote-staging (the "Request a quote" link in each section) picks the trade.
  useEffect(() => {
    const pick = () => {
      const h = decodeURIComponent(window.location.hash.replace(/^#(quote-)?/, ''))
      const x = tradeBySlug(h)
      if (x) setSlug(x.slug)
    }
    pick()
    window.addEventListener('hashchange', pick)
    return () => window.removeEventListener('hashchange', pick)
  }, [])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = e.currentTarget
    const v = (n: string) => ((f.elements.namedItem(n) as HTMLInputElement | null)?.value || '').trim()
    const email = v('email')
    if (!slug) { setMsg('Pick a service.'); return }
    if (!v('clientType')) { setMsg('Pick who it’s for.'); return }
    if (!v('name') || !EMAIL_RE.test(email)) { setMsg('Add your name and a valid email.'); return }
    if (!v('address')) { setMsg('Add the property address.'); return }
    setBusy(true)
    setMsg('')
    try {
      const body = {
        trade: slug, clientType: v('clientType'), scope: v('scope'), name: v('name'), email, phone: v('phone'), company: v('company'),
        address: v('address'), propertyType: v('propertyType'), size: v('size'), timing: v('timing'), details: v('details'), website: v('website'),
      }
      const r = await fetch('/api/book/service-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!r.ok || !j.ok) { setMsg(j.error || 'Could not send. Email help@brxs.ca.'); return }
      setSent(email)
    } catch {
      setMsg('Network error. Please email help@brxs.ca.')
    } finally {
      setBusy(false)
    }
  }

  if (sent) {
    return (
      <div className="sq" style={{ gridTemplateColumns: '1fr' }}>
        <style>{css}</style>
        <div className="ok" data-testid="service-quote-sent" role="status">
          <h3>Request sent.</h3>
          <p className="hint" style={{ fontSize: 15 }}>We sent a copy to {sent}. A person at Bricks will reply by email with questions or a written quote. Nothing is booked or charged until you approve it.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="sq">
      <style>{css}</style>
      <form onSubmit={submit} noValidate data-testid="service-quote-form">
        <fieldset>
          <legend>What you need</legend>
          <div className="two">
            <div>
              <label className="f" htmlFor="sq-trade">Service</label>
              <select id="sq-trade" name="trade" value={slug} onChange={(e) => setSlug(e.target.value as TradeSlug)}>
                {!trade && <option value="">Pick a service</option>}
                {TRADES.map((x) => <option key={x.slug} value={x.slug}>{x.name}</option>)}
              </select>
            </div>
            <div>
              <label className="f" htmlFor="sq-scope">Type of job (optional)</label>
              <select id="sq-scope" name="scope" defaultValue="" key={slug}>
                <option value="">Pick one</option>
                {(t?.scopes || []).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="f" htmlFor="sq-client">Who it&apos;s for</label>
            <select id="sq-client" name="clientType" defaultValue="">
              <option value="" disabled>Pick one</option>
              {QUOTE_CLIENT_TYPES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          {t?.rules.length ? <p className="hint">{t.rules.join(' ')}</p> : null}
        </fieldset>
        <fieldset>
          <legend>The property</legend>
          <div><label className="f" htmlFor="sq-address">Address</label><input id="sq-address" name="address" type="text" autoComplete="street-address" /></div>
          <div className="two">
            <div>
              <label className="f" htmlFor="sq-ptype">Property type (optional)</label>
              <select id="sq-ptype" name="propertyType" defaultValue="">
                <option value="">Pick one</option>
                {PROPERTY_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div><label className="f" htmlFor="sq-size">Size in sq ft (optional)</label><input id="sq-size" name="size" type="text" inputMode="numeric" /></div>
          </div>
          <div>
            <label className="f" htmlFor="sq-timing">Timing (optional)</label>
            <select id="sq-timing" name="timing" defaultValue="">
              <option value="">Pick one</option>
              {TIMING_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div><label className="f" htmlFor="sq-details">Details (optional)</label><textarea id="sq-details" name="details" placeholder="Rooms, access, dates, anything we should know" /></div>
        </fieldset>
        <fieldset>
          <legend>You</legend>
          <div className="two">
            <div><label className="f" htmlFor="sq-name">Name</label><input id="sq-name" name="name" type="text" autoComplete="name" /></div>
            <div><label className="f" htmlFor="sq-company">Company (optional)</label><input id="sq-company" name="company" type="text" autoComplete="organization" /></div>
          </div>
          <div className="two">
            <div><label className="f" htmlFor="sq-email">Email</label><input id="sq-email" name="email" type="email" autoComplete="email" /></div>
            <div><label className="f" htmlFor="sq-phone">Phone (optional)</label><input id="sq-phone" name="phone" type="tel" autoComplete="tel" /></div>
          </div>
        </fieldset>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }} />
        <div className="msg" role="alert">{msg}</div>
        <button className="btn btn-night btn-primary" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Request a quote'}</button>
      </form>
      <aside>
        <h3>How quote requests work</h3>
        <ol>
          <li>You send the request. We email you a copy.</li>
          <li>A person at Bricks reviews it and may ask a few questions.</li>
          <li>You get a written quote. Nothing is booked or charged until you approve it.</li>
          <li>Once it&apos;s done, the results are kept with the property in your Bricks account.</li>
        </ol>
        <p style={{ margin: 0 }}><a href="/help/home-services/how-quote-requests-work">More about quote requests</a></p>
      </aside>
    </div>
  )
}
