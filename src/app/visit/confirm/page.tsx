import type { Metadata } from 'next'
import { fetchVisitState } from '@/lib/plan-visit'
import VisitConfirm from './VisitConfirm'
import '../visit.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Confirm your visit | Bricks',
  description: 'Confirm your plan visit, pick another date, or skip this one.',
  robots: { index: false, follow: false, nocache: true },
  referrer: 'no-referrer',
}

export default async function VisitConfirmPage({ searchParams }: { searchParams: Promise<{ token?: string | string[] }> }) {
  const sp = await searchParams
  const token = (Array.isArray(sp.token) ? sp.token[0] : sp.token) || ''
  const initial = await fetchVisitState(token)
  return <VisitConfirm token={token} initial={initial} />
}
