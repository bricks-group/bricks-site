import type { Metadata } from 'next'
import HomeSections from '../../../HomeSections'
import VariantB from '@/components/steps-lab/VariantB'
import LabSwitch from '@/components/steps-lab/LabSwitch'

export const metadata: Metadata = {
  title: 'Steps test B — Timeline rail · Bricks lab',
  robots: { index: false, follow: false },
}

/** Homepage with the Companion booking band swapped for scroll-driven test B. */
export default function StepsLabB() {
  return (
    <>
      <HomeSections flow={<div id="steps"><VariantB /></div>} />
      <LabSwitch current="b" />
    </>
  )
}
