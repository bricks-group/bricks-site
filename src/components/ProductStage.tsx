'use client'

import { useState } from 'react'
import ProductWindow from '@/components/ProductWindow'

/**
 * Cursor desktop hero stack (measured @1280):
 * - Stage ~720 tall; main ~88%×86% with ~6% side / ~7% top mat; no clip
 * - Sub ~39%×50%, nested BR (top~45%, right~3%), ~0.44 width of main
 * - Click rear to raise (overlay — iframe pointer-events:none would pass through)
 */
export default function ProductStage() {
  const [front, setFront] = useState<'deal' | 'overview'>('deal')

  return (
    <div className="prod-stack">
      <div
        className={`prod-stack-main${front === 'overview' ? ' is-front' : ' is-back'}`}
        style={{ zIndex: front === 'overview' ? 100 : 10 }}
        onMouseDown={() => setFront('overview')}
        onTouchStart={() => setFront('overview')}
      >
        <ProductWindow
          title="bricks"
          src="/screens/os.html?screen=overview&lock=1"
          nw={1440}
          nh={920}
          fit="width"
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
        onMouseDown={() => setFront('deal')}
        onTouchStart={() => setFront('deal')}
      >
        <ProductWindow
          title="bricks"
          src="/screens/os.html?screen=transactions&lock=1"
          nw={1440}
          nh={920}
          fit="width"
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
