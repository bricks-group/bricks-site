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
  title: 'Confirm your email | Bricks',
  robots: { index: false, follow: false, nocache: true },
  referrer: 'no-referrer',
}

export default async function ConfirmPage({ searchParams }: { searchParams: Promise<{ t?: string | string[] }> }) {
  const sp = await searchParams
  const t = (Array.isArray(sp.t) ? sp.t[0] : sp.t) || ''
  const v = verifyToken(newsletterSecret(), t, 'c')
  if (!v.ok) {
    return (
      <NlMessage title={v.reason === 'expired' ? 'This link has expired' : "This link doesn't work"}
        action={<a className="btn pv-btn pv-primary" href="/newsletter">Sign up again</a>}>
        Sign up again and we&rsquo;ll send a fresh link.
      </NlMessage>
    )
  }
  return <TokenAction kind="confirm" token={t} masked={maskEmail(v.email)} />
}
