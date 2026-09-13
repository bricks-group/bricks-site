'use client'

import { useEffect, useState } from 'react'
import ProductWindow from '@/components/ProductWindow'

/**
 * MATCH CURSOR hero stack:
 * - Large primary centered in a mat
 * - Much smaller secondary NESTED on primary's bottom-right (stacked, not side-by-side)
 * - Clear size difference; both alive + legible (deal uses zoom crop)
 * - Mobile: same stacked composition, oversized + clipped
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

  const overviewZoom = mobile ? 780 : undefined
  // Smaller nested window needs stronger crop to stay legible (Cursor CLI-sized)
  const dealZoom = mobile ? 720 : 640

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
