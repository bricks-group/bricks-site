'use client'

import ProductWindow from '@/components/ProductWindow'
import LiveScreen from '@/components/LiveScreen'
import ScreenStatic from '@/components/ScreenStatic'

/** Homepage desk row: static readable crop on phones; live desk (full UI) on desktop. */
export default function OsDeskShot() {
  return (
    <LiveScreen
      still={<div className="scr-desk"><ScreenStatic name="desk" alt="Bricks desk: Transactions, with closing this week, GCI in escrow and open deals" sizes="(max-width:700px) 92vw, 60vw" /></div>}
      live={<ProductWindow title="Ashfield · deal" src="/screens/os.html?screen=transactions&lock=1" nw={1440} nh={920} fit="contain" hideChrome lazy />}
    />
  )
}
