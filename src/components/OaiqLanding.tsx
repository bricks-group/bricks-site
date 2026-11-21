'use client'
import { useEffect } from 'react'
import { oaiqOnAdLanding } from '@/lib/oaiq'

/** Renders nothing. Loads the ChatGPT ads pixel only for ad-click landings (?oppref=). */
export default function OaiqLanding() {
  useEffect(() => { oaiqOnAdLanding() }, [])
  return null
}
