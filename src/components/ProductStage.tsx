'use client'

import { useState } from 'react'
import ProductWindow from '@/components/ProductWindow'

/**
 * MATCH CURSOR hero stack:
 * - Large primary window, ~82% of the mat, floating with clear air on all sides
 * - Much smaller secondary window nested ON TOP of primary's bottom-right
 *   corner — deep overlap, not just beside it — sized honestly (no digital
 *   zoom/crop) so its resolution matches what a real smaller window would show
 * - Pure % insets, no breakpoint-specific overrides: the same clear-air
 *   composition scales down naturally at any width, mobile included
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
      </div>
    </div>
  )
}
