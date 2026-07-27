'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const SUPABASE = 'https://ctqwxwrcxwruaqojohpf.supabase.co/functions/v1/'
const ANON = 'sb_publishable_dsC8pvo5X9ZVZGbkaotrGQ_VhRINFod'

type Quote = {
  total: number
  sqft: number | null
  footprint_label: string
  distance_km: number | null
  sqft_source?: string
  photo_rate: number
  drone_rate: number
  drone_included?: boolean
  floor_plan_included?: boolean
  travel_km_billable: number
  travel_per_km: number
  travel_fee: number
  addons: { label: string; amount: number }[]
  subtotal: number
  hst: number
  sqft_estimated?: boolean
  lat?: number | null
  lon?: number | null
}

type Slot = { start: string; end: string }

const PKG_DEFS: Record<string, { drone: boolean; reel: boolean; tour: boolean; twilight: boolean }> = {
  photosOnly: { drone: false, reel: false, tour: false, twilight: false },
  essentials: { drone: true, reel: false, tour: false, twilight: false },
  story: { drone: true, reel: true, tour: false, twilight: false },
  showcase: { drone: true, reel: true, tour: true, twilight: false },
  suite: { drone: true, reel: true, tour: true, twilight: true },
}
const PKG_LABEL: Record<string, string> = { photosOnly: 'Photos only', essentials: 'Essentials', story: 'Story', showcase: 'Showcase', suite: 'Full suite' }
const PKG_DESC: Record<string, string> = {
  photosOnly: 'HDR photo only — no drone, no floor plan',
  essentials: 'Photo · drone · floor plan',
  story: '+ cinematic reel',
  showcase: '+ reel + 3D tour',
  suite: '+ reel + tour + twilight + staging',
}

function esc(s: string) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c))
}

export default function BookingWizard() {
  const [step, setStep] = useState<number | 'done'>(0)
  const [errs, setErrs] = useState<Record<number, string>>({})

  // step 0 fields
  const [name, setName] = useState('')
  const [brokerage, setBrokerage] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [addr, setAddr] = useState('')
  const [selectedAddr, setSelectedAddr] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [suggestions, setSuggestions] = useState<{ display_name: string }[]>([])
  const [showSuggest, setShowSuggest] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suggestBoxRef = useRef<HTMLDivElement>(null)
  const addrInputRef = useRef<HTMLInputElement>(null)

  // step 1 fields
  const [drone, setDrone] = useState(true)
  const [reel, setReel] = useState(false)
  const [tour, setTour] = useState(false)
  const [twilight, setTwilight] = useState(false)
  const [staging, setStaging] = useState(false)
  const [rush, setRush] = useState(false)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteError, setQuoteError] = useState('')
  const [sqftInput, setSqftInput] = useState('')

  // step 2 fields
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [slots, setSlots] = useState<Slot[] | null>(null)
  const [slotMsg, setSlotMsg] = useState('Pick a date above to see real available times.')
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  // step 3 / pay
  const [paying, setPaying] = useState(false)
  const [doneTitle, setDoneTitle] = useState('Payment started.')
  const [doneMsg, setDoneMsg] = useState('Redirecting to secure checkout…')
  const [scheduleCtaVisible, setScheduleCtaVisible] = useState(false)

  // ---- post-payment confirmation (?paid=1) ----
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('paid') !== '1') return
    setStep('done')
    setDoneTitle('Payment confirmed')
    setDoneMsg('Your shoot is paid and booked.')
    setScheduleCtaVisible(true)
  }, [])

  // ---- address autocomplete (Nominatim) ----
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const q = addr.trim()
    if (q.length < 4) { setShowSuggest(false); return }
    debounceRef.current = setTimeout(() => {
      fetch(
        'https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(q) +
        '&format=json&limit=5&addressdetails=0&countrycodes=ca&viewbox=-95.2,56.9,-74.3,41.6&bounded=1&dedupe=1',
        { headers: { 'User-Agent': 'BricksPreLaunch/1.0 (booking@brxs.ca)' } }
      )
        .then((r) => r.json())
        .then((j: { display_name: string }[]) => {
          if (!Array.isArray(j) || !j.length) { setShowSuggest(false); return }
          const ca = j.filter((o) => /Canada/i.test(o.display_name))
          ca.sort((a, b) => (/Ontario/i.test(b.display_name) ? 1 : 0) - (/Ontario/i.test(a.display_name) ? 1 : 0))
          if (!ca.length) { setShowSuggest(false); return }
          setSuggestions(ca)
          setShowSuggest(true)
        })
        .catch(() => setShowSuggest(false))
    }, 350)
  }, [addr])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as HTMLElement
      if (suggestBoxRef.current?.contains(t) || t === addrInputRef.current) return
      setShowSuggest(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  function pickSuggestion(displayName: string) {
    setAddr(displayName)
    setSelectedAddr(displayName)
    setShowSuggest(false)
  }

  // ---- package presets ----
  function matchedPackage(): string | null {
    for (const k of Object.keys(PKG_DEFS)) {
      const d = PKG_DEFS[k]
      if (d.drone === drone && d.reel === reel && d.tour === tour && d.twilight === twilight) return k
    }
    return null
  }

  function applyPackage(key: string) {
    const def = PKG_DEFS[key]
    setDrone(def.drone); setReel(def.reel); setTour(def.tour); setTwilight(def.twilight)
  }

  // ---- quote ----
  function fetchQuote(manualSqft?: number | null) {
    setQuoteError('')
    setQuoteLoading(true)
    const payload: Record<string, unknown> = {
      address: selectedAddr || addr.trim(),
      property_type: propertyType,
      drone_addon: drone,
      reel_addon: reel,
      tour_addon: tour,
      twilight_addon: twilight,
      rush_addon: rush,
    }
    if (manualSqft) payload.sqft = manualSqft
    fetch(SUPABASE + 'quote', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: ANON }, body: JSON.stringify(payload) })
      .then((r) => r.json().then((j) => ({ ok: r.ok && j.ok, j })))
      .then((res) => {
        setQuoteLoading(false)
        if (!res.ok) { setQuote(null); setQuoteError("We couldn't auto-price this address. Enter the square footage above and hit Re-quote, or email booking@brxs.ca."); return }
        setQuote(res.j.quote)
      })
      .catch(() => { setQuoteLoading(false); setQuote(null); setQuoteError('Network hiccup pricing this address — check your connection and try again.') })
  }

  // re-fetch quote whenever add-ons change, once a quote already exists (matches original behavior)
  const firstAddonRun = useRef(true)
  useEffect(() => {
    if (firstAddonRun.current) { firstAddonRun.current = false; return }
    if (quote) fetchQuote()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drone, reel, tour, twilight, rush])

  // ---- slots ----
  function fetchSlots(d: string) {
    setSelectedSlot(null)
    if (!d) { setSlots(null); setSlotMsg('Pick a date above to see real available times.'); return }
    setSlots(null)
    setSlotMsg('Checking live availability…')
    let geoQS = ''
    if (quote && quote.lat != null && quote.lon != null) {
      geoQS = '&lat=' + encodeURIComponent(quote.lat) + '&lon=' + encodeURIComponent(quote.lon)
    }
    fetch(SUPABASE + 'cal-slots?date=' + encodeURIComponent(d) + geoQS, { headers: { apikey: ANON } })
      .then((r) => r.json())
      .then((j: { ok: boolean; slots?: Slot[] }) => {
        if (!j.ok) { setSlotMsg("Couldn't load times for this date — try another, or email booking@brxs.ca."); return }
        if (!j.slots || !j.slots.length) { setSlotMsg('No open times that day — try another date.'); return }
        setSlots(j.slots)
      })
      .catch(() => setSlotMsg('Network hiccup loading times — try again.'))
  }

  function formatSlot(s: Slot) {
    const d = new Date(s.start)
    const day = d.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/Toronto' })
    const t = d.toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Toronto' })
    return day + ' · ' + t
  }

  function servicesSummary() {
    const pkg = matchedPackage()
    const parts = ['HDR photo']
    if (drone) parts.push('Drone')
    if (reel) parts.push('Cinematic reel')
    if (tour) parts.push('3D tour')
    if (twilight) parts.push('Twilight')
    if (rush) parts.push('Rush')
    const base = parts.join(' + ')
    return pkg ? PKG_LABEL[pkg] + ' — ' + base : base
  }

  // ---- validation / navigation ----
  function validate(s: number): boolean {
    let msg = ''
    if (s === 0) {
      if (!name.trim()) msg = 'Agent name required.'
      else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) msg = 'Valid email required.'
      else if (!phone.trim()) msg = 'Phone required.'
      else if (!brokerage.trim()) msg = 'Brokerage required.'
      else if (!addr.trim()) msg = 'Property address required.'
    }
    if (s === 1) {
      if (!quote) msg = 'Quote still calculating — give it a moment.'
    }
    if (s === 2) {
      if (!date) msg = 'Pick a shoot date.'
      else if (!selectedSlot) msg = 'Pick a real time slot above.'
    }
    setErrs((e) => ({ ...e, [s]: msg }))
    return !msg
  }

  function goNext(s: number) {
    if (validate(s)) {
      const next = s + 1
      setStep(next)
      if (next === 1) fetchQuote()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  function goPrev(s: number) {
    setStep(s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ---- pay ----
  function pay() {
    if (!quote) { setErrs((e) => ({ ...e, 3: 'Quote missing — go back to step 2.' })); return }
    setErrs((e) => ({ ...e, 3: '' }))
    setPaying(true)
    try {
      sessionStorage.setItem('bricks_booking', JSON.stringify({ name: name.trim(), email: email.trim(), addr: selectedAddr || addr.trim(), notes: notes.trim() }))
    } catch {}
    const payload = {
      quote,
      agent_name: name.trim(),
      email: email.trim(),
      brokerage: brokerage.trim() || null,
      phone: phone.trim() || null,
      property_address: selectedAddr || addr.trim(),
      property_type: propertyType,
      package_interest: servicesSummary(),
      sqft: quote.sqft || null,
      preferred_date: date,
      selected_slot_start: selectedSlot ? selectedSlot.start : null,
      selected_slot_end: selectedSlot ? selectedSlot.end : null,
      drone_addon: drone,
      reel_addon: reel,
      tour_addon: tour,
      twilight_addon: twilight,
      rush_addon: rush,
      notes: notes.trim() || null,
    }
    fetch(SUPABASE + 'create-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: ANON }, body: JSON.stringify(payload) })
      .then((r) => r.json().then((j) => ({ ok: r.ok && j.ok, j })))
      .then((res) => {
        if (!res.ok) { setErrs((e) => ({ ...e, 3: 'Checkout failed: ' + (res.j.error || 'try again') })); setPaying(false); return }
        setDoneTitle('Redirecting to secure checkout…')
        window.location.href = res.j.url
      })
      .catch(() => { setErrs((e) => ({ ...e, 3: 'Network error starting checkout.' })); setPaying(false) })
  }

  function QuoteBlock({ q, editable }: { q: Quote; editable: boolean }) {
    return (
      <>
        <div className="qhead"><div className="qhead-l">Your tailored quote</div><div className="qhead-t">${q.total.toFixed(2)} <span>CAD · incl. HST</span></div></div>
        <div className="qmeta">{q.sqft ? q.sqft.toLocaleString() + ' sqft' : 'sqft n/a'} · {q.footprint_label}{q.distance_km != null ? ' · ' + q.distance_km + ' km from base' : ''}{q.sqft_source ? ' · ' + q.sqft_source : ''}</div>
        <div className="qlines">
          <div className="qrow"><span className="qk">HDR photography</span><span className="qv">${q.photo_rate.toFixed(2)}</span></div>
          {q.drone_included !== false ? (
            <div className="qrow"><span className="qk">Licensed drone</span><span className="qv">${q.drone_rate.toFixed(2)}</span></div>
          ) : (
            <div className="qrow"><span className="qk">Licensed drone <em>not included — Photos only</em></span><span className="qv">$0.00</span></div>
          )}
          <div className="qrow"><span className="qk">Travel ({q.distance_km} km) <em>{q.travel_km_billable > 0 ? `$${q.travel_per_km}/km after 25 km free` : 'first 25 km free'}</em></span><span className="qv">${q.travel_fee.toFixed(2)}</span></div>
          {q.addons.map((a) => (
            <div key={a.label} className="qrow"><span className="qk">{a.label}</span><span className="qv">${a.amount.toFixed(2)}</span></div>
          ))}
          <div className="qrow"><span className="qk">Subtotal</span><span className="qv">${q.subtotal.toFixed(2)}</span></div>
          <div className="qrow"><span className="qk">HST (13%)</span><span className="qv">${q.hst.toFixed(2)}</span></div>
        </div>
        {editable && (
          <div className="sqft-edit">
            <input type="number" placeholder="sqft" value={sqftInput} onChange={(e) => setSqftInput(e.target.value)} />
            <button type="button" onClick={() => fetchQuote(sqftInput ? parseInt(sqftInput, 10) : null)}>Re-quote</button>
          </div>
        )}
        {q.floor_plan_included === false && <div className="qnote">Photos only: no floor plan drafted for this booking.</div>}
        {q.sqft_estimated && <div className="qnote">⚠ Sqft estimated from footprint — confirm above for an exact quote. Final invoice reflects actual scope.</div>}
      </>
    )
  }

  const pkg = matchedPackage()

  return (
    <>
      <div className="wrap">
        <section className="hero">
          <h1>Book a shoot.</h1>
          <p className="sub">Four steps. We price it live from the address — footprint, travel, add-ons, HST — you pay to lock the slot. Scheduling syncs to our calendar instantly.</p>
        </section>

        <div className="steps">
          {[
            { n: '1', label: 'Shoot' },
            { n: '2', label: 'Services' },
            { n: '3', label: 'Schedule' },
            { n: '4', label: 'Pay' },
          ].map((t, i) => (
            <div key={i} className={`step-tab${step === i ? ' active' : ''}${typeof step === 'number' && step > i ? ' done' : ''}`}>
              <span className="n">{t.n}</span>{t.label}
            </div>
          ))}
        </div>

        {step !== 'done' && (
          <form onSubmit={(e) => e.preventDefault()}>
            {/* STEP 1: SHOOT */}
            <div className={`panel${step === 0 ? ' active' : ''}`}>
              <h2>What are we shooting?</h2>
              <p className="hint">Tell us about the listing and who&apos;s booking. Start typing the address for suggestions.</p>
              <div className="grid2">
                <div className="field"><label>Listing agent name <span className="req">*</span></label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Agent" /></div>
                <div className="field"><label>Brokerage <span className="req">*</span></label><input value={brokerage} onChange={(e) => setBrokerage(e.target.value)} placeholder="e.g. Your brokerage" /></div>
              </div>
              <div className="grid2">
                <div className="field"><label>Email <span className="req">*</span></label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@brokerage.com" /></div>
                <div className="field"><label>Phone <span className="req">*</span></label><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="416-..." /></div>
              </div>
              <div className="field">
                <label>Property address <span className="req">*</span></label>
                <input ref={addrInputRef} value={addr} onChange={(e) => { setAddr(e.target.value); setSelectedAddr('') }} placeholder="123 Main St, Mississauga" autoComplete="off" />
                {showSuggest && suggestions.length > 0 && (
                  <div className="suggest" ref={suggestBoxRef}>
                    {suggestions.map((o) => (
                      <div key={o.display_name} onClick={() => pickSuggestion(o.display_name)}>
                        {o.display_name.split(',').slice(0, 3).join(',')}
                        <div className="muted">{o.display_name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="field">
                <label>Property type</label>
                <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                  <option value="">Not sure yet</option>
                  <option>Condo</option><option>Semi / Town</option><option>Detached</option>
                  <option>Multiplex</option><option>Commercial</option><option>Estate</option>
                </select>
                <span className="hint-sm">Optional — helps us size the shoot. We estimate from the footprint either way.</span>
              </div>
              <div className="err">{errs[0]}</div>
              <div className="nav-btns"><span></span><button type="button" className="btn btn-brick" onClick={() => goNext(0)}>Next →</button></div>
            </div>

            {/* STEP 2: SERVICES + QUOTE */}
            <div className={`panel${step === 1 ? ' active' : ''}`}>
              <h2>What do you need shot?</h2>
              <p className="hint">HDR photography is included on every shoot; licensed drone and a floor plan are included on the standard tiers, or drop both for the bare-minimum Photos only option. Pick a bundle, or build à la carte with the checkboxes — see <Link href="/pricing" style={{ color: 'var(--brickDeep)' }}>full pricing</Link>. Every option is quoted live below, priced from the same per-service rates either way.</p>
              <div className="choices">
                {Object.keys(PKG_DEFS).map((k) => (
                  <div key={k} className={`choice${pkg === k ? ' sel' : ''}`} onClick={() => applyPackage(k)}>
                    <div className="t">{PKG_LABEL[k]}</div>
                    <div className="x">{PKG_DESC[k]}</div>
                  </div>
                ))}
              </div>
              <p className="hint-sm" style={{ margin: '-4px 0 14px' }}>Or build à la carte:</p>
              <label className="toggle"><input type="checkbox" checked={reel} onChange={(e) => setReel(e.target.checked)} /> Cinematic reel (+$199–349, by footprint)</label>
              <label className="toggle"><input type="checkbox" checked={tour} onChange={(e) => setTour(e.target.checked)} /> 3D virtual tour (+$149–299, by footprint)</label>
              <label className="toggle"><input type="checkbox" checked={twilight} onChange={(e) => setTwilight(e.target.checked)} /> Twilight photography (+$150–200, by footprint)</label>
              <label className="toggle"><input type="checkbox" checked={staging} onChange={(e) => setStaging(e.target.checked)} /> Virtual staging (+$35 / image staged)</label>
              <label className="toggle"><input type="checkbox" checked={rush} onChange={(e) => setRush(e.target.checked)} /> Rush delivery (+$75)</label>

              <div className="quote">
                {quoteLoading && <div className="qload"><div className="spin"></div><div className="ltxt"><b>Tailoring your quote</b>Measuring footprint · mapping travel · adding tax</div></div>}
                {!quoteLoading && quote && <QuoteBlock q={quote} editable />}
                {!quoteLoading && !quote && quoteError && <div className="qmsg">{quoteError}</div>}
                {!quoteLoading && !quote && !quoteError && <div className="qmsg">Tailoring your quote…</div>}
              </div>
              <div className="err">{errs[1]}</div>
              <div className="nav-btns"><button type="button" className="btn btn-ghost" onClick={() => goPrev(1)}>← Back</button><button type="button" className="btn btn-brick" onClick={() => goNext(1)}>Next →</button></div>
            </div>

            {/* STEP 3: SCHEDULE */}
            <div className={`panel${step === 2 ? ' active' : ''}`}>
              <h2>When?</h2>
              <p className="hint">Pick a real time below — it&apos;s checked live against our calendar and locked the moment you pay.</p>
              <div className="field"><label>Shoot date <span className="req">*</span></label><input type="date" value={date} onChange={(e) => { setDate(e.target.value); fetchSlots(e.target.value) }} /></div>
              <div>
                {slots ? (
                  <div className="slotgrid">
                    {slots.map((s, i) => (
                      <div key={i} className={`slotbtn${selectedSlot === s ? ' sel' : ''}`} onClick={() => { setSelectedSlot(s); setErrs((e) => ({ ...e, 2: '' })) }}>
                        {new Date(s.start).toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Toronto' })}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="slotmsg">{slotMsg}</div>
                )}
              </div>
              <div className="field"><label>Access / staging notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Lockbox code, occupied, staging schedule, deadline…" /></div>
              <div className="err">{errs[2]}</div>
              <div className="nav-btns"><button type="button" className="btn btn-ghost" onClick={() => goPrev(2)}>← Back</button><button type="button" className="btn btn-brick" onClick={() => goNext(2)}>Review →</button></div>
            </div>

            {/* STEP 4: PAY */}
            <div className={`panel${step === 3 ? ' active' : ''}`}>
              <h2>Review &amp; pay.</h2>
              <p className="hint">Confirm details, then pay to lock your slot. Full amount (incl. HST) charged now via Stripe.</p>
              <div className="review">
                {[
                  ['Agent', name.trim() || '—'], ['Brokerage', brokerage.trim() || '—'], ['Email', email.trim() || '—'], ['Phone', phone.trim() || '—'],
                  ['Property', addr.trim() || '—'], ['Type', propertyType || '—'],
                  ['Package', pkg ? PKG_LABEL[pkg] : 'Custom (à la carte)'],
                  ['Licensed drone', drone ? 'Yes' : 'No — Photos only'], ['Floor plan', drone ? 'Yes' : 'No — Photos only'],
                  ['Cinematic reel', reel ? 'Yes' : 'No'], ['3D tour', tour ? 'Yes' : 'No'], ['Twilight', twilight ? 'Yes' : 'No'], ['Rush delivery', rush ? 'Yes' : 'No'],
                  ['Shoot time', selectedSlot ? formatSlot(selectedSlot) : '—'], ['Notes', notes.trim() || '—'],
                ].map(([k, v]) => (
                  <div key={k} className="rrow"><span className="rk">{k}</span><span className="rv">{esc(v)}</span></div>
                ))}
              </div>
              {quote && <div className="quote" style={{ marginTop: 14 }}><QuoteBlock q={quote} editable={false} /></div>}
              <div className="err">{errs[3]}</div>
              <p style={{ fontSize: 11.5, color: 'var(--inkFaint)', marginTop: 2 }}>By paying you agree to our <Link href="/terms" style={{ color: 'var(--brickDeep)' }}>Terms, Cancellation &amp; Refund Policy</Link>.</p>
              <div className="nav-btns"><button type="button" className="btn btn-ghost" onClick={() => goPrev(3)}>← Back</button><button type="button" className="btn btn-brick" disabled={paying} onClick={pay}>{paying ? 'Starting checkout…' : 'Pay & book'}</button></div>
            </div>
          </form>
        )}

        {step === 'done' && (
          <div className="panel active">
            <div className="done-box">
              <h2>{doneTitle}</h2>
              <p>{doneMsg}</p>
              {scheduleCtaVisible && (
                <div style={{ display: 'block', marginTop: 18, padding: 18, border: '1px solid var(--hairStrong)', borderRadius: 2 }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 500, color: 'var(--ink)' }}>Shoot booked ✓</h3>
                  <p style={{ margin: '0 0 14px', fontSize: 14, color: 'var(--inkSoft)' }}>Your slot is locked on our calendar and a confirmation email is on its way.</p>
                </div>
              )}
              <p style={{ marginTop: 14 }}><Link href="/" style={{ color: 'var(--brickDeep)', fontWeight: 500 }}>← Back to overview</Link></p>
            </div>
          </div>
        )}
      </div>

      <div className="wrap">
        <section className="faq-wrap rvl" style={{ padding: '12px 0 40px' }}>
          <div className="faq-head">
            <h2>Before you book.</h2>
            <p>Add-ons, scheduling, and what happens if plans change.</p>
          </div>
          <div className="faq">
            <div className="qa"><h4>What&apos;s included with twilight?</h4><p>Exterior photography shot during blue hour — windows lit, sky still holding color. It&apos;s an optional add-on (+$150–200 by footprint) on any shoot; pick it in Step 2.</p></div>
            <div className="qa"><h4>What is virtual staging?</h4><p>Furniture and décor added to your empty or dated interior photos in post — no physical staging, no movers. It&apos;s priced per image staged at <b>$35 / image</b>; tell us how many rooms to stage in the access notes and we&apos;ll confirm the count before delivery.</p></div>
            <div className="qa"><h4>Can I reschedule after booking?</h4><p>Yes — free with reasonable notice. Your confirmation email has a direct link, or email <a href="mailto:booking@brxs.ca">booking@brxs.ca</a>.</p></div>
            <div className="qa"><h4>What if I need to cancel?</h4><p>Full refund if a photographer hasn&apos;t been dispatched yet. Closer to the shoot, refunds are handled case by case — see the full <Link href="/terms#refunds">Cancellation &amp; Refund Policy</Link>.</p></div>
            <div className="qa"><h4>How do refunds work?</h4><p>Back to your original payment method via Stripe, typically within 5–10 business days.</p></div>
          </div>
        </section>
      </div>

      <style>{`
        .wrap{max-width:760px;margin:0 auto;padding:0 36px;}
        .hero{padding:44px 0 24px;}
        .hero h1{font-weight:500;font-size:34px;letter-spacing:-1px;color:var(--ink);}
        .hero p.sub{font-size:15px;color:var(--inkSoft);margin-top:12px;max-width:560px;}
        .steps{display:flex;gap:0;margin:28px 0 8px;border:1px solid var(--hair);border-radius:2px;overflow:hidden;}
        .step-tab{flex:1;padding:13px 10px;text-align:center;font-family:'JetBrains Mono',monospace;
          font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;color:var(--inkFaint);
          background:var(--paper);border-right:1px solid var(--hair);position:relative;}
        .step-tab:last-child{border-right:none;}
        .step-tab .n{display:block;font-size:13px;color:var(--inkMute);margin-bottom:3px;}
        .step-tab.active{background:var(--paperDeep);color:var(--brickDeep);}
        .step-tab.active .n{color:var(--brickDeep);}
        .step-tab.done{color:var(--inkMute);}
        .panel{display:none;padding:26px 0 8px;}
        .panel.active{display:block;}
        .panel h2{font-weight:500;font-size:22px;letter-spacing:-0.4px;color:var(--ink);margin-bottom:4px;}
        .panel .hint{font-size:13px;color:var(--inkMute);margin-bottom:20px;}
        .field{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;position:relative;}
        .field label{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.12em;
          text-transform:uppercase;color:var(--inkMute);}
        .field .req{color:var(--brickDeep);}
        .field .hint-sm{font-size:11.5px;color:var(--inkFaint);font-family:'General Sans',sans-serif;text-transform:none;letter-spacing:0;line-height:1.4;}
        .field input,.field select,.field textarea{font-family:'General Sans',sans-serif;font-size:14px;
          background:var(--paper);color:var(--ink);border:1px solid var(--hairStrong);border-radius:2px;
          padding:11px 12px;outline:none;width:100%;}
        .field input:focus,.field select:focus,.field textarea:focus{border-color:var(--brick);}
        .field textarea{resize:vertical;min-height:70px;}
        .grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        .suggest{position:absolute;top:100%;left:0;right:0;z-index:20;background:var(--paper);
          border:1px solid var(--hairStrong);border-radius:2px;margin-top:2px;max-height:240px;overflow:auto;}
        .suggest div{padding:10px 12px;font-size:13px;color:var(--inkSoft);cursor:pointer;border-bottom:1px solid var(--hair);}
        .suggest div:last-child{border-bottom:none;}
        .suggest div:hover{background:var(--paperSoft);color:var(--brickDeep);}
        .suggest .muted{font-size:11px;color:var(--inkFaint);font-family:'JetBrains Mono',monospace;}
        .choices{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--hair);
          border:1px solid var(--hair);border-radius:2px;margin-bottom:16px;}
        .choice{background:var(--paper);padding:18px;cursor:pointer;border:2px solid transparent;}
        .choice:hover{background:var(--paperSoft);}
        .choice.sel{background:var(--brickTint);border-color:var(--brick);}
        .choice .t{font-weight:500;font-size:15px;color:var(--ink);}
        .choice .x{font-size:12px;color:var(--inkMute);line-height:1.4;}
        .slotgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:14px 0;}
        .slotbtn{background:var(--paper);border:1px solid var(--hairStrong);border-radius:2px;
          padding:12px 10px;font-family:'JetBrains Mono',monospace;font-size:12.5px;color:var(--ink);
          cursor:pointer;text-align:center;}
        .slotbtn:hover{background:var(--paperSoft);border-color:var(--brick);}
        .slotbtn.sel{background:var(--brickTint);border-color:var(--brick);color:var(--brickDeep);font-weight:500;}
        .slotmsg{font-size:12.5px;color:var(--inkMute);padding:10px 2px;font-family:'JetBrains Mono',monospace;}
        @media (max-width:480px){.slotgrid{grid-template-columns:1fr;}}
        .toggle{display:flex;align-items:center;gap:10px;margin-bottom:14px;font-size:14px;color:var(--inkSoft);}
        .toggle input{width:16px;height:16px;accent-color:var(--brick);}
        .quote{background:var(--paperDeep);border:1px solid var(--hair);border-radius:2px;padding:20px;margin-top:8px;}
        .quote .qhead{display:flex;justify-content:space-between;align-items:baseline;gap:12px;
          padding-bottom:14px;margin-bottom:12px;border-bottom:2px solid var(--brick);}
        .quote .qhead-l{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.12em;
          text-transform:uppercase;color:var(--inkMute);}
        .quote .qhead-t{font-family:'JetBrains Mono',monospace;font-size:27px;font-weight:500;color:var(--brick);white-space:nowrap;}
        .quote .qhead-t span{font-family:'General Sans',sans-serif;font-size:11px;color:var(--inkMute);font-weight:400;letter-spacing:0;}
        .quote .qmeta{font-size:12px;color:var(--inkMute);margin-bottom:12px;}
        .quote .qrow{display:flex;justify-content:space-between;gap:16px;padding:8px 0;border-bottom:1px solid var(--hair);font-size:14px;}
        .quote .qrow:last-child{border-bottom:none;}
        .quote .qk{color:var(--inkMute);}
        .quote .qk em{font-style:normal;color:var(--inkFaint);font-size:10.5px;font-family:'JetBrains Mono',monospace;margin-left:6px;}
        .quote .qv{color:var(--ink);text-align:right;}
        .quote .qnote{font-size:11.5px;color:var(--brickDeep);margin-top:12px;font-family:'JetBrains Mono',monospace;line-height:1.5;
          border-left:2px solid var(--brick);padding-left:10px;}
        .sqft-edit{display:flex;align-items:center;gap:8px;margin:12px 0 2px;}
        .sqft-edit input{width:110px;padding:7px 9px;font-size:13px;}
        .sqft-edit button{font-size:12px;padding:7px 12px;border:1px solid var(--hairStrong);background:transparent;color:var(--ink);border-radius:2px;cursor:pointer;font-family:'JetBrains Mono',monospace;}
        .qload{display:flex;align-items:center;gap:14px;padding:10px 2px 6px;}
        .qload .spin{width:22px;height:22px;border-radius:50%;border:2px solid var(--brickSoft);
          border-top-color:var(--brick);animation:spin .7s linear infinite;flex:none;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .qload .ltxt{font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.1em;
          text-transform:uppercase;color:var(--inkMute);line-height:1.5;}
        .qload .ltxt b{display:block;font-family:'General Sans',sans-serif;font-size:14px;letter-spacing:0;
          text-transform:none;color:var(--ink);font-weight:500;margin-bottom:3px;}
        .qmsg{font-size:12.5px;color:var(--inkMute);padding:16px 2px;line-height:1.55;}
        @media (prefers-reduced-motion: reduce){.qload .spin{animation:none;border-top-color:var(--brickSoft);}}
        .review{background:var(--paperDeep);border:1px solid var(--hair);border-radius:2px;padding:20px;}
        .review .rrow{display:flex;justify-content:space-between;gap:16px;padding:9px 0;border-bottom:1px solid var(--hair);font-size:14px;}
        .review .rrow:last-child{border-bottom:none;}
        .review .rk{color:var(--inkMute);font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;}
        .review .rv{color:var(--ink);text-align:right;}
        .nav-btns{display:flex;justify-content:space-between;gap:12px;margin:22px 0 8px;}
        .btn{font-weight:500;font-size:14px;border-radius:2px;padding:12px 22px;cursor:pointer;border:none;
          font-family:'General Sans',sans-serif;}
        .btn-brick{background:var(--brick);color:#fff;}
        .btn-brick:disabled{opacity:0.5;cursor:not-allowed;}
        .btn-ghost{background:transparent;color:var(--ink);border:1px solid var(--hairStrong);}
        .err{color:var(--brickDeep);font-size:12.5px;font-family:'JetBrains Mono',monospace;margin-top:-8px;margin-bottom:12px;min-height:14px;}
        .done-box{background:var(--paperDeep);border:1px solid var(--hair);border-radius:2px;padding:28px;text-align:center;}
        .done-box h2{color:var(--ink);margin-bottom:8px;}
        .done-box p{font-size:14px;color:var(--inkMute);}
        .faq-head{margin:0 0 18px;}
        .faq-head h2{font-weight:500;font-size:22px;letter-spacing:-0.4px;color:var(--ink);margin-bottom:4px;}
        .faq-head p{font-size:13px;color:var(--inkMute);}
        .faq{display:flex;flex-direction:column;gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;}
        .qa{background:var(--paper);padding:20px 24px;}
        .qa h4{font-weight:500;font-size:15px;color:var(--ink);margin-bottom:6px;}
        .qa p{font-size:13px;color:var(--inkMute);line-height:1.5;}
        .qa p a{color:var(--brickDeep);}
        @media (max-width:640px){.choices,.grid2{grid-template-columns:1fr;} .hero h1{font-size:28px;}}
      `}</style>
    </>
  )
}
