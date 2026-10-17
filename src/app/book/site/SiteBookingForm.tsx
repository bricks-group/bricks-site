'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { track } from '@vercel/analytics'
import BricksLoader from '@/components/BricksLoader'
import { PER_VISIT, PLANS, fmt } from '@/lib/commercial'

type TrackProps = Record<string, string | number | boolean | null | undefined>
function evt(name: string, props?: TrackProps) {
  try { track(name, props) } catch { /* analytics is best-effort */ }
}

const HST = 0.13
const SETUP = PER_VISIT.find((x) => x.key === 'setup')!.price
const VISUAL = PER_VISIT.find((x) => x.key === 'visual')!.price
const MAPPED = PER_VISIT.find((x) => x.key === 'mapped')!.price
const CADENCES = [
  { key: 'monthly', label: 'Monthly', row: 'Monthly' },
  { key: 'biweekly', label: 'Every two weeks', row: 'Every two weeks' },
  { key: 'weekly', label: 'Weekly', row: 'Weekly' },
] as const

function minDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 2)
  return d.toLocaleDateString('en-CA')
}

const css = `
  .sb{display:grid;grid-template-columns:1.25fr .75fr;gap:40px;align-items:start;margin-top:12px;}
  .sb form{display:grid;gap:18px;}
  .sb fieldset{border:1px solid var(--hair);border-radius:2px;padding:18px 18px 20px;margin:0;display:grid;gap:14px;background:var(--paper);}
  .sb legend{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--inkMute);padding:0 6px;}
  .sb label.f{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--inkMute);display:block;margin-bottom:6px;}
  .sb input[type=text],.sb input[type=email],.sb input[type=tel],.sb input[type=date],.sb select,.sb textarea{width:100%;font-family:'General Sans',sans-serif;font-size:15px;color:var(--ink);background:var(--paperDeep);border:1px solid var(--hairStrong);border-radius:2px;padding:11px 13px;outline:none;}
  .sb input:focus,.sb select:focus,.sb textarea:focus{border-color:var(--brick);}
  .sb textarea{resize:vertical;min-height:84px;}
  .sb .two{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .sb .seg{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;border:1px solid var(--hairStrong);border-radius:2px;overflow:hidden;}
  .sb .seg button{font:inherit;font-size:14px;padding:10px 12px;border:0;background:transparent;color:var(--inkSoft);cursor:pointer;}
  .sb .seg button+button{border-left:1px solid var(--hairStrong);}
  .sb .seg button[aria-pressed=true]{background:var(--ink);color:var(--paper);}
  .sb .opt{display:flex;gap:10px;align-items:flex-start;font-size:14px;color:var(--inkSoft);line-height:1.45;cursor:pointer;}
  .sb .opt input{margin-top:3px;accent-color:var(--brick);}
  .sb .opt b{color:var(--ink);font-weight:500;}
  .sb .hint{font-size:12.5px;color:var(--inkMute);line-height:1.45;margin:0;}
  .sb aside{position:sticky;top:96px;border:1px solid var(--hair);border-radius:2px;background:var(--paper);padding:20px;display:grid;gap:10px;}
  .sb aside .row{display:flex;justify-content:space-between;gap:12px;font-size:14px;color:var(--inkSoft);}
  .sb aside .tot{border-top:1px solid var(--hair);padding-top:10px;font-weight:500;color:var(--ink);font-size:16px;}
  .sb .msg{font-size:13.5px;color:var(--brickDeep);min-height:18px;}
  .sb .ok{border:1px solid var(--hair);background:var(--paper);padding:22px;border-radius:2px;}
  @media (max-width:900px){.sb{grid-template-columns:1fr;}.sb aside{position:static;}.sb .two{grid-template-columns:1fr;}}
`

export default function SiteBookingForm() {
  const params = useSearchParams()
  const [mode, setMode] = useState<'one_off' | 'plan'>(params.get('plan') ? 'plan' : 'one_off')
  const [service, setService] = useState<'visual_visit' | 'mapped_visit'>(params.get('service') === 'mapped' ? 'mapped_visit' : 'visual_visit')
  const [firstMapped, setFirstMapped] = useState(true)
  const [planKind, setPlanKind] = useState<'visual' | 'mapped'>(params.get('plan') === 'mapped' ? 'mapped' : 'visual')
  const [cadence, setCadence] = useState<'monthly' | 'biweekly' | 'weekly'>('monthly')
  const [ins, setIns] = useState('2000000')
  const [rpas, setRpas] = useState(true)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [paid, setPaid] = useState<'checking' | 'ok' | 'fail' | null>(null)

  useEffect(() => {
    const sid = params.get('session_id') || ''
    if (params.get('paid') !== '1' || !sid.startsWith('cs_')) return
    setPaid('checking')
    fetch('/api/confirm-paid', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id: sid }) })
      .then((r) => r.json().then((j) => ({ r, j })))
      .then(({ r, j }) => { setPaid(r.ok && j?.ok ? 'ok' : 'fail'); if (r.ok) evt('site_booking_paid', { commercial: true }) })
      .catch(() => setPaid('fail'))
  }, [params])

  const quote = useMemo(() => {
    const lines: Array<[string, number]> = []
    let recurring = 0
    if (mode === 'one_off') {
      const mapped = service === 'mapped_visit'
      lines.push([mapped ? 'Mapped capture' : 'Progress visit', mapped ? MAPPED : VISUAL])
      if (mapped && firstMapped) lines.push(['First mapped setup', SETUP])
    } else {
      const plan = PLANS.find((p) => p.kind.toLowerCase() === planKind)!
      const row = plan.rows.find((r) => r.cadence === CADENCES.find((c) => c.key === cadence)!.row)!
      recurring = row.price
      lines.push([`${plan.kind} · ${row.cadence.toLowerCase()} (${row.visits} visit${row.visits === 1 ? '' : 's'}/mo)`, row.price])
      if (planKind === 'mapped') lines.push(['First mapped setup (first invoice)', SETUP])
    }
    const sub = lines.reduce((a, [, v]) => a + v, 0)
    const tax = Math.round(sub * HST * 100) / 100
    return { lines, sub, tax, total: sub + tax, recurring }
  }, [mode, service, firstMapped, planKind, cadence])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = e.currentTarget
    const v = (n: string) => ((f.elements.namedItem(n) as HTMLInputElement | null)?.value || '').trim()
    const payload: Record<string, unknown> = {
      mode,
      site_address: v('site_address'), company: v('company'), contact_name: v('contact_name'),
      contact_email: v('contact_email'), contact_phone: v('contact_phone'), site_contact_name: v('site_contact_name'),
      site_contact_phone: v('site_contact_phone'), access_notes: v('access_notes'), preferred_date: v('preferred_date'),
      min_insurance_cad: Number(ins), requires_rpas_advanced: rpas,
    }
    if (mode === 'one_off') { payload.service_key = service; payload.mapped_setup = service === 'mapped_visit' && firstMapped }
    else payload.plan_key = `${planKind}_${cadence}`
    setBusy(true)
    setMsg('')
    try {
      const r = await fetch('/api/book/commercial-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; url?: string; error?: string }
      if (!r.ok || !j.ok || !j.url) { setMsg(j.error || 'Could not start checkout. Email booking@brxs.ca.'); return }
      evt('site_booking_checkout', { mode, service: String(payload.service_key || payload.plan_key) })
      window.location.href = j.url
    } catch {
      setMsg('Network error. Please email booking@brxs.ca.')
    } finally {
      setBusy(false)
    }
  }

  if (paid) {
    return (
      <div className="sb" style={{ gridTemplateColumns: '1fr' }}>
        <div className="ok">
          {paid === 'checking' && <p><BricksLoader variant="cycle" size={16} color="currentColor" style={{ marginRight: 8 }} />Confirming your payment…</p>}
          {paid === 'ok' && (<>
            <h2 style={{ margin: '0 0 8px' }}>Booked. Thank you.</h2>
            <p className="hint" style={{ fontSize: 15 }}>We&apos;re assigning a pilot who meets your insurance minimum and will confirm the flight with your site contact. Questions: booking@brxs.ca.</p>
          </>)}
          {paid === 'fail' && <p>We could not confirm the payment yet. If you were charged, your booking is safe; email booking@brxs.ca and we will confirm it.</p>}
        </div>
        <style>{css}</style>
      </div>
    )
  }

  return (
    <div className="sb">
      <form onSubmit={submit}>
        <div className="seg" role="group" aria-label="Booking type">
          <button type="button" aria-pressed={mode === 'one_off'} onClick={() => setMode('one_off')}>One visit</button>
          <button type="button" aria-pressed={mode === 'plan'} onClick={() => setMode('plan')}>Monthly plan</button>
        </div>

        {mode === 'one_off' ? (
          <fieldset>
            <legend>What to capture</legend>
            <label className="opt"><input type="radio" name="svc" checked={service === 'visual_visit'} onChange={() => setService('visual_visit')} /><span><b>Progress visit · {fmt(VISUAL)}</b><br />Drone photos and video, dated by visit.</span></label>
            <label className="opt"><input type="radio" name="svc" checked={service === 'mapped_visit'} onChange={() => setService('mapped_visit')} /><span><b>Mapped capture · {fmt(MAPPED)}</b><br />Orthomosaic, 3D model and site map.</span></label>
            {service === 'mapped_visit' && (
              <label className="opt"><input type="checkbox" checked={firstMapped} onChange={(e) => setFirstMapped(e.target.checked)} /><span>First mapped capture on this site (+{fmt(SETUP)} ground-control setup). Untick if Bricks has mapped it before.</span></label>
            )}
          </fieldset>
        ) : (
          <fieldset>
            <legend>Plan</legend>
            <div className="seg" role="group" aria-label="Plan type">
              <button type="button" aria-pressed={planKind === 'visual'} onClick={() => setPlanKind('visual')}>Visual</button>
              <button type="button" aria-pressed={planKind === 'mapped'} onClick={() => setPlanKind('mapped')}>Mapped</button>
            </div>
            <div className="seg" role="group" aria-label="Cadence">
              {CADENCES.map((c) => (
                <button key={c.key} type="button" aria-pressed={cadence === c.key} onClick={() => setCadence(c.key)}>{c.label}</button>
              ))}
            </div>
            <p className="hint">Billed monthly per site, month to month. To change or cancel, email booking@brxs.ca.</p>
          </fieldset>
        )}

        <fieldset>
          <legend>Site</legend>
          <div><label className="f" htmlFor="sbAddr">Site address</label><input type="text" id="sbAddr" name="site_address" placeholder="Street address or nearest intersection, city" required minLength={6} /></div>
          <div className="two">
            <div><label className="f" htmlFor="sbDate">{mode === 'plan' ? 'First visit date' : 'Preferred date'}</label><input type="date" id="sbDate" name="preferred_date" min={minDate()} required /></div>
            <div><label className="f" htmlFor="sbCo">Company</label><input type="text" id="sbCo" name="company" placeholder="Builder / developer / GC" /></div>
          </div>
          <div className="two">
            <div><label className="f" htmlFor="sbScn">Site contact</label><input type="text" id="sbScn" name="site_contact_name" placeholder="Super or site lead" required /></div>
            <div><label className="f" htmlFor="sbScp">Site contact phone</label><input type="tel" id="sbScp" name="site_contact_phone" required /></div>
          </div>
          <div><label className="f" htmlFor="sbAcc">Access notes</label><textarea id="sbAcc" name="access_notes" maxLength={450} placeholder="Gate, sign-in, PPE, crane times, areas to avoid" /></div>
        </fieldset>

        <fieldset>
          <legend>Requirements</legend>
          <div><label className="f" htmlFor="sbIns">Pilot liability insurance minimum</label>
            <select id="sbIns" value={ins} onChange={(e) => setIns(e.target.value)}>
              <option value="2000000">$2,000,000 (standard)</option>
              <option value="5000000">$5,000,000 (e.g. CCDC 41)</option>
            </select>
          </div>
          <label className="opt"><input type="checkbox" checked={rpas} onChange={(e) => setRpas(e.target.checked)} /><span><b>Advanced RPAS required</b><br />Leave on unless the site is outside controlled airspace and away from people.</span></label>
        </fieldset>

        <fieldset>
          <legend>You</legend>
          <div className="two">
            <div><label className="f" htmlFor="sbName">Name</label><input type="text" id="sbName" name="contact_name" required /></div>
            <div><label className="f" htmlFor="sbEmail">Email</label><input type="email" id="sbEmail" name="contact_email" required /></div>
          </div>
          <div><label className="f" htmlFor="sbPhone">Phone</label><input type="tel" id="sbPhone" name="contact_phone" placeholder="Optional" /></div>
        </fieldset>

        <div className="cta-row">
          <button type="submit" className="btn btn-brick" disabled={busy}>{busy && <BricksLoader variant="cycle" size={16} color="currentColor" style={{ marginRight: 8 }} />}{busy ? 'Opening checkout…' : 'Continue to payment'}</button>
          <a className="btn btn-sec" href="/builders#quote">Talk to us instead</a>
        </div>
        <div className="msg" role="status">{msg}</div>
      </form>

      <aside aria-label="Summary">
        <span className="over">{mode === 'plan' ? 'First invoice' : 'Total'}</span>
        {quote.lines.map(([k, val]) => (<div key={k} className="row"><span>{k}</span><span>{fmt(val)}</span></div>))}
        <div className="row"><span>HST (13%)</span><span>${quote.tax.toFixed(2)}</span></div>
        <div className="row tot"><span>Total</span><span>${quote.total.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
        {mode === 'plan' && <p className="hint">Then {fmt(quote.recurring)} + HST per month.</p>}
        <p className="hint">CAD. Survey-grade work is quoted separately.</p>
      </aside>
      <style>{css}</style>
    </div>
  )
}
