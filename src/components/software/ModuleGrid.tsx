import Link from 'next/link'
import { SOFTWARE_MODULES, moduleHref } from '@/lib/software-modules'
import { Arrow } from '@/components/calm/Calm'
import './software.css'

/** The parts of Bricks, as a quiet grid of square cards linking to each in-depth page. */
export default function ModuleGrid({ only, label = 'Parts of Bricks' }: { only?: readonly string[]; label?: string }) {
  const items = only ? only.map((s) => SOFTWARE_MODULES.find((m) => m.slug === s)!).filter(Boolean) : SOFTWARE_MODULES
  return (
    <ul className="sw-grid" aria-label={label}>
      {items.map((m, i) => (
        <li key={m.slug}>
          <Link href={moduleHref(m.slug)} className="sw-card">
            <span className="sw-card-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="sw-card-t">{m.name}</span>
            <span className="sw-card-d">{m.blurb}</span>
            <Arrow />
          </Link>
        </li>
      ))}
    </ul>
  )
}
