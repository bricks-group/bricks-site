import type { Metadata } from 'next'
import HomeSections from '../../../HomeSections'
import VariantC from '@/components/steps-lab/VariantC'
import LabSwitch from '@/components/steps-lab/LabSwitch'

export const metadata: Metadata = {
  title: 'Steps test C — Stacked cards · Bricks lab',
  robots: { index: false, follow: false },
}

/** Homepage with the Companion booking band swapped for scroll-driven test C. */
export default function StepsLabC() {
  return (
    <>
      <HomeSections flow={<div id="steps"><VariantC /></div>} />
      <LabSwitch current="c" />
    </>
  )
}
