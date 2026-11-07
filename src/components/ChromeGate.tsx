'use client'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/** /gate and the plan-visit one-tap page use their own focused chrome. */
export const isBarePath = (p: string) => p === '/gate' || p === '/visit' || p.startsWith('/visit/')

/** Hides site chrome on bare pages. Client-side so the root layout stays static (no headers()). */
export default function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname() || ''
  return isBarePath(pathname) ? null : <>{children}</>
}
