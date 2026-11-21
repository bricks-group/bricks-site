import { ARTICLES, articleHref } from '@/lib/help'
import type { Block } from '@/lib/help/types'
import { SOFTWARE_PLANS, SOFTWARE_BLURB } from '@/lib/catalog'
import { BRICKS_DEFINITION, LISTING_MEDIA_DESCRIPTION, VIRTUAL_VISIT_DESCRIPTION, SITE_PROGRESS_DESCRIPTION, HOME_FAQS, MEDIA_FAQS, SITE_PROGRESS_FAQS } from '@/lib/public-content'
import { TRADES } from '@/lib/services'

const BASE = 'https://www.brxs.ca'

/** Lossless text rendering of the same typed blocks used by the public help pages. */
export function blockMarkdown(block: Block): string {
  switch (block.t) {
    case 'p': case 'note': case 'code': return block.x
    case 'h2': return `### ${block.x}`
    case 'ul': return block.items.map((x) => `- ${x}`).join('\n')
    case 'ol': return block.items.map((x, i) => `${i + 1}. ${x}`).join('\n')
    case 'table': return [block.head.join(' | '), block.head.map(() => '---').join(' | '), ...block.rows.map((r) => r.join(' | '))].join('\n')
    case 'fig': return block.caption
    case 'flow': return block.steps.map((s, i) => `${i + 1}. ${s.k}: ${s.v}`).join('\n')
    case 'qa': return block.items.map((x) => `### ${x.q}\n\n${x.a}`).join('\n\n')
  }
}

export function fullReference(): string {
  const lines = [
    '# Bricks — first-party reference', '',
    '> A text version of public Bricks definitions, plans, services and help articles. Each section links to its source. This file is generated from the same catalog, answers and typed help content used on the website, not independent endorsements or third-party verification.', '',
    '## What is Bricks?', `Source: ${BASE}/about`, '', BRICKS_DEFINITION, '',
    '## Software plans', `Source: ${BASE}/pricing`, '', SOFTWARE_BLURB, 'Prices are CAD, before tax. Listing media, Virtual Visit and Site Progress services are booked separately.', '',
    ...SOFTWARE_PLANS.map((p) => `- ${p.name}: ${p.price}; ${p.yearly}. ${p.points.join('; ')}.`), '',
    '## Listing media', `Source: ${BASE}/media`, '', LISTING_MEDIA_DESCRIPTION, '',
    '## Virtual Visit', `Source: ${BASE}/media#virtual-visit`, '', VIRTUAL_VISIT_DESCRIPTION, '',
    '## Site Progress', `Source: ${BASE}/builders`, '', SITE_PROGRESS_DESCRIPTION, '',
    '## Other services booked through Bricks', `Source: ${BASE}/services`, '',
    ...TRADES.map((trade) => `- ${trade.name}: ${trade.short}`),
    'Home services are by written quote. Nothing is booked or charged until the client approves the quote. A measurement is not a legal land survey; Bricks refers legal land surveys to an Ontario Land Surveyor.', '',
    '## Contact', `Source: ${BASE}/contact`, '',
    '- Support: help@brxs.ca', '- General enquiries: hello@brxs.ca', '- Vendor and job applications: careers@brxs.ca', '- Privacy: privacy@brxs.ca', '',
  ]
  for (const [url, faqs] of [[`${BASE}/`, HOME_FAQS], [`${BASE}/media`, MEDIA_FAQS], [`${BASE}/builders`, SITE_PROGRESS_FAQS]] as const) {
    lines.push(`## Questions answered on ${url}`, '')
    for (const f of faqs) lines.push(`### ${f.q}`, '', f.a, '')
  }
  lines.push('## Public help articles', `Index: ${BASE}/help/llms.txt`, '')
  for (const article of ARTICLES) {
    lines.push(`## ${article.title}`, `Source: ${BASE}${articleHref(article)}`, `Content updated: ${article.updated}`, '', article.summary, '', ...article.body.map(blockMarkdown).flatMap((text) => [text, '']))
  }
  return lines.join('\n').replace(/\]\(\/(?!\/)/g, `](${BASE}/`)
}

