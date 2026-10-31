'use client'

import { useState } from 'react'
import { LegalDocRows, LegalDocSheet, useLegalReads } from '@/components/legal/LegalDocRows'
import { lockedReason, type LegalDocKey } from '@/lib/legal-docs'
import type { Trade } from '@/lib/services'

// Same flow and scoring as /photographers, minus photo samples and the resume.
const APPLY_DOCS: readonly LegalDocKey[] = ['ic', 'privacy']
const DISPATCH_API = 'https://dispatch-api.brxs.ca/api/onboarding'
const CGL_MIN_CENTS = 200_000_000 // $2M
const DOC_MAX_BYTES = 4 * 1024 * 1024
const DOC_EXTS = ['.pdf', '.png', '.jpg', '.jpeg']

const SOURCE_OPTIONS: { value: string; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'google', label: 'Google search' },
  { value: 'indeed', label: 'Indeed' },
  { value: 'craigslist_kijiji', label: 'Craigslist/Kijiji' },
  { value: 'referral_photographer', label: 'Referral from a vendor' },
  { value: 'referral_realtor', label: 'Referral from a realtor/brokerage' },
  { value: 'event', label: 'Event or meetup' },
  { value: 'other', label: 'Other' },
]
const SOURCE_DETAIL_MAX = 80

const CITIES = [
  'Toronto', 'Etobicoke', 'North York', 'Scarborough', 'Mississauga', 'Brampton', 'Oakville', 'Burlington', 'Milton',
  'Vaughan', 'Markham', 'Richmond Hill', 'Aurora', 'Newmarket', 'Pickering', 'Ajax', 'Whitby', 'Oshawa',
  'Hamilton', 'Barrie', 'Guelph', 'Kitchener', 'Waterloo', 'Cambridge', 'St. Catharines', 'Niagara Falls',
  'Peterborough', 'Brantford', 'London', 'Kingston', 'Ottawa',
]
const DAYS = [{ v: 'mon', l: 'Mon' }, { v: 'tue', l: 'Tue' }, { v: 'wed', l: 'Wed' }, { v: 'thu', l: 'Thu' }, { v: 'fri', l: 'Fri' }]
const WINDOWS = [
  { v: 'early_morning', l: 'Early morning', h: '6–9am' },
  { v: 'daytime', l: 'Daytime', h: '9am–5pm' },
  { v: 'evening', l: 'Evening', h: '5–9pm' },
]
const NOTICE = [{ v: '12', l: '12 hours' }, { v: '24', l: '24 hours' }, { v: '48', l: '2 days' }, { v: '72', l: '3 days' }, { v: '168', l: '1 week' }]

const TOOLS_HINT: Record<Trade['vendorType'], string> = {
  stager: 'Inventory, truck, crew size, rental sources',
  cleaner: 'Supplies, vacuums, steam or floor machines, crew size',
  inspector: 'Moisture meter, thermal camera, ladder, report software',
  measurer: 'Laser measure, measuring app or software, the standard you use',
  handyman: 'Tools, vehicle, ladders',
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1] || '')
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function checkDoc(f: File | null, label: string): string {
  if (!f || f.size === 0) return ''
  if (!DOC_EXTS.some((x) => f.name.toLowerCase().endsWith(x))) return `${label} must be a PDF, PNG or JPEG.`
  if (f.size > DOC_MAX_BYTES) return `${label} is too large (4 MB max).`
  return ''
}

export default function TradeApplyForm({ trade }: { trade: Trade }) {
  const needsCgl = trade.apply.cgl
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [hstExempt, setHstExempt] = useState(false)
  const [source, setSource] = useState('')
  const [cityChoice, setCityChoice] = useState('')
  const legal = useLegalReads(APPLY_DOCS)
  const [accept, setAccept] = useState(false)
  const [showWhy, setShowWhy] = useState(false)
  const acceptMsg = showWhy ? lockedReason(APPLY_DOCS, legal.read) : ''
  const [err, setErr] = useState('')
  const [docWarning, setDocWarning] = useState('')
  const today = new Date().toISOString().slice(0, 10)

  async function uploadDoc(memberId: string, token: string, docType: 'coi' | 'wsib', file: File) {
    const fd = new FormData()
    fd.append('member_id', memberId)
    fd.append('doc_type', docType)
    fd.append('filename', file.name)
    fd.append('file_data', await fileToBase64(file))
    if (token) { fd.append('token', token); fd.append('application_token', token) }
    const r = await fetch(DISPATCH_API + '/documents', { method: 'POST', body: fd })
    if (!r.ok) throw new Error(`${docType} upload failed`)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErr('')
    const form = e.currentTarget
    const fd = new FormData(form)
    const s = (k: string) => ((fd.get(k) as string) || '').replace(/\s+/g, ' ').trim()
    if (s('company_website')) { setErr('Submission rejected.'); return }

    const name = s('name'), email = s('email'), phone = s('phone')
    const city = cityChoice === '__other' ? s('city_other') : cityChoice
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !phone) { setErr('Fill in your name, email and phone.'); return }
    if (!city) { setErr('Pick your home city.'); return }
    const tools = s('tools')
    if (tools.length < 8) { setErr('Tell us the tools and equipment you work with.'); return }

    const weekdays = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="days"]:checked')).map((c) => c.value)
    const windows = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="windows"]:checked')).map((c) => c.value)
    if (fd.get('weekends') == null) { setErr('Tell us whether you can work weekends.'); return }
    const weekends = fd.get('weekends') === 'yes'
    const availability = {
      days_of_week: [...weekdays, ...(weekends ? ['sat', 'sun'] : [])],
      weekends,
      time_windows: windows,
      earliest_start_date: s('earliest_start_date'),
      shoots_per_week: parseInt(s('jobs_per_week'), 10),
      max_shoots_per_day: parseInt(s('max_jobs_per_day'), 10),
      notice_hours: parseInt(s('notice_hours'), 10),
      has_car: fd.get('has_car') === 'yes' ? true : fd.get('has_car') === 'no' ? false : null,
      has_licence: fd.get('has_licence') === 'yes' ? true : fd.get('has_licence') === 'no' ? false : null,
    }
    if (!availability.days_of_week.length) { setErr('Pick the days you can work.'); return }
    if (!windows.length) { setErr('Pick at least one time window.'); return }
    if (!availability.earliest_start_date) { setErr('Pick your earliest start date.'); return }
    if (!(availability.shoots_per_week >= 1)) { setErr('Tell us how many jobs a week you expect to take.'); return }
    if (!(availability.max_shoots_per_day >= 1)) { setErr('Tell us your max jobs per day.'); return }
    if (!(availability.notice_hours >= 1)) { setErr('Tell us how much notice you need.'); return }
    if (availability.has_car === null || availability.has_licence === null) { setErr("Tell us whether you have a vehicle and a driver's licence."); return }

    const coi = (fd.get('coi') as File) || null
    const wsib = (fd.get('wsib_file') as File) || null
    const cglConfirmed = fd.get('cgl_confirmed') === 'on'
    if (needsCgl) {
      if (!coi || coi.size === 0) { setErr('Attach your certificate of insurance (PDF, PNG or JPEG).'); return }
      if (!s('insurer')) { setErr('Enter your insurer.'); return }
      if (!cglConfirmed) { setErr('Confirm you carry at least $2M commercial general liability insurance.'); return }
    }
    const docErr = checkDoc(needsCgl ? coi : null, 'Certificate of insurance') || checkDoc(trade.apply.wsibOptional ? wsib : null, 'WSIB clearance')
    if (docErr) { setErr(docErr); return }

    const hstNumber = s('hst_number')
    if (!hstNumber && !hstExempt) { setErr('Enter your HST/GST number, or confirm the small-supplier exemption below.'); return }
    const sourceVal = s('source')
    const sourceDetailRaw = s('source_detail').slice(0, SOURCE_DETAIL_MAX)
    if (!SOURCE_OPTIONS.some((o) => o.value === sourceVal)) { setErr('Tell us how you heard about Bricks.'); return }
    if (sourceVal === 'other' && !sourceDetailRaw) { setErr('Tell us where you heard about Bricks.'); return }
    const sourceDetail = sourceVal === 'other' || sourceVal.startsWith('referral_') ? (sourceDetailRaw || null) : null
    if (!legal.done) { setShowWhy(true); setErr('Read both documents and accept the agreement before submitting.'); return }
    if (!accept) { setErr('Please read and accept the independent contractor agreement before submitting.'); return }

    const portfolio = s('portfolio')
    if (portfolio && !/^https?:\/\//i.test(portfolio)) { setErr('Links must start with https://.'); return }
    const years = parseInt(s('years_experience'), 10)
    const team = parseInt(s('team_size'), 10)
    const payload = {
      name, email, phone, city,
      max_travel_km: parseInt(s('max_travel_km') || '50', 10),
      vendor_type: trade.vendorType,
      specialties: [] as string[],
      portfolio_links: portfolio ? [portfolio] : [],
      equipment_list: [tools],
      availability,
      hst_number: hstNumber || null,
      hst_exempt: hstExempt,
      company_website: '',
      drone_certified: false,
      accepted_terms: true,
      ic_agreement_version: '1.9',
      preferred_regions: [] as string[],
      source: sourceVal,
      source_detail: sourceDetail,
      trade_credentials: {
        business_name: s('business_name'),
        years_experience: Number.isFinite(years) ? years : undefined,
        team_size: Number.isFinite(team) ? team : undefined,
        licences: s('licences'),
        service_notes: s('service_notes'),
        insurer: s('insurer') || undefined,
        policy_number: s('policy_number') || undefined,
        cgl_confirmed: cglConfirmed,
        cgl_limit_cents: cglConfirmed ? CGL_MIN_CENTS : 0,
        wsib_number: trade.apply.wsibOptional ? s('wsib_number') || undefined : undefined,
      },
    }

    setSubmitting(true)
    try {
      const r = await fetch(DISPATCH_API + '/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await r.json().catch(() => ({}))
      if (!r.ok) {
        const detail = typeof data.detail === 'string' ? data.detail : 'Something went wrong. Please try again.'
        setErr(detail); setSubmitting(false); return
      }
      const failed: string[] = []
      if (data.member_id) {
        if (needsCgl && coi && coi.size) {
          try { await uploadDoc(data.member_id, data.application_token || '', 'coi', coi) } catch { failed.push('certificate of insurance') }
        }
        if (trade.apply.wsibOptional && wsib && wsib.size) {
          try { await uploadDoc(data.member_id, data.application_token || '', 'wsib', wsib) } catch { failed.push('WSIB clearance') }
        }
      }
      if (failed.length) setDocWarning(`Application received, but your ${failed.join(' and ')} didn’t upload. Email it to help@brxs.ca so we can review your application.`)
      setSubmitted(true)
    } catch {
      setErr('Network error. Please check your connection and try again.'); setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="success-box tform" data-testid="trade-apply-sent">
        <div className="check">✓</div>
        <h3>Application received.</h3>
        <p>A person at Bricks reviews every application, usually within 1–3 business days. Check your email, including spam.</p>
        {docWarning && <p style={{ color: 'var(--brickDeep)', marginTop: 10 }}>{docWarning}</p>}
      </div>
    )
  }

  return (
    <form className="tform" onSubmit={handleSubmit} noValidate data-testid="trade-apply-form">
      <div aria-hidden style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label>Company website (leave blank)</label>
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="fsec">About you</div>
      <div className="grid2">
        <div className="field"><label htmlFor="t_name">Full name <span className="req">*</span></label><input id="t_name" name="name" required autoComplete="name" /></div>
        <div className="field"><label htmlFor="t_phone">Phone <span className="req">*</span></label><input id="t_phone" name="phone" type="tel" required autoComplete="tel" /></div>
      </div>
      <div className="grid2">
        <div className="field"><label htmlFor="t_email">Email <span className="req">*</span></label><input id="t_email" name="email" type="email" required autoComplete="email" /></div>
        <div className="field"><label htmlFor="t_biz">Business name</label><input id="t_biz" name="business_name" autoComplete="organization" /></div>
      </div>
      <div className="grid2">
        <div className="field"><label htmlFor="t_city">Home city <span className="req">*</span></label>
          <select id="t_city" required value={cityChoice} onChange={(e) => setCityChoice(e.target.value)}>
            <option value="" disabled>Choose your city</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            <option value="__other">Somewhere else…</option>
          </select>
        </div>
        <div className="field"><label htmlFor="t_km">Max travel radius</label>
          <select id="t_km" name="max_travel_km" defaultValue="50">
            <option value="25">25 km</option><option value="50">50 km</option><option value="100">100 km</option><option value="200">200 km</option>
          </select>
        </div>
      </div>
      {cityChoice === '__other' && (
        <div className="field"><label htmlFor="t_city_other">Your city <span className="req">*</span></label><input id="t_city_other" name="city_other" required /></div>
      )}

      <div className="fsec">Your work</div>
      <div className="grid2">
        <div className="field"><label htmlFor="t_years">Years doing this work</label><input id="t_years" name="years_experience" type="number" min={0} max={60} inputMode="numeric" /></div>
        <div className="field"><label htmlFor="t_team">People on your team</label><input id="t_team" name="team_size" type="number" min={1} max={500} inputMode="numeric" /></div>
      </div>
      <div className="field"><label htmlFor="t_tools">Tools and equipment <span className="req">*</span></label>
        <input id="t_tools" name="tools" required placeholder={TOOLS_HINT[trade.vendorType]} />
      </div>
      <div className="field"><label htmlFor="t_lic">Licences, designations or memberships</label><input id="t_lic" name="licences" /></div>
      <div className="field"><label htmlFor="t_notes">The jobs you do</label><textarea id="t_notes" name="service_notes" rows={3} maxLength={200} /></div>
      {trade.vendorType === 'stager' && (
        <div className="field"><label htmlFor="t_port">Portfolio link <span className="opt">(optional)</span></label><input id="t_port" name="portfolio" type="url" placeholder="https://" /></div>
      )}

      {needsCgl ? (
        <>
          <div className="fsec">Insurance</div>
          <p className="hint-sm" style={{ margin: '0 0 12px' }}>$2M commercial general liability insurance is required for repair and inspection vendors. A person checks the certificate before you take jobs.</p>
          <div className="grid2">
            <div className="field"><label htmlFor="t_insurer">Insurer <span className="req">*</span></label><input id="t_insurer" name="insurer" required /></div>
            <div className="field"><label htmlFor="t_policy">Policy number</label><input id="t_policy" name="policy_number" /></div>
          </div>
          <div className="field"><label htmlFor="t_coi">Certificate of insurance <span className="req">*</span></label>
            <input id="t_coi" name="coi" type="file" accept=".pdf,.png,.jpg,.jpeg" required />
            <span className="hint-sm">PDF, PNG or JPEG, 4 MB max.</span>
          </div>
          <label className="check-item">
            <input type="checkbox" name="cgl_confirmed" data-testid="cgl-confirm" />
            <span>I carry at least $2M commercial general liability insurance, and I&apos;ll keep it in force while I take jobs through Bricks.</span>
          </label>
          {trade.apply.wsibOptional && (
            <>
              <div className="grid2" style={{ marginTop: 16 }}>
                <div className="field"><label htmlFor="t_wsib">WSIB number <span className="opt">(optional)</span></label><input id="t_wsib" name="wsib_number" /></div>
                <div className="field"><label htmlFor="t_wsib_file">WSIB clearance <span className="opt">(optional)</span></label><input id="t_wsib_file" name="wsib_file" type="file" accept=".pdf,.png,.jpg,.jpeg" /></div>
              </div>
            </>
          )}
        </>
      ) : null}

      <div className="fsec">Availability</div>
      <div className="field"><label>Weekdays you can work</label>
        <div className="chip-row">{DAYS.map((d) => <label key={d.v} className="chip"><input type="checkbox" name="days" value={d.v} defaultChecked /> {d.l}</label>)}</div>
      </div>
      <div className="field"><label>Weekends <span className="req">*</span></label>
        <div className="radio-row"><label><input type="radio" name="weekends" value="yes" /> Yes</label><label><input type="radio" name="weekends" value="no" /> No</label></div>
      </div>
      <div className="field"><label>Time windows</label>
        <div className="chip-row">{WINDOWS.map((w) => <label key={w.v} className="chip"><input type="checkbox" name="windows" value={w.v} defaultChecked={w.v === 'daytime'} /> {w.l} <span className="chip-h">{w.h}</span></label>)}</div>
      </div>
      <div className="grid2">
        <div className="field"><label htmlFor="t_start">Earliest start date <span className="req">*</span></label><input id="t_start" name="earliest_start_date" type="date" min={today} defaultValue={today} /></div>
        <div className="field"><label htmlFor="t_notice">Notice you need</label>
          <select id="t_notice" name="notice_hours" defaultValue="48">{NOTICE.map((n) => <option key={n.v} value={n.v}>{n.l}</option>)}</select>
        </div>
      </div>
      <div className="grid2">
        <div className="field"><label htmlFor="t_pw">Jobs per week</label><input id="t_pw" name="jobs_per_week" type="number" min={1} max={40} defaultValue={3} /></div>
        <div className="field"><label htmlFor="t_pd">Max jobs per day</label><input id="t_pd" name="max_jobs_per_day" type="number" min={1} max={8} defaultValue={2} /></div>
      </div>
      <div className="grid2">
        <div className="field"><label>Vehicle <span className="req">*</span></label>
          <div className="radio-row"><label><input type="radio" name="has_car" value="yes" /> Yes</label><label><input type="radio" name="has_car" value="no" /> No</label></div>
        </div>
        <div className="field"><label>Driver&apos;s licence <span className="req">*</span></label>
          <div className="radio-row"><label><input type="radio" name="has_licence" value="yes" /> Yes</label><label><input type="radio" name="has_licence" value="no" /> No</label></div>
        </div>
      </div>

      <div className="fsec">Business info</div>
      <div className="field"><label htmlFor="t_hst">HST / GST number <span className="req">*</span></label>
        <input id="t_hst" name="hst_number" placeholder="123456789 RT0001" disabled={hstExempt} />
      </div>
      <label className="check-item" style={{ marginBottom: 16 }}>
        <input type="checkbox" onChange={(e) => setHstExempt(e.target.checked)} />
        <span>I&apos;m not GST/HST registered. My revenue across all clients is under $30,000 CAD a year (CRA small-supplier exemption).</span>
      </label>

      <div className="fsec">How you found us</div>
      <div className="field"><label htmlFor="t_source">How did you hear about Bricks? <span className="req">*</span></label>
        <select id="t_source" name="source" required value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="" disabled>Choose one</option>
          {SOURCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      {(source === 'other' || source.startsWith('referral_')) && (
        <div className="field"><label htmlFor="t_source_detail">{source === 'other' ? 'Where?' : 'Who referred you?'}</label>
          <input id="t_source_detail" name="source_detail" maxLength={SOURCE_DETAIL_MAX} />
        </div>
      )}

      <div className="fsec">Independent contractor agreement</div>
      <p className="hint-sm" style={{ margin: '0 0 4px' }}>Open and read both documents before accepting.</p>
      <LegalDocRows docs={APPLY_DOCS} read={legal.read} onOpen={legal.setOpen} />
      <label className={`ic-accept${legal.done ? '' : ' is-locked'}`} onClick={() => { if (!legal.done) setShowWhy(true) }}>
        <input
          type="checkbox"
          checked={legal.done && accept}
          aria-disabled={!legal.done}
          onChange={(e) => { if (!legal.done) { setShowWhy(true); return } setAccept(e.target.checked) }}
        />
        <span>I have read and agree to the <strong>Bricks Independent Contractor Agreement v1.9</strong> with Bricks Group. I understand I am an independent contractor, not an employee, and that I am responsible for my own taxes, tools and insurance.</span>
      </label>
      {acceptMsg ? <p className="ic-why" role="status">{acceptMsg}</p> : null}
      <LegalDocSheet doc={legal.open} read={legal.open ? !!legal.read[legal.open] : false} onRead={legal.markRead} onClose={() => legal.setOpen(null)} />

      <div className="err" role="alert">{err}</div>
      <div className="cta-row">
        <button type="submit" className="btn btn-night btn-primary" disabled={submitting}>{submitting ? 'Sending…' : 'Submit application'}</button>
      </div>
      <p className="hint-sm">A person at Bricks reviews every application and makes every decision.</p>

      <style>{`
        .tform{background:var(--paper);border:1px solid var(--hair);border-radius:2px;padding:var(--card-pad-lg,32px);max-width:100%;min-width:0;box-sizing:border-box;}
        .tform .fsec{font-size:16px;font-weight:500;letter-spacing:-0.2px;color:var(--ink);margin:24px 0 16px;padding-top:24px;border-top:1px solid var(--hair);}
        .tform .fsec:first-of-type{margin-top:0;padding-top:0;border-top:none;}
        .tform .grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .tform .field{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;min-width:0;}
        .tform .field > label{font-size:13px;font-weight:500;color:var(--inkMute);}
        .tform .req{color:var(--brickDeep);} .tform .opt{font-weight:400;}
        .tform .field input,.tform .field select,.tform .field textarea{font:inherit;font-size:14px;background:var(--paperDeep);color:var(--ink);border:1px solid var(--hairStrong);border-radius:2px;padding:12px;outline:none;width:100%;box-sizing:border-box;}
        .tform .field input:focus,.tform .field select:focus,.tform .field textarea:focus{border-color:var(--brick);}
        .tform .field input[type=file]{padding:9px;}
        .tform .chip-row,.tform .radio-row{display:flex;gap:8px;flex-wrap:wrap;}
        .tform .chip,.tform .radio-row label{display:flex;align-items:center;gap:8px;padding:0 12px;min-height:44px;border:1px solid var(--hairStrong);border-radius:2px;font-size:13.5px;color:var(--ink);background:var(--paperDeep);cursor:pointer;}
        .tform .field .chip input,.tform .field .radio-row input{width:auto;padding:0;}
        .tform .chip:has(input:checked),.tform .radio-row label:has(input:checked){border-color:var(--brick);}
        .tform .chip-h{font-size:11px;color:var(--inkMute);}
        .tform .check-item{display:grid;grid-template-columns:auto 1fr;gap:8px;padding:12px;border:1px solid var(--hairStrong);border-radius:2px;background:var(--paperDeep);font-size:14px;color:var(--ink);cursor:pointer;}
        .tform .check-item input{margin-top:3px;}
        .tform .ic-accept{display:flex;align-items:flex-start;gap:8px;padding:16px;border:1px solid var(--hairStrong);border-radius:2px;cursor:pointer;background:var(--paperDeep);font-size:13.5px;line-height:1.5;margin-bottom:16px;color:var(--ink);}
        .tform .ic-accept input{margin-top:3px;flex:none;accent-color:var(--ink);}
        .tform .ic-accept.is-locked{cursor:not-allowed;color:var(--inkMute);}
        .tform .ic-accept.is-locked input{opacity:.4;}
        .tform .ic-why{margin:-8px 0 16px;font-size:13px;color:var(--inkSoft);}
        .tform .hint-sm{font-size:12px;color:var(--inkMute);line-height:1.45;display:block;margin-top:4px;}
        .tform .err{color:var(--brickDeep);font-size:13px;min-height:16px;margin-bottom:8px;}
        .success-box.tform{text-align:center;padding:64px 32px;}
        .success-box .check{font-size:38px;margin-bottom:14px;color:var(--brickDeep);}
        .success-box h3{font-weight:500;font-size:24px;margin:0 0 10px;color:var(--ink);}
        .success-box p{color:var(--inkMute);font-size:14.5px;line-height:1.6;max-width:420px;margin:0 auto;}
        @media (max-width:680px){.tform{padding:20px 16px;}.tform .grid2{grid-template-columns:1fr;gap:0;}}
      `}</style>
    </form>
  )
}
