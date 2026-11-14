import type { Article } from '../types'
import { p, table, ul } from '../blocks'

export const CONTACT: Article[] = [
  {
    slug: 'contact-us',
    title: `Contact Bricks`,
    summary: `Email, phone and the contact form. Who to write to for what.`,
    popular: true,
    body: [
      table(['For', 'Contact'], [
        ['Support', '[help@brxs.ca](mailto:help@brxs.ca)'],
        ['General enquiries', '[hello@brxs.ca](mailto:hello@brxs.ca)'],
        ['Privacy', '[privacy@brxs.ca](mailto:privacy@brxs.ca)'],
        ['Phone', '[(289) 312-7425](tel:+12893127425)'],
      ]),
      p(`Or use the [contact form](/contact). Tell us the property address, the shoot type and your preferred date, or anything else we should know.`),
      p(`Writing about a booking? Include the property address and the email you booked with.`),
      p(`Bricks serves clients across Canada.`),
    ],
    related: ['raise-a-concern', 'privacy-requests'],
  },
  {
    slug: 'privacy-requests',
    title: `Privacy requests`,
    summary: `Access, correction and deletion requests go to privacy@brxs.ca.`,
    body: [
      p(`Email [privacy@brxs.ca](mailto:privacy@brxs.ca) from the email on your account. Say what you'd like:`),
      ul(`A copy of the information we hold about you.`, `A correction.`, `Deletion. Use the subject "Delete my Bricks account".`),
      p(`We respond within 30 days.`),
    ],
    related: ['your-privacy-rights', 'delete-your-account'],
  },
  {
    slug: 'help-centre-feedback',
    title: `Feedback on this help centre`,
    summary: `Missing an answer or found a mistake? Tell us.`,
    body: [
      p(`Use **Was this helpful?** at the bottom of any article. Your note goes straight to the Bricks team.`),
      p(`Or email [hello@brxs.ca](mailto:hello@brxs.ca) with the page and what's missing.`),
    ],
    related: ['contact-us'],
  },
]
