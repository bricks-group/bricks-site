import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'bricks',
  robots: { index: false, follow: false },
}

export default function GateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`header, footer { display: none !important; }`}</style>
      {children}
    </>
  )
}
