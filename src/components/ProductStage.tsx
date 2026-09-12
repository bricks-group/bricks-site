'use client'

import { useState } from 'react'
import ProductWindow from '@/components/ProductWindow'

/** Overview is the desk. The overlapping window is a deal in motion, not a shoot queue. */
export default function ProductStage() {
  const [front, setFront] = useState<'deal' | 'overview'>('deal')
  return (
    <div className="prod-stack">
      <div
        className="prod-stack-main"
        style={{ zIndex: front === 'overview' ? 15 : 10 }}
        onMouseDown={() => setFront('overview')}
      >
        <ProductWindow
          title="bricks"
          src="/screens/os.html?screen=overview"
          nw={1440}
          nh={920}
          fit="width"
        />
      </div>
      <div
        className="prod-stack-sub"
        style={{ zIndex: front === 'deal' ? 15 : 10 }}
        onMouseDown={() => setFront('deal')}
      >
        <ProductWindow
          title="bricks"
          src="/screens/os.html?screen=transactions"
          nw={1440}
          nh={920}
          fit="width"
        />
      </div>
    </div>
  )
}
