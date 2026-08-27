'use client'

import ProductWindow from '@/components/ProductWindow'

/** Focal OS window — one open app on the painterly ground. No companion phones. */
export default function ProductStage() {
  return (
    <ProductWindow
      title="Brokerage OS"
      src="/screens/os.html"
      nw={1440}
      nh={920}
    />
  )
}
