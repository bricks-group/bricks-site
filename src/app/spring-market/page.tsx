import SeasonalMarketPage, { seasonMetadata } from '@/components/SeasonalMarketPage'

// Out of season, middleware 307s this URL to the current season (src/lib/seasonal-market.ts).
export const metadata = seasonMetadata('spring')

export default function SpringMarket() {
  return <SeasonalMarketPage season="spring" />
}
