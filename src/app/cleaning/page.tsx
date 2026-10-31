import type { Metadata } from 'next'
import TradePage, { tradeMetadata } from '@/components/home-services/TradePage'
import { tradeBySlug } from '@/lib/services'

const trade = tradeBySlug('cleaning')!

export const metadata: Metadata = tradeMetadata(trade)

export default function CleaningPage() {
  return <TradePage trade={trade} />
}
