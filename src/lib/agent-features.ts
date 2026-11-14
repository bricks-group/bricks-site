import type { FeatureItem } from '@/components/features/Feature'

/** Agent and brokerage feature copy, shared by /agents and /brokerage. Every line matches what app.brxs.ca does. */
export const ESIGN: FeatureItem = {
  title: 'E-sign you can stand behind.',
  body: 'Place signature, initials, date and text fields on the PDF and send it from the deal. Every signed PDF comes with fingerprints and an audit trail.',
  points: [
    'SHA-256 fingerprints of the original and the signed PDF',
    'Sent, opened, signed and completed, each with the time, IP address and browser',
    'Fillable fields flattened, so the signed PDF can’t be edited',
  ],
  shot: 'esign-audit',
  alt: 'A completed Bricks e-signature with sample data: two signers, SHA-256 fingerprints of the original and signed PDF, and an audit trail with times, IP addresses and browsers',
}

/** Built and tested in the app; shown on www only when AGENT_LAUNCH_LIVE is on (see lib/launch.ts). */
export const LAUNCH: readonly FeatureItem[] = [
  {
    title: 'A launch kit for every listing.',
    body: 'Made from the listing’s details and delivered photos. Download each piece, then share or submit it yourself. Bricks never posts or submits for you. On every plan, free Clay included.',
    points: [
      'Feature sheet: a one-page PDF with a QR code to the listing site',
      'Social pack: feed, story and link crops, with captions',
      'MLS® package: board-sized photos, a field sheet, remarks and a required-field checklist',
    ],
    shot: 'launch-kit',
    alt: 'The Bricks launch page for a sample listing: media, listing site, Virtual Visit, listing copy and MLS® package steps, with the feature sheet, social pack and MLS® package ready to download',
  },
  {
    title: 'A deal room for everyone on the deal.',
    body: 'Give each lawyer, mortgage broker, inspector or appraiser a private link that shows only their dates, conditions and documents. On Marble and up, and on every brokerage seat.',
    points: [
      'They can send documents back and say a condition is met; you decide what it means for the deal',
      'Their deadlines in their own calendar, with optional reminder emails 48 hours before',
      'Links end 30 days after closing, and you can turn one off at any time',
    ],
    shot: 'deal-room',
    alt: 'A Bricks deal room page for a buyer’s lawyer with sample data: two conditions, key dates and the signed agreement to download',
  },
]
