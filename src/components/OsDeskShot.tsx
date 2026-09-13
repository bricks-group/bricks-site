'use client'

import ProductWindow from '@/components/ProductWindow'

/** Homepage desk band — full UI natural scale, never zoom-cropped. */
export default function OsDeskShot() {
  return (
    <ProductWindow
      title="Ashfield · deal"
      src="/screens/os.html?screen=transactions&lock=1"
      nw={1440}
      nh={920}
      fit="contain"
      hideChrome
      lazy
    />
  )
}
