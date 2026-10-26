import type { Article } from '../types'
import { p, h, ul, ol, note } from '../blocks'

export const TROUBLESHOOTING: Article[] = [
  {
    slug: 'cant-sign-in',
    title: `I can't sign in`,
    summary: `Check the sign-in method, reset your password, or try Google.`,
    popular: true,
    body: [
      ol(
        `Use the same method you signed up with. If you signed up with Google, choose **Continue with Google**. If you signed up with email, use your email and password.`,
        `Check the email for typos. Use the address on your account.`,
        `Forgot the password? Choose **Forgot password** on the sign-in screen.`,
        `Saw a passkey button? Passkeys aren't switched on yet. Use email or Google.`,
        `Still stuck? Email [help@brxs.ca](mailto:help@brxs.ca) from the address on your account.`,
      ),
      p(`Photographers sign in at [go.brxs.ca](https://go.brxs.ca), not app.brxs.ca. See [Sign in to the photographer app](/help/photographers/photographer-sign-in).`),
    ],
    related: ['sign-in-options', 'reset-your-password', 'google-sign-in'],
  },
  {
    slug: 'google-sign-in',
    title: `Google sign-in isn't working`,
    summary: `Pick the right Google account, and allow pop-ups and cookies for Google.`,
    body: [
      ul(
        `Pick the Google account that uses the email on your Bricks account. A different Google account won't open your Bricks account.`,
        `If the Google window closes without signing you in, allow pop-ups and third-party sign-in for brxs.ca, then try again.`,
        `Private browsing or strict tracking protection can block the return from Google. Try a normal window.`,
      ),
      p(`Still not working? Email [help@brxs.ca](mailto:help@brxs.ca).`),
    ],
    related: ['cant-sign-in', 'sign-in-options'],
  },
  {
    slug: 'missing-email',
    title: `I didn't get an email from Bricks`,
    summary: `Confirmations, reset links and deliveries. Where to look and what to try.`,
    popular: true,
    body: [
      ol(
        `Wait a few minutes. Some mail providers hold messages briefly.`,
        `Check spam, junk and promotions. If you find the email there, mark it as not spam.`,
        `Check the address you typed. Bookings email the address on the booking.`,
        `For a password reset, request one more link and use the newest one.`,
      ),
      p(`Booked a shoot but didn't get a confirmation? Email [help@brxs.ca](mailto:help@brxs.ca) with the property address, and we'll check the booking.`),
      note(`Receipts and security mail always send, even when other notifications are off.`),
    ],
    related: ['notification-settings', 'reset-your-password'],
  },
  {
    slug: 'payment-failed',
    title: `My payment didn't go through`,
    summary: `What to check when a card, Apple Pay or Google Pay payment fails.`,
    body: [
      ol(
        `Check the card number, expiry, security code and postal code.`,
        `Make sure the card allows online payments in Canadian dollars.`,
        `Try another card, or Apple Pay or Google Pay.`,
        `Ask your bank whether it declined the charge.`,
      ),
      p(`Your shoot isn't booked until payment is confirmed. When it is, you'll see "Payment confirmed" and a confirmation email.`),
      p(`Checkout also stays blocked until a photographer is assigned and the final fee is shown. If it says that, re-quote or email [help@brxs.ca](mailto:help@brxs.ca).`),
      note(`Bricks doesn't take PayPal, Klarna, Afterpay or Interac.`),
    ],
    related: ['pay-for-a-booking', 'stripe-payments'],
  },
  {
    slug: 'address-not-found',
    title: `The booking form can't price my address`,
    summary: `Pick the address from the suggestions, and check your connection.`,
    body: [
      ul(
        `Start typing the address and pick it from the suggestions. A typed address that isn't picked may not price.`,
        `If you see "Network hiccup pricing this address", check your connection and try again.`,
      ),
      p(`Still not working? [Contact us](/contact) with the address and we'll quote it.`),
    ],
    related: ['book-a-listing-shoot', 'travel-fees'],
  },
  {
    slug: 'no-times-available',
    title: `No shoot times are showing`,
    summary: `Times come live from photographer calendars. Try another day.`,
    body: [
      p(`The times you see are live from photographer calendars. If a date shows none, there are no shoot hours left that day.`),
      ul(
        `Pick another date.`,
        `Twilight times depend on sunset, so there are fewer of them.`,
        `Need a time that isn't shown? [Contact us](/contact).`,
      ),
    ],
    related: ['choose-a-shoot-time', 'book-a-listing-shoot'],
  },
  {
    slug: 'media-not-arrived',
    title: `My media hasn't arrived`,
    summary: `Delivery targets, and what to do if yours is late.`,
    body: [
      p(`Photos usually arrive within 24 hours of the shoot, and other media within 24–48 hours. These are targets, not guarantees.`),
      ol(
        `Check spam and promotions for the delivery email.`,
        `With an account, check the listing in Bricks. Delivered media lands there too.`,
        `Weather, airspace or access on the day can delay delivery. If a drone couldn't fly, see [If the drone couldn't fly](/help/changes-refunds/drone-not-flown).`,
        `Still nothing after 48 hours? Email [help@brxs.ca](mailto:help@brxs.ca) with the property address.`,
      ),
    ],
    related: ['what-you-get', 'missing-email'],
  },
  {
    slug: 'display-issues',
    title: `The app looks wrong or won't load`,
    summary: `Refresh, update your browser, and check light or dark mode.`,
    body: [
      ol(
        `Refresh the page.`,
        `Update your browser to its latest version.`,
        `Turn off extensions that change pages, like ad blockers, for brxs.ca.`,
        `Sign out and sign in again.`,
      ),
      p(`Text hard to read? Switch between light and dark in [Settings](/help/account-security/appearance-light-dark).`),
      p(`If it still looks wrong, email [help@brxs.ca](mailto:help@brxs.ca) with a screenshot and your browser name.`),
    ],
    related: ['appearance-light-dark', 'bricks-on-your-phone'],
  },
]
