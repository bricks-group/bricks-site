import { fullReference } from '@/lib/llms'

export const dynamic = 'force-static'

export function GET() {
  return new Response(fullReference(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
