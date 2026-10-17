'use client'

import Link from 'next/link'
import StepPhone from './StepPhone'
import { STEPS, STEPS_LEDE, STEPS_TITLE } from './steps'
import { useStepScroll } from './useStepScroll'
import './steps-lab.css'

/**
 * Test B — horizontal timeline rail. A brick line fills across Property →
 * Package → Time as you scroll; the step detail cross-fades under it and the
 * phones advance (desktop: focus moves across the row; mobile: the row itself
 * slides — scroll replaces the old swipe carousel).
 */
export default function VariantB() {
  const n = STEPS.length
  const { ref, active } = useStepScroll<HTMLElement>(n)
  const state = (i: number) => (i === active ? 'is-on' : i < active ? 'is-past' : 'is-next')

  const head = (
    <div className="cap-copy slab-head">
      <h2>{STEPS_TITLE}</h2>
      <p className="cap-lede">{STEPS_LEDE}</p>
      <Link className="learn-link slab-b-link" href="/book">Start a booking →</Link>
    </div>
  )

  return (
    <section ref={ref} className="cap-band flow-band slab slab-pinned slab-b" aria-label="Companion booking" style={{ ['--n' as string]: n }}>
      <div className="cap-inner slab-head-m">{head}</div>
      <div className="slab-pin">
        <div className="cap-inner slab-b-inner">
          <div className="slab-b-top">
          <div className="slab-head-d">{head}</div>
          <div className="slab-b-steps">
          <div className="slab-b-railwrap">
            <span className="slab-b-track" aria-hidden="true"><i /></span>
            <ol className="slab-b-rail" aria-label="Booking steps">
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
              <p key={s.key} className={state(i)}>
                <b>{s.title}</b> {s.body}
              </p>
            ))}
          </div>
          </div>
          </div>

          <div className="cap-stage tray tray-book slab-b-stage">
            <div className="slab-b-phones">
              {STEPS.map((s, i) => (
                <div key={s.key} className={`slab-b-phone ${state(i)}`}>
                  <StepPhone flow={s.flow} label={s.label} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
