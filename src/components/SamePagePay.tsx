'use client'

import CheckoutElementsPay from './CheckoutElementsPay'
import EmbeddedPay, { type EmbeddedSession } from './EmbeddedPay'

/** Bricks-drawn form for `elements` sessions; Stripe's embedded page otherwise. */
export default function SamePagePay(props: { session: EmbeddedSession; onBack?: () => void; detail?: string }) {
  if (props.session.uiMode === 'elements') return <CheckoutElementsPay {...props} />
  return <EmbeddedPay session={props.session} onBack={props.onBack} note="" />
}
