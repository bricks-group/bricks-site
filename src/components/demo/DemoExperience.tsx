'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import ProductWindow from '@/components/ProductWindow'
import BrixtonGuide from './BrixtonGuide'
import { DEMO_STEPS } from './demoSteps'
import { OS_LOGIN } from '@/lib/brand'

export default function DemoExperience() {
  const [i, setI] = useState(0)
  const step = DEMO_STEPS[i]
  const closing = step.id === 'close'

  const jump = useCallback((n: number) => {
    setI(Math.max(0, Math.min(DEMO_STEPS.length - 1, n)))
  }, [])

  return (
    <div className="demo-shell">
      <div className="demo-main">
        <div className={`demo-stage tray ${step.kind === 'phone' ? 'tray-phone demo-stage-phone' : 'tray-os demo-stage-desk'} ${step.surface === 'companion' ? 'tray-book' : ''} ${step.surface === 'go' ? 'tray-disp' : ''}`}>
          <div className="tray-stage">
            <ProductWindow
              key={step.src}
              variant={step.kind === 'phone' ? 'phone' : 'os'}
              title={step.title}
              src={step.src}
              nw={step.nw}
              nh={step.nh}
              fit={step.kind === 'phone' ? 'contain' : 'width'}
            />
          </div>
        </div>

        {closing ? (
          <div className="demo-close-cta">
            <Link className="btn btn-brick" href="/book">
              Book a shoot
            </Link>
            <a className="btn btn-sec" href={OS_LOGIN}>
              Open Bricks
            </a>
            <Link className="btn btn-sec" href="/platform">
              Platform
            </Link>
          </div>
        ) : null}
      </div>

      <BrixtonGuide
        step={step}
        stepIndex={i}
        stepCount={DEMO_STEPS.length}
        onPrev={() => jump(i - 1)}
        onNext={() => jump(i + 1)}
        onJump={jump}
        closing={closing}
      />
    </div>
  )
}
