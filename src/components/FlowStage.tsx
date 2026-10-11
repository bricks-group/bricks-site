'use client'

import PhoneDevice from '@/components/PhoneDevice'
import ProductWindow from '@/components/ProductWindow'

/**
 * Companion booking flow — three flat phones inside the painted tray.
 * No step labels. Natural 390×844, width-first, full devices (no crop/distort).
 * property (Mapbox) → package → time.
 */
export default function FlowStage() {
  const mb = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
  const q = mb ? `&mb=${encodeURIComponent(mb)}` : ''
  const steps = [
    { key: 'property', src: `/screens/book.html?lock=1&flow=1${q}`, label: 'Property' },
    { key: 'package', src: `/screens/book.html?lock=1&flow=2${q}`, label: 'Package' },
    { key: 'time', src: `/screens/book.html?lock=1&flow=3${q}`, label: 'Time' },
  ] as const

  return (
    <div className="flow-phones" aria-label="Companion booking flow">
      {steps.map((s, i) => (
        <div key={s.key} className={`flow-phone flow-phone-${['a','b','c'][i]}`}>
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
