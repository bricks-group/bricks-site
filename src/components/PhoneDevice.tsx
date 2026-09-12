'use client'

import type { ReactNode } from 'react'

/** Cursor-style real device bezel for Companion / GO / Web&Mobile surfaces. */
export default function PhoneDevice({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="phone-device" aria-label={label || 'Phone preview'}>
      <div className="phone-device-notch" aria-hidden="true" />
      <div className="phone-device-screen">{children}</div>
    </div>
  )
}
