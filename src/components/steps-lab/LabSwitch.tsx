'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

/** Small fixed switcher for the /lab/steps tests. Hidden with ?capture=1. */
export default function LabSwitch({ current }: { current: 'a' | 'b' | 'c' }) {
  const [hide, setHide] = useState(true)
  useEffect(() => {
    setHide(new URLSearchParams(location.search).get('capture') === '1')
  }, [])
  if (hide) return null
  const items = [
    { k: 'a', label: 'A · Pinned' },
    { k: 'b', label: 'B · Rail' },
    { k: 'c', label: 'C · Stack' },
  ] as const
  return (
    <nav className="lab-switch" aria-label="Steps test variants">
      <span className="lab-switch-k">Steps test</span>
      {items.map((it) => (
        <Link key={it.k} href={`/lab/steps/${it.k}#steps`} className={it.k === current ? 'on' : ''} aria-current={it.k === current ? 'page' : undefined}>
          {it.label}
        </Link>
      ))}
    </nav>
  )
}
