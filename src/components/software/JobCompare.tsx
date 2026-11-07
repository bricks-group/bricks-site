'use client'

import { useState } from 'react'
import type React from 'react'
import './software.css'

type Job = { job: string; without: string; tools: string; with: string }
type Audience = 'builder' | 'agent'

/**
 * With and without Bricks, one job per row. Every "with" line is something Bricks does today
 * (see the module pages and help articles). The tool counts describe this example, not a survey.
 */
export const JOBS: Record<Audience, { jobs: Job[]; tally: { label: string; without: string; with: string }[] }> = {
  builder: {
    jobs: [
      { job: 'Book the visit', without: 'Calls and emails to find a drone pilot', tools: 'Phone, email', with: 'Book once, or put the site on a monthly plan' },
      { job: 'Send someone', without: 'Find a pilot and check their insurance', tools: 'You', with: 'Bricks assigns a vetted, insured pilot' },
      { job: 'Make the maps', without: 'Run the flight through mapping software', tools: 'Mapping software', with: 'Orthomosaic and 3D model on mapped visits' },
      { job: 'Keep the files', without: 'Download links, saved to a shared drive', tools: 'File transfer, drive', with: 'Dated on the project timeline' },
      { job: 'Write the report', without: 'Copy images into slides, write what changed', tools: 'Slides', with: 'Pick the dates. Bricks drafts it' },
      { job: 'Share with investors', without: 'PDF attached to an email', tools: 'Email', with: 'A PDF, or a read-only link that expires' },
    ],
    tally: [
      { label: 'Logins', without: '3', with: '1' },
      { label: 'Vendors to chase', without: '1+', with: '0' },
    ],
  },
  agent: {
    jobs: [
      { job: 'Book media', without: 'Photographer, drone and video, booked one by one', tools: 'Texts, calls', with: 'One booking at one exact time' },
      { job: 'Brief vendors', without: 'Lockbox and access notes, sent to each', tools: 'Email ×3', with: 'Entered once, on the booking' },
      { job: 'Pay vendors', without: 'An invoice from each', tools: '3 invoices', with: 'One checkout. Bricks pays them' },
      { job: 'Get the files', without: 'A download link from each', tools: 'File transfer ×3', with: 'Edited media lands on the listing' },
      { job: 'Market it', without: 'Build a site, lay out a feature sheet', tools: 'Site builder, design tool', with: 'Listing site and launch kit, made for you' },
      { job: 'Sign', without: 'Upload to a separate e-sign tool', tools: 'E-sign tool', with: 'E-sign from the deal' },
      { job: 'Share updates', without: 'Threads with the lawyer, broker and inspector', tools: 'Email ×3', with: 'A deal room link for each' },
    ],
    tally: [
      { label: 'Logins', without: '5', with: '1' },
      { label: 'Bookings', without: '3', with: '1' },
      { label: 'Payments', without: '3', with: '1' },
    ],
  },
}

const AUDS = ['builder', 'agent'] as const
const LABEL: Record<Audience, string> = { builder: 'Builders and developers', agent: 'Agents and teams' }

export default function JobCompare({ initial = 'builder' }: { initial?: Audience }) {
  const [aud, setAud] = useState<Audience>(initial)
  const d = JOBS[aud]
  // Tabs keyboard pattern (as in shadcn/Radix Tabs): arrows move and select, Home/End jump.
  function onKey(e: React.KeyboardEvent<HTMLDivElement>) {
    const i = AUDS.indexOf(aud)
    const next = e.key === 'ArrowRight' ? (i + 1) % AUDS.length : e.key === 'ArrowLeft' ? (i - 1 + AUDS.length) % AUDS.length : e.key === 'Home' ? 0 : e.key === 'End' ? AUDS.length - 1 : -1
    if (next < 0) return
    e.preventDefault()
    setAud(AUDS[next])
    document.getElementById(`jc-tab-${AUDS[next]}`)?.focus()
  }
  return (
    <div className="jc">
      <div className="sc-tabs jc-tabs" role="tablist" aria-label="Who it’s for" onKeyDown={onKey}>
        {AUDS.map((a) => (
          <button key={a} id={`jc-tab-${a}`} type="button" role="tab" aria-selected={aud === a} aria-controls="jc-panel" tabIndex={aud === a ? 0 : -1} className={aud === a ? 'on' : ''} onClick={() => setAud(a)}>{LABEL[a]}</button>
        ))}
      </div>
      <div id="jc-panel" role="tabpanel" aria-labelledby={`jc-tab-${aud}`} key={aud} className="jc-panel">
      <div className="jc-table" role="table" aria-label={`With and without Bricks, ${LABEL[aud].toLowerCase()}`}>
        <div className="jc-row jc-head" role="row">
          <span role="columnheader" className="jc-job">The job</span>
          <span role="columnheader" className="jc-without">Without Bricks</span>
          <span role="columnheader" className="jc-with">With Bricks</span>
        </div>
        {d.jobs.map((j) => (
          <div className="jc-row" role="row" key={j.job}>
            <span role="rowheader" className="jc-job">{j.job}</span>
            <span role="cell" className="jc-without">
              <span className="jc-what">{j.without}</span>
              <span className="jc-tools">{j.tools}</span>
            </span>
            <span role="cell" className="jc-with">
              <span className="jc-mark" aria-hidden="true" />
              <span className="jc-what">{j.with}</span>
            </span>
          </div>
        ))}
        <div className="jc-row jc-foot" role="row">
          <span role="rowheader" className="jc-job">In this example</span>
          <span role="cell" className="jc-without">{d.tally.map((t) => <span key={t.label} className="jc-num"><b>{t.without}</b> {t.label.toLowerCase()}</span>)}</span>
          <span role="cell" className="jc-with">{d.tally.map((t) => <span key={t.label} className="jc-num"><b>{t.with}</b> {t.label.toLowerCase()}</span>)}</span>
        </div>
      </div>
      </div>
      <p className="wf-fine">An example, not a measurement. Your own tools will differ.</p>
    </div>
  )
}
