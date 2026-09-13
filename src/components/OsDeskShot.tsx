'use client'

import { useEffect, useState } from 'react'
import ProductWindow from '@/components/ProductWindow'

/** Homepage desk shot — mobile-only readable crop. Desktop never zooms. */
export default function OsDeskShot() {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width:680px)')
    const apply = () => setMobile(mq.matches)
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
      fit="width"
      hideChrome
      zoomAt={mobile ? 820 : undefined}
      lazy
    />
  )
}
