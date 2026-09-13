'use client'

import PhoneDevice from '@/components/PhoneDevice'
import ProductWindow from '@/components/ProductWindow'

/**
 * Companion booking flow — three main screens:
 * property → package → time (exact clock).
 */
export default function FlowStage() {
  const steps = [
    { cap: '1 · Property', src: '/screens/book.html?lock=1&flow=1', label: 'Pick property' },
    { cap: '2 · Package', src: '/screens/book.html?lock=1&flow=2', label: 'Choose package' },
    { cap: '3 · Time', src: '/screens/book.html?lock=1&flow=3', label: 'Lock the time' },
  ] as const

  return (
    <div className="flow-phones" aria-label="Companion booking flow">
      {steps.map((s, i) => (
        <div key={s.cap} className={`flow-phone flow-phone-${['a','b','c'][i]}`}>
          <span className="flow-cap">{s.cap}</span>
          <PhoneDevice label={s.label}>
            <ProductWindow
              variant="phone"
              title="Companion"
              src={s.src}
              nw={390}
              nh={844}
              fit="contain"
              hideChrome
              lazy
            />
          </PhoneDevice>
        </div>
      ))}
    </div>
  )
}
