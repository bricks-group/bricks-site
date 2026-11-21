import type { Metadata } from 'next'
import { newsletterSecret } from '@/lib/newsletter/config'
import { maskEmail } from '@/lib/newsletter/email'
import { verifyToken } from '@/lib/newsletter/token'
import { NlMessage } from '../NlShell'
import TokenAction from '../TokenAction'
import '../../visit/visit.css'
import '../newsletter.css'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Unsubscribe | Bricks',
  robots: { index: false, follow: false, nocache: true },
  referrer: 'no-referrer',
}

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ t?: string | string[] }> }) {
  const sp = await searchParams
  const t = (Array.isArray(sp.t) ? sp.t[0] : sp.t) || ''
  const v = verifyToken(newsletterSecret(), t, 'u')
  if (!v.ok) {
    return (
      <NlMessage title="This link doesn't work"
        action={<a className="btn pv-btn pv-primary" href="mailto:hello@brxs.ca?subject=Unsubscribe">Email us to unsubscribe</a>}>
        Write to hello@brxs.ca with the subject &ldquo;Unsubscribe&rdquo; and we&rsquo;ll take you off the list.
      </NlMessage>
    )
  }
  return <TokenAction kind="unsubscribe" token={t} masked={maskEmail(v.email)} />
}
