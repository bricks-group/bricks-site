'use client'

import { useEffect, useState } from 'react'
import ProductWindow from '@/components/ProductWindow'

/** Cursor mobile: zoom the desk so UI text is readable, crop intentionally.
 *  Desktop: full dual-window stack. Front pokeable; rear raises. */
export default function ProductStage() {
  const [front, setFront] = useState<'deal' | 'overview'>('deal')
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width:900px)')
    const apply = () => setMobile(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  // ~720 design width → ~2× readable vs fitting full 1440 into a phone tray
  const zoomAt = mobile ? 780 : undefined

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
          zoomAt={zoomAt}
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
          zoomAt={zoomAt}
        />
      </div>
    </div>
  )
}
