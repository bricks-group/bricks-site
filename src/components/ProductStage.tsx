'use client'

import { useEffect, useState } from 'react'
import ProductWindow from '@/components/ProductWindow'

/**
 * Cursor-style dual stack:
 * - Desktop: overview floats in a mat (no zoom); deal overlaps BR with readable zoom crop.
 * - Mobile ≤680: same overlap, oversized stage crop; both windows zoom for legibility.
 * Both iframes stay alive (KPI tick + transactions growth). Front pokeable; rear raises.
 */
export default function ProductStage() {
  const [front, setFront] = useState<'deal' | 'overview'>('deal')
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width:680px)')
    const apply = () => setMobile(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  // Desktop deal needs zoom crop so the small overlapping window stays legible
  // (full 1440 crushed into ~45% width is unreadable — Cursor's CLI is native-sized).
  const overviewZoom = mobile ? 780 : undefined
  const dealZoom = mobile ? 780 : 760

  return (
    <div className={`prod-stack${mobile ? ' prod-stack-mobile' : ''}`}>
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
          zoomAt={overviewZoom}
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
          zoomAt={dealZoom}
        />
      </div>
    </div>
  )
}
