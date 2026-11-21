'use client'

import NewsletterForm from './newsletter/NewsletterForm'

/** Not mounted anywhere today. Same double opt-in form as /newsletter. */
export default function NewsletterInline() {
  return <NewsletterForm source="inline" />
}
