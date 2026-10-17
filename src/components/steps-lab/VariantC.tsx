'use client'

import Link from 'next/link'
import StepPhone from './StepPhone'
import { STEPS, STEPS_LEDE, STEPS_TITLE } from './steps'
import { useCardStack } from './useStepScroll'
import './steps-lab.css'

/**
 * Test C — stacked cards. Each step is a sticky card; the next one slides up
 * over it and the one underneath settles back (scale + dim) into a stack.
 * Copy and phone rise in as each card lands.
 */
export default function VariantC() {
  const n = STEPS.length
  const { ref, active } = useCardStack<HTMLElement>()

  return (
    <section ref={ref} className="cap-band flow-band slab slab-c" aria-label="Companion booking" style={{ ['--n' as string]: n }}>
      <div className="cap-inner">
        <div className="cap-copy slab-head">
          <h2>{STEPS_TITLE}</h2>
          <p className="cap-lede">{STEPS_LEDE}</p>
          <Link className="learn-link" href="/book">Start a booking →</Link>
        </div>
        <ol className="slab-c-stack" aria-label="Booking steps">
          {STEPS.map((s, i) => (
            <li
              key={s.key}
              data-card
              className={`slab-c-card${i <= active ? ' is-on' : ''}${i === active ? ' is-top' : ''}`}
              style={{ ['--i' as string]: i }}
              aria-current={i === active ? 'step' : undefined}
            >
              <div className="slab-c-copy">
                <div className="slab-c-meter" aria-hidden="true">
                  {STEPS.map((m, j) => (
                    <span key={m.key} className={j <= i ? 'on' : ''} />
                  ))}
                </div>
                <span className="slab-c-n">{s.n}<small> / 0{n}</small></span>
                <span className="over">{s.label}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
              <div className="cap-stage tray tray-book slab-c-stage">
                <div className="slab-c-phone">
                  <StepPhone flow={s.flow} label={s.label} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
