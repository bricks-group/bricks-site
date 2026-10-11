import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import ContactForm from '@/app/contact/ContactForm'
import DemoExperience from '@/components/demo/DemoExperience'
import { DEMO_ACCESS_COOKIE, verifyDemoInvite } from '@/lib/demo-invite'

export const metadata: Metadata = {
  title: 'Request a Bricks walkthrough',
  description:
    'Request a guided walkthrough of Bricks OS, Companion, and GO. We schedule a short session with your team — no public interactive demo.',
  alternates: { canonical: '/demo' },
  robots: { index: false, follow: false },
}

type Props = {
  searchParams?: Promise<{ invite?: string }> | { invite?: string }
}

export default async function DemoPage({ searchParams }: Props) {
  const jar = await cookies()
  const token = jar.get(DEMO_ACCESS_COOKIE)?.value || ''
  const verified = token ? verifyDemoInvite(token) : { ok: false as const, reason: 'missing' }

  if (verified.ok) {
    return (
      <main className="demo-page">
        <div className="demo-page-head wrap">
          <span className="badge">Invited walkthrough</span>
          <h1>Bricks walkthrough.</h1>
          <p className="sub">
            Short tour of the OS desk, Companion, and GO. Use the guide on the right — no account needed.
          </p>
        </div>
        <DemoExperience />
      </main>
    )
  }

  const sp = searchParams ? await Promise.resolve(searchParams) : {}
  const expired = sp?.invite === 'expired'

  return (
    <main className="demo-page">
      <div className="demo-page-head wrap">
        <span className="badge">Walkthrough</span>
        <h1>Request a walkthrough.</h1>
        <p className="sub">
          Short, scheduled intro to the OS desk, Companion, and GO. Tell us who you are and we&apos;ll set a time.
        </p>
        {expired ? (
          <p className="sub" style={{ color: 'var(--brickDeep)', marginTop: 16 }} role="status">
            That invite link expired. Request a walkthrough below and we&apos;ll send a fresh one.
          </p>
        ) : null}
      </div>
      <section className="block">
        <div className="wrap">
          <ContactForm />
        </div>
      </section>
    </main>
  )
}
