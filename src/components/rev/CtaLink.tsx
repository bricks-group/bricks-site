'use client'

import { useState } from 'react'
import Link from 'next/link'
import BricksLoader from '@/components/BricksLoader'

/** Link-styled button that swaps its arrow for the approved Cycle loader while the next route loads. */
export default function CtaLink({
  href,
  children,
  className = '',
  loaderColor = '#fff',
  onNavigate,
}: {
  href: string
  children: React.ReactNode
  className?: string
  loaderColor?: string
  onNavigate?: () => void
}) {
  const [loading, setLoading] = useState(false)
  const external = /^https?:/.test(href)
  const inner = (
    <>
      <span className="rv-btn-label">{children}</span>
      <span className="rv-btn-icon" aria-hidden={!loading}>
        {loading ? <BricksLoader variant="cycle" size={14} color={loaderColor} label="Loading" /> : <span className="rv-arrow">→</span>}
      </span>
    </>
  )
  const onClick = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return
    setLoading(true)
    onNavigate?.()
  }
  return external ? (
    <a href={href} className={`rv-btn ${className}`} data-loading={loading || undefined} onClick={onClick}>{inner}</a>
  ) : (
    <Link href={href} className={`rv-btn ${className}`} data-loading={loading || undefined} onClick={onClick}>{inner}</Link>
  )
}
