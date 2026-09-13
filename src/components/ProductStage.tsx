'use client'

import { useEffect, useState } from 'react'
import ProductWindow from '@/components/ProductWindow'

/**
 * Cursor homepage ProductStage — stacked Mac windows, limited interaction.
 * Click-to-front only; iframes locked (lock=1) and never fully navigable.
 * Desktop and mobile use different nest math (Cursor does too).
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

  // Readable crop; mobile crops harder like Cursor's phone hero
  const zoomAt = desktop ? 1100 : 900

  return (
    <div className="prod-stack">
      <div
        className={`prod-stack-main${front === 'overview' ? ' is-front' : ' is-back'}`}
        style={{ zIndex: front === 'overview' ? 100 : 10 }}
      >
        <ProductWindow
          title="Overview"
          src="/screens/os.html?screen=overview&lock=1"
          nw={1440}
          nh={920}
          fit="contain"
          zoomAt={zoomAt}
        />
        {/* Always-on raise layer when back — front window has no in-app clicks (Cursor-limited) */}
        {front !== 'overview' ? (
          <button
            type="button"
            className="prod-stack-raise"
            aria-label="Bring Overview to front"
            onMouseDown={(e) => {
              e.preventDefault()
              setFront('overview')
            }}
            onTouchStart={(e) => {
              e.preventDefault()
              setFront('overview')
            }}
          />
        ) : (
          <div className="prod-stack-veil" aria-hidden="true" />
        )}
      </div>
      <div
        className={`prod-stack-sub${front === 'deal' ? ' is-front' : ' is-back'}`}
        style={{ zIndex: front === 'deal' ? 100 : 10 }}
      >
        <ProductWindow
          title="Transactions"
          src="/screens/os.html?screen=transactions&lock=1"
          nw={1440}
          nh={920}
          fit="contain"
          zoomAt={zoomAt}
        />
        {front !== 'deal' ? (
          <button
            type="button"
            className="prod-stack-raise"
            aria-label="Bring Transactions to front"
            onMouseDown={(e) => {
              e.preventDefault()
              setFront('deal')
            }}
            onTouchStart={(e) => {
              e.preventDefault()
              setFront('deal')
            }}
          />
        ) : (
          <div className="prod-stack-veil" aria-hidden="true" />
        )}
      </div>
    </div>
  )
}
