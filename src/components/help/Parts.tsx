import { helpHubHref } from '@/lib/help/href'
import Link from 'next/link'

export function Crumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="hc-crumbs">
        {items.map((c, i) => (
          <li key={i}>{c.href ? <Link href={helpHubHref(c.href)}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</li>
        ))}
      </ol>
    </nav>
  )
}

export function ContactBand() {
  return (
    <section className="hc-contact" aria-labelledby="hc-contact-t">
      <div>
        <h2 id="hc-contact-t">Still need help?</h2>
        <p>
          Email <a href="mailto:help@brxs.ca">help@brxs.ca</a> about a booking, or{' '}
          <a href="mailto:hello@brxs.ca">hello@brxs.ca</a> about anything else. Or call <a href="tel:+13434534578">343-453-4578</a>.
        </p>
      </div>
      <Link href="/contact/contact-us" className="btn btn-brick">Contact us</Link>
    </section>
  )
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return `${d} ${months[m - 1]} ${y}`
}
