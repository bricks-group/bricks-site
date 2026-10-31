import type { Metadata } from 'next'
import TradePage, { tradeMetadata } from '@/components/home-services/TradePage'
import { tradeBySlug } from '@/lib/services'

const trade = tradeBySlug('inspections')!

export const metadata: Metadata = tradeMetadata(trade)

export default function InspectionsPage() {
  return <TradePage trade={trade} />
}
