'use client'

import { useEffect, useState } from 'react'
import ProductWindow from '@/components/ProductWindow'

/**
 * Homepage desk row. Desktop: full UI at natural proportions.
 * Phones (≤700px): Cursor-style readable crop. The window renders as if the
 * design were 820px wide and bleeds off the right/bottom of the tray, so text
 * stays legible instead of shrinking a 1440px desk to a thumbnail.
 */
export default function OsDeskShot() {
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)')
    const apply = () => setNarrow(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  return (
    <ProductWindow
      title="Ashfield · deal"
      src="/screens/os.html?screen=transactions&lock=1"
      nw={1440}
      nh={920}
      fit="contain"
      zoomAt={narrow ? 820 : undefined}
      hideChrome
      lazy
    />
  )
}
