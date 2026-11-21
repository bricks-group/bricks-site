import type { Metadata } from 'next'
import Link from 'next/link'
import NewsletterForm from './NewsletterForm'
import './newsletter.css'

export const metadata: Metadata = {
  title: 'Bricks updates by email',
  description: 'One short email a month from Bricks: what is new and what it means for your business.',
  alternates: { canonical: '/newsletter' },
}

export default function NewsletterPage() {
  return (
    <section className="nl-page">
      <div className="wrap">
        <h1>Bricks updates</h1>
        <p className="sub">One short email a month. What&rsquo;s new, and what it means for your business.</p>
        <NewsletterForm source="page" />
        <p className="nl-fine">
          From Bricks Group, Mississauga, Ontario. We&rsquo;ll send a link to confirm first. Every email has an unsubscribe link.
          See our <Link href="/privacy">privacy policy</Link>.
        </p>
      </div>
    </section>
  )
}
