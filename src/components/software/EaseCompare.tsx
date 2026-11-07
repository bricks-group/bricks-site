'use client'

import { useState } from 'react'
import type React from 'react'
import { PRICE_ROWS, type PriceRow } from '@/lib/market-rates'
import './software.css'

type Aud = 'builder' | 'agent' | 'pm'
const AUDS: Aud[] = ['builder', 'agent', 'pm']
const LABEL: Record<Aud, string> = { builder: 'Builders', agent: 'Agents', pm: 'Property managers' }

/** The example: the same job, step by step. Every "with" step is a shipped feature. */
const FLOW: Record<Aud, { without: string[]; with: string[] }> = {
  builder: {
    without: ['Ask for quotes', 'Email the site rules', 'Agree a date', 'Chase the files', 'Build the report', 'Pay the invoice'],
    with: ['Book the visit', 'Bricks sends a vetted, insured pilot', 'Photos, maps and a drafted report land on the project'],
  },
  agent: {
    without: ['Find a photographer', 'Book drone separately', 'Send lockbox notes', 'Pay each invoice', 'Download from links', 'Upload to the listing'],
    with: ['Book photos, drone and video', 'Bricks assigns and edits', 'Media lands on the listing'],
  },
  pm: {
    without: ['Find an inspector', 'Agree a time', 'Send access notes', 'Chase the report', 'Find the last one', 'Pay the invoice'],
    with: ['Book the report', 'Bricks sends someone', 'Report lands, compared with the last one'],
  },
}

const $ = (n: number) => '$' + n.toLocaleString('en-CA')

function PriceBar({ r }: { r: PriceRow }) {
  const head = (
    <div className="ec-price-head">
      <span className="ec-price-job">{r.job}<span>{r.unit}</span></span>
      <span className="ec-price-fig"><b>{$(r.bricks)}</b> Bricks</span>
    </div>
  )
  if (!r.market) {
    return (
      <div className="ec-price">
        {head}
        {r.included ? <ul className="ec-incl">{r.included.map((t) => <li key={t}>{t}</li>)}</ul> : null}
      </div>
    )
  }
  const max = Math.max(r.market[1], r.bricks) * 1.12
  const pct = (n: number) => `${(n / max) * 100}%`
  return (
    <div className="ec-price">
      {head}
      <div className="ec-track" aria-hidden="true">
        <span className="ec-band" style={{ left: pct(r.market[0]), width: `calc(${pct(r.market[1])} - ${pct(r.market[0])})` }} />
        <span className="ec-dot" style={{ left: pct(r.bricks) }} />
      </div>
      <p className="ec-price-sub">
        Market {$(r.market[0])} to {$(r.market[1])}
        {r.bricksNote ? <> · Bricks {r.bricksNote}</> : null}
      </p>
    </div>
  )
}

export default function EaseCompare({ initial = 'builder' }: { initial?: Aud }) {
  const [aud, setAud] = useState<Aud>(initial)
  const f = FLOW[aud]
  function onKey(e: React.KeyboardEvent<HTMLDivElement>) {
    const i = AUDS.indexOf(aud)
    const n = e.key === 'ArrowRight' ? (i + 1) % AUDS.length : e.key === 'ArrowLeft' ? (i - 1 + AUDS.length) % AUDS.length : e.key === 'Home' ? 0 : e.key === 'End' ? AUDS.length - 1 : -1
    if (n < 0) return
    e.preventDefault(); setAud(AUDS[n]); document.getElementById(`ec-tab-${AUDS[n]}`)?.focus()
  }
  return (
    <div className="ec">
      <div className="sc-tabs ec-tabs" role="tablist" aria-label="Who it’s for" onKeyDown={onKey}>
        {AUDS.map((a) => (
          <button key={a} id={`ec-tab-${a}`} type="button" role="tab" aria-selected={aud === a} aria-controls="ec-panel" tabIndex={aud === a ? 0 : -1} className={aud === a ? 'on' : ''} onClick={() => setAud(a)}>{a === 'pm' ? <><span className="ec-full">Property managers</span><span className="ec-short">Managers</span></> : LABEL[a]}</button>
        ))}
      </div>
      <div id="ec-panel" role="tabpanel" aria-labelledby={`ec-tab-${aud}`} className="ec-panel" key={aud}>
        <div className="ec-flows">
          <section className="ec-without" aria-label="Without Bricks">
            <p className="ec-k">Without Bricks</p>
            <p className="ec-n">{f.without.length}<span>steps</span></p>
            <ul>{f.without.map((s) => <li key={s}>{s}</li>)}</ul>
          </section>
          <section className="ec-with" aria-label="With Bricks">
            <p className="ec-k">With Bricks</p>
            <p className="ec-n">{f.with.length}<span>steps</span></p>
            <ol>{f.with.map((s, i) => <li key={s}><span className="ec-i">{i + 1}</span>{s}</li>)}</ol>
            <p className="ec-one">One checkout.</p>
          </section>
        </div>
        <div className="ec-prices">
          <p className="ec-k">Price</p>
          {PRICE_ROWS[aud].map((r) => <PriceBar key={r.job} r={r} />)}
          {PRICE_ROWS[aud].some((r) => r.market) ? <p className="ec-legend"><span className="ec-legend-band" /> Market range <span className="ec-legend-dot" /> Bricks</p> : null}
        </div>
      </div>
      <p className="ec-note">Market range from published GTA and Ontario rates, 7 November 2026, CAD before tax. Your quotes will differ. Step counts are an example.</p>
    </div>
  )
}
