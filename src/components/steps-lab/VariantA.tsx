'use client'

import Link from 'next/link'
import StepPhone from './StepPhone'
import { STEPS, STEPS_LEDE, STEPS_TITLE } from './steps'
import { useStepScroll } from './useStepScroll'
import './steps-lab.css'

/**
 * Test A — pinned band. Scrolling drives a vertical brick progress line; each
 * step lights up and opens its line of copy while the Companion phone in the
 * painted tray swaps to that screen. No click / swipe.
 */
export default function VariantA() {
  const n = STEPS.length
  const { ref, active } = useStepScroll<HTMLElement>(n)
  const state = (i: number) => (i === active ? 'is-on' : i < active ? 'is-past' : 'is-next')

  const head = (
    <div className="cap-copy slab-head">
      <h2>{STEPS_TITLE}</h2>
      <p className="cap-lede">{STEPS_LEDE}</p>
    </div>
  )

  return (
    <section ref={ref} className="cap-band flow-band slab slab-pinned slab-a" aria-label="Companion booking" style={{ ['--n' as string]: n }}>
      <div className="cap-inner slab-head-m">{head}</div>
      <div className="slab-pin">
        <div className="cap-inner slab-a-grid">
          <div className="slab-a-copy">
            <div className="slab-head-d">{head}</div>
            <ol className="slab-a-list" aria-label="Booking steps">
              {STEPS.map((s, i) => (
                <li key={s.key} className={state(i)} style={{ ['--i' as string]: i }} aria-current={i === active ? 'step' : undefined}>
                  {i < n - 1 ? <span className="slab-seg" aria-hidden="true"><i /></span> : null}
                  <span className="slab-brick" aria-hidden="true" />
                  <div className="slab-a-txt">
                    <span className="slab-a-k"><span className="slab-n">{s.n}</span>{s.label}</span>
                    <div className="slab-a-d">
                      <div>
                        <b>{s.title}</b> {s.body}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="slab-a-foot">
              <Link className="learn-link" href="/book">Start a booking →</Link>
            </div>
          </div>
          <div className="cap-stage tray tray-book slab-a-stage">
            <div className="slab-chip" aria-hidden="true">
              {STEPS.map((s, i) => (
                <span key={s.key} className={`slab-chip-i ${state(i)}`}>
                  <i className="slab-dot" />
                  <b>{s.n} / 0{n}</b>
                  <span>{s.label}</span>
                </span>
              ))}
            </div>
            <div className="slab-a-phones">
              {STEPS.map((s, i) => (
                <div key={s.key} className={`slab-a-phone ${state(i)}`}>
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
