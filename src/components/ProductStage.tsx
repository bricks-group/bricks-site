'use client'

import { useState } from 'react'
import ProductWindow from '@/components/ProductWindow'

/**
 * Cursor-style layered demo: fixed-pixel OS window centered in the painting
 * on desktop; same size on a phone so the right side is cut off. A second
 * window sits on the bottom-right (CLI analog). Click raises z-index.
 */
export default function ProductStage() {
  const [front, setFront] = useState<'jobs' | 'overview'>('jobs')
  return (
    <div className="prod-stack">
      <div
        className="prod-stack-main"
        style={{ zIndex: front === 'overview' ? 15 : 10 }}
        onMouseDown={() => setFront('overview')}
      >
        <ProductWindow
          title="bricks"
          src="/screens/os.html?screen=overview&lock=1"
          nw={1440}
          nh={920}
          fit="width"
        />
      </div>
      <div
        className="prod-stack-sub"
        style={{ zIndex: front === 'jobs' ? 15 : 10 }}
        onMouseDown={() => setFront('jobs')}
      >
        <ProductWindow
          title="bricks"
          src="/screens/os.html?screen=jobs&lock=1"
          nw={1440}
          nh={920}
          fit="width"
        />
      </div>
    </div>
  )
}
