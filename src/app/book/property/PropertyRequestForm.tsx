'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { track } from '@vercel/analytics'
import { CLIENT_LABEL, SERVICES_FOR, isPropertyClient, type PropertyClient } from '@/lib/clientServices'
import { signupUrl } from '@/lib/brand'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TYPES = Object.keys(SERVICES_FOR) as PropertyClient[]

const css = `
  .pr{display:grid;grid-template-columns:1.25fr .75fr;gap:40px;align-items:start;margin-top:12px;}
  .pr form{display:grid;gap:18px;}
  .pr fieldset{border:1px solid var(--hair);border-radius:2px;padding:18px 18px 20px;margin:0;display:grid;gap:14px;background:var(--paper);min-width:0;}
  .pr legend{font-size:15px;font-weight:500;color:var(--ink);padding:0 6px;}
  .pr label.f{font-size:13px;font-weight:500;color:var(--inkMute);display:block;margin-bottom:6px;}
  .pr input[type=text],.pr input[type=email],.pr input[type=tel],.pr input[type=number],.pr select,.pr textarea{width:100%;font:inherit;font-size:15px;color:var(--ink);background:var(--paperDeep);border:1px solid var(--hairStrong);border-radius:2px;padding:11px 13px;outline:none;min-height:44px;}
  .pr input:focus,.pr select:focus,.pr textarea:focus{border-color:var(--brick);}
  .pr textarea{resize:vertical;min-height:84px;}
  .pr .two{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .pr .opt{display:flex;gap:10px;align-items:flex-start;font-size:14px;color:var(--inkSoft);line-height:1.45;cursor:pointer;min-height:44px;}
  .pr .opt input{margin-top:3px;accent-color:var(--brick);width:18px;height:18px;flex:none;}
  .pr .opt b{color:var(--ink);font-weight:500;display:block;}
  .pr .hint{font-size:13px;color:var(--inkMute);line-height:1.45;margin:0;}
  .pr aside{position:sticky;top:96px;border:1px solid var(--hair);border-radius:2px;background:var(--paper);padding:20px;display:grid;gap:10px;font-size:14px;color:var(--inkSoft);line-height:1.5;}
  .pr aside h3{margin:0;font-size:16px;font-weight:500;color:var(--ink);}
  .pr aside a{color:var(--ink);}
  .pr .msg{font-size:13.5px;color:var(--brickDeep);min-height:18px;}
  .pr .ok{border:1px solid var(--hair);background:var(--paper);padding:22px;border-radius:2px;display:grid;gap:12px;justify-items:start;}
  .pr .btn{min-height:44px;}
  @media (max-width:900px){.pr{grid-template-columns:1fr;}.pr aside{position:static;}.pr .two{grid-template-columns:1fr;}}
`

export default function PropertyRequestForm() {
  const params = useSearchParams()
  const initial = params.get('for')
  const [kind, setKind] = useState<PropertyClient>(isPropertyClient(initial) ? initial : 'property_manager')
  const services = SERVICES_FOR[kind]
  const [picked, setPicked] = useState<string[]>(() => {
    const s = params.get('service')
    return s && SERVICES_FOR[isPropertyClient(initial) ? initial : 'property_manager'].some((x) => x.key === s) ? [s] : []
  })
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState<string | null>(null)
  const chosen = useMemo(() => services.filter((s) => picked.includes(s.key)), [services, picked])

  function toggle(key: string) {
    setPicked((p) => (p.includes(key) ? p.filter((k) => k !== key) : [...p, key]))
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = e.currentTarget
    const v = (n: string) => ((f.elements.namedItem(n) as HTMLInputElement | null)?.value || '').trim()
    const email = v('email')
    if (!v('name') || !EMAIL_RE.test(email)) { setMsg('Add your name and a valid email.'); return }
    if (!v('address')) { setMsg('Add the property address.'); return }
    if (!chosen.length) { setMsg('Pick at least one service.'); return }
    setBusy(true)
    setMsg('')
    try {
      const body = {
        kind, services: chosen.map((s) => s.key), name: v('name'), email, address: v('address'),
        company: v('company'), phone: v('phone'), units: v('units'), size: v('size'), notes: v('notes'), website: v('website'),
      }
      const r = await fetch('/api/book/property-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!r.ok || !j.ok) { setMsg(j.error || 'Could not send. Email booking@brxs.ca.'); return }
      try { track('property_request', { kind, services: chosen.map((s) => s.key).join(',') }) } catch { /* best-effort */ }
      setSent(email)
    } catch {
      setMsg('Network error. Please email booking@brxs.ca.')
    } finally {
      setBusy(false)
    }
  }

  if (sent) {
    return (
      <div className="pr" style={{ gridTemplateColumns: '1fr' }}>
        <style>{css}</style>
        <div className="ok" data-testid="property-request-sent">
          <h2 style={{ margin: 0 }}>Request sent.</h2>
          <p className="hint" style={{ fontSize: 15 }}>We reply to {sent} with the price and a time, usually within one business day. Nothing is booked until you confirm.</p>
          <a className="btn btn-sec" href={signupUrl(kind, sent)}>Set up your account</a>
        </div>
      </div>
    )
  }

  return (
    <div className="pr">
      <style>{css}</style>
      <form onSubmit={submit} noValidate data-testid="property-request-form">
        <fieldset>
          <legend>Who it&apos;s for</legend>
          <div>
            <label className="f" htmlFor="pr-kind">Account</label>
            <select id="pr-kind" value={kind} onChange={(e) => { setKind(e.target.value as PropertyClient); setPicked([]) }}>
              {TYPES.map((t) => <option key={t} value={t}>{CLIENT_LABEL[t]}</option>)}
            </select>
          </div>
        </fieldset>
        <fieldset>
          <legend>What you need</legend>
          {services.map((s) => (
            <label key={s.key} className="opt">
              <input type="checkbox" checked={picked.includes(s.key)} onChange={() => toggle(s.key)} />
              <span><b>{s.name}</b>{s.detail}</span>
            </label>
          ))}
          {kind !== 'property_manager' && (
            <p className="hint">Building something? <Link href="/book/site">Book site progress</Link> online with prices shown.</p>
          )}
        </fieldset>
        <fieldset>
          <legend>The property</legend>
          <div><label className="f" htmlFor="pr-address">Address</label><input id="pr-address" name="address" type="text" autoComplete="street-address" /></div>
          <div className="two">
            <div><label className="f" htmlFor="pr-units">Units or spaces (optional)</label><input id="pr-units" name="units" type="text" inputMode="numeric" /></div>
            <div><label className="f" htmlFor="pr-size">Size in sq ft (optional)</label><input id="pr-size" name="size" type="text" inputMode="numeric" /></div>
          </div>
          <div><label className="f" htmlFor="pr-notes">Anything we should know (optional)</label><textarea id="pr-notes" name="notes" placeholder="Access, timing, move-out date" /></div>
        </fieldset>
        <fieldset>
          <legend>You</legend>
          <div className="two">
            <div><label className="f" htmlFor="pr-name">Name</label><input id="pr-name" name="name" type="text" autoComplete="name" /></div>
            <div><label className="f" htmlFor="pr-company">Company (optional)</label><input id="pr-company" name="company" type="text" autoComplete="organization" /></div>
          </div>
          <div className="two">
            <div><label className="f" htmlFor="pr-email">Email</label><input id="pr-email" name="email" type="email" autoComplete="email" /></div>
            <div><label className="f" htmlFor="pr-phone">Phone (optional)</label><input id="pr-phone" name="phone" type="tel" autoComplete="tel" /></div>
          </div>
        </fieldset>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }} />
        <div className="msg" role="alert">{msg}</div>
        <button className="btn btn-night btn-primary" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send request'}</button>
      </form>
      <aside>
        <h3>How it works</h3>
        <p style={{ margin: 0 }}>We confirm the price for your property and a time that works. You pay only once you say yes.</p>
        <p style={{ margin: 0 }}>Every visit is dated and filed under the property in your Bricks account.</p>
        <p style={{ margin: 0 }}>Listing photos for one unit? <Link href="/book">Book listing media</Link> with prices shown.</p>
      </aside>
    </div>
  )
}
