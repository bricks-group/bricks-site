'use client'

import Link from 'next/link'
import { useStepScroll } from '@/components/steps-rail/useStepScroll'
import '@/components/steps-rail/steps-rail.css'
import './site-rail.css'

const STEPS = [
  {
    key: 'site', n: '01', label: 'Cadence',
    title: 'Pick the site and how often.',
    body: 'Visual or mapped, monthly to weekly. One plan per site.',
    panel: ['Site', 'Capture type', 'Cadence', 'Insurance minimum on your contract'],
  },
  {
    key: 'pilot', n: '02', label: 'Pilot',
    title: 'Only qualified pilots fly it.',
    body: 'We assign a top-tier pilot with Advanced RPAS and verified drone insurance.',
    panel: ['Top tier only', 'Advanced RPAS', 'Drone liability $2M+ verified', '$5M when your contract requires it'],
  },
  {
    key: 'file', n: '03', label: 'Site file',
    title: 'Every visit lands in one site file.',
    body: 'Dated photos, video and maps in one link for owners, lenders and site teams.',
    panel: ['Dated by visit', 'Photos and video', 'Orthomosaic + 3D (mapped)', 'One share link'],
  },
] as const

/** Builders page: same scroll-driven brick rail as the homepage steps (shared hook + tokens). */
export default function SiteRail() {
  const n = STEPS.length
  const { ref, active } = useStepScroll<HTMLElement>(n)
  const state = (i: number) => (i === active ? 'is-on' : i < active ? 'is-past' : 'is-next')

  const head = (
    <div className="cap-copy slab-head">
      <h2>Site progress in three steps.</h2>
      <p className="cap-lede">The network behind our listing shoots, pointed at your sites.</p>
      <Link className="learn-link slab-b-link" href="#quote">Request a site plan →</Link>
    </div>
  )

  return (
    <section ref={ref} className="cap-band flow-band slab slab-pinned slab-b site-rail" aria-label="How site progress works" style={{ ['--n' as string]: n }}>
      <div className="cap-inner slab-head-m">{head}</div>
      <div className="slab-pin">
        <div className="cap-inner slab-b-inner">
          <div className="slab-b-top">
            <div className="slab-head-d">{head}</div>
            <div className="slab-b-steps">
              <div className="slab-b-railwrap">
                <span className="slab-b-track" aria-hidden="true"><i /></span>
                <ol className="slab-b-rail" aria-label="Site progress steps">
                  {STEPS.map((s, i) => (
                    <li key={s.key} className={state(i)} aria-current={i === active ? 'step' : undefined}>
                      <span className="slab-brick" aria-hidden="true" />
                      <span className="slab-b-k"><span className="slab-n">{s.n}</span>{s.label}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="slab-b-detail">
                {STEPS.map((s, i) => (
                  <p key={s.key} className={state(i)}><b>{s.title}</b> {s.body}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="cap-stage tray tray-book slab-b-stage">
            <div className="site-panels">
              {STEPS.map((s, i) => (
                <div key={s.key} className={`site-panel ${state(i)}`}>
                  <span className="site-panel-k">{s.n} · {s.label}</span>
                  <ul>
                    {s.panel.map((line) => (
                      <li key={line}><span className="slab-brick" aria-hidden="true" />{line}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
