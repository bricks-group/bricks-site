'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CLIENT_LABEL, isPropertyClient, type PropertyClient } from '@/lib/clientServices'
import { ONE_OFFS, ONE_OFFS_FOR, addDays, checkCheckout, checkoutBody, money, tierForSqft, type CheckoutFields } from '@/lib/propertyCheckout'
import { signupUrl } from '@/lib/brand'
import NotInArea from '@/components/NotInArea'
import EmbeddedPay, { type EmbeddedSession, embeddedFrom } from '@/components/EmbeddedPay'
import { checkCoverage, coverageKey, isNotCoveredCode, UNAVAILABLE_CODE, type CoverageInput } from '@/lib/booking-coverage'

const TYPES = Object.keys(ONE_OFFS_FOR) as PropertyClient[]
const torontoToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())

const css = `
  .pc{display:grid;grid-template-columns:1.25fr .75fr;gap:40px;align-items:start;margin-top:12px;}
  .pc form{display:grid;gap:18px;}
  .pc fieldset{border:1px solid var(--hair);border-radius:2px;padding:18px 18px 20px;margin:0;display:grid;gap:14px;background:var(--paper);min-width:0;}
  .pc legend{font-size:15px;font-weight:500;color:var(--ink);padding:0 6px;}
  .pc label.f{font-size:13px;font-weight:500;color:var(--inkMute);display:block;margin-bottom:6px;}
  .pc input[type=text],.pc input[type=email],.pc input[type=tel],.pc input[type=date],.pc select,.pc textarea{width:100%;font:inherit;font-size:15px;color:var(--ink);background:var(--paperDeep);border:1px solid var(--hairStrong);border-radius:2px;padding:11px 13px;outline:none;min-height:44px;}
  .pc input:focus,.pc select:focus,.pc textarea:focus{border-color:var(--brick);}
  .pc textarea{resize:vertical;min-height:84px;}
  .pc .two{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .pc .hint{font-size:13px;color:var(--inkMute);line-height:1.45;margin:0;}
  .pc aside{position:sticky;top:96px;border:1px solid var(--hair);border-radius:2px;background:var(--paper);padding:20px;display:grid;gap:10px;font-size:14px;color:var(--inkSoft);line-height:1.5;}
  .pc aside h3{margin:0;font-size:16px;font-weight:500;color:var(--ink);}
  .pc aside a{color:var(--ink);}
  .pc .total{display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid var(--hair);padding-top:12px;color:var(--ink);}
  .pc .total b{font-size:20px;font-weight:500;}
  .pc .msg{font-size:13.5px;color:var(--brickDeep);min-height:18px;}
  .pc .ok{border:1px solid var(--hair);background:var(--paper);padding:22px;border-radius:2px;display:grid;gap:12px;justify-items:start;}
  .pc .btn{min-height:44px;}
  @media (max-width:900px){.pc{grid-template-columns:1fr;}.pc aside{position:static;}.pc .two{grid-template-columns:1fr;}}
`

const EMPTY: CheckoutFields = {
  service_key: '', street: '', unit: '', city: 'Toronto', sqft: '', move_kind: 'move_out', move_date: '', preferred_date: '',
  contact_name: '', contact_email: '', contact_phone: '', site_contact_phone: '', access_notes: '',
}

export default function PropertyCheckoutForm({ onRequest }: { onRequest: () => void }) {
  const params = useSearchParams()
  const q = params.get('for')
  const [kind, setKind] = useState<PropertyClient>(isPropertyClient(q) ? q : 'property_manager')
  const keys = ONE_OFFS_FOR[kind]
  const presetKey = params.get('service')
  const [f, setF] = useState<CheckoutFields>(() => ({ ...EMPTY, service_key: presetKey && keys.includes(presetKey) ? presetKey : keys[0] }))
  const [company, setCompany] = useState('')
  const [busy, setBusy] = useState(false)
  const [embedded, setEmbedded] = useState<EmbeddedSession | null>(null)
  const [msg, setMsg] = useState('')
  const today = useMemo(torontoToday, [])
  // Booking coverage (Kam 2026-11-14): checked before checkout; the API re-checks.
  const [notCoveredKey, setNotCoveredKey] = useState('')
  const covInput: CoverageInput = { address: [f.street.trim(), f.city.trim()].filter(Boolean).join(', '), flow: 'property' }
  const notCovered = !!notCoveredKey && notCoveredKey === coverageKey(covInput)
  const s = ONE_OFFS[f.service_key]
  const set = (k: keyof CheckoutFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const v = e.target.value
    setF((x) => {
      const n = { ...x, [k]: v }
      if (k === 'sqft' && ONE_OFFS[x.service_key]?.maxSqft) { const t = tierForSqft(v); if (t) n.service_key = t }
      if (k === 'service_key' && ONE_OFFS[v]?.move && !ONE_OFFS[v].move!.includes(x.move_kind as 'move_in')) n.move_kind = ONE_OFFS[v].move![0]
      return n
    })
    setMsg('')
  }

  if (params.get('paid') === '1') {
    return (
      <div className="pc" style={{ gridTemplateColumns: '1fr' }}>
        <style>{css}</style>
        <div className="ok" data-testid="property-paid">
          <h2 style={{ margin: 0 }}>Payment received.</h2>
          <p className="hint" style={{ fontSize: 15 }}>We confirm the time with your contact The visit and its files are kept under the property in your Bricks account.</p>
          <a className="btn btn-sec" href={signupUrl(kind)}>Set up your account</a>
        </div>
      </div>
    )
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const err = checkCheckout(f, today)
    if (err) { setMsg(err); return }
    setBusy(true)
    setMsg('')
    const cov = await checkCoverage(covInput)
    if (cov.status !== 'covered') {
      setBusy(false)
      if (cov.status === 'not_covered') setNotCoveredKey(coverageKey(covInput))
      else setMsg(cov.message)
      return
    }
    try {
      const r = await fetch('/api/book/property-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(checkoutBody(kind, { ...f, company })) })
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; url?: string; error?: string; code?: string }
      if (isNotCoveredCode(j.code)) { setNotCoveredKey(coverageKey(covInput)); return }
      if (j.code === UNAVAILABLE_CODE) { setMsg(j.error || 'We couldn’t confirm coverage for this address. Please try again in a moment.'); return }
      // Not configured on this deploy (no key, or the API has no checkout yet): fall back to the request form.
      if (r.status === 503 || r.status === 404 || r.status === 405) { onRequest(); return }
      const emb = embeddedFrom(j)
      if (r.ok && emb) { setEmbedded(emb); return } // same page when the booking service supports it
      if (!r.ok || !j.url) { setMsg(j.error || 'Checkout failed. Email help@brxs.ca.'); return }
      window.location.assign(j.url)
    } catch {
      setMsg('Network error. Please email help@brxs.ca.')
    } finally {
      setBusy(false)
    }
  }

  const unitWord = s?.scope === 'space' ? 'Suite' : 'Unit'
  const minDate = addDays(today, s?.drone ? 2 : 1)

  return (
    <div className="pc">
      <style>{css}</style>
      <form onSubmit={submit} noValidate data-testid="property-checkout-form">
        <fieldset>
          <legend>What you need</legend>
          <div className="two">
            <div>
              <label className="f" htmlFor="pc-kind">Account</label>
              <select id="pc-kind" value={kind} onChange={(e) => { const k = e.target.value as PropertyClient; setKind(k); setF((x) => ({ ...x, service_key: ONE_OFFS_FOR[k][0] })); setMsg('') }}>
                {TYPES.map((t) => <option key={t} value={t}>{CLIENT_LABEL[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="f" htmlFor="pc-service">Service</label>
              <select id="pc-service" data-testid="pc-service" value={f.service_key} onChange={set('service_key')}>
                {keys.map((k) => <option key={k} value={k}>{`${ONE_OFFS[k].name} · ${money(ONE_OFFS[k].cents)}`}</option>)}
              </select>
            </div>
          </div>
          {s && <p className="hint">{s.what}</p>}
          {s?.move && (
            <div className="two">
              <div>
                <label className="f" htmlFor="pc-move">Report for</label>
                <select id="pc-move" value={f.move_kind} onChange={set('move_kind')} disabled={s.move.length < 2}>
                  {s.move.map((m) => <option key={m} value={m}>{m === 'move_in' ? 'Move-in' : 'Move-out'}</option>)}
                </select>
              </div>
              <div><label className="f" htmlFor="pc-move-date">{f.move_kind === 'move_in' ? 'Move-in date' : 'Move-out date'}</label><input id="pc-move-date" type="date" value={f.move_date} onChange={set('move_date')} /></div>
            </div>
          )}
          {s?.move && <p className="hint">{f.move_kind === 'move_in' ? 'Shot up to two weeks before the move-in, while the unit is empty.' : 'Shot up to two weeks after the move-out.'}</p>}
        </fieldset>
        <fieldset>
          <legend>The property</legend>
          <div><label className="f" htmlFor="pc-street">Street address</label><input id="pc-street" type="text" autoComplete="address-line1" value={f.street} onChange={set('street')} /></div>
          <div className="two">
            {s && (s.scope === 'unit' || s.scope === 'space')
              ? <div><label className="f" htmlFor="pc-unit">{unitWord}</label><input id="pc-unit" type="text" value={f.unit} onChange={set('unit')} /></div>
              : null}
            <div><label className="f" htmlFor="pc-city">City</label><input id="pc-city" type="text" autoComplete="address-level2" value={f.city} onChange={set('city')} /></div>
          </div>
          {s?.maxSqft ? <div><label className="f" htmlFor="pc-sqft">Space size in sq ft</label><input id="pc-sqft" type="text" inputMode="numeric" value={f.sqft} onChange={set('sqft')} /></div> : null}
          <div>
            <label className="f" htmlFor="pc-date">Visit date</label>
            <input id="pc-date" type="date" min={minDate} max={addDays(today, 180)} value={f.preferred_date} onChange={set('preferred_date')} />
            <p className="hint" style={{ marginTop: 6 }}>We confirm the time with your contact.{s?.drone ? ' Flown visits need two days to clear airspace.' : ''}</p>
          </div>
          <div><label className="f" htmlFor="pc-site-phone">Who lets us in</label><input id="pc-site-phone" type="tel" placeholder="Phone number" value={f.site_contact_phone} onChange={set('site_contact_phone')} /></div>
          <div><textarea aria-label="Access notes" placeholder="Lockbox, concierge, tenant notice" value={f.access_notes} onChange={set('access_notes')} /></div>
        </fieldset>
        <fieldset>
          <legend>You</legend>
          <div className="two">
            <div><label className="f" htmlFor="pc-name">Name</label><input id="pc-name" type="text" autoComplete="name" value={f.contact_name} onChange={set('contact_name')} /></div>
            <div><label className="f" htmlFor="pc-company">Company (optional)</label><input id="pc-company" type="text" autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} /></div>
          </div>
          <div className="two">
            <div><label className="f" htmlFor="pc-email">Email</label><input id="pc-email" type="email" autoComplete="email" value={f.contact_email} onChange={set('contact_email')} /></div>
            <div><label className="f" htmlFor="pc-phone">Phone (optional)</label><input id="pc-phone" type="tel" autoComplete="tel" value={f.contact_phone} onChange={set('contact_phone')} /></div>
          </div>
        </fieldset>
        {s && <div className="total"><span className="hint">Plus HST.</span><b data-testid="pc-total">{money(s.cents)}</b></div>}
        <div className="msg" role="alert">{msg}</div>
        {embedded ? <EmbeddedPay session={embedded} onBack={() => setEmbedded(null)} note="" /> : (<>
        {notCovered ? <NotInArea input={covInput} email={f.contact_email} /> : <button className="btn btn-night btn-primary" type="submit" disabled={busy}>{busy ? 'Opening checkout…' : 'Continue to payment'}</button>}
        <p className="hint">Secure checkout by Stripe.</p>
        </>)}
      </form>
      <aside>
        <h3>How it works</h3>
        <p style={{ margin: 0 }}>Pay for one visit here. We confirm the time with your contact, and the files are dated and kept under the property.</p>
        <p style={{ margin: 0 }}>REITs with 10 or more properties get 10% off every visit, and 15% off at 25, when booked from the Bricks account.</p>
        <p style={{ margin: 0 }}>Need a monthly plan, a space over 20,000 sq ft or several properties at once? <button type="button" onClick={onRequest} style={{ all: 'unset', cursor: 'pointer', textDecoration: 'underline', color: 'var(--ink)' }}>Send a request</button>.</p>
        {kind !== 'property_manager' && <p style={{ margin: 0 }}>Building something? <Link href="/book/site">Book site progress</Link>.</p>}
      </aside>
    </div>
  )
}
