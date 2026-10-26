import type { Article } from '../types'
import { p, h, ul, ol, note, table } from '../blocks'
import { signupUrl } from '@/lib/brand'

export const GETTING_STARTED: Article[] = [
  {
    slug: 'what-is-bricks',
    title: `What Bricks is`,
    summary: `One app for running listings and deals, with listing media booked and delivered inside it.`,
    popular: true,
    body: [
      p(`Bricks is software for Canadian real estate, with professional media built in. You run your listings, contacts and deals in the Bricks app, and you book photos, drone, video, floor plans and 3D from the same place. The media lands on the listing it was shot for.`),
      h(`Two parts, one company`),
      ul(
        `**The Bricks app** at [app.brxs.ca](https://app.brxs.ca): listing files, transactions, CRM, e-sign, forms, billing and media orders. Agents, teams, brokerages, builders, property managers, commercial owners, investors and REITs each get a version shaped for how they work.`,
        `**Listing media**: shoots booked at [brxs.ca/book](/book) or from a listing in the app. Bricks Group is the company you contract with. Photographers who shoot for Bricks are independent contractors, and Bricks edits every photo and film in-house.`,
      ),
      p(`Photographers and vendors use their own version of Bricks at [go.brxs.ca](https://go.brxs.ca) to take jobs, shoot to the standard and get paid. See [Photographers and vendors](/help/photographers).`),
      h(`Where to start`),
      ul(
        `Need photos for one listing? [Book a shoot](/help/booking/book-a-listing-shoot). You don't need an account.`,
        `Want the software? [Pick your account type](/help/getting-started/choose-an-account-type). Clay, the individual plan, is free with no card.`,
        `Run an office or a team? See [Brokerages](/help/brokerages) or [Teams](/help/teams).`,
      ),
    ],
    related: ['choose-an-account-type', 'book-a-listing-shoot', 'plans-overview'],
  },
  {
    slug: 'choose-an-account-type',
    title: `Choose the right account type`,
    summary: `Bricks shapes the app around who you are. Here is which account type fits.`,
    popular: true,
    body: [
      p(`When you create an account, Bricks asks what kind of business you run. The answer decides what you see in the app. You confirm the type during sign-up, and nothing is assumed from the link you came in on.`),
      table(['If you are…', 'Choose', 'What you get'], [
        [`An agent working on your own`, `Agent`, `Listing files, transactions, your MLS® and media booking. Free on Clay.`],
        [`A team lead with up to 6 agents`, `Team`, `One plan for the team, a shared pipeline, and member shoot allocations.`],
        [`A brokerage from 5 seats`, `Brokerage`, `Per-seat pricing, roster, pipeline, compliance and trust accounting.`],
        [`A builder, developer or GC`, `Builder`, `Site Progress: drone visits, maps, progress reports and investor updates.`],
        [`A property manager or landlord`, `Property manager`, `Unit photos, condition reports, turnovers and your buildings in one account.`],
        [`A commercial owner or broker`, `Commercial`, `Leasing sets, aerials and site progress for commercial property.`],
        [`An investor or lender`, `Investor`, `Acquisition captures, portfolio watch and site progress evidence.`],
        [`A REIT`, `REIT`, `Everything above, filed by property, in one account.`],
      ]),
      h(`Create the account`),
      ul(
        `[Agent](${signupUrl('solo')})`,
        `[Team](${signupUrl('team')})`,
        `[Brokerage](${signupUrl('brokerage')})`,
        `[Builder](${signupUrl('builder')})`,
        `[Property manager](${signupUrl('property_manager')})`,
        `[Commercial](${signupUrl('commercial')})`,
        `[Investor](${signupUrl('investor')})`,
        `[REIT](${signupUrl('reit_leasing')})`,
      ),
      note(`Photographers don't create an account here. [Apply to shoot with Bricks](/help/photographers/apply-to-shoot) instead.`),
    ],
    related: ['create-an-account', 'what-is-bricks', 'plans-overview'],
  },
  {
    slug: 'create-an-account',
    title: `Create a Bricks account`,
    summary: `Sign up with your email or Google, confirm your email, then finish onboarding.`,
    howto: true,
    body: [
      p(`You can create an account with an email and password, or with Google.`),
      ol(
        `Go to [app.brxs.ca](https://app.brxs.ca/login?mode=register) and choose **Create account**.`,
        `Sign up with Google, or enter your name, email and a password.`,
        `If you used email, open the confirmation email from Bricks and follow the link. Your account isn't active until the email is confirmed.`,
        `Pick your account type and answer the onboarding questions.`,
        `Read and accept the terms. You land on your overview.`,
      ),
      p(`Clay is free and doesn't ask for a card. You only pay when you choose a paid plan or book media.`),
      note(`Didn't get the confirmation email? See [I didn't get an email from Bricks](/help/troubleshooting/missing-email).`),
    ],
    related: ['sign-in-options', 'choose-an-account-type', 'missing-email'],
  },
  {
    slug: 'sign-in-options',
    title: `Ways to sign in`,
    summary: `Sign in to Bricks with your email and password, or with Google.`,
    popular: true,
    body: [
      p(`The Bricks app at [app.brxs.ca](https://app.brxs.ca/login) supports two ways to sign in today:`),
      ul(
        `**Email and password.** Use **Forgot password** on the sign-in screen if you need a new one.`,
        `**Google.** Choose **Continue with Google** and pick the Google account that uses your work email.`,
      ),
      p(`Use the same method each time. If you signed up with Google, sign in with Google. If you signed up with email, sign in with email.`),
      h(`Not available yet`),
      ul(
        `Sign in with Apple isn't connected yet.`,
        `Passkey sign-in isn't switched on yet. Some browsers show a passkey button, but it will tell you passkeys aren't enabled. Use email or Google.`,
        `Phone (text message) sign-in isn't switched on for the Bricks app.`,
      ),
      p(`Photographers sign in at [go.brxs.ca](https://go.brxs.ca). See [Sign in to the photographer app](/help/photographers/photographer-sign-in).`),
    ],
    related: ['reset-your-password', 'cant-sign-in', 'create-an-account'],
  },
  {
    slug: 'reset-your-password',
    title: `Reset your password`,
    summary: `Get a reset link by email from the sign-in screen.`,
    howto: true,
    body: [
      ol(
        `Go to [app.brxs.ca/login](https://app.brxs.ca/login).`,
        `Choose **Forgot password** and enter the email on your account.`,
        `Open the email from Bricks and follow the link.`,
        `Set a new password. You're signed in.`,
      ),
      p(`If you signed up with Google, you don't have a Bricks password. Sign in with Google instead.`),
      note(`No email after a few minutes? Check spam and promotions, then see [I didn't get an email from Bricks](/help/troubleshooting/missing-email).`),
    ],
    related: ['sign-in-options', 'cant-sign-in', 'missing-email'],
  },
  {
    slug: 'book-without-an-account',
    title: `Book media without an account`,
    summary: `Anyone can book a listing shoot at brxs.ca/book. An account is optional.`,
    body: [
      p(`You don't need a Bricks account to book a shoot. Go to [brxs.ca/book](/book), enter the address, pick what you need, choose a time and pay. Your confirmation and delivery come by email.`),
      p(`With an account, the shoot also attaches to the listing in Bricks, so the delivered media sits with the listing file. If you book while signed in, the confirmation tells you the listing is in Bricks.`),
      p(`Property managers, commercial owners, investors and REITs book one-off visits at [brxs.ca/book/property](/book/property). Builders book site visits at [brxs.ca/book/site](/book/site).`),
    ],
    related: ['book-a-listing-shoot', 'what-is-bricks', 'create-an-account'],
  },
  {
    slug: 'bricks-on-your-phone',
    title: `Use Bricks on your phone`,
    summary: `Bricks works in your phone's browser. There is no app store download for clients yet.`,
    body: [
      p(`The Bricks app is built to work on a phone. Open [app.brxs.ca](https://app.brxs.ca) in Safari or Chrome and sign in. Booking at [brxs.ca/book](/book) also works on a phone, including Apple Pay in Safari and Google Pay in Chrome.`),
      p(`To open it like an app, use your browser's **Add to Home Screen** option.`),
      p(`Photographers use [go.brxs.ca](https://go.brxs.ca) on their phone in the same way.`),
    ],
    related: ['sign-in-options', 'appearance-light-dark'],
  },
  {
    slug: 'request-a-walkthrough',
    title: `See Bricks before you sign up`,
    summary: `Ask for a walkthrough, or start free on Clay and explore with your own listings.`,
    body: [
      p(`Two ways to see Bricks before you commit:`),
      ul(
        `**Start free.** Clay costs nothing and needs no card. [Create an account](/help/getting-started/create-an-account) and add a listing.`,
        `**Request a walkthrough.** Tell us who you are at [brxs.ca/demo](/demo) and we'll set a time to show your team Bricks with sample data.`,
      ),
    ],
    related: ['create-an-account', 'choose-an-account-type'],
  },
]

