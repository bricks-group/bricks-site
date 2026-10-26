import { searchIndex } from '@/lib/help'

export const dynamic = 'force-static'

export function GET() {
  return Response.json(searchIndex(), { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=86400' } })
}
