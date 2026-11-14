import Link from 'next/link'
import type { RichFaq } from '@/lib/faq-content'

/** Visible FAQ block for a RichFaq array. Pair with faqPageSchema(faqs) so the JSON-LD matches. */
export default function RichFaqList({ faqs }: { faqs: readonly RichFaq[] }) {
  return (
    <div className="faq">
      {faqs.map((f) => (
        <div className="qa" key={f.q}>
          <h3>{f.q}</h3>
          <p>
            {f.parts.map((p, i) =>
              typeof p === 'string' ? p
                : p.href.startsWith('/') ? <Link key={i} href={p.href}>{p.label}</Link>
                : <a key={i} href={p.href}>{p.label}</a>,
            )}
          </p>
        </div>
      ))}
    </div>
  )
}
