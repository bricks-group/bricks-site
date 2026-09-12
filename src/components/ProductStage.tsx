'use client'

import ProductWindow from '@/components/ProductWindow'

/** Cursor-style layered demo: dual overlapping OS windows with intentional crop.
 *  Interaction is inside the demos (scroll/hover/click in-frame). Screens stay
 *  lock=1 — sidebar can't roam the whole app. Not bring-to-front chrome. */
export default function ProductStage() {
  return (
    <div className="prod-stack">
      <div className="prod-stack-main">
        <ProductWindow
          title="bricks"
          src="/screens/os.html?screen=overview&lock=1"
          nw={1440}
          nh={920}
          fit="width"
        />
      </div>
      <div className="prod-stack-sub">
        <ProductWindow
          title="bricks"
          src="/screens/os.html?screen=transactions&lock=1"
          nw={1440}
          nh={920}
          fit="width"
        />
      </div>
    </div>
  )
}
