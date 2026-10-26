import type { Article } from '../types'
import { p, h, ul, ol, note, table } from '../blocks'

export const INTEGRATIONS: Article[] = [
  {
    slug: 'integrations-overview',
    title: `What Bricks connects to`,
    summary: `Your MLS® feed, Follow Up Boss, kvCORE, calendars and Stripe.`,
    popular: true,
    body: [
      p(`Connections live under **Connected tools** in the Bricks app sidebar. Listing tools work without them. Contacts, calendar and e-sign are built in, so every connection is optional.`),
      table(['Connection', 'What it does'], [
        ['PropTx (TRREB)', 'MLS® feed through the RESO Web API, on your own credentials.'],
        ['Bridge Interactive', 'MLS® feeds, including Cornerstone and ITSO, on your own credentials.'],
        ['Repliers', 'MLS® feed, on your own credentials.'],
        ['Follow Up Boss', 'Two-way contact and deal sync.'],
        ['kvCORE (BoldTrail)', 'Pulls your contacts into Bricks.'],
        ['Google Calendar, Apple Calendar or a calendar link', 'Showings and closings in the calendar you already use.'],
        ['Stripe', 'Payments for bookings and plans.'],
      ]),
      p(`See [Coming soon](/help/integrations/integrations-coming-soon) for what isn't connected yet.`),
    ],
    related: ['mls-feeds', 'connect-your-crm', 'calendar-sync'],
  },
  {
    slug: 'mls-feeds',
    title: `Connect your MLS feed`,
    summary: `Bring your board feed on your own credentials. Bricks pulls from it. Publishing stays manual.`,
    howto: true,
    body: [
      p(`Bricks reads your board feed on your own credentials. Supported: PropTx (TRREB) through the RESO Web API, Bridge Interactive (including Cornerstone and ITSO), another RESO Web API feed, or Repliers.`),
      ol(
        `Open **Connected tools** in the sidebar.`,
        `Choose your feed and paste the access token or key from your board or feed provider.`,
        `Add your office MLS® ID if you want listing sync.`,
        `Save. Listing sync and lookups pull from your feed.`,
      ),
      note(`Connections are pull only. Bricks never publishes or submits to your MLS®. Use the MLS® package in the launch kit and submit it yourself.`),
    ],
    related: ['listing-launch-kit', 'integrations-overview'],
  },
  {
    slug: 'connect-your-crm',
    title: `Connect Follow Up Boss or kvCORE`,
    summary: `Paste your key. Bricks checks it before saving.`,
    howto: true,
    body: [
      ol(
        `Open **Connected tools** in the sidebar.`,
        `For Follow Up Boss, paste your API key. For kvCORE, paste an API token generated in kvCORE.`,
        `Save. Bricks verifies the key before saving it.`,
      ),
      h(`How sync works`),
      ul(
        `**Follow Up Boss** syncs both ways: contacts and deals.`,
        `**kvCORE** sync pulls its contacts into Bricks.`,
      ),
      p(`Contacts on the listing file are native to Bricks, and Bricks stays the source on the listing file.`),
    ],
    related: ['contacts-and-crm', 'integrations-overview'],
  },
  {
    slug: 'calendar-sync',
    title: `Sync your calendar`,
    summary: `Showings and closings live in Bricks. Google, Apple and a calendar link are optional.`,
    body: [
      p(`Showings and closings live on the listing file and in the Bricks calendar. To see them in the calendar you already use, open **Connected tools**:`),
      ul(
        `**Google Calendar:** connect your Google account and grant calendar permission.`,
        `**Apple Calendar:** enter your Apple ID and an app-specific password made in your Apple account settings.`,
        `**Calendar link:** subscribe to a private link from any calendar app. Making a new link stops the old one from working.`,
      ),
    ],
    related: ['integrations-overview'],
  },
  {
    slug: 'stripe-payments',
    title: `Payments through Stripe`,
    summary: `Bookings, plans and seats are paid through Stripe. Bricks doesn't store full card numbers.`,
    body: [
      p(`Every payment to Bricks goes through Stripe: media bookings, plans, add-ons and seats. Stripe holds your card details. Bricks never stores full card numbers. It may keep the card brand, the last four digits and the payment status.`),
      p(`Manage cards, invoices and subscriptions from **Billing** in the app, which opens your Stripe billing portal.`),
    ],
    related: ['invoices-and-receipts', 'pay-for-a-booking'],
  },
  {
    slug: 'integrations-coming-soon',
    title: `Coming soon`,
    summary: `Connections that aren't live yet.`,
    body: [
      ul(
        `**Docusign.** Not set up on Bricks yet. Native Bricks e-sign works now.`,
        `**Lone Wolf.** A key can be saved, but nothing syncs yet.`,
      ),
      p(`Need a connection we don't have? [Tell us](/contact).`),
    ],
    related: ['integrations-overview', 'e-sign-documents'],
  },
]
