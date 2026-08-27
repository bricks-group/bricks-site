import type { Metadata } from 'next'
import BookingWizard from './BookingWizard'

export const metadata: Metadata = {
  title: 'Bricks — Book a shoot (GTA listing media)',
  description: 'Book Bricks listing media in the GTA: instant tailored quote by footprint + travel, pay to lock your slot.',
  alternates: { canonical: '/book' },
  openGraph: {
    title: 'Bricks — Book a shoot (GTA listing media)',
    description: 'Book Bricks listing media in the GTA: instant tailored quote by footprint + travel, pay to lock your slot.',
  },
  twitter: {
    title: 'Bricks — Book a shoot (GTA listing media)',
    description: 'Book Bricks listing media in the GTA: instant tailored quote by footprint + travel, pay to lock your slot.',
  },
}

export default function BookPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: "What's included with twilight?", acceptedAnswer: { '@type': 'Answer', text: "Exterior photography shot during blue hour -- windows lit, sky still holding color. It's an optional add-on (+$150–200 by footprint) on any shoot; pick it in Step 2." } },
              { '@type': 'Question', name: 'Can I reschedule after booking?', acceptedAnswer: { '@type': 'Answer', text: 'More than 48 hours before the shoot window is free. Inside 48 hours we will try; if we cannot, the cancellation schedule applies. Email booking@brxs.ca.' } },
              { '@type': 'Question', name: 'What if I need to cancel?', acceptedAnswer: { '@type': 'Answer', text: 'More than 48 hours before the shoot window: full refund. 48 hours down to 4 hours: 50% refund. Inside 4 hours, or no-show / no access: no refund. If we cancel on our side: full refund or a free reshoot, your choice.' } },
              { '@type': 'Question', name: 'How do refunds work?', acceptedAnswer: { '@type': 'Answer', text: 'Back to your original payment method via Stripe, typically within 5-10 business days.' } },
            ],
          }),
        }}
      />
      <BookingWizard />
    </>
  )
}
