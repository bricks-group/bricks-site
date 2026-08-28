'use client'

import ProductWindow from '@/components/ProductWindow'

/** Focal OS window — one open app on the painterly ground. No companion phones. */
export default function ProductStage() {
  return (
    <ProductWindow
      title="Brokerage OS"
      src="/screens/os.html?screen=overview&lock=1"
      nw={1440}
      nh={920}
      fit="contain"
    />
  )
}
