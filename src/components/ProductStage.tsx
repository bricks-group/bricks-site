'use client'

import { useState } from 'react'
import ProductWindow from '@/components/ProductWindow'

/**
 * Cursor-style hero stack — natural aspect (1440×920), no stretch, no zoomAt.
 * Frame capped ~Cursor size; fit=contain shows full 1440×920 with no crop-zoom.
 * Front interactive; rear raise overlay; stable iframe src for animation.
 */
export default function ProductStage() {
  const [front, setFront] = useState<'deal' | 'overview'>('deal')

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
