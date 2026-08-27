import type { Metadata } from 'next'
import BookingWizard from './BookingWizard'
import { TOUR_NAME, VISIT_NAME, VISIT_PACKAGING } from '@/lib/brand'
import { TOUR_RANGE, TWILIGHT_RANGE, VISIT_PRICE_LABEL } from '@/lib/pricing'

export const metadata: Metadata = {
  title: 'Bricks — Book a shoot (Canadian listing media)',
  description: 'Book Bricks listing media in Canada: instant tailored quote by footprint + travel, pay to lock your slot.',
  alternates: { canonical: '/book' },
  openGraph: {
    title: 'Bricks — Book a shoot (Canadian listing media)',
    description: 'Book Bricks listing media in Canada: instant tailored quote by footprint + travel, pay to lock your slot.',
  },
  twitter: {
    title: 'Bricks — Book a shoot (Canadian listing media)',
    description: 'Book Bricks listing media in Canada: instant tailored quote by footprint + travel, pay to lock your slot.',
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
              { '@type': 'Question', name: "What's included with twilight?", acceptedAnswer: { '@type': 'Answer', text: `Exterior photography shot during blue hour -- windows lit, sky still holding color. It's an optional add-on (+${TWILIGHT_RANGE} by footprint) on any shoot; pick it in Step 2.` } },
              { '@type': 'Question', name: `Is the ${TOUR_NAME.toLowerCase()} included?`, acceptedAnswer: { '@type': 'Answer', text: `À la carte, no — it's a ${TOUR_RANGE} add-on. Showcase and Full suite include it.` } },
              { '@type': 'Question', name: `Is the ${VISIT_NAME.toLowerCase()} included?`, acceptedAnswer: { '@type': 'Answer', text: `Never. ${VISIT_PACKAGING} Price is ${VISIT_PRICE_LABEL.toLowerCase()} separately — it is not charged in the live quote total.` } },
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
