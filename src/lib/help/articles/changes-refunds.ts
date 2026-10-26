import type { Article } from '../types'
import { p, h, ul, ol, note, table } from '../blocks'

export const CHANGES_REFUNDS: Article[] = [
  {
    slug: 'reschedule-a-shoot',
    title: `Reschedule a shoot`,
    summary: `Free more than 24 hours before the shoot window. Inside 24 hours, we'll try.`,
    popular: true,
    howto: true,
    body: [
      table(['When you ask', 'What happens'], [
        ['More than 24 hours before the shoot window', 'Free'],
        ['Inside 24 hours', `We'll try. If we can't, the cancellation rules apply.`],
      ]),
      ol(
        `Email [support@brxs.ca](mailto:support@brxs.ca) as soon as you know.`,
        `Include the property address, the booked date and two or three times that work.`,
        `We confirm the new time by email once a photographer is set.`,
      ),
      note(`The 24 hours count back from the start of your booked shoot window.`),
    ],
    related: ['cancel-a-shoot', 'choose-a-shoot-time', 'no-access-or-no-show'],
  },
  {
    slug: 'cancel-a-shoot',
    title: `Cancel a shoot`,
    summary: `Full refund more than 24 hours ahead. No refund inside 24 hours.`,
    popular: true,
    howto: true,
    body: [
      table(['When you cancel', 'Refund'], [
        ['More than 24 hours before the shoot window', 'Full refund'],
        ['Inside 24 hours', 'No refund'],
        ['No-show, or the photographer can’t get in', 'No refund'],
      ]),
      ol(
        `Email [support@brxs.ca](mailto:support@brxs.ca) with the property address and booked date.`,
        `We confirm the cancellation and, if it qualifies, start the refund.`,
      ),
      p(`There's no callout fee. Rescheduling instead? See [Reschedule a shoot](/help/changes-refunds/reschedule-a-shoot).`),
    ],
    related: ['refund-timing', 'reschedule-a-shoot', 'no-access-or-no-show'],
  },
  {
    slug: 'no-access-or-no-show',
    title: `If the photographer can't get in`,
    summary: `Refused or missing access is treated as a cancellation inside 24 hours.`,
    body: [
      p(`You're responsible for arranging access to the property and occupant consent. If the photographer arrives and access is refused or not available, it's treated as a cancellation inside 24 hours, with no refund.`),
      h(`Avoid it`),
      ul(
        `Put lockbox codes, concierge details and parking in the booking notes.`,
        `Tell occupants the date and time.`,
        `Check building rules for amenities and drone ahead of time.`,
      ),
      p(`Running late or locked out on the day? Email [support@brxs.ca](mailto:support@brxs.ca) or call [343-453-4578](tel:+13434534578) right away.`),
    ],
    related: ['prepare-for-a-shoot', 'cancel-a-shoot'],
  },
  {
    slug: 'if-bricks-cancels',
    title: `If Bricks cancels or can't finish`,
    summary: `You choose: a full refund or a free reshoot.`,
    body: [
      p(`If Bricks cancels, or can't complete the shoot for reasons on our side, you choose between a full refund and a free reshoot.`),
      p(`If only part of a booking can't be delivered, like a drone add-on that can't be flown safely, see [When drone can't be flown](/help/changes-refunds/drone-not-flown).`),
    ],
    related: ['refund-timing', 'drone-not-flown'],
  },
  {
    slug: 'drone-not-flown',
    title: `When drone can't be flown`,
    summary: `The ground package is still delivered, and a separately charged drone add-on is refunded.`,
    body: [
      p(`Drone may be skipped if Transport Canada rules, NAV CANADA airspace, weather or the site make it unsafe or unlawful.`),
      ul(
        `The rest of the paid ground package is still delivered.`,
        `If the drone add-on was charged separately and couldn't be shot, Bricks refunds it.`,
      ),
      p(`For Site Progress visits, a visit that can't be flown safely is rescheduled within the same billing month where possible.`),
    ],
    related: ['drone-rules', 'refund-timing'],
  },
  {
    slug: 'refund-timing',
    title: `When your refund arrives`,
    summary: `Refunds go back to your original payment method, usually within 5–10 business days.`,
    body: [
      p(`Refunds go back to the card or wallet you paid with, usually within 5–10 business days of approval. The exact timing depends on your bank.`),
      p(`If it's been longer, email [support@brxs.ca](mailto:support@brxs.ca) with the address and the date you paid.`),
      note(`Nothing in our terms limits your rights under Ontario's Consumer Protection Act, 2002, where it applies.`),
    ],
    related: ['cancel-a-shoot', 'subscription-refunds'],
  },
  {
    slug: 'raise-a-concern',
    title: `Raise a concern about a shoot`,
    summary: `Email us first. We aim to resolve it within 30 days.`,
    body: [
      p(`If something isn't right with a shoot or delivery, email [support@brxs.ca](mailto:support@brxs.ca) with the address and what's wrong. For anything we can't sort out there, write to [hello@brxs.ca](mailto:hello@brxs.ca). We aim to resolve concerns within 30 days.`),
      p(`Our [terms](/terms) are governed by the laws of Ontario and Canada.`),
    ],
    related: ['contact-us', 'if-bricks-cancels'],
  },
]
