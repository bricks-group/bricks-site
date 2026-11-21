'use client'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/** /gate, the plan-visit one-tap page and the newsletter link pages use their own focused chrome. */
export const isBarePath = (p: string) => p === '/gate' || p === '/visit' || p.startsWith('/visit/')
  || p.startsWith('/newsletter/confirm') || p.startsWith('/newsletter/unsubscribe')

/** Hides site chrome on bare pages. Client-side so the root layout stays static (no headers()). */
export default function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname() || ''
  return isBarePath(pathname) ? null : <>{children}</>
}
