import { Head } from '@/components/calm/Calm'
import { faqPageSchema } from '@/lib/schema'

export default function PublicFaqs({ title, faqs }: { title: string; faqs: readonly { q: string; a: string }[] }) {
  return (
    <section className="cm-sec" aria-label={title}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(faqs)) }} />
      <Head title={title} />
      <div className="faq">
        {faqs.map((f) => <div className="qa" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
      </div>
    </section>
  )
}
