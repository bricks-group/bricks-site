'use client'

import { useEffect, useRef } from 'react'
import type { DemoStep } from './demoSteps'

export default function BrixtonGuide({
  step,
  stepIndex,
  stepCount,
  onPrev,
  onNext,
  onJump,
  closing,
}: {
  step: DemoStep
  stepIndex: number
  stepCount: number
  onPrev: () => void
  onNext: () => void
  onJump: (i: number) => void
  closing: boolean
}) {
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [step.id])

  return (
    <aside className="bx-guide" aria-label="Brixton demo companion">
      <header className="bx-guide-head">
        <div className="bx-avatar" aria-hidden="true">B</div>
        <div>
          <strong>Brixton</strong>
          <span>Bricks companion</span>
        </div>
      </header>

      <ol className="bx-steps" aria-label="Tour steps">
        {Array.from({ length: stepCount }).map((_, i) => (
          <li key={i}>
            <button
              type="button"
              className={i === stepIndex ? 'on' : i < stepIndex ? 'done' : ''}
              onClick={() => onJump(i)}
              aria-current={i === stepIndex ? 'step' : undefined}
            >
              {i + 1}
            </button>
          </li>
        ))}
      </ol>

      <div className="bx-chat" role="log" aria-live="polite">
        {step.lines.map((line, i) => (
          <p key={`${step.id}-${i}`} className="bx-bubble">
            {line}
          </p>
        ))}
        <div ref={endRef} />
      </div>

      <footer className="bx-guide-foot">
        <p className="bx-tip">{step.tip}</p>
        <div className="bx-nav">
          <button type="button" className="btn btn-sec" onClick={onPrev} disabled={stepIndex === 0}>
            Back
          </button>
          {!closing ? (
            <button type="button" className="btn btn-brick" onClick={onNext}>
              Next
            </button>
          ) : (
            <button type="button" className="btn btn-brick" onClick={() => onJump(0)}>
              Restart
            </button>
          )}
        </div>
      </footer>
    </aside>
  )
}
