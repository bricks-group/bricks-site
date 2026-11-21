import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import RevealObserver from '@/components/RevealObserver'
import { Head } from '@/components/calm/Calm'
import { TRADE_SLUGS, tradeBySlug } from '@/lib/services'
import TradeApplyForm from '../TradeApplyForm'
import { DISPUTES, PAYOUT_TIMING, tradePay } from '@/lib/trade-pricing'
import '@/components/home-services/home-services.css'
import { OG_IMAGE } from '@/lib/og'
import { CAREERS_EMAIL } from '@/lib/careers'

export const dynamicParams = false

export function generateStaticParams() {
  return TRADE_SLUGS.map((trade) => ({ trade }))
}

/** Search titles per trade (W2 keyword pass, 2026-11-14). Others fall back to the generic title. */
const JOB_TITLES: Partial<Record<string, string>> = {
  cleaning: 'Cleaning Contractor Jobs: Turnovers & Move-Outs | Bricks',
  inspections: 'Home Inspector Jobs in Ontario | Work with Bricks',
  measurement: 'Floor Plan Measurer Jobs | Work with Bricks',
  staging: 'Home Stager Jobs | Work with Bricks',
}

export async function generateMetadata({ params }: { params: Promise<{ trade: string }> }): Promise<Metadata> {
  const t = tradeBySlug((await params).trade)
  if (!t) return {}
  const title = JOB_TITLES[t.slug] ?? `Apply: ${t.apply.role.toLowerCase()} | Work with Bricks`
  const description = `${t.apply.lede} Apply to take ${t.name.toLowerCase()} jobs through Bricks.`
  return { title, description, alternates: { canonical: `/work-with-bricks/${t.slug}` }, openGraph: { images: [OG_IMAGE], title, description } }
}

export default async function TradeApplyPage({ params }: { params: Promise<{ trade: string }> }) {
  const t = tradeBySlug((await params).trade)
  if (!t) notFound()
  return (
    <div className="hs">
      <RevealObserver />
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow"><Link href="/work-with-bricks">Work with Bricks</Link> · {t.name}</p>
          <h1>{`${t.apply.role}: apply to work with Bricks.`}</h1>
          <p className="sub">{t.apply.lede} You&apos;re an independent contractor. Bricks sends you set-price jobs near you, with your cut shown up front.</p>
        </div>
      </section>

      <section className="cm-sec rvl" aria-label="What you need">
        <Head title="What you need." />
        <ul className="hs-list" style={{ maxWidth: '72ch' }}>
          {t.apply.needs.map((n) => <li key={n}>{n}</li>)}
          <li>An HST/GST number, or the small-supplier exemption</li>
        </ul>
        {t.rules.length ? (
          <div className="hs-rules" role="note">{t.rules.map((r) => <p key={r}><b>Scope.</b> {r}</p>)}</div>
        ) : null}
      </section>

      <section className="cm-sec rvl" aria-label="Your pay">
        <Head title="Your pay." lede="A set amount per job, by tier: Tier 1 / Tier 2 / Tier 3." />
        <ul className="hs-list hs-price-list" style={{ maxWidth: '72ch' }}>
          {tradePay(t.slug).map((r) => <li key={r.name}><b>{r.pay}</b>{r.name}</li>)}
        </ul>
        <p className="hs-note">{PAYOUT_TIMING} {DISPUTES}</p>
      </section>

      <section className="cm-sec hs-quote" id="apply" aria-label="Application">
        <Head title="Apply." lede={`No photo samples are needed for this trade. Questions? Email ${CAREERS_EMAIL}.`} />
        <TradeApplyForm trade={t} />
      </section>
    </div>
  )
}
