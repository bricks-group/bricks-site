import Link from 'next/link'
import type { ReactNode } from 'react'

/** Render the two inline marks used in help content: [label](href) and **bold**. */
export default function Inline({ text }: { text: string }) {
  return <>{render(text)}</>
}

const TOKEN = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g

function render(text: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let i = 0
  for (const m of text.matchAll(TOKEN)) {
    const at = m.index ?? 0
    if (at > last) out.push(text.slice(last, at))
    if (m[1] !== undefined) {
      const href = m[2]
      const label = render(m[1])
      if (href.startsWith('/')) out.push(<Link key={i++} href={href}>{label}</Link>)
      else if (href.startsWith('mailto:') || href.startsWith('tel:')) out.push(<a key={i++} href={href}>{label}</a>)
      else out.push(<a key={i++} href={href} target="_blank" rel="noopener noreferrer">{label}</a>)
    } else {
      out.push(<strong key={i++}>{m[3]}</strong>)
    }
    last = at + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}
