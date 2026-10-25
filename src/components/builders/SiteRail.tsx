'use client'

import { useStepScroll } from '@/components/steps-rail/useStepScroll'
import '@/components/steps-rail/steps-rail.css'
import './site-rail.css'
import SitePic from './SitePic'

const STEPS = [
  { key: 'photo', n: '01', label: 'Photo', title: 'Photos and video, dated.', body: 'Stills and a flyover on every visit, filed by date.' },
  { key: 'map', n: '02', label: 'Map', title: 'A map you can measure.', body: 'Orthomosaic with distance, area and elevation (DSM).' },
  { key: 'model', n: '03', label: 'Model', title: 'A 3D model of the site.', body: 'Model and point cloud, compared visit to visit.' },
  { key: 'report', n: '04', label: 'Report', title: 'A report in one site file.', body: 'A progress report as a PDF or an expiring link: measured on true maps, with an issues log, weather for each visit and a checksum for every file.' },
] as const

const REPORT = ['Photos and video', 'Orthomosaic', 'Elevation (DSM)', '3D model and point cloud', 'Compare to last visit', 'Progress report'] as const

/** Builders page: same scroll-driven brick rail as the homepage steps (shared hook + tokens). */
export default function SiteRail() {
  const n = STEPS.length
  const { ref, active } = useStepScroll<HTMLElement>(n)
  const state = (i: number) => (i === active ? 'is-on' : i < active ? 'is-past' : 'is-next')

  const head = (
    <div className="cap-copy slab-head">
      <h2>Every visit, in layers.</h2>
      <p className="cap-lede">Photos, maps, models and reports, compared over time.</p>
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
                      <span className="slab-b-k">{s.label}</span>
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
            <div className="sl-stage" data-step={active}>
              <div className="sl-card">
                <div className="sl-plane">
                  <SitePic name="excavation-topdown" className="sl-photo" alt="Top-down drone view of a site in its foundation stage" sizes="(max-width:900px) 92vw, 640px" />
                  <div className="sl-map" aria-hidden="true">
                    <svg viewBox="0 0 100 66.7" preserveAspectRatio="none">
                      <polygon className="sl-area" points="33,9 77,9 77,68 33,68" />
                      <line className="sl-dist" x1="33" y1="5" x2="77" y2="5" />
                      <line className="sl-tick" x1="33" y1="3.4" x2="33" y2="6.6" />
                      <line className="sl-tick" x1="77" y1="3.4" x2="77" y2="6.6" />
                    </svg>
                    <span className="sl-tag sl-tag-d">Distance</span>
                    <span className="sl-tag sl-tag-a">Area</span>
                    <span className="sl-ramp"><i />Elevation</span>
                  </div>
                  <div className="sl-mesh" aria-hidden="true" />
                  <span className="sl-scan" aria-hidden="true" />
                </div>
                <span className="sl-chip" aria-hidden="true">
                  {['Photos and video', 'Orthomosaic', '3D model', 'Site report'][active]}
                </span>
              </div>
              <div className="sl-report" aria-label="Site report">
                <div className="sl-report-h"><b>Site report</b><span>This visit</span></div>
                <ul>
                  {REPORT.map((r) => (
                    <li key={r}><span className="slab-brick" aria-hidden="true" />{r}</li>
                  ))}
                </ul>
                <div className="sl-report-f">One share link</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
