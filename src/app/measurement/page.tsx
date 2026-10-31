import type { Metadata } from 'next'
import TradePage, { tradeMetadata } from '@/components/home-services/TradePage'
import { tradeBySlug } from '@/lib/services'

const trade = tradeBySlug('measurement')!

export const metadata: Metadata = tradeMetadata(trade)

export default function MeasurementPage() {
  return <TradePage trade={trade} />
}
