import type { Metadata } from 'next'
import ContactForm from '@/app/contact/ContactForm'

export const metadata: Metadata = {
  title: 'Request a Bricks walkthrough',
  description:
    'Request a guided walkthrough of Bricks OS, Companion, and GO. We schedule a short session with your team — no public interactive demo.',
  alternates: { canonical: '/demo' },
  robots: { index: false, follow: false },
}

export default function DemoPage() {
  return (
    <main className="demo-page">
      <div className="demo-page-head wrap">
        <span className="badge">Walkthrough</span>
        <h1>Request a walkthrough.</h1>
        <p className="sub">
          Short, scheduled intro to the OS desk, Companion, and GO. Tell us who you are and we&apos;ll set a time.
        </p>
      </div>
      <section className="block">
        <div className="wrap">
          <ContactForm />
        </div>
      </section>
    </main>
  )
}
