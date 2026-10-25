'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { REEL_RANGE, TOUR_RANGE, TWILIGHT_RANGE, RUSH_FLAT, FLOOR_PLAN_ONLY_RATE, VISIT_PRICE_LABEL, STAGING_PRICE_LABEL, STAGING_PER_IMAGE, FOOTPRINT_BANDS, CORE_FROM } from '@/lib/pricing'
import { packageLines } from '@/lib/quote-lines'
import { TOUR_BLURB, TOUR_NAME, VISIT_BLURB, VISIT_NAME, VISIT_PACKAGING } from '@/lib/brand'
import { BookCalendar } from './BookCalendar'
import { type BookSlot, WORK_END, WORK_START, buildDaySlots, formatBookedWhen, localYmd, resolvePropertyTimezone, zoneAbbrev } from '@/lib/schedule'
import Link from 'next/link'
import LegalDocSheet from '@/components/legal/LegalDocSheet'
import type { LegalDocKey } from '@/lib/legal-docs'
import { track } from '@vercel/analytics'
import MapCutout from '@/components/MapCutout'
import BricksLoader from '@/components/BricksLoader'
import { type BookPrefill, bookTypeOption, canSkipToPackages, readBookPrefill, readHandoff } from '@/lib/book-prefill'
import { type Recommendation, compactMoney, recommendPackage } from '@/lib/book-recommend'
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
  base_rate?: number
  drone_included?: boolean
  floor_plan_included?: boolean
  floor_plan_only?: boolean
  floor_plan_only_rate?: number
  staging_addon?: boolean
  staging_images?: number
  travel_km_billable: number
  travel_per_km: number
  travel_fee: number
  travel_pending?: boolean
  travel_basis?: string
  gta_major?: boolean
  assignee_id?: string | null
  addons: { label: string; amount: number }[]
  subtotal: number
  hst: number
  sqft_estimated?: boolean
  lat?: number | null
  lon?: number | null
}

type SlotsResponse = {
  ok?: boolean
  availability?: 'live' | 'hours'
  slots?: BookSlot[]
}

const PKG_DEFS: Record<string, { drone: boolean; reel: boolean; tour: boolean; twilight: boolean; floorPlanOnly?: boolean }> = {
  floorPlanOnly: { drone: false, reel: false, tour: false, twilight: false, floorPlanOnly: true },
  photosOnly: { drone: false, reel: false, tour: false, twilight: false },
  essentials: { drone: true, reel: false, tour: false, twilight: false },
  story: { drone: true, reel: true, tour: false, twilight: false },
  showcase: { drone: true, reel: true, tour: true, twilight: false },
  suite: { drone: true, reel: true, tour: true, twilight: true },
}
const PKG_LABEL: Record<string, string> = {
  floorPlanOnly: 'Floor plan only',
  photosOnly: 'Photos only',
  essentials: 'Essentials',
  story: 'Story',
  showcase: 'Showcase',
  suite: 'Full suite',
}
const PKG_DESC: Record<string, string> = {
  floorPlanOnly: `Branded 2D floor plan capture — $${FLOOR_PLAN_ONLY_RATE} flat (no HDR / no drone)`,
  photosOnly: 'HDR photo only — no drone, no floor plan',
  essentials: `HDR + licensed drone + floor plan — from $${CORE_FROM}`,
  story: '+ cinematic reel',
  showcase: `+ reel + ${TOUR_NAME.toLowerCase()}`,
  suite: `+ reel + ${TOUR_NAME.toLowerCase()} + twilight`,
}

/** Stable ids the GO capture gate reads (package_id / photos_only / suite / floor_plan_only). */
const PKG_ID: Record<string, string> = {
  floorPlanOnly: 'floor_plan_only',
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
  const [legalOpen, setLegalOpen] = useState<LegalDocKey | null>(null)
  const [legalRead, setLegalRead] = useState<Partial<Record<LegalDocKey, boolean>>>({})
  // Plain clicks open the document in a pop-up; modified clicks still open the page.
  const openLegal = (k: LegalDocKey) => (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    setLegalOpen(k)
  }
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
  const [addrProvince, setAddrProvince] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suggestBoxRef = useRef<HTMLDivElement>(null)
  const addrInputRef = useRef<HTMLInputElement>(null)
  const addrFieldRef = useRef<HTMLDivElement>(null)
  const [drone, setDrone] = useState(true)
  const [reel, setReel] = useState(false)
  const [tour, setTour] = useState(false)
  const [visit, setVisit] = useState(false)
  const [staging, setStaging] = useState(false)
  const [stagingImages, setStagingImages] = useState(1)
  const [twilight, setTwilight] = useState(false)
  const [floorPlanOnly, setFloorPlanOnly] = useState(false)
  const [rush, setRush] = useState(false)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteError, setQuoteError] = useState('')
  const [sqftInput, setSqftInput] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<BookSlot | null>(null)
  const [daySlots, setDaySlots] = useState<BookSlot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsLive, setSlotsLive] = useState(false)
  const [slotsHint, setSlotsHint] = useState('Pick a date to see clock times.')
  const [paying, setPaying] = useState(false)
  const [doneTitle, setDoneTitle] = useState('Payment started.')
  const [doneMsg, setDoneMsg] = useState('Redirecting to secure checkout…')
  const [scheduleCtaVisible, setScheduleCtaVisible] = useState(false)

  // Book media from a listing in Bricks: a signed handoff (?h=) or plain params
  // fill the address, property details and the agent's own contact, preselect
  // the recommended package and open on the package step. Back still edits all.
  const [listing, setListing] = useState<BookPrefill | null>(null)
  const [rec, setRec] = useState<Recommendation | null>(null)
  const [handoffLoading, setHandoffLoading] = useState(false)
  const [handoffNote, setHandoffNote] = useState('')
  const [pendingQuote, setPendingQuote] = useState(false)

  useEffect(() => {
    const q = readBookPrefill(window.location.search)
    const apply = (p: BookPrefill) => {
      if (p.name) setName((v) => v || p.name!)
      if (p.brokerage) setBrokerage((v) => v || p.brokerage!)
      if (p.email) setEmail((v) => v || p.email!)
      if (p.phone) setPhone((v) => v || p.phone!)
      if (p.address) setAddr((v) => v || p.address!)
      const opt = bookTypeOption(p.details)
      if (opt) setPropertyType((v) => v || opt)
      if (p.details?.sqft) setSqftInput((v) => v || String(p.details!.sqft))
      if (p.details || p.focus || p.gaps) {
        const r = recommendPackage({ details: p.details, focus: p.focus, gaps: p.gaps, photoReason: p.photoReason })
        applyPackage(r.pkg)
        setVisit(r.visit)
        setStaging(r.staging)
        if (r.staging) setStagingImages(r.stagingImages)
        setRec(r)
        setListing(p)
      }
      if (canSkipToPackages(p)) {
        setStep(1)
        setPendingQuote(true)
        evt('booking_listing_handoff', { focus: p.focus || 'none', pkg: p.details || p.focus ? 'recommended' : 'none' })
      }
    }
    if (!q.token) { apply(q); return }
    // Keep the token out of history and bookmarks once it has been read.
    try {
      const u = new URL(window.location.href)
      u.searchParams.delete('h')
      window.history.replaceState(window.history.state, '', u.pathname + u.search + u.hash)
    } catch {}
    setHandoffLoading(true)
    fetch('/api/book/handoff?t=' + encodeURIComponent(q.token), { cache: 'no-store' })
      .then((r) => r.json().catch(() => ({})))
      .then((j: { ok?: boolean; error?: string; handoff?: unknown }) => {
        if (j && j.ok) { apply(readHandoff(j.handoff)); return }
        setHandoffNote(j && j.error === 'expired' ? 'That link from Bricks has expired. Check the details below.' : 'Couldn’t load your listing. Check the details below.')
        apply(q)
      })
      .catch(() => { setHandoffNote('Couldn’t load your listing. Check the details below.'); apply(q) })
      .finally(() => setHandoffLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!pendingQuote) return
    setPendingQuote(false)
    fetchQuote()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingQuote])

  /** Address edited away from the listing: its size and recommendation no longer apply. */
  function onAddrEdited(v: string) {
    if (!listing?.address || v === listing.address) return
    if (listing.details?.sqft && sqftInput === String(listing.details.sqft)) setSqftInput('')
    setListing(null)
    setRec(null)
  }

  function listingLine(p: BookPrefill): string {
    const d = p.details || {}
    const parts: string[] = []
    if (p.address) parts.push(p.address.split(',')[0])
    if (d.propertyType) parts.push(d.propertyType)
    if (d.sqft) parts.push(`${d.sqft.toLocaleString('en-US')} sq ft`)
    if (d.beds) parts.push(`${d.beds} bd`)
    if (d.baths) parts.push(`${d.baths} ba`)
    if (d.lotAcres && d.lotAcres >= 0.25) parts.push(`${Math.round(d.lotAcres * 10) / 10} ac`)
    if (d.price) parts.push(compactMoney(d.price))
    return parts.join(' · ')
  }

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('paid') !== '1') return
    evt('booking_paid')
    setStep('done')
    setDoneTitle('Payment confirmed')
    setScheduleCtaVisible(true)

    const sessionId = new URLSearchParams(window.location.search).get('session_id') || ''
    if (!sessionId) {
      // Edge may be stale without session_id — webhook (or manual nudge) is the only path.
      setDoneMsg('Payment confirmed. Your shoot is booked — finalizing dispatch.')
      return
    }

    setDoneMsg('Confirming your shoot…')
    let cancelled = false
    fetch('/api/confirm-paid', {
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
              ? 'Payment confirmed. Your shoot is booked, and the listing is in Bricks at app.brxs.ca.'
              : 'Payment confirmed. Your shoot is booked.',
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
    setAddrProvince(o.province || '')
  }

  function clearPickedPin() {
    setSelectedAddr('')
    setAddrLng(null)
    setAddrLat(null)
    setAddrProvince('')
  }

  const bookingZone = useMemo(
    () => resolvePropertyTimezone({ province: addrProvince, address: selectedAddr || addr }),
    [addrProvince, selectedAddr, addr],
  )
  const propertyTz = bookingZone.tz
  const propertyAbbrev = zoneAbbrev(propertyTz)

  function matchedPackage(): string | null {
    for (const k of Object.keys(PKG_DEFS)) {
      const d = PKG_DEFS[k]
      const dFp = !!d.floorPlanOnly
      if (dFp !== floorPlanOnly) continue
      if (d.drone === drone && d.reel === reel && d.tour === tour && d.twilight === twilight) return k
    }
    return null
  }

  /** Catalog id for Dispatch jobs.package_id — never collapse to first-word "hdr". */
  function packageIdForCheckout(): string {
    const m = matchedPackage()
    if (m) return PKG_ID[m]
    if (floorPlanOnly) return 'floor_plan_only'
    // Custom mix still includes HDR photo; floor plan follows drone (Photos only drops both).
    if (!drone) return 'photos_only'
    return 'essentials'
  }

  function applyPackage(key: string) {
    const def = PKG_DEFS[key]
    const fpOnly = !!def.floorPlanOnly
    setFloorPlanOnly(fpOnly)
    setDrone(def.drone); setReel(def.reel); setTour(def.tour); setTwilight(def.twilight)
    if (fpOnly) {
      // Floor-plan-only drops HDR/drone. Visit and staging stay optional add-ons.
    }
  }

  function fetchQuote(manualSqft?: number | null) {
    setQuoteError('')
    setQuoteLoading(true)
    const payload: Record<string, unknown> = {
      address: selectedAddr || addr.trim(),
      property_type: propertyType,
      drone_addon: floorPlanOnly ? false : drone,
      reel_addon: floorPlanOnly ? false : reel,
      tour_addon: floorPlanOnly ? false : tour,
      twilight_addon: floorPlanOnly ? false : twilight,
      rush_addon: rush,
      visit_addon: visit,
      staging_addon: staging,
      staging_images: staging ? Math.max(1, stagingImages || 1) : 0,
      floor_plan_only: floorPlanOnly,
      package_id: packageIdForCheckout(),
    }
    const typed = manualSqft ?? (sqftInput ? parseInt(sqftInput, 10) : null)
    if (typed && Number.isFinite(typed)) payload.sqft = typed
    // Same-origin Next API — bypasses Canada Edge Fair-Use 402.
    fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
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
  }, [drone, reel, tour, twilight, rush, floorPlanOnly, visit, staging, stagingImages])

  function loadSlots(ymd: string) {
    setSelectedSlot(null)
    if (!ymd) {
      setDaySlots([])
      setSlotsLive(false)
      setSlotsLoading(false)
      setSlotsHint('Pick a date to see clock times.')
      return
    }
    setSlotsLoading(true)
    setSlotsHint('Loading times…')
    const qs = new URLSearchParams({ date: ymd })
    if (bookingZone.province) qs.set('province', bookingZone.province)
    if (selectedAddr || addr.trim()) qs.set('address', selectedAddr || addr.trim())
    qs.set('tz', propertyTz)
    fetch('/api/book/slots?' + qs.toString(), { cache: 'no-store' })
      .then((r) => r.json().then((j: SlotsResponse) => ({ ok: r.ok && j.ok, j })))
      .then((res) => {
        const list = Array.isArray(res.j.slots) ? res.j.slots : []
        if (res.ok) {
          setDaySlots(list)
          setSlotsLive(res.j.availability === 'live')
          setSlotsHint(list.length ? '' : 'No remaining shoot hours that day — pick another date.')
          return
        }
        const local = buildDaySlots(ymd, new Date(), propertyTz)
        setDaySlots(local)
        setSlotsLive(false)
        setSlotsHint(local.length ? '' : 'No remaining shoot hours that day — pick another date.')
      })
      .catch(() => {
        const local = buildDaySlots(ymd, new Date(), propertyTz)
        setDaySlots(local)
        setSlotsLive(false)
        setSlotsHint(local.length ? "Couldn't check booked times — showing open shoot hours." : 'No remaining shoot hours that day — pick another date.')
      })
      .finally(() => setSlotsLoading(false))
  }

  useEffect(() => {
    loadSlots(date)
    // Reload when the property zone changes so Vancouver clocks replace the fallback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, propertyTz])

  function servicesSummary() {
    const pkg = matchedPackage()
    if (floorPlanOnly) {
      const parts = ['Floor plan only']
      if (visit) parts.push(VISIT_NAME)
      if (staging) parts.push(`Virtual staging ×${Math.max(1, stagingImages || 1)}`)
      if (rush) parts.push('Rush')
      const label = pkg ? PKG_LABEL[pkg] : 'Floor plan only'
      return label + ' — ' + parts.join(' + ')
    }
    const parts = ['HDR photo']
    if (drone) parts.push('Drone')
    if (reel) parts.push('Cinematic reel')
    if (tour) parts.push(TOUR_NAME)
    // Virtual visit is quoted separately — never an add_on / never opens phone tour.
    if (visit) parts.push(`${VISIT_NAME} (${VISIT_PRICE_LABEL})`)
    if (staging) parts.push(`Virtual staging (${Math.max(1, stagingImages || 1)} × ${STAGING_PRICE_LABEL})`)
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
      else if (!selectedSlot) msg = 'Pick a clock time above.'
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
      if (s === 2) evt('booking_schedule_submitted', { slot: selectedSlot?.start || 'none' })
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
    if (quote.travel_pending || (!quote.gta_major && !quote.assignee_id)) {
      setErrs((e) => ({ ...e, 3: 'A photographer must be assigned and the final fee shown before payment. Re-quote or email booking@brxs.ca.' }))
      return
    }
    if (!selectedSlot) { setErrs((e) => ({ ...e, 3: 'Pick a clock time on the When step.' })); return }
    setErrs((e) => ({ ...e, 3: '' }))
    setPaying(true)
    evt('checkout_started', { total: quote ? quote.total : null })
    try {
      sessionStorage.setItem('bricks_booking', JSON.stringify({ name: name.trim(), email: email.trim(), addr: selectedAddr || addr.trim(), notes: notes.trim() }))
    } catch {}
    const visitSqft = (sqftInput ? parseInt(sqftInput, 10) : null) || quote.sqft
    const visitBand = quote.footprint_label || 'unbanded'
    const visitNote = visit
      ? `${VISIT_NAME} (Gaussian splat, free-roam) paid add-on — ${VISIT_PRICE_LABEL}. Footprint: ${visitBand}${visitSqft ? ` · ${visitSqft} sqft` : ''}. Never packaged.`
      : ''
    const stagingNote = staging
      ? `Virtual staging paid — ${Math.max(1, stagingImages || 1)} × ${STAGING_PRICE_LABEL}.`
      : ''
    const combinedNotes = [notes.trim(), visitNote, stagingNote].filter(Boolean).join('\n')
    const packageId = packageIdForCheckout()
    const floorPlanIncluded = packageId === 'floor_plan_only' || (packageId !== 'photos_only' && drone)
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
      floor_plan_only: floorPlanOnly || packageId === 'floor_plan_only',
      sqft: quote.sqft || null,
      preferred_date: date,
      preferred_window: null,
      selected_slot_start: selectedSlot?.start || null,
      selected_slot_end: selectedSlot?.end || null,
      timezone: propertyTz,
      province: bookingZone.province,
      drone_addon: floorPlanOnly ? false : drone,
      reel_addon: floorPlanOnly ? false : reel,
      tour_addon: floorPlanOnly ? false : tour,
      twilight_addon: floorPlanOnly ? false : twilight,
      rush_addon: rush,
      staging_addon: staging,
      staging_images: staging ? Math.max(1, stagingImages || 1) : 0,
      visit_addon: visit,
      notes: combinedNotes || null,
    }
    // Same-origin Next API — bypasses Canada Edge Fair-Use 402.
    fetch('/api/create-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
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
        <div className="qmeta">{q.sqft ? q.sqft.toLocaleString() + ' sqft' : 'sqft n/a'} · {q.footprint_label}{q.gta_major ? ' · GTA major — $0 travel' : q.travel_pending ? ' · assigning photographer…' : (q.distance_km != null ? ' · ' + q.distance_km + ' km from photographer base' : '')}{q.sqft_source ? ' · ' + q.sqft_source : ''}</div>
        <div className="qlines">
          {packageLines(q, FLOOR_PLAN_ONLY_RATE).map((l) => (
            <div key={l.key} className="qrow"><span className="qk">{l.label}{l.note && l.note !== 'included' ? <> <em>{l.note}</em></> : null}</span><span className="qv">{l.note === 'included' ? 'Included' : `$${l.amount.toFixed(2)}`}</span></div>
          ))}
          <div className="qrow"><span className="qk">Travel {q.gta_major ? <em>GTA major market — no travel fee</em> : q.travel_pending ? <em>confirming photographer — checkout blocked until assigned</em> : <>({q.distance_km} km from assigned photographer) <em>{q.travel_km_billable > 0 ? `$${q.travel_per_km}/km after 25 km free` : 'first 25 km free'}</em></>}</span><span className="qv">${q.travel_fee.toFixed(2)}</span></div>
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
        {visit && <div className="qnote">{VISIT_NAME} is in this total ({q.footprint_label}{q.sqft ? ` · ${q.sqft.toLocaleString()} sqft` : ''}).</div>}
        {q.floor_plan_only && <div className="qnote">Floor plan only — the photographer's app opens floor-plan capture mode. No HDR stills / no drone on this booking.</div>}
        {q.floor_plan_included === false && !q.floor_plan_only && <div className="qnote">Photos only: no floor plan drafted for this booking.</div>}
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

        {handoffLoading && (
          <div className="panel active"><BricksLoader variant="cycle" size={22} label="Opening your listing" /></div>
        )}

        {step !== 'done' && !handoffLoading && (
          <form onSubmit={(e) => e.preventDefault()}>
            <div className={`panel${step === 0 ? ' active' : ''}`}>
              <h2>What are we shooting?</h2>
              <p className="hint">Start typing the address.</p>
              {handoffNote && <p className="hint-sm" role="status" style={{ margin: '-12px 0 20px' }}>{handoffNote}</p>}
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
                <input ref={addrInputRef} value={addr} onChange={(e) => { setAddr(e.target.value); clearPickedPin(); onAddrEdited(e.target.value) }} placeholder="123 Main St, Mississauga" autoComplete="off" />
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
                <span className="hint-sm">Optional. Helps us size the shoot.</span>
              </div>
              <div className="err">{errs[0]}</div>
              <div className="nav-btns"><span></span><button type="button" className="btn btn-brick" onClick={() => goNext(0)}>Next →</button></div>
            </div>

            <div className={`panel${step === 1 ? ' active' : ''}`}>
              <h2>What do you need shot?</h2>
              {rec ? (
                <p className="hint">We’ve picked a package for this listing. Choose any other. <Link href="/pricing" style={{ color: 'var(--brickDeep)' }}>Full pricing</Link></p>
              ) : (
                <p className="hint">Pick a package, then add extras. <Link href="/pricing" style={{ color: 'var(--brickDeep)' }}>Full pricing</Link></p>
              )}
              {listing && (
                <div className="lst" data-testid="book-listing">
                  <div className="lst-body">
                    <div className="lst-k">From your listing</div>
                    <div className="lst-v">{listingLine(listing)}</div>
                  </div>
                  <button type="button" className="lst-edit" onClick={() => goPrev(1)}>Edit</button>
                </div>
              )}
              {rec && <p className="rec-why" data-testid="book-rec-reason">{rec.reason}{rec.visit ? ` · ${VISIT_NAME} added` : ''}{rec.staging ? ' · Virtual staging added' : ''}</p>}
              <div className="choices" role="radiogroup" aria-label="Package">
                {Object.keys(PKG_DEFS).map((k) => (
                  <div
                    key={k}
                    role="radio"
                    aria-checked={pkg === k}
                    tabIndex={0}
                    className={`choice${pkg === k ? ' sel' : ''}`}
                    data-pkg={k}
                    onClick={() => applyPackage(k)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); applyPackage(k) } }}
                  >
                    <div className="t">{PKG_LABEL[k]}{rec?.pkg === k && <span className="rec-tag">Recommended</span>}</div>
                    <div className="x">{PKG_DESC[k]}</div>
                  </div>
                ))}
              </div>
              {!floorPlanOnly && (
                <>
                  <p className="hint-sm" style={{ margin: '-4px 0 16px' }}>Or build à la carte:</p>
                  <label className="toggle"><input type="checkbox" checked={reel} onChange={(e) => setReel(e.target.checked)} /> Cinematic reel (+{REEL_RANGE}, by footprint)</label>
                  <label className="toggle"><input type="checkbox" checked={tour} onChange={(e) => setTour(e.target.checked)} /> {TOUR_NAME} (+{TOUR_RANGE}, by footprint) — {TOUR_BLURB}</label>
                  <label className="toggle"><input type="checkbox" checked={visit} onChange={(e) => setVisit(e.target.checked)} /> {VISIT_NAME} ({VISIT_PRICE_LABEL}) — {VISIT_BLURB} {VISIT_PACKAGING}</label>
                  {visit && (
                    <div className="field" style={{ margin: '4px 0 16px' }}>
                      <label>Sqft (sets the footprint band)</label>
                      <input type="number" min={1} value={sqftInput} onChange={(e) => setSqftInput(e.target.value)} placeholder={quote?.sqft ? String(quote.sqft) : 'e.g. 2200'} />
                      <span className="hint-sm">{FOOTPRINT_BANDS}.</span>
                    </div>
                  )}
                  <label className="toggle"><input type="checkbox" checked={twilight} onChange={(e) => setTwilight(e.target.checked)} /> Twilight photography (+{TWILIGHT_RANGE}, by footprint)</label>
                </>
              )}
              {floorPlanOnly && (
                <>
                  <label className="toggle"><input type="checkbox" checked={visit} onChange={(e) => setVisit(e.target.checked)} /> {VISIT_NAME} ({VISIT_PRICE_LABEL}) — {VISIT_PACKAGING}</label>
                  <p className="hint-sm" style={{ margin: '-4px 0 16px' }}>Floor plan only — no HDR, no drone. Visit and staging below are optional. Rush is +${RUSH_FLAT}.</p>
                </>
              )}
              <label className="toggle"><input type="checkbox" checked={staging} onChange={(e) => setStaging(e.target.checked)} /> Virtual staging ({STAGING_PRICE_LABEL})</label>
              {staging && (
                <div className="field" style={{ margin: '4px 0 16px' }}>
                  <label>Photos to stage</label>
                  <input type="number" min={1} value={stagingImages} onChange={(e) => setStagingImages(Math.max(1, parseInt(e.target.value || '1', 10) || 1))} />
                  <span className="hint-sm">{STAGING_PER_IMAGE} CAD per photo, before tax. Not included in any package.</span>
                </div>
              )}
              <label className="toggle"><input type="checkbox" checked={rush} onChange={(e) => setRush(e.target.checked)} /> Rush delivery (+${RUSH_FLAT})</label>
              <div className="quote">
                {quoteLoading && <div className="qload"><BricksLoader variant="cycle" size={22} label="Tailoring your quote" /><div className="ltxt"><b>Tailoring your quote</b>Measuring footprint · mapping travel · adding tax</div></div>}
                {!quoteLoading && quote && <QuoteBlock q={quote} editable />}
                {!quoteLoading && !quote && quoteError && <div className="qmsg">{quoteError}</div>}
                {!quoteLoading && !quote && !quoteError && <div className="qmsg">Tailoring your quote…</div>}
              </div>
              <div className="err">{errs[1]}</div>
              <div className="nav-btns"><button type="button" className="btn btn-ghost" onClick={() => goPrev(1)}>← Back</button><button type="button" className="btn btn-brick" onClick={() => goNext(1)}>Next →</button></div>
            </div>

            <div className={`panel${step === 2 ? ' active' : ''}`}>
              <h2>When?</h2>
              <p className="hint">Pick a date and an exact time.</p>
              <div className="field">
                <label>Shoot date <span className="req">*</span></label>
<BookCalendar
                  tz={propertyTz}
                  area={selectedAddr || addr.trim()}
                  value={date}
                  onChange={(next) => {
                    setDate(next)
                    setErrs((er) => ({ ...er, 2: '' }))
                  }}
                />
              </div>
              <div className="field">
                <label>Start time <span className="req">*</span></label>
                {slotsLoading && <div className="slotmsg">Loading times…</div>}
                {!slotsLoading && daySlots.length > 0 && (
                  <div className="slotgrid" style={{ marginTop: 8 }}>
                    {daySlots.map((s) => (
                      <button
                        type="button"
                        key={s.start}
                        className={`slotbtn${selectedSlot?.start === s.start ? ' sel' : ''}`}
                        onClick={() => { setSelectedSlot(s); setErrs((er) => ({ ...er, 2: '' })) }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
                {!slotsLoading && date && daySlots.length === 0 && (
                  <div className="slotmsg">{slotsHint || 'No remaining shoot hours that day — pick another date.'}</div>
                )}
                {!date && <div className="slotmsg">Pick a date above to see clock times.</div>}
                <p className="hint-sm" style={{ marginTop: 12 }}>
                  {`Property local time (${propertyAbbrev}). Shoot hours ${WORK_START}–${WORK_END}.${slotsLive ? ' Booked times are hidden.' : ''}`}
                </p>
              </div>
              <div className="field"><label>Access notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Lockbox code, occupied, deadline…" /></div>
              <div className="err">{errs[2]}</div>
              <div className="nav-btns"><button type="button" className="btn btn-ghost" onClick={() => goPrev(2)}>← Back</button><button type="button" className="btn btn-brick" onClick={() => goNext(2)}>Review →</button></div>
            </div>

            <div className={`panel${step === 3 ? ' active' : ''}`}>
              <h2>Review &amp; pay.</h2>
              <p className="hint">Pay now to lock this time. Full amount, incl. HST, charged via Stripe.</p>
              <p className="hint-sm" style={{ marginTop: 8 }}>Photos in 24 hours. Other media in 24–48 hours{rush ? ' (rush on)' : ''}. A target, not a guarantee.</p>
              <p className="hint-sm" style={{ marginTop: 8 }}>Photographer and travel are final before you pay.</p>
              <div className="review">
                {[
                  ['Agent', name.trim() || '—'], ['Brokerage', brokerage.trim() || '—'], ['Email', email.trim() || '—'], ['Phone', phone.trim() || '—'],
                  ['Property', addr.trim() || '—'], ['Type', propertyType || '—'],
                  ['Package', pkg ? PKG_LABEL[pkg] : (floorPlanOnly ? 'Floor plan only' : 'Custom (à la carte)')],
                  ['Licensed drone', floorPlanOnly ? 'No — floor plan only' : (drone ? 'Yes' : 'No — Photos only')],
                  ['Floor plan', floorPlanOnly ? 'Floor plan only' : drone ? 'Included' : 'No — Photos only'],
                  ['Cinematic reel', floorPlanOnly ? 'No' : (reel ? 'Yes' : 'No')],
                  [TOUR_NAME, floorPlanOnly ? 'No' : (tour ? 'Yes' : 'No')],
                  [VISIT_NAME, visit ? `Yes — ${VISIT_PRICE_LABEL}` : 'No'],
                  ['Twilight', floorPlanOnly ? 'No' : (twilight ? 'Yes' : 'No')],
                  ['Virtual staging', staging ? `Yes — ${Math.max(1, stagingImages || 1)} × ${STAGING_PRICE_LABEL}` : 'No'],
                  ['Rush delivery', rush ? 'Yes' : 'No'],
                  ['Shoot time', selectedSlot ? formatBookedWhen(selectedSlot.start, propertyTz) : '—'], ['Notes', notes.trim() || '—'],
                ].map(([k, v]) => (
                  <div key={k} className="rrow"><span className="rk">{k}</span><span className="rv">{esc(v)}</span></div>
                ))}
              </div>
              {quote && <div className="quote" style={{ marginTop: 16 }}><QuoteBlock q={quote} editable={false} /></div>}
              <div className="err">{errs[3]}</div>
              <p style={{ fontSize: 12.5, color: 'var(--inkSoft)', marginTop: 12, lineHeight: 1.45, padding: '12px 16px', border: '1px solid var(--hairStrong)', borderRadius: 2, background: 'var(--bgRaised, transparent)' }}>
                <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>Cancellation / no-show:</strong>{' '}
                More than 24 hours before the shoot window: full refund. Inside 24 hours, or no-show / no access: <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>no refund</strong>. If we cancel: full refund or a free reshoot. No callout fee. Full schedule in the <Link href="/terms#refunds" onClick={openLegal('terms')} style={{ color: 'var(--brickDeep)' }}>Terms</Link>.
              </p>
              <p style={{ fontSize: 11.5, color: 'var(--inkFaint)', marginTop: 12 }}>By paying you agree to our <Link href="/terms" onClick={openLegal('terms')} style={{ color: 'var(--brickDeep)' }}>Terms</Link> and <Link href="/privacy" onClick={openLegal('privacy')} style={{ color: 'var(--brickDeep)' }}>Privacy Policy</Link>, including the cancellation and no-show schedule above.</p>
              <LegalDocSheet doc={legalOpen} read={legalOpen ? !!legalRead[legalOpen] : false} onRead={(k) => setLegalRead((r) => ({ ...r, [k]: true }))} onClose={() => setLegalOpen(null)} />
              <div className="nav-btns"><button type="button" className="btn btn-ghost" onClick={() => goPrev(3)}>← Back</button><button type="button" className="btn btn-brick" disabled={paying} onClick={pay}>{paying ? 'Starting checkout…' : 'Pay & book'}</button></div>
              <p className="hint-sm" style={{ margin: '12px 0 0' }}>Have a launch code? Enter it at checkout.</p>
            </div>
          </form>
        )}

        {step === 'done' && (
          <div className="panel active">
            <div className="done-box">
              {doneMsg.endsWith('…') && <BricksLoader variant="assemble" size={40} label={doneMsg} style={{ marginBottom: 16 }} />}
              <h2>{doneTitle}</h2>
              <p>{doneMsg}</p>
              {scheduleCtaVisible && (
                <div style={{ display: 'block', marginTop: 16, padding: 'var(--card-pad)', border: '1px solid var(--hairStrong)', borderRadius: 2 }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 500, color: 'var(--ink)' }}>Shoot booked ✓</h3>
                  <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--inkSoft)' }}>Your booked time is locked and sent to the photographer. A confirmation email is on its way.</p>
                </div>
              )}
              <p style={{ marginTop: 16 }}><Link href="/" style={{ color: 'var(--brickDeep)', fontWeight: 500 }}>← Back to overview</Link></p>
            </div>
          </div>
        )}
      </div>

      <div className="wrap">
        <section className="faq-wrap rvl" style={{ padding: 'var(--sec-half) 0', borderTop: '1px solid var(--hair)' }}>
          <div className="faq-head">
            <h2>Before you book.</h2>
            <p>Add-ons, scheduling, and what happens if plans change.</p>
          </div>
          <div className="faq">
            <div className="qa"><h4>What&apos;s in Essentials?</h4><p>HDR interiors and exteriors, licensed drone and a branded floor plan, from ${CORE_FROM}.</p></div>
            <div className="qa"><h4>Are the photos MLS-safe?</h4><p>Yes. We keep real window views and don&apos;t add fake skies by default. Twilight is shot for real at blue hour.</p></div>
            <div className="qa"><h4>How does travel work?</h4><p>Travel is priced from the assigned photographer&apos;s location: the first 25 km are free, then $0.75/km. It&apos;s often free in the GTA, and it&apos;s on your quote before you pay.</p></div>
            <div className="qa"><h4>Is the {VISIT_NAME.toLowerCase()} included?</h4><p>No. It&apos;s an add-on, {VISIT_PRICE_LABEL.toLowerCase()}. Pick it in Step 2.</p></div>
            <div className="qa"><h4>How fast is delivery?</h4><p>We aim to deliver photos 24 hours after the shoot, and other media in 24–48 hours. Rush (+${RUSH_FLAT}) is faster. You get a media link and a property website, with MLS, web and print downloads.</p></div>
            <div className="qa"><h4>What&apos;s included with twilight?</h4><p>Exterior photos at blue hour, with the windows lit and colour still in the sky. Add it to any shoot in Step 2.</p></div>
            <div className="qa"><h4>What is virtual staging?</h4><p>Furniture and décor added to photos of empty or dated rooms. {STAGING_PRICE_LABEL}, before tax, and not part of any package. Choose how many photos in Step 2.</p></div>
            <div className="qa"><h4>Can I reschedule after booking?</h4><p>More than 24 hours before the shoot window is free. Inside 24 hours we will try; if we cannot, the cancellation schedule applies. Email <a href="mailto:booking@brxs.ca">booking@brxs.ca</a> as soon as you know — see the <Link href="/terms#refunds">cancellation policy</Link>.</p></div>
            <div className="qa"><h4>What if I need to cancel?</h4><p>More than 24 hours before the shoot window: full refund. Inside 24 hours, or no-show / no access: no refund. If we cancel on our side: full refund or a free reshoot, your choice. No callout fee. Full schedule in the <Link href="/terms#refunds">Terms</Link>.</p></div>
            <div className="qa"><h4>How do refunds work?</h4><p>Refunds go back to your original payment method, typically within 5–10 business days.</p></div>
            <div className="qa"><h4>Can I pay with Apple Pay or Google Pay?</h4><p>Yes, plus cards. Apple Pay works in Safari and on iOS, Google Pay in Chrome and on Android. We don&apos;t take PayPal, Klarna, Afterpay or Interac.</p></div>
          </div>
        </section>
      </div>
    </>
  )
}
