'use client'

import { useState, useEffect } from 'react'

const DISPATCH_API = 'https://dispatch-api.brxs.ca/api/onboarding'

// "How did you hear about Bricks?" keys match Dispatch backend/app/shared/applicant_source.py.
const SOURCE_OPTIONS: { value: string; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'google', label: 'Google search' },
  { value: 'indeed', label: 'Indeed' },
  { value: 'craigslist_kijiji', label: 'Craigslist/Kijiji' },
  { value: 'referral_photographer', label: 'Referral from a photographer' },
  { value: 'referral_realtor', label: 'Referral from a realtor/brokerage' },
  { value: 'event', label: 'Event or meetup' },
  { value: 'other', label: 'Other' },
]
const SOURCE_DETAIL_MAX = 80

// City picker. In the GTA is worked out by Dispatch from the city (never asked).
// Keep in sync with Dispatch backend/app/services/applicant_evidence.py.
const GTA_CITIES = [
  'Toronto', 'Etobicoke', 'North York', 'Scarborough', 'East York', 'York',
  'Mississauga', 'Brampton', 'Caledon', 'Oakville', 'Burlington', 'Milton', 'Halton Hills',
  'Vaughan', 'Markham', 'Richmond Hill', 'Aurora', 'Newmarket', 'King', 'Whitchurch-Stouffville',
  'East Gwillimbury', 'Georgina', 'Pickering', 'Ajax', 'Whitby', 'Oshawa', 'Clarington', 'Uxbridge', 'Scugog', 'Brock',
]
const NEAR_CITIES = [
  'Hamilton', 'Barrie', 'Guelph', 'Kitchener', 'Waterloo', 'Cambridge', 'St. Catharines', 'Niagara Falls',
  'Orangeville', 'Peterborough', 'Innisfil', 'Bradford West Gwillimbury', 'Brantford', 'London', 'Kingston', 'Ottawa',
]

// Sample photos go straight to Bricks storage (signed upload), then /apply gets the paths.
const MIN_SAMPLES = 8
const MAX_SAMPLES = 15
const SAMPLE_MAX_BYTES = 15 * 1024 * 1024
const SAMPLE_MIN_BYTES = 40 * 1024
const CERT_MAX_BYTES = 10 * 1024 * 1024
const IMAGE_TYPES: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', heic: 'image/heic', heif: 'image/heif',
}
function imageType(f: File): string {
  if (f.type && Object.values(IMAGE_TYPES).includes(f.type)) return f.type
  const ext = (f.name.split('.').pop() || '').toLowerCase()
  return IMAGE_TYPES[ext] || ''
}
function fileKey(f: File) { return `${f.name}:${f.size}:${f.lastModified}` }

const DAYS = [
  { v: 'mon', l: 'Mon' }, { v: 'tue', l: 'Tue' }, { v: 'wed', l: 'Wed' }, { v: 'thu', l: 'Thu' }, { v: 'fri', l: 'Fri' },
]
const WINDOWS = [
  { v: 'early_morning', l: 'Early morning', h: '6–9am' },
  { v: 'daytime', l: 'Daytime', h: '9am–5pm' },
  { v: 'evening', l: 'Evening', h: '5–9pm' },
]
const NOTICE = [
  { v: '2', l: 'Same day (2h)' }, { v: '12', l: '12 hours' }, { v: '24', l: '24 hours' }, { v: '48', l: '2 days' }, { v: '72', l: '3 days' },
]

type Uploaded = { session: string; paths: Record<string, string> }

export default function PhotographerForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [droneVisible, setDroneVisible] = useState(false)
  const [hstExempt, setHstExempt] = useState(false)
  const [source, setSource] = useState('')
  const [icText, setIcText] = useState('Loading agreement…')
  const [err, setErr] = useState('')
  const [resumeWarning, setResumeWarning] = useState('')
  const [cityChoice, setCityChoice] = useState('')
  const [rpas, setRpas] = useState('')
  const [samples, setSamples] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [certFile, setCertFile] = useState<File | null>(null)
  const [progress, setProgress] = useState('')
  const [uploaded, setUploaded] = useState<Uploaded | null>(null)
  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    const urls = samples.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [samples])

  function addSamples(list: FileList | null) {
    if (!list) return
    setErr('')
    const next = [...samples]
    const problems: string[] = []
    for (const f of Array.from(list)) {
      if (next.some((x) => fileKey(x) === fileKey(f))) continue
      if (!imageType(f)) { problems.push(`${f.name} isn't a JPEG, PNG, WebP or HEIC photo`); continue }
      if (f.size > SAMPLE_MAX_BYTES) { problems.push(`${f.name} is over 15 MB`); continue }
      if (f.size < SAMPLE_MIN_BYTES) { problems.push(`${f.name} is too small to review (upload the full-size export)`); continue }
      if (next.length >= MAX_SAMPLES) { problems.push(`Only ${MAX_SAMPLES} photos allowed`); break }
      next.push(f)
    }
    setSamples(next)
    if (problems.length) setErr(problems.join('. ') + '.')
  }

  async function uploadEvidence(files: File[], cert: File | null): Promise<{ session: string; samplePaths: string[]; certPath: string | null }> {
    // Re-use earlier uploads on a resubmit (same files, same session).
    const all = cert ? [...files, cert] : files
    if (uploaded && all.every((f) => uploaded.paths[fileKey(f)])) {
      return {
        session: uploaded.session,
        samplePaths: files.map((f) => uploaded.paths[fileKey(f)]),
        certPath: cert ? uploaded.paths[fileKey(cert)] : null,
      }
    }
    setProgress('Preparing upload…')
    const r = await fetch(DISPATCH_API + '/sample-uploads', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        files: all.map((f, i) => ({ name: f.name, type: imageType(f), size: f.size, kind: cert && i === all.length - 1 ? 'rpas_cert' : 'sample' })),
      }),
    })
    const data = await r.json().catch(() => ({}))
    if (!r.ok) throw new Error(data.detail || 'Photo upload is unavailable right now. Please try again.')
    const uploads: { path: string; signed_url: string }[] = data.uploads || []
    let done = 0
    const paths: Record<string, string> = {}
    const queue = all.map((f, i) => ({ f, u: uploads[i] }))
    async function worker() {
      while (queue.length) {
        const item = queue.shift()
        if (!item) return
        const put = await fetch(item.u.signed_url, { method: 'PUT', headers: { 'Content-Type': imageType(item.f) }, body: item.f })
        if (!put.ok) throw new Error(`${item.f.name} didn't upload. Please try again.`)
        paths[fileKey(item.f)] = item.u.path
        done += 1
        setProgress(`Uploading photos ${done}/${all.length}…`)
      }
    }
    await Promise.all([worker(), worker(), worker()])
    setUploaded({ session: data.session, paths })
    return {
      session: data.session,
      samplePaths: files.map((f) => paths[fileKey(f)]),
      certPath: cert ? paths[fileKey(cert)] : null,
    }
  }

  const RESUME_MAX_BYTES = 8 * 1024 * 1024 // 8MB
  const RESUME_EXTS = ['.pdf', '.doc', '.docx']

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve((reader.result as string).split(',')[1] || '')
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function uploadResume(memberId: string, applicationToken: string, file: File) {
    const base64 = await fileToBase64(file)
    const fd = new FormData()
    fd.append('member_id', memberId)
    fd.append('doc_type', 'resume')
    fd.append('filename', file.name)
    fd.append('file_data', base64)
    // Server _check_application_token requires the token from /apply (Form field token or application_token).
    if (applicationToken) {
      fd.append('token', applicationToken)
      fd.append('application_token', applicationToken)
    }
    const r = await fetch(DISPATCH_API + '/documents', { method: 'POST', body: fd })
    if (!r.ok) throw new Error('resume upload failed')
  }

  useEffect(() => {
    fetch('/legal/ic-agreement.txt')
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((t) => setIcText(t))
      .catch(() => setIcText('Could not load agreement. Please email booking@brxs.ca for the full text.'))
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErr('')
    const form = e.currentTarget
    const fd = new FormData(form)

    if ((fd.get('company_website') as string || '').trim()) { setErr('Submission rejected.'); return }

    const specialties = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="specialties"]:checked')).map((c) => c.value)
    if (!specialties.length) { setErr('Select at least one specialty.'); return }

    const name = (fd.get('name') as string || '').trim()
    const email = (fd.get('email') as string || '').trim()
    const phone = (fd.get('phone') as string || '').trim()
    const city = cityChoice === '__other' ? (fd.get('city_other') as string || '').replace(/\s+/g, ' ').trim() : cityChoice
    const portfolio1 = (fd.get('portfolio1') as string || '').trim()
    const portfolio2 = (fd.get('portfolio2') as string || '').trim()
    const hstNumber = (fd.get('hst_number') as string || '').trim()
    const hstExemptChecked = (form.querySelector<HTMLInputElement>('#f_hst_exempt'))?.checked
    const accepted = (form.querySelector<HTMLInputElement>('#f_accept'))?.checked
    const equipment = {
      camera_body: (fd.get('camera_body') as string || '').trim(),
      lenses: (fd.get('lenses') as string || '').trim(),
      tripod: (fd.get('tripod') as string || '').trim(),
      lighting: (fd.get('lighting') as string || '').trim(),
      drone_model: (fd.get('drone_model') as string || '').trim(),
    }

    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !phone) {
      setErr('Fill in your name, email and phone.'); return
    }
    if (!city) { setErr('Pick your home city.'); return }
    if (!equipment.camera_body || !equipment.lenses || !equipment.tripod) {
      setErr('Tell us your camera body, lenses and tripod.'); return
    }
    if (samples.length < MIN_SAMPLES || samples.length > MAX_SAMPLES) {
      setErr(`Upload ${MIN_SAMPLES}–${MAX_SAMPLES} sample real estate photos (you have ${samples.length}).`); return
    }

    const droneChecked = specialties.includes('drone')
    const rpasLevel = droneChecked ? rpas : ''
    const rpasNumber = (fd.get('rpas_certificate_number') as string || '').trim()
    const droneClaimed = droneChecked && (rpasLevel === 'basic' || rpasLevel === 'advanced')
    if (droneChecked && !rpasLevel) { setErr('Select your RPAS certification level for drone work.'); return }
    if (droneClaimed && !rpasNumber) { setErr('Enter your RPAS pilot certificate number.'); return }
    if (droneClaimed && !certFile) { setErr('Add a photo of your RPAS pilot certificate.'); return }

    const weekdays = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="days"]:checked')).map((c) => c.value)
    const weekends = fd.get('weekends') === 'yes'
    const windows = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="windows"]:checked')).map((c) => c.value)
    const availability = {
      days_of_week: [...weekdays, ...(weekends ? ['sat', 'sun'] : [])],
      weekends,
      time_windows: windows,
      earliest_start_date: (fd.get('earliest_start_date') as string || '').trim(),
      shoots_per_week: parseInt((fd.get('shoots_per_week') as string) || '', 10),
      max_shoots_per_day: parseInt((fd.get('max_shoots_per_day') as string) || '', 10),
      notice_hours: parseInt((fd.get('notice_hours') as string) || '', 10),
      has_car: fd.get('has_car') === 'yes' ? true : fd.get('has_car') === 'no' ? false : null,
      has_licence: fd.get('has_licence') === 'yes' ? true : fd.get('has_licence') === 'no' ? false : null,
    }
    if (fd.get('weekends') == null) { setErr('Tell us whether you can shoot weekends.'); return }
    if (!availability.days_of_week.length) { setErr('Pick the days you can shoot.'); return }
    if (!windows.length) { setErr('Pick at least one time window.'); return }
    if (!availability.earliest_start_date) { setErr('Pick your earliest start date.'); return }
    if (!(availability.shoots_per_week >= 1)) { setErr('Tell us how many shoots a week you expect to take.'); return }
    if (!(availability.max_shoots_per_day >= 1)) { setErr('Tell us your max shoots per day.'); return }
    if (!(availability.notice_hours >= 1)) { setErr('Tell us how much notice you need for a booking.'); return }
    if (availability.has_car === null || availability.has_licence === null) { setErr("Tell us whether you have a car and a driver's licence."); return }

    if (!hstNumber && !hstExemptChecked) {
      setErr('Enter your HST/GST number, or confirm the small-supplier exemption below.'); return
    }
    const sourceVal = (fd.get('source') as string || '').trim()
    const sourceDetailRaw = (fd.get('source_detail') as string || '').replace(/\s+/g, ' ').trim().slice(0, SOURCE_DETAIL_MAX)
    if (!SOURCE_OPTIONS.some((o) => o.value === sourceVal)) { setErr('Tell us how you heard about Bricks.'); return }
    if (sourceVal === 'other' && !sourceDetailRaw) { setErr('Tell us where you heard about Bricks.'); return }
    const sourceDetail = sourceVal === 'other' || sourceVal.startsWith('referral_') ? (sourceDetailRaw || null) : null

    const resumeFile = (fd.get('resume') as File) || null
    if (!resumeFile || resumeFile.size === 0) {
      setErr('Please attach your resume (PDF, DOC, or DOCX).'); return
    }
    const lower = resumeFile.name.toLowerCase()
    if (!RESUME_EXTS.some((ext) => lower.endsWith(ext))) {
      setErr('Resume must be a PDF, DOC, or DOCX file.'); return
    }
    if (resumeFile.size > RESUME_MAX_BYTES) {
      setErr('Resume file is too large (8MB max).'); return
    }
    if (!accepted) { setErr('Please read and accept the IC Agreement before submitting.'); return }

    const basePayload = {
      name, email, phone, city,
      max_travel_km: parseInt((fd.get('max_travel_km') as string) || '50', 10),
      vendor_type: 'photographer',
      specialties,
      portfolio_links: [portfolio1, portfolio2].filter(Boolean),
      equipment_list: [equipment.camera_body, equipment.lenses, equipment.tripod, equipment.lighting, droneChecked ? equipment.drone_model : '']
        .filter(Boolean),
      equipment: { ...equipment, drone_model: droneChecked ? equipment.drone_model : '' },
      availability,
      hst_number: hstNumber || null,
      hst_exempt: !!hstExemptChecked,
      company_website: (fd.get('company_website') as string || '').trim(),
      drone_certified: droneClaimed,
      rpas_certificate_level: droneClaimed ? rpasLevel : null,
      rpas_certificate_number: droneClaimed ? rpasNumber : null,
      accepted_terms: true,
      ic_agreement_version: '1.8',
      preferred_regions: [] as string[],
      source: sourceVal,
      source_detail: sourceDetail,
    }

    setSubmitting(true)
    let ev
    try {
      ev = await uploadEvidence(samples, droneClaimed ? certFile : null)
    } catch (upErr) {
      setProgress('')
      setErr((upErr as Error).message || 'Your photos didn\'t upload. Please try again.'); setSubmitting(false); return
    }
    const payload = {
      ...basePayload,
      sample_upload_session: ev.session,
      sample_paths: ev.samplePaths,
      rpas_cert_path: ev.certPath,
    }
    setProgress('Sending application…')
    try {
      const r = await fetch(DISPATCH_API + '/apply', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
      const data = await r.json()
      if (!r.ok) {
        const detail = data.detail || 'Something went wrong. Please try again.'
        if (/upload expired/i.test(detail)) setUploaded(null)
        setErr(detail); setProgress(''); setSubmitting(false); return
      }

      if (resumeFile && resumeFile.size > 0 && data.member_id) {
        try {
          await uploadResume(data.member_id, data.application_token || '', resumeFile)
        } catch {
          setResumeWarning('Application received, but your resume didn’t upload — email it to booking@brxs.ca if you’d like it reviewed.')
        }
      }
      setSubmitted(true)
    } catch {
      setErr('Network error. Please check your connection and try again.'); setProgress(''); setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="success-box aform">
        <div className="check">✓</div>
        <h3>Application received.</h3>
        <p>We&apos;ll review your photos and be in touch within 3 business days. Check your email — including spam.</p>
        {resumeWarning && <p style={{ color: 'var(--brickDeep)', marginTop: 10 }}>{resumeWarning}</p>}
      </div>
    )
  }

  return (
    <form className="aform" onSubmit={handleSubmit} noValidate>
      {/* Honeypot — hidden from real users; bots that autofill it get rejected. */}
      <div aria-hidden style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label>Company website (leave blank)</label>
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="fsec">01 · About you</div>
      <div className="grid2">
        <div className="field"><label>Full name <span className="req">*</span></label><input name="name" placeholder="Jordan Chen" required autoComplete="name" /></div>
        <div className="field"><label>Phone <span className="req">*</span></label><input name="phone" type="tel" placeholder="+1 (416) 555-0100" required autoComplete="tel" /></div>
      </div>
      <div className="field"><label>Email <span className="req">*</span></label><input name="email" type="email" placeholder="jordan@example.com" required autoComplete="email" /></div>
      <div className="grid2">
        <div className="field"><label htmlFor="f_city">Home city <span className="req">*</span></label>
          <select id="f_city" name="city_choice" required value={cityChoice} onChange={(e) => setCityChoice(e.target.value)}>
            <option value="" disabled>Choose your city</option>
            <optgroup label="Greater Toronto Area">
              {GTA_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </optgroup>
            <optgroup label="Nearby Ontario">
              {NEAR_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </optgroup>
            <option value="__other">Somewhere else…</option>
          </select>
        </div>
        <div className="field"><label>Max travel radius</label>
          <select name="max_travel_km" defaultValue="50">
            <option value="25">25 km</option>
            <option value="50">50 km</option>
            <option value="75">75 km</option>
            <option value="100">100 km</option>
          </select>
        </div>
      </div>
      {cityChoice === '__other' && (
        <div className="field"><label htmlFor="f_city_other">Your city <span className="req">*</span></label>
          <input id="f_city_other" name="city_other" required maxLength={80} placeholder="City, province" />
          <span className="hint-sm">Bookings are in the GTA for now. Tell us where you&apos;re based and we&apos;ll keep you on file.</span>
        </div>
      )}

      <div className="fsec">02 · What you shoot</div>
      <div className="field"><label>Specialties <span className="req">*</span> <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(select all that apply)</span></label>
        <div className="check-col">
          {[
            { value: 'photo', label: 'Real estate photography' },
            { value: 'video', label: 'Cinematic video' },
            { value: 'drone', label: 'Drone / aerial' },
            { value: 'virtual_tour', label: 'Virtual tour (path-confined walkthrough)' },
            { value: 'virtual_visit', label: 'Virtual visit (Gaussian splat / SuperSplat)' },
            { value: 'floor_plan', label: 'Floor plans' },
            { value: 'twilight', label: 'Twilight / blue hour' },
          ].map((s) => (
            <label key={s.value} className="check-item">
              <input
                type="checkbox" name="specialties" value={s.value}
                onChange={(e) => { if (s.value === 'drone') setDroneVisible(e.target.checked) }}
              />
              <span>{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      {droneVisible && (
        <div>
          <div className="field"><label>Transport Canada RPAS pilot certificate <span className="req">*</span></label>
            <div className="radio-row">
              {[{ v: 'none', l: 'Not certified' }, { v: 'basic', l: 'Basic' }, { v: 'advanced', l: 'Advanced' }].map((o) => (
                <label key={o.v}><input type="radio" name="f_rpas" value={o.v} checked={rpas === o.v} onChange={() => setRpas(o.v)} /> {o.l}</label>
              ))}
            </div>
            <span className="hint-sm">Controlled airspace near Pearson / Billy Bishop needs Advanced. Your pilot certificate number starts with PC- (your drone&apos;s registration number starting with C- is different).</span>
          </div>
          {(rpas === 'basic' || rpas === 'advanced') && (
            <div className="grid2">
              <div className="field"><label htmlFor="f_rpas_no">Pilot certificate number <span className="req">*</span></label>
                <input id="f_rpas_no" name="rpas_certificate_number" placeholder="PC-1234567890" required maxLength={40} />
              </div>
              <div className="field"><label htmlFor="f_rpas_cert">Certificate photo <span className="req">*</span></label>
                <input id="f_rpas_cert" type="file" accept="image/jpeg,image/png,image/webp,image/heic,.heic,.heif"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null
                    if (f && (!imageType(f) || f.size > CERT_MAX_BYTES)) { setErr('Certificate photo must be a JPEG, PNG, WebP or HEIC under 10 MB.'); setCertFile(null); e.target.value = ''; return }
                    setCertFile(f)
                  }} />
                <span className="hint-sm">A clear photo or screenshot of the certificate (Drone Management Portal is fine).</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="field"><label>Equipment <span className="req">*</span></label>
        <div className="grid2">
          <div className="field sub"><label htmlFor="f_body">Camera body <span className="req">*</span></label><input id="f_body" name="camera_body" required maxLength={120} placeholder="Sony A7 IV" /></div>
          <div className="field sub"><label htmlFor="f_lenses">Lenses <span className="req">*</span></label><input id="f_lenses" name="lenses" required maxLength={200} placeholder="16-35mm f/4, 24-70mm f/2.8" /></div>
          <div className="field sub"><label htmlFor="f_tripod">Tripod <span className="req">*</span></label><input id="f_tripod" name="tripod" required maxLength={120} placeholder="Manfrotto 190" /></div>
          <div className="field sub"><label htmlFor="f_light">Flash / lighting</label><input id="f_light" name="lighting" maxLength={160} placeholder="Godox V1, or none" /></div>
          {droneVisible && <div className="field sub"><label htmlFor="f_drone">Drone model</label><input id="f_drone" name="drone_model" maxLength={120} placeholder="DJI Mini 4 Pro" /></div>}
        </div>
        <span className="hint-sm">Minimums for interiors: an interchangeable-lens camera (full-frame or APS-C), a lens that goes 16mm or wider on full frame (about 10–11mm on APS-C), and a tripod for bracketing.</span>
      </div>

      <div className="fsec">03 · Your work</div>
      <div className="field"><label htmlFor="f_samples">Sample real estate photos <span className="req">*</span> <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none' }}>({MIN_SAMPLES}–{MAX_SAMPLES} photos)</span></label>
        <input id="f_samples" type="file" multiple accept="image/jpeg,image/png,image/webp,image/heic,.heic,.heif"
          onChange={(e) => { addSamples(e.target.files); e.target.value = '' }} />
        <span className="hint-sm">Your own finished edits: interiors (kitchen, living, bedrooms, bathrooms) plus a front exterior. JPEG, PNG, WebP or HEIC, 15 MB each. We look at verticals, exposure, window views, colour and composition.</span>
        <div className="sample-count" aria-live="polite">{samples.length} of {MIN_SAMPLES}–{MAX_SAMPLES} added</div>
        {samples.length > 0 && (
          <div className="sample-grid">
            {samples.map((f, i) => (
              <div key={fileKey(f)} className="sample-cell">
                {previews[i] ? <img src={previews[i]} alt={f.name} /> : <div className="sample-ph">{f.name}</div>}
                <button type="button" aria-label={`Remove ${f.name}`} onClick={() => setSamples(samples.filter((x) => fileKey(x) !== fileKey(f)))}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="grid2">
        <div className="field"><label>Portfolio link <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none' }}>(optional)</span></label><input name="portfolio1" type="url" placeholder="https://yourportfolio.com" /></div>
        <div className="field"><label>Second link <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none' }}>(optional)</span></label><input name="portfolio2" type="url" placeholder="https://instagram.com/yourhandle" /></div>
      </div>
      <div className="field"><label>Resume <span className="req">*</span></label>
        <input name="resume" type="file" accept=".pdf,.doc,.docx" required />
        <span className="hint-sm">PDF, DOC, or DOCX — 8MB max. Required.</span>
      </div>

      <div className="fsec">04 · Availability</div>
      <div className="field"><label>Weekdays you can shoot <span className="req">*</span></label>
        <div className="chip-row">
          {DAYS.map((d) => <label key={d.v} className="chip"><input type="checkbox" name="days" value={d.v} /> {d.l}</label>)}
        </div>
      </div>
      <div className="field"><label>Weekends <span className="req">*</span></label>
        <div className="radio-row">
          <label><input type="radio" name="weekends" value="yes" /> Yes, Sat &amp; Sun</label>
          <label><input type="radio" name="weekends" value="no" /> No weekends</label>
        </div>
      </div>
      <div className="field"><label>Time windows <span className="req">*</span></label>
        <div className="chip-row">
          {WINDOWS.map((w) => <label key={w.v} className="chip"><input type="checkbox" name="windows" value={w.v} /> {w.l} <span className="chip-h">{w.h}</span></label>)}
        </div>
      </div>
      <div className="grid2">
        <div className="field"><label htmlFor="f_start">Earliest start date <span className="req">*</span></label><input id="f_start" name="earliest_start_date" type="date" min={today} required /></div>
        <div className="field"><label htmlFor="f_notice">Notice you need for a booking <span className="req">*</span></label>
          <select id="f_notice" name="notice_hours" defaultValue="" required>
            <option value="" disabled>Choose one</option>
            {NOTICE.map((n) => <option key={n.v} value={n.v}>{n.l}</option>)}
          </select>
        </div>
        <div className="field"><label htmlFor="f_spw">Shoots per week you can take <span className="req">*</span></label><input id="f_spw" name="shoots_per_week" type="number" min={1} max={40} inputMode="numeric" placeholder="5" required /></div>
        <div className="field"><label htmlFor="f_mpd">Max shoots per day <span className="req">*</span></label>
          <select id="f_mpd" name="max_shoots_per_day" defaultValue="" required>
            <option value="" disabled>Choose one</option>
            {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <div className="grid2">
        <div className="field"><label>Car for shoots <span className="req">*</span></label>
          <div className="radio-row"><label><input type="radio" name="has_car" value="yes" /> Yes</label><label><input type="radio" name="has_car" value="no" /> No</label></div>
        </div>
        <div className="field"><label>Driver&apos;s licence <span className="req">*</span></label>
          <div className="radio-row"><label><input type="radio" name="has_licence" value="yes" /> Yes</label><label><input type="radio" name="has_licence" value="no" /> No</label></div>
        </div>
      </div>

      <div className="fsec">05 · Business info</div>
      <div className="field"><label>HST / GST number <span className="req">*</span></label>
        <input name="hst_number" placeholder="123456789 RT0001" disabled={hstExempt} required={!hstExempt} />
        <span className="hint-sm">Required once your revenue across all clients exceeds $30,000 CAD/year. We issue T4As for earnings ≥ $500/year.</span>
      </div>
      <label className="check-item" style={{ marginBottom: 16 }}>
        <input
          type="checkbox" id="f_hst_exempt"
          onChange={(e) => setHstExempt(e.target.checked)}
        />
        <span>I&apos;m not GST/HST registered — my revenue across all clients is under $30,000 CAD/year, so I&apos;m not required to register (CRA small-supplier exemption).</span>
      </label>

      <div className="fsec">06 · How you found us</div>
      <div className="field"><label htmlFor="f_source">How did you hear about Bricks? <span className="req">*</span></label>
        <select id="f_source" name="source" required value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="" disabled>Choose one</option>
          {SOURCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      {source === 'other' && (
        <div className="field"><label htmlFor="f_source_detail">Where? <span className="req">*</span></label>
          <input id="f_source_detail" key="source-other" name="source_detail" required maxLength={SOURCE_DETAIL_MAX} placeholder="Podcast, newsletter, a friend…" />
        </div>
      )}
      {source.startsWith('referral_') && (
        <div className="field"><label htmlFor="f_source_detail">Who referred you? <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none' }}>(optional)</span></label>
          <input id="f_source_detail" key="source-referral" name="source_detail" maxLength={SOURCE_DETAIL_MAX} placeholder="Their name or brokerage" autoComplete="off" />
        </div>
      )}

      <div className="fsec">07 · Independent contractor agreement</div>
      <p className="hint-sm" style={{ margin: '0 0 4px' }}>Read the Bricks IC Agreement below before accepting. This agreement governs your relationship with Bricks Group as an independent contractor under Ontario law.</p>
      <div className="ic-box">{icText}</div>
      <label className="ic-accept">
        <input type="checkbox" id="f_accept" required />
        <span>I have read and agree to the <strong>Bricks Independent Contractor Agreement v1.8</strong> with Bricks Group. I understand I am an independent contractor, not an employee; that I am responsible for my own taxes and equipment; and that Transport Canada drone regulations are my sole responsibility.</span>
      </label>

      <div className="err">{err}</div>
      <div className="cta-row">
        <button type="submit" className="btn btn-brick" disabled={submitting}>
          {submitting ? (progress || 'Submitting…') : 'Submit application →'}
        </button>
      </div>
      <p className="hint-sm">By submitting you confirm the information above is accurate and the sample photos are your own work. Bricks checks your photos and kit automatically, and a person makes every decision.</p>

      <style>{`
        .aform{background:var(--paper);border:1px solid var(--hair);border-radius:2px;padding:32px;margin-top:4px;max-width:100%;min-width:0;box-sizing:border-box;}
        .aform .fsec{font-family:'Ioskeley Mono','JetBrains Mono',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;
          color:var(--brickDeep);margin:26px 0 14px;padding-top:22px;border-top:1px solid var(--hair);}
        .aform .fsec:first-of-type{margin-top:0;padding-top:0;border-top:none;}
        .aform .check-col{display:grid;gap:8px;min-width:0;max-width:100%;}
        .aform .check-item{display:grid;grid-template-columns:auto 1fr;align-items:start;gap:10px;padding:11px 13px;border:1px solid var(--hairStrong);
          border-radius:2px;cursor:pointer;background:var(--paperDeep);font-family:'General Sans',sans-serif;font-size:14px;letter-spacing:0;text-transform:none;color:var(--ink);min-width:0;max-width:100%;box-sizing:border-box;}
        .aform .check-item input{width:auto;max-width:none;margin-top:3px;flex:none;}
        .aform .check-item span{min-width:0;white-space:normal;overflow-wrap:break-word;word-break:normal;}
        .aform .radio-row{display:flex;gap:8px;flex-wrap:wrap;}
        .aform .radio-row label{display:flex;align-items:center;gap:6px;padding:9px 12px;border:1px solid var(--hairStrong);
          border-radius:2px;font-size:13.5px;letter-spacing:0;text-transform:none;font-family:'General Sans',sans-serif;cursor:pointer;background:var(--paperDeep);white-space:nowrap;flex:none;}
        .aform .radio-row input{width:auto;max-width:none;}
        .aform .ic-box{border:1px solid var(--hairStrong);border-radius:2px;background:var(--paperDeep);padding:16px 18px;
          font-size:12.5px;color:var(--inkSoft);line-height:1.6;max-height:240px;overflow-y:auto;margin:8px 0 14px;white-space:pre-wrap;}
        .aform .ic-accept{display:flex;align-items:flex-start;gap:10px;padding:14px;border:1px solid var(--hairStrong);
          border-radius:2px;cursor:pointer;background:var(--paperDeep);font-size:13.5px;line-height:1.5;margin-bottom:16px;}
        .aform .ic-accept input{margin-top:3px;flex:none;}
        .aform .ic-accept span{min-width:0;flex:1;overflow-wrap:anywhere;white-space:normal;}
        .success-box{text-align:center;padding:64px 28px;}
        .success-box .check{font-size:38px;margin-bottom:14px;color:var(--brickDeep);}
        .success-box h3{font-weight:500;font-size:24px;letter-spacing:-.5px;margin:0 0 10px;color:var(--ink);}
        .success-box p{color:var(--inkMute);font-size:14.5px;line-height:1.6;max-width:400px;margin:0 auto;}
        .aform .grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px;min-width:0;max-width:100%;}
        .aform .field{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;min-width:0;max-width:100%;}
        .aform .field > label{font-family:'Ioskeley Mono','JetBrains Mono',monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--inkMute);}
        .aform .field .req{color:var(--brickDeep);}
        .aform .field input,.aform .field select{font-family:'General Sans',sans-serif;font-size:14px;background:var(--paperDeep);color:var(--ink);
          border:1px solid var(--hairStrong);border-radius:2px;padding:11px 12px;outline:none;width:100%;max-width:100%;min-width:0;box-sizing:border-box;}
        .aform .field input:focus,.aform .field select:focus{border-color:var(--brick);}
        .aform .field .radio-row input,.aform .field .chip input,.aform .field .check-item input{width:auto;max-width:none;padding:0;}
        .aform .hint-sm{font-size:11.5px;color:var(--inkFaint);line-height:1.4;display:block;margin-top:4px;}
        .aform .field.sub{margin-bottom:0;}
        .aform .chip-row{display:flex;gap:8px;flex-wrap:wrap;}
        .aform .chip{display:flex;align-items:center;gap:6px;padding:9px 12px;border:1px solid var(--hairStrong);border-radius:2px;
          font-family:'General Sans',sans-serif;font-size:13.5px;letter-spacing:0;text-transform:none;color:var(--ink);background:var(--paperDeep);cursor:pointer;}
        .aform .chip input{width:auto;max-width:none;}
        .aform .chip:has(input:checked),.aform .radio-row label:has(input:checked){border-color:var(--brick);}
        .aform .chip-h{font-family:'Ioskeley Mono','JetBrains Mono',monospace;font-size:10.5px;color:var(--inkFaint);}
        .aform .sample-count{font-family:'Ioskeley Mono','JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--inkMute);}
        .aform .sample-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px;margin-top:6px;}
        .aform .sample-cell{position:relative;border:1px solid var(--hairStrong);border-radius:2px;overflow:hidden;background:var(--paperDeep);aspect-ratio:3/2;}
        .aform .sample-cell img{width:100%;height:100%;object-fit:cover;display:block;}
        .aform .sample-ph{font-size:10px;padding:6px;color:var(--inkMute);overflow-wrap:anywhere;}
        .aform .sample-cell button{position:absolute;right:4px;bottom:4px;font-family:'Ioskeley Mono','JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.08em;
          text-transform:uppercase;background:var(--ink);color:var(--paper);border:none;border-radius:2px;padding:3px 6px;cursor:pointer;}
        .aform .err{color:var(--brickDeep);font-size:12.5px;font-family:'Ioskeley Mono','JetBrains Mono',monospace;min-height:14px;}
        @media (max-width:680px){ .aform .grid2{grid-template-columns:1fr;} .aform .radio-row{flex-direction:column;} .aform{padding:22px;} }
      `}</style>
    </form>
  )
}
