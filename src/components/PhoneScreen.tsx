'use client'

import ProductWindow from '@/components/ProductWindow'
import PhoneDevice from '@/components/PhoneDevice'
import LiveScreen from '@/components/LiveScreen'
import ScreenStatic, { type ScreenName } from '@/components/ScreenStatic'

/** Phone bezel with a static capture on phones and the live screen on desktop. */
export default function PhoneScreen({ name, alt, label = 'Bricks' }: { name: Exclude<ScreenName, 'desk'>; alt: string; label?: string }) {
  return (
    <PhoneDevice label={label}>
      <LiveScreen
        still={<div className="scr-phone"><ScreenStatic name={name} alt={alt} sizes="(max-width:700px) 46vw, 280px" /></div>}
        live={<ProductWindow variant="phone" title={label} src={`/screens/${name}.html?lock=1`} nw={390} nh={844} fit="contain" hideChrome zoomAt={390} lazy />}
      />
    </PhoneDevice>
  )
}
