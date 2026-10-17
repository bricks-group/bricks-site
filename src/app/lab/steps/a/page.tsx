import type { Metadata } from 'next'
import HomeSections from '../../../HomeSections'
import VariantA from '@/components/steps-lab/VariantA'
import LabSwitch from '@/components/steps-lab/LabSwitch'

export const metadata: Metadata = {
  title: 'Steps test A — Pinned progress line · Bricks lab',
  robots: { index: false, follow: false },
}

/** Homepage with the Companion booking band swapped for scroll-driven test A. */
export default function StepsLabA() {
  return (
    <>
      <HomeSections flow={<div id="steps"><VariantA /></div>} />
      <LabSwitch current="a" />
    </>
  )
}
