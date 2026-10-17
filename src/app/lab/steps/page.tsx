import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Steps tests · Bricks lab',
  robots: { index: false, follow: false },
}

const tests = [
  { k: 'a', t: 'A · Pinned progress line', d: 'Band pins; a brick line runs down the steps and the Companion phone swaps per step.' },
  { k: 'b', t: 'B · Timeline rail', d: 'A rail fills across Property → Package → Time; detail cross-fades and the phones advance.' },
  { k: 'c', t: 'C · Stacked cards', d: 'Each step is a card that slides up and settles onto the stack.' },
] as const

export default function StepsLabIndex() {
  return (
    <section className="hero">
      <div className="wrap">
        <span className="badge">Lab · not live</span>
        <h1>Book a shoot in three steps — motion tests.</h1>
        <p className="sub">Scroll drives every test. No click, no swipe. Each opens the homepage with only the booking band swapped.</p>
        <div className="incl three" style={{ marginTop: 32 }}>
          {tests.map((x) => (
            <Link key={x.k} href={`/lab/steps/${x.k}#steps`} className="c" style={{ textDecoration: 'none' }}>
              <h4>{x.t}</h4>
              <p>{x.d}</p>
            </Link>
          ))}
        </div>
        <div className="cta-row">
          <Link className="btn btn-brick" href="/lab/steps/a#steps">Open test A</Link>
          <Link className="btn btn-sec" href="/">Live homepage</Link>
        </div>
      </div>
    </section>
  )
}
