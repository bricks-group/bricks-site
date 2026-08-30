'use client'

import { useState, useEffect } from 'react'

const DISPATCH_API = 'https://dispatch-api.brxs.ca/api/onboarding'

export default function PhotographerForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [droneVisible, setDroneVisible] = useState(false)
  const [icText, setIcText] = useState('Loading agreement…')
  const [err, setErr] = useState('')
  const [resumeWarning, setResumeWarning] = useState('')

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

  async function uploadResume(memberId: string, file: File) {
    const base64 = await fileToBase64(file)
    const fd = new FormData()
    fd.append('member_id', memberId)
    fd.append('doc_type', 'resume')
    fd.append('filename', file.name)
    fd.append('file_data', base64)
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
    const city = (fd.get('city') as string || '').trim()
    const equipmentRaw = (fd.get('equipment') as string) || ''
    const portfolio1 = (fd.get('portfolio1') as string || '').trim()
    const hstNumber = (fd.get('hst_number') as string || '').trim()
    const accepted = (form.querySelector<HTMLInputElement>('#f_accept'))?.checked

    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !phone || !city || !equipmentRaw.trim() || !portfolio1 || !hstNumber) {
      setErr('Fill in all required fields marked *.'); return
    }
    if (!accepted) { setErr('Please read and accept the IC Agreement before submitting.'); return }

    const droneChecked = specialties.includes('drone')
    const rpasLevel = (fd.get('f_rpas') as string) || null
    if (droneChecked && !rpasLevel) { setErr('Select your RPAS certification level for drone work.'); return }

    const portfolio2 = (fd.get('portfolio2') as string || '').trim()
    const equipmentList = equipmentRaw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)

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

    const payload = {
      name, email, phone, city,
      max_travel_km: parseInt((fd.get('max_travel_km') as string) || '50', 10),
      specialties,
      portfolio_links: [portfolio1].concat(portfolio2 ? [portfolio2] : []),
      equipment_list: equipmentList,
      hst_number: hstNumber,
      company_website: (fd.get('company_website') as string || '').trim(),
      drone_certified: !!(droneChecked && rpasLevel && rpasLevel !== 'none'),
      rpas_certificate_level: rpasLevel && rpasLevel !== 'none' ? rpasLevel : null,
      rpas_certificate_number: (fd.get('rpas_certificate_number') as string || '').trim() || null,
      accepted_terms: true,
      ic_agreement_version: '1.3',
      preferred_regions: [] as string[],
    }

    setSubmitting(true)
    try {
      const r = await fetch(DISPATCH_API + '/apply', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
      const data = await r.json()
      if (!r.ok) { setErr(data.detail || 'Something went wrong. Please try again.'); setSubmitting(false); return }

      if (resumeFile && resumeFile.size > 0 && data.member_id) {
        try {
          await uploadResume(data.member_id, resumeFile)
        } catch {
          setResumeWarning('Application received, but your resume didn’t upload — email it to booking@brxs.ca if you’d like it reviewed.')
        }
      }
      setSubmitted(true)
    } catch {
      setErr('Network error. Please check your connection and try again.'); setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="success-box aform">
        <div className="check">✓</div>
        <h3>Application received.</h3>
        <p>We&apos;ll review your portfolio and be in touch within 3 business days. Check your email — including spam.</p>
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
        <div className="field"><label>Home city <span className="req">*</span></label><input name="city" placeholder="Toronto, ON" required /></div>
        <div className="field"><label>Max travel radius</label>
          <select name="max_travel_km" defaultValue="50">
            <option value="25">25 km</option>
            <option value="50">50 km</option>
            <option value="75">75 km</option>
            <option value="100">100 km</option>
          </select>
        </div>
      </div>

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
          <div className="field"><label>Transport Canada RPAS certification <span className="req">*</span></label>
            <div className="radio-row">
              <label><input type="radio" name="f_rpas" value="none" /> Not certified</label>
              <label><input type="radio" name="f_rpas" value="basic" /> Basic certificate</label>
              <label><input type="radio" name="f_rpas" value="advanced" /> Advanced certificate</label>
            </div>
            <span className="hint-sm">Controlled airspace near Pearson / Billy Bishop requires Advanced RPAS. We verify with Transport Canada before routing drone jobs.</span>
          </div>
          <div className="field"><label>RPAS certificate number</label><input name="rpas_certificate_number" placeholder="PC-XXXXXXXX" /></div>
        </div>
      )}

      <div className="field"><label>Equipment <span className="req">*</span></label>
        <textarea name="equipment" rows={3} placeholder="Camera body, lenses, drone model (if applicable), editing software…" required
          style={{ width: '100%', fontFamily: 'inherit', fontSize: 15, color: 'var(--ink)', background: 'var(--paperDeep)', border: '1px solid var(--hairStrong)', borderRadius: 2, padding: '12px 14px', resize: 'vertical' }} />
        <span className="hint-sm">List your primary kit. We&apos;re looking for full-frame or equivalent, fast primes, and ideally a DJI/Autel drone for aerial-capable applicants.</span>
      </div>

      <div className="fsec">03 · Your work</div>
      <div className="field"><label>Portfolio link 1 <span className="req">*</span></label><input name="portfolio1" type="url" placeholder="https://yourportfolio.com" required /></div>
      <div className="field"><label>Portfolio link 2 <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none' }}>(optional)</span></label><input name="portfolio2" type="url" placeholder="https://instagram.com/yourhandle" /></div>
      <div className="field"><label>Resume <span className="req">*</span></label>
        <input name="resume" type="file" accept=".pdf,.doc,.docx" required />
        <span className="hint-sm">PDF, DOC, or DOCX — 8MB max. Required.</span>
      </div>

      <div className="fsec">04 · Business info</div>
      <div className="field"><label>HST / GST number <span className="req">*</span></label>
        <input name="hst_number" placeholder="123456789 RT0001" required />
        <span className="hint-sm">Required for all paid contractors. We issue T4As for earnings ≥ $500/year.</span>
      </div>

      <div className="fsec">05 · Independent contractor agreement</div>
      <p className="hint-sm" style={{ margin: '0 0 4px' }}>Read the Bricks IC Agreement below before accepting. This agreement governs your relationship with Bricks Group as an independent contractor under Ontario law.</p>
      <div className="ic-box">{icText}</div>
      <label className="ic-accept">
        <input type="checkbox" id="f_accept" required />
        <span>I have read and agree to the <strong>Bricks Independent Contractor Agreement v1.3</strong> with Bricks Group. I understand I am an independent contractor, not an employee; that I am responsible for my own taxes, equipment, and required insurance and WSIB proof before a first job; and that Transport Canada drone regulations are my sole responsibility.</span>
      </label>

      <div className="err">{err}</div>
      <div className="cta-row">
        <button type="submit" className="btn btn-brick" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit application →'}
        </button>
      </div>
      <p className="hint-sm">By submitting you confirm the information above is accurate. Bricks reviews all applications manually.</p>

      <style>{`
        .aform{background:var(--paper);border:1px solid var(--hair);border-radius:2px;padding:32px;margin-top:4px;max-width:100%;min-width:0;box-sizing:border-box;}
        .aform .fsec{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;
          color:var(--brickDeep);margin:26px 0 14px;padding-top:22px;border-top:1px solid var(--hair);}
        .aform .fsec:first-of-type{margin-top:0;padding-top:0;border-top:none;}
        .aform .check-col{display:grid;gap:8px;min-width:0;max-width:100%;}
        .aform .check-item{display:grid;grid-template-columns:auto 1fr;align-items:start;gap:10px;padding:11px 13px;border:1px solid var(--hairStrong);
          border-radius:2px;cursor:pointer;background:var(--paperDeep);font-family:'General Sans',sans-serif;font-size:14px;letter-spacing:0;text-transform:none;color:var(--ink);min-width:0;max-width:100%;box-sizing:border-box;}
        .aform .check-item input{width:auto;max-width:none;margin-top:3px;flex:none;}
        .aform .check-item span{min-width:0;white-space:normal;overflow-wrap:break-word;word-break:normal;}
        .aform .radio-row{display:flex;gap:8px;flex-wrap:wrap;}
        .aform .radio-row label{display:flex;align-items:center;gap:6px;padding:9px 12px;border:1px solid var(--hairStrong);
          border-radius:2px;font-size:13.5px;letter-spacing:0;text-transform:none;font-family:'General Sans',sans-serif;cursor:pointer;background:var(--paperDeep);}
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
        .aform .field > label{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--inkMute);}
        .aform .field .req{color:var(--brickDeep);}
        .aform .field input,.aform .field select{font-family:'General Sans',sans-serif;font-size:14px;background:var(--paperDeep);color:var(--ink);
          border:1px solid var(--hairStrong);border-radius:2px;padding:11px 12px;outline:none;width:100%;max-width:100%;min-width:0;box-sizing:border-box;}
        .aform .field input:focus,.aform .field select:focus{border-color:var(--brick);}
        .aform .hint-sm{font-size:11.5px;color:var(--inkFaint);line-height:1.4;display:block;margin-top:4px;}
        .aform .err{color:var(--brickDeep);font-size:12.5px;font-family:'JetBrains Mono',monospace;min-height:14px;}
        @media (max-width:680px){ .aform .grid2{grid-template-columns:1fr;} .aform .radio-row{flex-direction:column;} .aform{padding:22px;} }
      `}</style>
    </form>
  )
}
