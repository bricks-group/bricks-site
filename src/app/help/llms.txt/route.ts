import { COLLECTIONS, articleHref, articlesIn, collectionHref } from '@/lib/help'

export const dynamic = 'force-static'

const BASE = 'https://www.brxs.ca'

export function GET() {
  const lines = [
    '# Bricks help centre',
    '',
    '> Support articles for Bricks: booking listing media, changes and refunds, plans and billing, guides by client type, integrations, account and privacy, and the photographer and pilot capture standard. Prices are CAD, plus tax.',
    '',
  ]
  for (const c of COLLECTIONS) {
    lines.push(`## [${c.title}](${BASE}${collectionHref(c.slug)})`, '', c.summary, '')
    for (const a of articlesIn(c.slug)) lines.push(`- [${a.title}](${BASE}${articleHref(a)}): ${a.summary}`)
    lines.push('')
  }
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
