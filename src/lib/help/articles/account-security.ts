import type { Article } from '../types'
import { p, h, ul, ol, note, table } from '../blocks'

export const ACCOUNT_SECURITY: Article[] = [
  {
    slug: 'notification-settings',
    title: `Choose your notifications`,
    summary: `Turn email and push on or off for bookings, deliveries and the weekly digest.`,
    body: [
      p(`Open **Settings** in the sidebar, then **Notifications**.`),
      table(['Notification', 'When', 'Channels'], [
        ['New booking', 'When a shoot you booked is confirmed', 'Email, push'],
        ['Delivery ready', 'When your photos, tour or floor plan are delivered', 'Email'],
        ['Weekly digest', 'Mondays at 8:00 AM, with your desk numbers for the week', 'Email'],
      ]),
      p(`Emails go to your account email. Receipts and security mail always send.`),
      h(`Push on this device`),
      p(`Push is set per device and needs a browser that supports it. Choose **Turn on**, then **Send test** to check it arrives.`),
    ],
    related: ['missing-email', 'appearance-light-dark'],
  },
  {
    slug: 'appearance-light-dark',
    title: `Light and dark mode`,
    summary: `Pick Light, Dark or System in Settings.`,
    body: [
      p(`Open **Settings**, then **Appearance**, and choose **Light**, **Dark** or **System**. System follows your device setting.`),
    ],
    related: ['notification-settings'],
  },
  {
    slug: 'delete-your-account',
    title: `Delete your account`,
    summary: `Request deletion in Settings, or by email. It's done within 30 days.`,
    howto: true,
    body: [
      ol(
        `Open **Settings** and find **Delete account**.`,
        `Choose **Delete my account**, then **Yes, delete my account**.`,
        `You'll see "Request received." We email you when it's done.`,
      ),
      p(`Photographers: at [go.brxs.ca](https://go.brxs.ca), open **Settings**, then **Delete account**.`),
      p(`Or email [privacy@brxs.ca](mailto:privacy@brxs.ca) from the email on your account with the subject "Delete my Bricks account".`),
      h(`What's deleted within 30 days`),
      ul(`Your login and profile.`, `Push tokens and connected tools.`, `Photographer applications not yet accepted, and portfolio files.`, `Personal documents.`),
      h(`What's kept`),
      ul(
        `Payment, payout and tax records, for 7 years, as the law requires.`,
        `Delivered listing media and office listing-file documents, which belong to the client or office.`,
        `Anything under a legal hold.`,
      ),
      p(`Full details: [brxs.ca/account-deletion](/account-deletion).`),
      note(`Only want to stop paying? [Cancel your plan](/help/plans-billing/cancel-your-plan) instead.`),
    ],
    related: ['privacy-overview', 'data-retention'],
  },
  {
    slug: 'privacy-overview',
    title: `How Bricks handles your information`,
    summary: `What we collect, who processes it, and where it's stored.`,
    body: [
      p(`Bricks follows Canada's PIPEDA. The full policy is at [brxs.ca/privacy](/privacy).`),
      h(`What we collect`),
      ul(
        `Booking details: contact information, the property address and notes.`,
        `Payments: handled by Stripe. We never store full card numbers.`,
        `Photographer applications and profiles.`,
        `In the apps: your profile, uploads, a push token, and for photographers, location when you check in to a job. It's required to check in and only used to confirm you're at the property.`,
      ),
      h(`Who processes it`),
      table(['Service', 'Purpose', 'Where'], [
        ['Supabase', 'Database and sign-in', 'Canada'],
        ['Stripe', 'Payments', 'United States'],
        ['Vercel', 'Hosting', 'United States'],
        ['Expo', 'App notifications', 'United States'],
        ['Mapbox', 'Maps', 'United States'],
        ['OpenStreetMap', 'Address lookup', '—'],
      ]),
      p(`The Bricks apps don't include advertising or analytics SDKs. Bricks doesn't sell your information.`),
    ],
    related: ['your-privacy-rights', 'cookies-and-analytics', 'data-retention'],
  },
  {
    slug: 'your-privacy-rights',
    title: `Your privacy rights`,
    summary: `Ask to see, correct or delete your information. We reply within 30 days.`,
    body: [
      p(`You can ask what information Bricks holds about you, ask us to correct it, or ask us to delete it. Email [privacy@brxs.ca](mailto:privacy@brxs.ca). We respond within 30 days.`),
      p(`If you're not satisfied, you can complain to the Office of the Privacy Commissioner of Canada at [priv.gc.ca](https://www.priv.gc.ca).`),
      p(`Marketing email follows Canada's anti-spam law (CASL). You can unsubscribe from any marketing email.`),
    ],
    related: ['privacy-overview', 'delete-your-account'],
  },
  {
    slug: 'data-retention',
    title: `How long we keep records`,
    summary: `Booking and payment records are generally kept for 7 years.`,
    body: [
      p(`Booking and payment records are generally kept for 7 years, for tax and legal reasons. Other information is kept while your account is open and deleted when you ask, as described in [Delete your account](/help/account-security/delete-your-account).`),
      p(`Delivered media isn't a long-term archive. Download and keep your own copies.`),
    ],
    related: ['delete-your-account', 'privacy-overview'],
  },
  {
    slug: 'cookies-and-analytics',
    title: `Cookies and analytics`,
    summary: `No advertising or tracking cookies. Site analytics are cookieless.`,
    body: [
      p(`brxs.ca uses Vercel Analytics to measure overall usage. It's cookieless: it doesn't set cookies, build a profile of you, or track you across other sites.`),
      p(`The site sets no advertising or tracking cookies. If we ever add a tool that sets cookies, we'll name it in the [privacy policy](/privacy) first and ask for consent where the law requires it.`),
    ],
    related: ['privacy-overview'],
  },
  {
    slug: 'account-security',
    title: `Keeping your account secure`,
    summary: `Encrypted connections, Stripe-held cards, and a few habits that help.`,
    body: [
      ul(
        `Information is encrypted in transit (TLS), and access to systems is limited.`,
        `Card details are held by Stripe, not Bricks.`,
        `Signed PDFs carry SHA-256 fingerprints and an audit trail.`,
      ),
      h(`What you can do`),
      ul(
        `Use a password you don't use anywhere else, or sign in with Google.`,
        `Sign out on shared computers. **Sign out** is at the bottom of the sidebar.`,
      ),
      p(`Think someone else got into your account? [Reset your password](/help/getting-started/reset-your-password) and email [help@brxs.ca](mailto:help@brxs.ca).`),
    ],
    related: ['sign-in-options', 'reset-your-password'],
  },
]
