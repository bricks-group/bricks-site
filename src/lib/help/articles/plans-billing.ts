import type { Article } from '../types'
import { p, h, ul, ol, note, table } from '../blocks'
import { SOFTWARE_PLANS, ADDONS, OFFICE_PLANS, OFFICE_SEAT_PRICE_PER_MONTH } from '@/lib/catalog'

const plan = (id: string) => SOFTWARE_PLANS.find((x) => x.id === id)!

export const PLANS_BILLING: Article[] = [
  {
    slug: 'plans-overview',
    title: `Bricks plans at a glance`,
    summary: `Clay is free. Keystone, Marble and Diamond add CRM, forms and AI.`,
    popular: true,
    body: [
      p(`Individual plans build on each other. Media is always booked separately, at the same rates on every plan.`),
      table(['Plan', 'Monthly', 'Yearly', 'Adds'], [
        [`Clay`, `Free`, `No card`, `Book media at rack rate. Listing file, transactions and your own MLS® feed. Listing launch kit.`],
        [`Keystone`, plan('keystone').price, plan('keystone').yearly.split(' · ')[0], `CRM. E-sign with fields on the PDF and shareable links.`],
        [`Marble`, plan('marble').price, plan('marble').yearly.split(' · ')[0], `Forms. Deal room.`],
        [`Diamond`, plan('diamond').price, plan('diamond').yearly.split(' · ')[0], `AI Listing Copy, AI CMA and AI Document Drafter.`],
      ]),
      p(`Prices are CAD, before HST. Yearly is 10 months' price for 12 months.`),
      p(`Teams and brokerages are priced differently. See [Teams](/help/teams/team-plan) and [Brokerage seat pricing](/help/brokerages/brokerage-seat-pricing).`),
    ],
    related: ['upgrade-your-plan', 'ai-add-ons', 'monthly-or-yearly'],
  },
  {
    slug: 'monthly-or-yearly',
    title: `Monthly or yearly billing`,
    summary: `Yearly costs 10 months' price for 12 months.`,
    body: [
      table(['Plan', 'Monthly', 'Yearly'], SOFTWARE_PLANS.filter((x) => x.id !== 'clay').map((x) => [x.name, x.price, x.yearly.split(' · ')[0]])),
      p(`Both renew automatically until you cancel. If a price changes, the new price is posted before your next renewal.`),
      p(`To change how you're billed, email [help@brxs.ca](mailto:help@brxs.ca).`),
    ],
    related: ['plans-overview', 'cancel-your-plan'],
  },
  {
    slug: 'upgrade-your-plan',
    title: `Upgrade your plan`,
    summary: `Upgrade from Billing in the app. Checkout is through Stripe.`,
    howto: true,
    body: [
      ol(
        `In the Bricks app, open **Billing**.`,
        `On Clay, choose **Upgrade plan**, or pick a plan in the plans list.`,
        `Finish checkout in Stripe. Your new plan is active once Stripe confirms the payment.`,
      ),
      p(`Already on a paid plan? **Manage billing** opens your Stripe billing portal, where you manage your subscription.`),
    ],
    related: ['plans-overview', 'ai-add-ons', 'cancel-your-plan'],
  },
  {
    slug: 'ai-add-ons',
    title: `AI add-ons`,
    summary: `Add one AI feature to a paid plan without changing plans. Diamond includes all three.`,
    body: [
      table(['Add-on', 'Price'], ADDONS.map((a) => [a.name, a.price])),
      p(`Add-ons attach to Keystone or Marble and are billed monthly. Diamond includes all three.`),
      h(`Turn one on or off`),
      ol(
        `Open **Billing** in the app and find **Add-ons**.`,
        `Choose **Enable** and finish checkout in Stripe.`,
        `To stop one, choose **Manage**. It opens the Stripe billing portal, where you cancel that add-on.`,
      ),
    ],
    related: ['plans-overview', 'upgrade-your-plan'],
  },
  {
    slug: 'cancel-your-plan',
    title: `Cancel your plan`,
    summary: `Cancel in the Stripe billing portal from Billing. It ends at the end of the cycle.`,
    howto: true,
    body: [
      ol(
        `Open **Billing** in the Bricks app.`,
        `Choose **Manage billing** to open the Stripe billing portal.`,
        `Cancel your subscription there.`,
      ),
      p(`You can also email [help@brxs.ca](mailto:help@brxs.ca). Cancellation takes effect at the end of the current billing cycle, and you keep access until then.`),
      p(`Cancelling a plan doesn't delete your account.`),
      note(`Want to delete your account instead? See [Delete your account](/help/account-security/delete-your-account).`),
    ],
    related: ['subscription-refunds', 'delete-your-account'],
  },
  {
    slug: 'subscription-refunds',
    title: `Refunds on subscriptions`,
    summary: `A billing cycle that has started isn't refunded, with a few exceptions.`,
    body: [
      p(`Subscription fees for a cycle that has already started aren't refunded, except where:`),
      ul(
        `the law requires it, or`,
        `Bricks discontinues your plan, or ends your subscription without cause. Then the unused part is refunded.`,
      ),
      p(`Media bookings follow different rules. See [Cancel a shoot](/help/changes-refunds/cancel-a-shoot).`),
    ],
    related: ['cancel-your-plan', 'refund-timing'],
  },
  {
    slug: 'invoices-and-receipts',
    title: `Invoices, receipts and payment methods`,
    summary: `Find invoices in Billing. Cards are managed securely in Stripe.`,
    body: [
      p(`Open **Billing** in the app.`),
      ul(
        `**Invoices** lists your charges. It shows "No invoices yet" until your first charge.`,
        `**Payment method** shows the card on file. Choose **Manage payment methods** to change it in Stripe.`,
      ),
      p(`Bricks keeps only the card brand and last four digits. Stripe holds the full card details.`),
      p(`Booked media without an account? Your receipt comes by email from checkout.`),
    ],
    related: ['tax-and-currency', 'payment-failed'],
  },
  {
    slug: 'tax-and-currency',
    title: `Currency and tax`,
    summary: `All prices are Canadian dollars. HST is added at checkout.`,
    body: [
      p(`Every Bricks price is in Canadian dollars (CAD) and shown before HST. HST is added at checkout and shown on your receipt.`),
    ],
    related: ['invoices-and-receipts', 'pay-for-a-booking'],
  },
  {
    slug: 'office-seat-billing',
    title: `How office seats are billed`,
    summary: `Brokerages pay per seat. Every seat gets all of Bricks.`,
    body: [
      table(['Tier', 'Seats', 'Yearly, per seat', 'Monthly, per seat'], OFFICE_PLANS.map((o) => [
        o.name, o.seats, `$${o.seatPricePerYear}`, `$${OFFICE_SEAT_PRICE_PER_MONTH[o.id]}`,
      ])),
      p(`Yearly is billed once a year. Prefer monthly? Boutique is $74, Growth $56, Enterprise $44 and Franchise $31 per seat per month, with no lock-in. [Ask us](/contact) to set it up. Every seat gets all of Bricks, plus trust accounting. Agents don't pay separately, and media is billed separately.`),
      p(`More in [Brokerages](/help/brokerages).`),
    ],
    related: ['brokerage-seat-pricing', 'plans-overview'],
  },
]
