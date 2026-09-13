'use client'

import { useEffect, useState } from 'react'
import ProductWindow from '@/components/ProductWindow'

/**
 * Cursor-style hero stack — desktop feels like a live Mac desktop:
 * nested overlap, soft depth shadows, hover lift, click-to-front,
 * readable UI scale (mild zoomAt on desktop only).
 */
export default function ProductStage() {
  const [front, setFront] = useState<'deal' | 'overview'>('deal')
  const [desktop, setDesktop] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)')
    const apply = () => setDesktop(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const zoomAt = desktop ? 1180 : undefined

  return (
    <div className="prod-stack">
      <div
        className={`prod-stack-main${front === 'overview' ? ' is-front' : ' is-back'}`}
        style={{ zIndex: front === 'overview' ? 100 : 10 }}
      >
        <ProductWindow
          title="bricks"
          src="/screens/os.html?screen=overview"
          nw={1440}
          nh={920}
          fit="contain"
          zoomAt={zoomAt}
          hideChrome
        />
        {front !== 'overview' ? (
          <button
            type="button"
            className="prod-stack-raise"
            aria-label="Bring overview to front"
            onMouseDown={(e) => {
              e.preventDefault()
              setFront('overview')
            }}
            onTouchStart={(e) => {
              e.preventDefault()
              setFront('overview')
            }}
          />
        ) : null}
      </div>
      <div
        className={`prod-stack-sub${front === 'deal' ? ' is-front' : ' is-back'}`}
        style={{ zIndex: front === 'deal' ? 100 : 10 }}
      >
        <ProductWindow
          title="bricks"
          src="/screens/os.html?screen=transactions"
          nw={1440}
          nh={920}
          fit="contain"
          zoomAt={zoomAt}
          hideChrome
        />
        {front !== 'deal' ? (
          <button
            type="button"
            className="prod-stack-raise"
            aria-label="Bring transactions to front"
            onMouseDown={(e) => {
              e.preventDefault()
              setFront('deal')
            }}
            onTouchStart={(e) => {
              e.preventDefault()
              setFront('deal')
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
