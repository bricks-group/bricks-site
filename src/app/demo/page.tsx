import type { Metadata } from 'next'
import DemoExperience from '@/components/demo/DemoExperience'

export const metadata: Metadata = {
  title: 'bricks demo — guided by Brixton',
  description:
    'Interactive tour of Bricks OS, Companion, and GO. Brixton walks you through the desk, a deal, booking, and the field app.',
  alternates: { canonical: '/demo' },
  robots: { index: false, follow: false },
}

export default function DemoPage() {
  return (
    <main className="demo-page">
      <div className="demo-page-head wrap">
        <span className="badge">Interactive demo</span>
        <h1>Try Bricks with Brixton.</h1>
        <p className="sub">A short guided tour of the OS desk, Companion, and GO. Ashfield is fictional — the product is real.</p>
      </div>
      <DemoExperience />
    </main>
  )
}
