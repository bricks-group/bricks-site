import type { Metadata } from 'next'
import TradePage, { tradeMetadata } from '@/components/home-services/TradePage'
import { tradeBySlug } from '@/lib/services'

const trade = tradeBySlug('staging')!

export const metadata: Metadata = tradeMetadata(trade)

export default function StagingPage() {
  return <TradePage trade={trade} />
}
