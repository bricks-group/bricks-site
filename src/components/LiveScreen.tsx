'use client'

import { useEffect, useState, type ReactNode } from 'react'

/**
 * Static image first; the live iframe is a desktop-only enhancement mounted after hydration
 * (min-width 701px, hover-capable pointer). Phones, iOS full-page capture and no-JS always get the image.
 */
export default function LiveScreen({ still, live }: { still: ReactNode; live: ReactNode }) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 701px) and (hover: hover) and (pointer: fine)')
    const apply = () => setOn(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  return <>{on ? live : still}</>
}
