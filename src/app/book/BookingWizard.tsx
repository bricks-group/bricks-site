'use client'

import { useEffect, useRef, useState } from 'react'
import { REEL_RANGE, TOUR_RANGE, TWILIGHT_RANGE, RUSH_FLAT, STAGING_PER_IMAGE, VISIT_PRICE_LABEL, FOOTPRINT_BANDS } from '@/lib/pricing'
import { TOUR_BLURB, TOUR_NAME, VISIT_BLURB, VISIT_NAME, VISIT_PACKAGING } from '@/lib/brand'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import MapCutout from '@/components/MapCutout'

const SUPABASE = 'https://ctqwxwrcxwruaqojohpf.supabase.co/functions/v1/'
const ANON = 'sb_publishable_dsC8pvo5X9ZVZGbkaotrGQ_VhRINFod'
const MAPBOX_PUBLIC = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

type AddrSuggestion = {
  label: string
  city: string
  province: string
  postal_code: string
  lng?: number
  lat?: number
}

type MapboxContext = { id?: string; text?: string; short_code?: string }
type MapboxFeature = {
  place_name?: string
  text?: string
  center?: [number, number]
  context?: MapboxContext[]
}

function parseMapboxFeature(feat: MapboxFeature): AddrSuggestion | null {
  const ctx = feat.context || []
  const find = (prefix: string) => ctx.find((c) => String(c.id || '').startsWith(prefix))
  const place = find('place.') || find('locality.')
  const region = find('region.')
  const postcode = find('postcode.')
  let province = ''
  if (region) {
    const short = String(region.short_code || '').toUpperCase()
    province = short.startsWith('CA-') && short.length === 5 ? short.slice(3) : (region.text || '')
  }
  const center = feat.center || []
  const lng = Number(center[0])
  const lat = Number(center[1])
  const label = (feat.place_name || feat.text || '').trim()
  if (!label) return null
  return {
    label,
    city: (place && place.text) || '',
    province,
    postal_code: (postcode && postcode.text) || '',
    lng: Number.isFinite(lng) ? lng : undefined,
    lat: Number.isFinite(lat) ? lat : undefined,
  }
}

function fetchAddressSuggestions(q: string): Promise<AddrSuggestion[]> {
  const fallback = () =>
    fetch('/api/address-suggest?q=' + encodeURIComponent(q))
      .then((r) => r.json())
      .then((j: AddrSuggestion[]) => (Array.isArray(j) ? j : []))

  if (!MAPBOX_PUBLIC) return fallback()

  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json` +
    `?access_token=${encodeURIComponent(MAPBOX_PUBLIC)}` +
    '&country=ca&types=address&autocomplete=true&limit=6'

  return fetch(url)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('mapbox'))))
    .then((d: { features?: MapboxFeature[] }) =>
      (d.features || []).map(parseMapboxFeature).filter((x): x is AddrSuggestion => x !== null),
    )
    .catch(() => fallback())
}

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

type TimeWindow = 'morning' | 'afternoon' | 'evening'

const TIME_WINDOWS: { id: TimeWindow; label: string; range: string; start: string; end: string }[] = [
  { id: 'morning', label: 'Morning', range: '09:00–12:00', start: '09:00', end: '12:00' },
  { id: 'afternoon', label: 'Afternoon', range: '12:00–16:00', start: '12:00', end: '16:00' },
  { id: 'evening', label: 'Evening', range: '16:00–19:00', start: '16:00', end: '19:00' },
]

/** Synthetic ISO bounds in America/Toronto for Stripe/OS back-compat (no third-party calendar). */
function windowBoundsIso(ymd: string, windowId: TimeWindow): { start: string; end: string } | null {
  const w = TIME_WINDOWS.find((x) => x.id === windowId)
  if (!ymd || !w) return null
  const toIso = (hm: string) => {
    const [hh, mm] = hm.split(':').map(Number)
    const y = Number(ymd.slice(0, 4))
    const mo = Number(ymd.slice(5, 7)) - 1
    const d = Number(ymd.slice(8, 10))
    const asUtc = Date.UTC(y, mo, d, hh, mm, 0)
    let guess = asUtc
    for (let i = 0; i < 3; i++) {
      const fp = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      }).formatToParts(new Date(guess))
      const g = (typ: string) => Number(fp.find((part) => part.type === typ)?.value || '0')
      const gotH = g('hour') === 24 ? 0 : g('hour')
      const want = Date.UTC(y, mo, d, hh, mm, 0)
      const got = Date.UTC(g('year'), g('month') - 1, g('day'), gotH, g('minute'), g('second'))
      guess += want - got
    }
    return new Date(guess).toISOString()
  }
  return { start: toIso(w.start), end: toIso(w.end) }
}

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
  showcase: `+ reel + ${TOUR_NAME.toLowerCase()}`,
  suite: `+ reel + ${TOUR_NAME.toLowerCase()} + twilight + staging`,
}

/** Stable ids the GO capture gate reads (package_id / photos_only / suite). */
const PKG_ID: Record<string, string> = {
  photosOnly: 'photos_only',
  essentials: 'essentials',
  story: 'story',
  showcase: 'showcase',
  suite: 'suite',
}

function esc(s: string) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c))
}

type TrackProps = Record<string, string | number | boolean | null | undefined>
function evt(name: string, props?: TrackProps) {
  try { track(name, props) } catch { /* analytics is best-effort */ }
}

export default function BookingWizard() {
  const [step, setStep] = useState<number | 'done'>(0)
  const [errs, setErrs] = useState<Record<number, string>>({})
  const [name, setName] = useState('')
  const [brokerage, setBrokerage] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [addr, setAddr] = useState('')
  const [selectedAddr, setSelectedAddr] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [suggestions, setSuggestions] = useState<AddrSuggestion[]>([])
  const [showSuggest, setShowSuggest] = useState(false)
  const [addrLng, setAddrLng] = useState<number | null>(null)
  const [addrLat, setAddrLat] = useState<number | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suggestBoxRef = useRef<HTMLDivElement>(null)
  const addrInputRef = useRef<HTMLInputElement>(null)
  const addrFieldRef = useRef<HTMLDivElement>(null)
  const [drone, setDrone] = useState(true)
  const [reel, setReel] = useState(false)
  const [tour, setTour] = useState(false)
  const [visit, setVisit] = useState(false)
  const [twilight, setTwilight] = useState(false)
  const [staging, setStaging] = useState(false)
  const [rush, setRush] = useState(false)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteError, setQuoteError] = useState('')
  const [sqftInput, setSqftInput] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [preferredWindow, setPreferredWindow] = useState<TimeWindow | null>(null)
  const [paying, setPaying] = useState(false)
  const [doneTitle, setDoneTitle] = useState('Payment started.')
  const [doneMsg, setDoneMsg] = useState('Redirecting to secure checkout…')
  const [scheduleCtaVisible, setScheduleCtaVisible] = useState(false)

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('paid') !== '1') return
    evt('booking_paid')
    setStep('done')
    setDoneTitle('Payment confirmed')
    setScheduleCtaVisible(true)

    const sessionId = new URLSearchParams(window.location.search).get('session_id') || ''
    if (!sessionId) {
      // Edge may be stale without session_id — webhook (or manual nudge) is the only path.
      setDoneMsg('Payment confirmed. Your shoot is on Bricks GO — finalizing dispatch.')
      return
    }

    setDoneMsg('Confirming your shoot…')
    const OS_API = 'https://bricks-brokerage-api.vercel.app'
    let cancelled = false
    fetch(`${OS_API}/api/book/confirm-paid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then(async (r) => {
        const j = await r.json().catch(() => ({} as Record<string, unknown>))
        if (cancelled) return
        if (r.ok && j && (j as { ok?: boolean }).ok) {
          const agent = (j as { agent_user_id?: string | null }).agent_user_id
          setDoneMsg(
            agent
              ? 'Payment confirmed. Your shoot is on Bricks GO — and the listing is on your desk at app.brxs.ca.'
              : 'Payment confirmed. Your shoot is on Bricks GO',
          )
          return
        }
        setDoneMsg(
          "Payment received — we're finalizing dispatch. You'll get email if anything needs a nudge.",
        )
      })
      .catch(() => {
        if (cancelled) return
        setDoneMsg(
          "Payment received — we're finalizing dispatch. You'll get email if anything needs a nudge.",
        )
      })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const q = addr.trim()
    if (q.length < 3) { setShowSuggest(false); return }
    if (selectedAddr && q === selectedAddr) { setShowSuggest(false); return }
    debounceRef.current = setTimeout(() => {
      fetchAddressSuggestions(q)
        .then((j) => {
          if (!j.length) { setShowSuggest(false); return }
          setSuggestions(j)
          setShowSuggest(true)
        })
        .catch(() => setShowSuggest(false))
    }, 350)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [addr, selectedAddr])

  useEffect(() => {
    function onDocPointer(e: Event) {
      const t = e.target
      if (!(t instanceof Node)) return
      if (addrFieldRef.current?.contains(t)) return
      setShowSuggest(false)
    }
    document.addEventListener('pointerdown', onDocPointer)
    return () => document.removeEventListener('pointerdown', onDocPointer)
  }, [])

  function pickSuggestion(o: AddrSuggestion) {
    setAddr(o.label)
    setSelectedAddr(o.label)
    setShowSuggest(false)
    const lng = typeof o.lng === 'number' && Number.isFinite(o.lng) ? o.lng : null
    const lat = typeof o.lat === 'number' && Number.isFinite(o.lat) ? o.lat : null
    setAddrLng(lng)
    setAddrLat(lat)
  }

  function clearPickedPin() {
    setSelectedAddr('')
    setAddrLng(null)
    setAddrLat(null)
  }

  function matchedPackage(): string | null {
    for (const k of Object.keys(PKG_DEFS)) {
      const d = PKG_DEFS[k]
      if (d.drone === drone && d.reel === reel && d.tour === tour && d.twilight === twilight) return k
    }
    return null
  }

  /** Catalog id for Dispatch jobs.package_id — never collapse to first-word "hdr". */
  function packageIdForCheckout(): string {
    const m = matchedPackage()
    if (m) return PKG_ID[m]
    // Custom mix still includes HDR photo; floor plan follows drone (Photos only drops both).
    if (!drone) return 'photos_only'
    return 'essentials'
  }

  function applyPackage(key: string) {
    const def = PKG_DEFS[key]
    setDrone(def.drone); setReel(def.reel); setTour(def.tour); setTwilight(def.twilight)
  }

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
        if (!res.ok) { evt('quote_failed'); setQuote(null); setQuoteError("We couldn't auto-price this address. Enter the square footage above and hit Re-quote, or email booking@brxs.ca."); return }
        setQuote(res.j.quote)
        evt('quote_viewed', { footprint: res.j.quote.footprint_label, total: res.j.quote.total, sqft_source: res.j.quote.sqft_source ?? 'unknown' })
      })
      .catch(() => { setQuoteLoading(false); setQuote(null); setQuoteError('Network hiccup pricing this address — check your connection and try again.') })
  }

  const firstAddonRun = useRef(true)
  useEffect(() => {
    if (firstAddonRun.current) { firstAddonRun.current = false; return }
    if (quote) fetchQuote()
  }, [drone, reel, tour, twilight, rush])

  function formatPreferred(ymd: string, windowId: TimeWindow | null) {
    if (!ymd || !windowId) return '—'
    const w = TIME_WINDOWS.find((x) => x.id === windowId)
    const d = new Date(ymd + 'T12:00:00')
    const day = d.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/Toronto' })
    return day + ' · ' + (w ? w.label + ' (' + w.range + ')' : windowId)
  }

  function servicesSummary() {
    const pkg = matchedPackage()
    const parts = ['HDR photo']
    if (drone) parts.push('Drone')
    if (reel) parts.push('Cinematic reel')
    if (tour) parts.push(TOUR_NAME)
    // Virtual visit is quoted separately — never an add_on / never opens phone tour.
    if (visit) parts.push(`${VISIT_NAME} (${VISIT_PRICE_LABEL.toLowerCase()})`)
    if (twilight) parts.push('Twilight')
    if (rush) parts.push('Rush')
    const base = parts.join(' + ')
    const label = pkg
      ? PKG_LABEL[pkg]
      : (packageIdForCheckout() === 'photos_only' ? 'Photos only' : 'Essentials')
    return label + ' — ' + base
  }

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
      else if (visit && !(quote.sqft || sqftInput)) msg = `Confirm square footage so we can quote the ${VISIT_NAME.toLowerCase()} by footprint (${FOOTPRINT_BANDS}).`
    }
    if (s === 2) {
      if (!date) msg = 'Pick a shoot date.'
      else if (!preferredWindow) msg = 'Pick a time window above.'
    }
    setErrs((e) => ({ ...e, [s]: msg }))
    return !msg
  }

  function goNext(s: number) {
    if (validate(s)) {
      const next = s + 1
      setStep(next)
      if (s === 0) evt('booking_contact_submitted')
      if (s === 1) evt('booking_services_submitted', { total: quote ? quote.total : null })
      if (s === 2) evt('booking_schedule_submitted', { window: preferredWindow || 'none' })
      if (next === 1) fetchQuote()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  function goPrev(s: number) {
    setStep(s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function pay() {
    if (!quote) { setErrs((e) => ({ ...e, 3: 'Quote missing — go back to step 2.' })); return }
    setErrs((e) => ({ ...e, 3: '' }))
    setPaying(true)
    evt('checkout_started', { total: quote ? quote.total : null })
    try {
      sessionStorage.setItem('bricks_booking', JSON.stringify({ name: name.trim(), email: email.trim(), addr: selectedAddr || addr.trim(), notes: notes.trim() }))
    } catch {}
    const visitSqft = (sqftInput ? parseInt(sqftInput, 10) : null) || quote.sqft
    const visitBand = quote.footprint_label || 'unbanded'
    const visitNote = visit
      ? `${VISIT_NAME} (Gaussian splat, free-roam) requested — ${VISIT_PRICE_LABEL.toLowerCase()} (${FOOTPRINT_BANDS}). Footprint: ${visitBand}${visitSqft ? ` · ${visitSqft} sqft` : ''}${quote.sqft_estimated ? ' (estimated — confirm)' : ''}. Never packaged. Not in Stripe total.`
      : ''
    const combinedNotes = [notes.trim(), visitNote].filter(Boolean).join('\n')
    const packageId = packageIdForCheckout()
    const floorPlanIncluded = packageId !== 'photos_only' && drone
    const payload = {
      quote,
      agent_name: name.trim(),
      email: email.trim(),
      brokerage: brokerage.trim() || null,
      phone: phone.trim() || null,
      property_address: selectedAddr || addr.trim(),
      property_type: propertyType,
      package_id: packageId,
      package_interest: servicesSummary(),
      floor_plan_included: floorPlanIncluded,
      sqft: quote.sqft || null,
      preferred_date: date,
      preferred_window: preferredWindow,
      selected_slot_start: (preferredWindow && date && windowBoundsIso(date, preferredWindow)?.start) || null,
      selected_slot_end: (preferredWindow && date && windowBoundsIso(date, preferredWindow)?.end) || null,
      drone_addon: drone,
      reel_addon: reel,
      tour_addon: tour,
      twilight_addon: twilight,
      rush_addon: rush,
      // visit is notes-only — never tour_addon / never phone shutter
      notes: combinedNotes || null,
    }
    fetch(SUPABASE + 'create-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: ANON }, body: JSON.stringify(payload) })
      .then((r) => r.json().then((j) => ({ ok: r.ok && j.ok, j })))
      .then((res) => {
        if (!res.ok) { evt('checkout_failed', { reason: 'create_checkout_error' }); setErrs((e) => ({ ...e, 3: 'Checkout failed: ' + (res.j.error || 'try again') })); setPaying(false); return }
        setDoneTitle('Redirecting to secure checkout…')
        evt('checkout_redirected', { total: quote ? quote.total : null })
        window.location.href = res.j.url
      })
      .catch(() => { evt('checkout_failed', { reason: 'network' }); setErrs((e) => ({ ...e, 3: 'Network error starting checkout.' })); setPaying(false) })
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
        {visit && <div className="qnote">{VISIT_NAME} requested — {VISIT_PRICE_LABEL.toLowerCase()} ({q.footprint_label}{q.sqft ? ` · ${q.sqft.toLocaleString()} sqft` : ''}). Not in this total, not charged at checkout. Never packaged.</div>}
        {q.floor_plan_included === false && <div className="qnote">Photos only: no floor plan drafted for this booking.</div>}
        {q.sqft_estimated && <div className="qnote">⚠ Sqft estimated from footprint — confirm above for an exact quote. Final invoice reflects actual scope.</div>}
      </>
    )
  }

  const pkg = matchedPackage()

  return (
    <>
      <div className="wrap flow">
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
            <div className={`panel${step === 0 ? ' active' : ''}`}>
              <h2>What are we shooting?</h2>
              <p className="hint">Tell us about the listing and who&apos;s booking. Start typing the address for suggestions.</p>
              <div className="grid2">
                <div className="field"><label>Listing agent name <span className="req">*</span></label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Agent" /></div>
                <div className="field"><label>Brokerage <span className="req">*</span></label><input value={brokerage} onChange={(e) => setBrokerage(e.target.value)} placeholder="e.g. Your brokerage" /></div>
              </div>
              <div className="grid2">
                <div className="field"><label>Email <span className="req">*</span></label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" /></div>
                <div className="field"><label>Phone <span className="req">*</span></label><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="416-..." /></div>
              </div>
              <div className="field" ref={addrFieldRef}>
                <label>Property address <span className="req">*</span></label>
                <input ref={addrInputRef} value={addr} onChange={(e) => { setAddr(e.target.value); clearPickedPin() }} placeholder="123 Main St, Mississauga" autoComplete="off" />
                {showSuggest && suggestions.length > 0 && (
                  <div className="suggest" ref={suggestBoxRef} role="listbox">
                    {suggestions.map((o) => (
                      <button
                        type="button"
                        key={o.label}
                        role="option"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          pickSuggestion(o)
                        }}
                      >
                        {o.label.split(',').slice(0, 3).join(',')}
                        <span className="muted">{o.label}</span>
                      </button>
                    ))}
                  </div>
                )}
                {MAPBOX_PUBLIC && addrLng != null && addrLat != null && (
                  <MapCutout
                    token={MAPBOX_PUBLIC}
                    lng={addrLng}
                    lat={addrLat}
                    label={selectedAddr || addr}
                  />
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

            <div className={`panel${step === 1 ? ' active' : ''}`}>
              <h2>What do you need shot?</h2>
              <p className="hint">HDR photography is included on every shoot; licensed drone and a floor plan are included on the standard tiers, or drop both for Photos only. {TOUR_NAME} may be included in Showcase and Full suite. {VISIT_NAME} is always a paid add-on, {VISIT_PRICE_LABEL.toLowerCase()} ({FOOTPRINT_BANDS}), never packaged, and not charged at checkout. See <Link href="/pricing" style={{ color: 'var(--brickDeep)' }}>full pricing</Link>.</p>
              <div className="choices">
                {Object.keys(PKG_DEFS).map((k) => (
                  <div key={k} className={`choice${pkg === k ? ' sel' : ''}`} onClick={() => applyPackage(k)}>
                    <div className="t">{PKG_LABEL[k]}</div>
                    <div className="x">{PKG_DESC[k]}</div>
                  </div>
                ))}
              </div>
              <p className="hint-sm" style={{ margin: '-4px 0 14px' }}>Or build à la carte:</p>
              <label className="toggle"><input type="checkbox" checked={reel} onChange={(e) => setReel(e.target.checked)} /> Cinematic reel (+{REEL_RANGE}, by footprint)</label>
              <label className="toggle"><input type="checkbox" checked={tour} onChange={(e) => setTour(e.target.checked)} /> {TOUR_NAME} (+{TOUR_RANGE}, by footprint) — {TOUR_BLURB}</label>
              <label className="toggle"><input type="checkbox" checked={visit} onChange={(e) => setVisit(e.target.checked)} /> {VISIT_NAME} ({VISIT_PRICE_LABEL.toLowerCase()}) — {VISIT_BLURB} {VISIT_PACKAGING} Not charged in Stripe.</label>
              {visit && (
                <div className="field" style={{ margin: '4px 0 14px' }}>
                  <label>Sqft for {VISIT_NAME.toLowerCase()} quote</label>
                  <input type="number" min={1} value={sqftInput} onChange={(e) => setSqftInput(e.target.value)} placeholder={quote?.sqft ? String(quote.sqft) : 'e.g. 2200'} />
                  <span className="hint-sm">{FOOTPRINT_BANDS}. Same bands as photo, reel, and virtual tour. We quote the visit after booking using this footprint — not in checkout.</span>
                </div>
              )}
              <label className="toggle"><input type="checkbox" checked={twilight} onChange={(e) => setTwilight(e.target.checked)} /> Twilight photography (+{TWILIGHT_RANGE}, by footprint)</label>
              <label className="toggle"><input type="checkbox" checked={staging} onChange={(e) => setStaging(e.target.checked)} /> Virtual staging (+${STAGING_PER_IMAGE} per image staged)</label>
              <label className="toggle"><input type="checkbox" checked={rush} onChange={(e) => setRush(e.target.checked)} /> Rush delivery (+${RUSH_FLAT})</label>
              <div className="quote">
                {quoteLoading && <div className="qload"><div className="spin"></div><div className="ltxt"><b>Tailoring your quote</b>Measuring footprint · mapping travel · adding tax</div></div>}
                {!quoteLoading && quote && <QuoteBlock q={quote} editable />}
                {!quoteLoading && !quote && quoteError && <div className="qmsg">{quoteError}</div>}
                {!quoteLoading && !quote && !quoteError && <div className="qmsg">Tailoring your quote…</div>}
              </div>
              <div className="err">{errs[1]}</div>
              <div className="nav-btns"><button type="button" className="btn btn-ghost" onClick={() => goPrev(1)}>← Back</button><button type="button" className="btn btn-brick" onClick={() => goNext(1)}>Next →</button></div>
            </div>

            <div className={`panel${step === 2 ? ' active' : ''}`}>
              <h2>When?</h2>
              <p className="hint">Pick a date and window. Your photographer confirms the exact time on GO — nothing is locked to a third-party calendar.</p>
              <div className="field"><label>Shoot date <span className="req">*</span></label><input type="date" value={date} onChange={(e) => { setDate(e.target.value); setErrs((er) => ({ ...er, 2: '' })) }} /></div>
              <div className="field">
                <label>Time window <span className="req">*</span></label>
                <div className="slotgrid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 8 }}>
                  {TIME_WINDOWS.map((w) => (
                    <div
                      key={w.id}
                      className={`slotbtn${preferredWindow === w.id ? ' sel' : ''}`}
                      onClick={() => { setPreferredWindow(w.id); setErrs((er) => ({ ...er, 2: '' })) }}
                    >
                      <div>{w.label}</div>
                      <div style={{ marginTop: 4, fontSize: 11, opacity: 0.85 }}>{w.range}</div>
                    </div>
                  ))}
                </div>
                <p className="hint-sm" style={{ marginTop: 10 }}>Times are America/Toronto. Exact start is confirmed on GO after you pay.</p>
              </div>
              <div className="field"><label>Access / staging notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Lockbox code, occupied, staging schedule, deadline…" /></div>
              <div className="err">{errs[2]}</div>
              <div className="nav-btns"><button type="button" className="btn btn-ghost" onClick={() => goPrev(2)}>← Back</button><button type="button" className="btn btn-brick" onClick={() => goNext(2)}>Review →</button></div>
            </div>

            <div className={`panel${step === 3 ? ' active' : ''}`}>
              <h2>Review &amp; pay.</h2>
              <p className="hint">Confirm details, then pay to book. Your photographer confirms the window on GO. Full amount (incl. HST) charged now via Stripe. Apple Pay, Google Pay, and Link show on the next screen when your device supports them — cards always stay.</p>
              <div className="review">
                {[
                  ['Agent', name.trim() || '—'], ['Brokerage', brokerage.trim() || '—'], ['Email', email.trim() || '—'], ['Phone', phone.trim() || '—'],
                  ['Property', addr.trim() || '—'], ['Type', propertyType || '—'],
                  ['Package', pkg ? PKG_LABEL[pkg] : 'Custom (à la carte)'],
                  ['Licensed drone', drone ? 'Yes' : 'No — Photos only'], ['Floor plan', drone ? 'Yes' : 'No — Photos only'],
                  ['Cinematic reel', reel ? 'Yes' : 'No'], [TOUR_NAME, tour ? 'Yes' : 'No'], [VISIT_NAME, visit ? `Yes — ${VISIT_PRICE_LABEL.toLowerCase()}` : 'No'], ['Twilight', twilight ? 'Yes' : 'No'], ['Rush delivery', rush ? 'Yes' : 'No'],
                  ['Preferred window', formatPreferred(date, preferredWindow)], ['Notes', notes.trim() || '—'],
                ].map(([k, v]) => (
                  <div key={k} className="rrow"><span className="rk">{k}</span><span className="rv">{esc(v)}</span></div>
                ))}
              </div>
              {quote && <div className="quote" style={{ marginTop: 14 }}><QuoteBlock q={quote} editable={false} /></div>}
              <div className="err">{errs[3]}</div>
              <p style={{ fontSize: 11.5, color: 'var(--inkFaint)', marginTop: 2 }}>By paying you agree to our <Link href="/terms" style={{ color: 'var(--brickDeep)' }}>Terms</Link> and <Link href="/privacy" style={{ color: 'var(--brickDeep)' }}>Privacy Policy</Link>.</p>
              <p className="hint-sm" style={{ marginTop: 8 }}>Safari / iOS → Apple Pay. Chrome / Android → Google Pay. Link where Stripe offers it. Card always available.</p>
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
                  <p style={{ margin: '0 0 14px', fontSize: 14, color: 'var(--inkSoft)' }}>Your preferred window is on GO — the photographer will confirm timing. A confirmation email is on its way.</p>
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
            <div className="qa"><h4>Is the {VISIT_NAME.toLowerCase()} included?</h4><p>Never. {VISIT_PACKAGING} {VISIT_PRICE_LABEL} on the same bands as photo, reel, and virtual tour ({FOOTPRINT_BANDS}). Check it in Step 2 and confirm sqft — we quote after booking. It is not charged in Stripe checkout.</p></div>
            <div className="qa"><h4>What&apos;s included with twilight?</h4><p>Exterior photography shot during blue hour — windows lit, sky still holding color. It&apos;s an optional add-on (+{TWILIGHT_RANGE} by footprint) on any shoot; pick it in Step 2.</p></div>
            <div className="qa"><h4>What is virtual staging?</h4><p>Furniture and décor added to your empty or dated interior photos in post — no physical staging, no movers. It&apos;s priced per image staged at <b>$35 / image</b>; tell us how many rooms to stage in the access notes and we&apos;ll confirm the count before delivery.</p></div>
            <div className="qa"><h4>Can I reschedule after booking?</h4><p>More than 48 hours before the shoot window is free. Inside 48 hours we will try; if we cannot, the cancellation schedule applies. Email <a href="mailto:booking@brxs.ca">booking@brxs.ca</a> as soon as you know — see the <Link href="/terms#refunds">cancellation policy</Link>.</p></div>
            <div className="qa"><h4>What if I need to cancel?</h4><p>More than 48 hours before the shoot window: full refund. 48 hours down to 4 hours: 50% refund. Inside 4 hours, or no-show / no access: no refund. If we cancel on our side: full refund or a free reshoot, your choice. Full schedule in the <Link href="/terms#refunds">Terms</Link>.</p></div>
            <div className="qa"><h4>How do refunds work?</h4><p>Back to your original payment method via Stripe, typically within 5–10 business days.</p></div>
            <div className="qa"><h4>Can I pay with Apple Pay or Google Pay?</h4><p>Yes. Pay &amp; book opens Stripe Checkout: Apple Pay in Safari/iOS, Google Pay in Chrome/Android, Link where Stripe shows it, plus cards. We don&apos;t take PayPal, Klarna, Afterpay, or Interac. The virtual visit is still never charged here.</p></div>
          </div>
        </section>
      </div>
    </>
  )
}
