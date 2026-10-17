'use client'

import PhoneDevice from '@/components/PhoneDevice'
import ProductWindow from '@/components/ProductWindow'

/** Same Companion screen + bezel the live homepage FlowStage uses (book.html?lock=1&flow=N). */
export default function StepPhone({ flow, label }: { flow: number; label: string }) {
  const mb = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
  const q = mb ? `&mb=${encodeURIComponent(mb)}` : ''
  return (
    <PhoneDevice label={label}>
      <ProductWindow
        variant="phone"
        title="Companion"
        src={`/screens/book.html?lock=1&flow=${flow}${q}`}
        nw={390}
        nh={844}
        fit="contain"
        hideChrome
        lazy
      />
    </PhoneDevice>
  )
}
