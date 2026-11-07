import type { FeatureShotName } from '@/components/features/FeatureShot'
import { PER_VISIT, fmt } from './commercial'
import { OFFICE_SEAT_PRICE_PER_MONTH } from './catalog'

/**
 * In-depth software pages (/software/[slug]). Every claim here must match what app.brxs.ca,
 * the booking flow and the photographer app do today (sources: lg-os frontend pages, lg-dispatch,
 * lg-companion and the help centre articles in src/lib/help/articles). Don't add a feature that isn't shipped.
 * Customers only ever see the name "Bricks".
 */

/** A product visual: a live, locked mock screen (os.html, themed light and dark), a captured feature shot, or the phone booking flow. */
export type ModuleVisual =
  | { kind: 'screen'; screen: 'overview' | 'crm' | 'transactions' | 'mls' | 'forms' | 'jobs' | 'vendors' | 'accounting' | 'billing' | 'agents' | 'settings'; title: string; caption: string }
  | { kind: 'shot'; name: FeatureShotName; alt: string; caption?: string }
  | { kind: 'phone'; caption: string }

export type SoftwareModule = {
  slug: string
  /** Menu and breadcrumb name. */
  name: string
  /** Footer and compact menus. */
  short: string
  /** One line for menus and grids. */
  blurb: string
  metaTitle: string
  metaDescription: string
  h1: string
  sub: string
  /** What this part of Bricks replaces: the separate tools, threads and handoffs. */
  replaces: readonly string[]
  steps: readonly { title: string; body: string }[]
  visuals: readonly ModuleVisual[]
  details: readonly { title: string; body: string }[]
  plan: string
  faqs: readonly { q: string; a: string }[]
  related: readonly string[]
  cta?: { href: string; label: string }
}

export const SOFTWARE_MODULES: readonly SoftwareModule[] = [
  {
    slug: 'deals',
    short: 'Deals',
    name: 'Deals and transactions',
    blurb: 'Prices, commission, conditions, dates and signatures on one file per deal.',
    metaTitle: 'Deals and transactions | Bricks',
    metaDescription: 'Track every deal from offer to closing in Bricks: prices, commission, conditions and deadlines, showings, checklists, documents and e-signatures on one file.',
    h1: 'Every deal, deadline and closing in one place.',
    sub: 'Each deal gets one file: prices, commission, conditions, key dates, documents and signatures. Nothing to rebuild from a spreadsheet and an inbox.',
    replaces: [
      'A spreadsheet of deals and closing dates',
      'Condition deadlines tracked in a notebook or your head',
      'Searching email for the latest signed version',
      'A separate e-signature subscription',
    ],
    steps: [
      { title: 'Open the deal', body: 'Enter the address, deal type, list and sale price, a commission rate or flat amount, and the acceptance and closing dates. Or import the deals you already have.' },
      { title: 'Add conditions and dates', body: 'Each condition carries its deadline from the offer. Change a deadline for a signed amendment and the old date stays on record.' },
      { title: 'Work the file', body: 'Add showings and closings, keep a checklist, and attach documents, including media from the shoot.' },
      { title: 'Sign and close', body: 'Place fields on the PDF and send it for signature from the deal. Each step is recorded until it’s completed.' },
    ],
    visuals: [
      { kind: 'screen', screen: 'transactions', title: 'Transactions', caption: 'Transactions, sample data' },
      { kind: 'shot', name: 'esign-audit', alt: 'A completed Bricks e-signature with sample data: two signers, SHA-256 fingerprints of the original and signed PDF, and an audit trail with times, IP addresses and browsers' },
    ],
    details: [
      { title: 'Next 14 days', body: 'Deadlines and closings coming up across every deal, so nothing lapses quietly.' },
      { title: 'E-sign with proof', body: 'SHA-256 fingerprints of the original and signed PDF, and every event recorded with the time, IP address and browser.' },
      { title: 'Compliance for brokerages', body: 'Set the documents each deal file needs. Your broker reviews them, approves or sends them back to the agent.' },
      { title: 'Calendar', body: 'Showings and closings appear in the Bricks calendar, and in Google or Apple Calendar if you connect one.' },
    ],
    plan: 'Transactions are on every plan, including free Clay. E-sign comes with Keystone, forms and the deal room with Marble. Every brokerage seat includes all of it.',
    faqs: [
      { q: 'Can I bring in the deals I already have?', a: 'Yes. Use Import deals on the Transactions page, or add them one at a time.' },
      { q: 'Does Bricks connect to Docusign?', a: 'Not yet. Bricks has its own e-sign, with fingerprints and an audit trail, on Keystone and up.' },
      { q: 'Can my broker review deal files?', a: 'Yes, on a brokerage account. Compliance lists the files missing documents and the documents waiting for review.' },
    ],
    related: ['documents-and-delivery', 'updates', 'listings'],
  },
  {
    slug: 'listings',
    short: 'Listings',
    name: 'Listings and listing sites',
    blurb: 'One listing file for details, media and the deal, with a listing site and launch kit made from it.',
    metaTitle: 'Listings, listing sites and the launch kit | Bricks',
    metaDescription: 'Keep each listing’s details, photos, Virtual Visits, documents and deal on one listing file. Bricks makes a listing site, feature sheet, social pack and MLS® package from it.',
    h1: 'A listing file that keeps everything.',
    sub: 'Details, photos, floor plans, Virtual Visits, documents and the deal stay on one listing file. The listing site and launch kit are made from it.',
    replaces: [
      'A website builder for single-property sites',
      'Photo folders in a shared drive',
      'Feature sheets laid out by hand in a design tool',
      'MLS® paperwork assembled from scratch for each listing',
    ],
    steps: [
      { title: 'Add the listing', body: 'Enter it by hand, or pull it from your MLS® feed on your own credentials.' },
      { title: 'Book media from it', body: 'When the shoot is delivered, the photos, video, floor plan and Virtual Visit land on the listing file.' },
      { title: 'Share the listing site', body: 'A page for the property with its photos, floor plan and Virtual Visit, and a form for buyers to send an inquiry.' },
      { title: 'Launch', body: 'Download the feature sheet, social pack and MLS® package, then share or submit them yourself.' },
    ],
    visuals: [
      { kind: 'shot', name: 'launch-kit', alt: 'The Bricks launch page for a sample listing: media, listing site, Virtual Visit, listing copy and MLS package steps, with the feature sheet, social pack and MLS package ready to download' },
      { kind: 'screen', screen: 'mls', title: 'MLS listings', caption: 'MLS® submission, sample data' },
    ],
    details: [
      { title: 'Feature sheet', body: 'A one-page PDF with a QR code to the listing site.' },
      { title: 'Social pack', body: 'Feed, story and link crops, with captions.' },
      { title: 'MLS® package', body: 'Board-sized photos, a field sheet, remarks and a required-field checklist.' },
      { title: 'AI listing copy and CMA', body: 'Draft listing copy and a comparative market analysis from the listing’s data. Included in Diamond, or added to any paid plan.' },
    ],
    plan: 'The listing file and launch kit are on every plan, including free Clay. AI Listing Copy and AI CMA are included in Diamond or added to any paid plan.',
    faqs: [
      { q: 'Does Bricks post to my MLS® or social media?', a: 'No. Bricks never submits or posts for you. You download each piece and submit or share it yourself.' },
      { q: 'Do I need an MLS® feed?', a: 'No. Listings can be entered by hand. A feed connection only pulls data in, on your own credentials.' },
      { q: 'What happens to the listing after it sells?', a: 'The listing file stays in Bricks with its deal. Download and keep your own copies of delivered media too.' },
    ],
    related: ['booking-and-dispatch', 'deals', 'integrations'],
  },
  {
    slug: 'booking-and-dispatch',
    short: 'Booking and dispatch',
    name: 'Booking and vendor dispatch',
    blurb: 'Book photos, drone, video and 3D at an exact time. Bricks assigns, checks and pays the vendor.',
    metaTitle: 'Booking and vendor dispatch | Bricks',
    metaDescription: 'Book listing media from the listing at an exact time. Bricks assigns the photographer before you pay, edits in-house and pays vendors directly. Home services are requested in the same place.',
    h1: 'Book the work. Bricks handles the vendor.',
    sub: 'Photos, drone, video, floor plans and Virtual Visits are booked from the listing at an exact time. Bricks assigns the photographer, holds every shoot to one standard and pays them.',
    replaces: [
      'Calling around to find who’s free',
      'A separate booking, invoice and delivery link for each vendor',
      'Sending lockbox codes and access notes again and again',
      'Agreeing travel charges after the fact',
    ],
    steps: [
      { title: 'Pick what you need', body: 'Choose services and an exact time. The times shown come live from photographers’ calendars.' },
      { title: 'See the final price', body: 'Bricks assigns the photographer before you pay, so travel is on the quote and final at checkout.' },
      { title: 'The shoot', body: 'The photographer gets the job, your notes and the address in their app, checks in on site and follows a checklist for your package.' },
      { title: 'Delivered to the listing', body: 'Bricks edits every photo and film in-house. Photos usually arrive within 24 hours and other media within 24 to 48 hours. These are targets, not guarantees.' },
    ],
    visuals: [
      { kind: 'phone', caption: 'Screen recording of the booking flow, sample data' },
      { kind: 'screen', screen: 'jobs', title: 'Shoots', caption: 'Shoots, sample data' },
    ],
    details: [
      { title: 'One checkout', body: 'Pay by card, Apple Pay or Google Pay. Rescheduling 24 hours or more before the shoot window is free.' },
      { title: 'Favourite photographers', body: 'Brokerages can mark favourites, who get priority when Bricks dispatches their agents’ shoots.' },
      { title: 'Home services', body: 'Staging, cleaning, inspections and measurement are requested inside Bricks. A person at Bricks quotes each job in writing.' },
      { title: 'Vendors paid for you', body: 'Photographers are paid a fixed rate per completed job through Stripe Connect. You never handle their invoices.' },
    ],
    plan: 'Book media on any plan, including free Clay, or at brxs.ca/book without an account. Media is priced separately from software.',
    faqs: [
      { q: 'Can I choose my photographer?', a: 'Bricks assigns the photographer. Brokerages can mark favourites, who get priority for their agents’ shoots.' },
      { q: 'What if the drone can’t fly?', a: 'If rules, airspace, weather or the site make it unsafe, the rest of the package is still delivered and the drone add-on is refunded if it was charged separately.' },
      { q: 'Do I need an account to book?', a: 'No. With an account, the shoot also attaches to the listing in Bricks.' },
    ],
    related: ['listings', 'documents-and-delivery', 'payments'],
    cta: { href: '/book', label: 'Book media' },
  },
  {
    slug: 'updates',
    short: 'Updates and deal rooms',
    name: 'Updates and deal rooms',
    blurb: 'Bookings, shoots and deadlines send their own updates. Each party sees only their part.',
    metaTitle: 'Updates, notifications and deal rooms | Bricks',
    metaDescription: 'Fewer texts and emails asking where things are. Bricks sends booking, shoot and delivery updates, and gives lawyers, brokers and inspectors a private deal room with their own dates and reminders.',
    h1: 'Fewer texts asking where things are.',
    sub: 'Bookings, shoots, deliveries and deal deadlines send their own updates. Everyone on a deal sees only the part that’s theirs.',
    replaces: [
      'Texting the photographer for an arrival time',
      'Emailing a download link when the photos are ready',
      'Forwarding the same document to the lawyer, broker and inspector',
      'Reminding everyone about condition deadlines',
    ],
    steps: [
      { title: 'Booked', body: 'A confirmation email goes out as soon as the shoot is booked, with the time held for you.' },
      { title: 'On the day', body: 'The photographer checks in on site. If no one is there to let them in, Bricks texts the client that they’ve arrived.' },
      { title: 'Delivered', body: 'Job updates and delivery alerts arrive in your Bricks inbox, and the media is already on the listing.' },
      { title: 'Through closing', body: 'Each lawyer, mortgage broker, inspector or appraiser gets a private deal room link with only their dates, conditions and documents.' },
    ],
    visuals: [
      { kind: 'shot', name: 'deal-room', alt: 'A Bricks deal room page for a buyer’s lawyer, with sample data: conditions, key dates and documents for one deal' },
      { kind: 'screen', screen: 'overview', title: 'Overview', caption: 'Overview, sample data' },
    ],
    details: [
      { title: 'They send things back', body: 'Parties in a deal room can upload documents and say a condition is met. You decide what it means for the deal.' },
      { title: 'Reminders 48 hours ahead', body: 'Their deadlines go into their own calendar, with optional reminder emails 48 hours before.' },
      { title: 'Links that end', body: 'Deal room links end 30 days after closing, and you can turn one off at any time.' },
      { title: 'Your calendar', body: 'Showings and closings sync to Google Calendar, Apple Calendar or a private calendar link.' },
    ],
    plan: 'Booking and delivery updates come with every account. The deal room is on Marble and up, and on every brokerage seat.',
    faqs: [
      { q: 'Is there a chat between agents and photographers?', a: 'No. Bricks sends updates as notifications and emails instead, and the assigned photographer can call you about access on the day.' },
      { q: 'Do lawyers or inspectors need a Bricks account?', a: 'No. They open a private link that shows only their part of the deal.' },
      { q: 'Can I stop someone’s access?', a: 'Yes. Turn off their link at any time. Every link ends 30 days after closing anyway.' },
    ],
    related: ['deals', 'booking-and-dispatch', 'integrations'],
  },
  {
    slug: 'documents-and-delivery',
    short: 'Documents and delivery',
    name: 'Documents, e-sign and delivery',
    blurb: 'Documents, signatures, forms and finished media filed with the deal or listing they belong to.',
    metaTitle: 'Documents, e-sign, forms and media delivery | Bricks',
    metaDescription: 'Store documents with folders and tags, send PDFs for e-signature with an audit trail, fill forms from the deal, and get edited media delivered straight to the listing.',
    h1: 'Signed, filed and delivered to the right place.',
    sub: 'Documents, e-signatures, forms and finished media sit with the listing or deal they belong to, not in a shared drive and a pile of download links.',
    replaces: [
      'A separate e-signature subscription',
      'Shared drive folders nobody keeps tidy',
      'File transfer links that expire before you download them',
      'Typing the same deal details into every form',
    ],
    steps: [
      { title: 'File it', body: 'Upload documents to your document store, in folders and with tags, and search across both.' },
      { title: 'Sign it', body: 'Place signature, initials, date and text fields on the PDF and send it from the deal. Follow it from sent to completed.' },
      { title: 'Fill it', body: 'Brokerages build reusable form templates. Agents fill them from the deal instead of retyping it.' },
      { title: 'Receive it', body: 'Edited photos, video, floor plans and Virtual Visits are delivered to the listing’s media library, ready to download.' },
    ],
    visuals: [
      { kind: 'screen', screen: 'forms', title: 'Forms and e-signatures', caption: 'Forms and e-signatures, sample data' },
      { kind: 'shot', name: 'esign-audit', alt: 'A completed Bricks e-signature with sample data: two signers, SHA-256 fingerprints and an audit trail' },
    ],
    details: [
      { title: 'Fingerprinted', body: 'SHA-256 fingerprints of the original and the signed PDF.' },
      { title: 'Can’t be edited after', body: 'Fillable fields are flattened, so the signed PDF can’t be changed.' },
      { title: 'MLS-safe media', body: 'Real window views and no fake skies by default. Twilight is shot for real at blue hour.' },
      { title: 'Keep your copies', body: 'Download delivered files and keep your own copies. Bricks isn’t a long-term archive.' },
    ],
    plan: 'Documents and delivery come with every account. E-sign is on Keystone and up, forms on Marble and up, and both are on every brokerage seat.',
    faqs: [
      { q: 'Who owns the delivered media?', a: 'Bricks owns the copyright. Once the booking is paid in full you get a perpetual, non-exclusive licence to market that property with it.' },
      { q: 'How do signers sign?', a: 'Each signer gets their own link. You follow progress on the deal: sent, opened, signed and completed.' },
      { q: 'Is e-sign on the free plan?', a: 'No. E-sign starts on Keystone at $49 a month.' },
    ],
    related: ['deals', 'listings', 'teams-and-roles'],
  },
  {
    slug: 'teams-and-roles',
    short: 'Teams and roles',
    name: 'Teams, brokerages and roles',
    blurb: 'Teams of up to six and brokerages by the seat, with a shared pipeline, roster and compliance.',
    metaTitle: 'Teams, brokerages and roles | Bricks',
    metaDescription: 'Run a team of up to six agents on one plan, or a brokerage per seat, with a shared pipeline, invites, shoot allocations, a roster, compliance review and trust accounting.',
    h1: 'Everyone on one system, each with the right view.',
    sub: 'Teams share one plan and one pipeline. Brokerages get every seat on Bricks, with a roster, compliance review and trust accounting.',
    replaces: [
      'A shared spreadsheet of who owns which deal',
      'Separate software accounts for each agent',
      'Chasing agents for missing deal documents',
      'Guessing who has booked how many shoots',
    ],
    steps: [
      { title: 'Invite by email', body: 'Agents join from an invite and keep their own logins.' },
      { title: 'Set allocations', body: 'Give each team member a monthly shoot allocation. Members who have used it show as at limit.' },
      { title: 'One pipeline', body: 'Every deal and listing in one view, with who owns each one. The lead or broker sees all of it.' },
      { title: 'Review files', body: 'On a brokerage account, compliance shows incomplete deal files and documents waiting for review.' },
    ],
    visuals: [
      { kind: 'screen', screen: 'agents', title: 'Agents', caption: 'Agents roster, sample data' },
      { kind: 'screen', screen: 'overview', title: 'Overview', caption: 'Overview, sample data' },
    ],
    details: [
      { title: 'Team plans', body: 'Up to 6 agents on the lead’s Keystone, Marble or Diamond plan, at that plan’s price. Extra seats are $79 per agent a month.' },
      { title: 'Brokerage seats', body: `From 5 seats, $${OFFICE_SEAT_PRICE_PER_MONTH.franchise} to $${OFFICE_SEAT_PRICE_PER_MONTH.boutique} per seat a month depending on office size. Agents don’t pay separately.` },
      { title: 'Roster filters', body: 'See all, active, at cap and invited agents, and who can book media.' },
      { title: 'Trust accounting', body: 'Part of every brokerage account. Not on agent or team plans.' },
    ],
    plan: 'Team plans run on Keystone, Marble or Diamond. Brokerage seats include all of Bricks plus trust accounting. Media is billed separately.',
    faqs: [
      { q: 'Team plan or brokerage seats?', a: 'From about 17 agents, brokerage seats can cost less than a team plan with added seats. Brokerages also get trust accounting.' },
      { q: 'Do agents keep their own logins?', a: 'Yes. Each person signs in with their own email or Google account.' },
      { q: 'Can I see who isn’t using it?', a: 'Yes. Filter team members by active, at limit and dormant.' },
    ],
    related: ['payments', 'deals', 'documents-and-delivery'],
    cta: { href: '/brokerage', label: 'Bricks for brokerages' },
  },
  {
    slug: 'payments',
    short: 'Payments',
    name: 'Payments, commissions and trust',
    blurb: 'Stripe checkout for bookings and plans, commission plans, agent statements and the trust account.',
    metaTitle: 'Payments, commissions and trust accounting | Bricks',
    metaDescription: 'Bookings and plans are paid through Stripe. Brokerages run commission plans, agent statements and their trust account in Bricks, and vendors are paid automatically.',
    h1: 'Money in and money out, on the record.',
    sub: 'Bookings and plans are paid through Stripe. Brokerages run commissions, agent statements and the trust account in the same system, and vendors are paid without invoices.',
    replaces: [
      'Paying a separate invoice to each vendor',
      'A commission spreadsheet rebuilt every month',
      'Agent statements put together by hand',
      'Card details sitting in email threads',
    ],
    steps: [
      { title: 'Pay at booking', body: 'Card, Apple Pay or Google Pay at checkout, with the final price shown before you pay.' },
      { title: 'Manage billing', body: 'Plans, seats, cards and invoices are handled from Billing, which opens your Stripe billing portal.' },
      { title: 'Set commission plans', body: 'Brokerages define commission structures with an effective date. Records appear as deals close, ready to approve and mark paid.' },
      { title: 'Keep the trust account', body: 'Commissions, agent splits and the trust ledger, in the Finance section of a brokerage account.' },
    ],
    visuals: [
      { kind: 'screen', screen: 'accounting', title: 'Accounting', caption: 'Accounting, sample data' },
      { kind: 'screen', screen: 'billing', title: 'Billing', caption: 'Billing, sample data' },
    ],
    details: [
      { title: 'No stored card numbers', body: 'Stripe holds card details. Bricks may keep the brand, last four digits and payment status.' },
      { title: 'Vendors paid automatically', body: 'Each completed job pays the photographer a fixed rate through Stripe Connect.' },
      { title: 'Agent statements', body: 'Commission records by agent and by period.' },
      { title: 'Prices before tax', body: 'Every price is in CAD, before tax. Tax is added at checkout.' },
    ],
    plan: 'Stripe payments work on every account. Commission plans, agent statements and trust accounting are part of brokerage accounts.',
    faqs: [
      { q: 'Is trust accounting on agent or team plans?', a: 'No. It’s included with brokerage accounts only.' },
      { q: 'Where do I get invoices and receipts?', a: 'From Billing in the app, which opens your Stripe billing portal.' },
      { q: 'Can I pay monthly?', a: 'Yes. Pay monthly, or yearly and get two months free. Brokerage seats can also be monthly, with no lock-in.' },
    ],
    related: ['teams-and-roles', 'booking-and-dispatch', 'integrations'],
  },
  {
    slug: 'integrations',
    short: 'Integrations',
    name: 'Integrations',
    blurb: 'Your MLS® feed, Follow Up Boss, kvCORE, calendars and Stripe. All optional.',
    metaTitle: 'Integrations: MLS® feeds, CRM and calendars | Bricks',
    metaDescription: 'Bricks connects to PropTx (TRREB), Bridge Interactive, Repliers, Follow Up Boss, kvCORE, Google and Apple Calendar and Stripe. Contacts, calendar and e-sign are built in, so every connection is optional.',
    h1: 'Works with the tools you keep.',
    sub: 'Contacts, calendar and e-sign are built in, so every connection is optional. Bring your MLS® feed and CRM on your own credentials.',
    replaces: [
      'Copying contacts between your CRM and your files',
      'Typing listing details already in your board feed',
      'Entering showings and closings twice',
      'A separate payment link for each booking',
    ],
    steps: [
      { title: 'Open Connected tools', body: 'Find it in the Bricks app sidebar.' },
      { title: 'Paste your key', body: 'For an MLS® feed or CRM, paste the token or API key from your provider. Bricks checks it before saving.' },
      { title: 'Choose what syncs', body: 'Add your office MLS® ID for listing sync, or connect a calendar for showings and closings.' },
      { title: 'Keep working', body: 'Feeds pull in. Bricks never publishes or submits to your MLS®.' },
    ],
    visuals: [
      { kind: 'screen', screen: 'crm', title: 'Contacts', caption: 'Contacts, sample data' },
    ],
    details: [
      { title: 'MLS® feeds', body: 'PropTx (TRREB) through the RESO Web API, Bridge Interactive including Cornerstone and ITSO, another RESO Web API feed, or Repliers.' },
      { title: 'CRM', body: 'Follow Up Boss syncs contacts and deals both ways. kvCORE (BoldTrail) pulls your contacts into Bricks.' },
      { title: 'Calendars', body: 'Google Calendar, Apple Calendar with an app-specific password, or a private calendar link.' },
      { title: 'Not yet', body: 'Docusign isn’t set up yet. A Lone Wolf key can be saved, but nothing syncs yet.' },
    ],
    plan: 'Connections are available on every account. The CRM itself starts on Keystone.',
    faqs: [
      { q: 'Does Bricks publish to my MLS®?', a: 'No. Connections are pull only. Use the MLS® package from the launch kit and submit it yourself.' },
      { q: 'Which is the source of truth for contacts?', a: 'Contacts on the listing file are native to Bricks, and Bricks stays the source on the listing file.' },
      { q: 'Need something else?', a: 'Tell us at brxs.ca/contact.' },
    ],
    related: ['listings', 'deals', 'updates'],
  },
  {
    slug: 'site-progress',
    short: 'Site Progress software',
    name: 'Site Progress for builders',
    blurb: 'Dated drone visits, maps, 3D compare, progress reports and investor updates per project.',
    metaTitle: 'Site Progress software for builders and developers | Bricks',
    metaDescription: 'Every site visit on one dated timeline: drone photos, maps and 3D. Bricks drafts progress reports and investor updates from the visits and shares them as a PDF or expiring link.',
    h1: 'Every site visit, dated, mapped and reported.',
    sub: 'Bricks books the pilot, keeps each visit on the project timeline and drafts progress reports and investor updates from what was captured.',
    replaces: [
      'Hiring a drone pilot separately for each visit',
      'Maps and photos arriving through download links',
      'Building every progress report by hand in slides',
      'Rewriting the investor update from last month’s',
    ],
    steps: [
      { title: 'Book the visit', body: `A progress visit from ${fmt(PER_VISIT[0].price)} or a mapped capture from ${fmt(PER_VISIT[1].price)}, or a monthly plan per site.` },
      { title: 'Vetted pilots fly it', body: 'Transport Canada Advanced certificate and at least $2M liability insurance, or the higher minimum you set.' },
      { title: 'Filed by date', body: 'Each visit, or each import of your own captures, lands on the project timeline.' },
      { title: 'Report from it', body: 'Pick a date range and Bricks drafts the report. Share it as a PDF or a read-only link that expires.' },
    ],
    visuals: [
      { kind: 'shot', name: 'progress-report', alt: 'The top of a Bricks progress report with sample data: an orthomosaic with a scale bar and photo location pins' },
      { kind: 'shot', name: 'compare-3d', alt: 'Bricks comparing two point clouds of a sample site a month apart, with fill, cut and area changed measured' },
    ],
    details: [
      { title: 'Measured, with the method shown', body: 'Cut, fill, net volume and area changed, each naming its method. Estimates for tracking progress, not a survey.' },
      { title: 'Investor updates', body: 'Each starts from the last, so what changed is already written. Your schedule and budget figures stay marked as yours.' },
      { title: 'Evidence you can check', body: 'An evidence index with SHA-256 checksums, weather for each visit and the capture details.' },
      { title: 'Your own files', body: 'GeoTIFF, LAS, LAZ, E57, PLY, OBJ, GLB, photos, video or PDF, up to 5 GB a file, marked as imported.' },
    ],
    plan: 'Visits are priced per visit, or per site each month on a plan. Mapped plans add a one-time setup. CAD, plus HST.',
    faqs: [
      { q: 'Does a report certify completion or quantities?', a: 'No. Reports are visual documentation of site conditions, not a cost, quantity or completion certification. Each report says so.' },
      { q: 'Do readers need an account?', a: 'No. Share a PDF or a read-only link that expires.' },
      { q: 'What if a visit can’t be flown?', a: 'A visit that can’t be flown safely is rescheduled within the same billing month where possible.' },
    ],
    related: ['documents-and-delivery', 'booking-and-dispatch', 'payments'],
    cta: { href: '/builders', label: 'See the builder hub' },
  },
]

export function moduleBySlug(slug: string): SoftwareModule | undefined {
  return SOFTWARE_MODULES.find((m) => m.slug === slug)
}

export const moduleHref = (slug: string) => `/software/${slug}`
