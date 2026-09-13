'use client'

import PhoneDevice from '@/components/PhoneDevice'
import ProductWindow from '@/components/ProductWindow'

/**
 * Companion booking flow — three flat phones (no off-angle):
 * property (Mapbox) → package → time.
 */
export default function FlowStage() {
  const mb = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
  const q = mb ? `&mb=${encodeURIComponent(mb)}` : ''
  const steps = [
    { cap: '1 · Property', src: `/screens/book.html?lock=1&flow=1${q}`, label: 'Pick property' },
    { cap: '2 · Package', src: `/screens/book.html?lock=1&flow=2${q}`, label: 'Choose package' },
    { cap: '3 · Time', src: `/screens/book.html?lock=1&flow=3${q}`, label: 'Lock the time' },
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
