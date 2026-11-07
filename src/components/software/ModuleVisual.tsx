import ProductWindow from '@/components/ProductWindow'
import PhoneFrame from '@/components/phone/PhoneFrame'
import PhoneVideo from '@/components/phone/PhoneVideo'
import FeatureShot from '@/components/features/FeatureShot'
import type { ModuleVisual as V } from '@/lib/software-modules'
import '@/components/features/features.css'
import './software.css'

const PAINT: Record<string, string> = { transactions: 'tray-tx', crm: 'tray-crm', overview: 'tray-os', jobs: 'tray-disp' }

/** One product visual. Mock screens follow the site theme (light and dark) through ProductWindow. */
export default function ModuleVisual({ v }: { v: V }) {
  if (v.kind === 'shot') return <FeatureShot name={v.name} alt={v.alt} caption={v.caption} sizes="(max-width:900px) 100vw, 760px" />
  if (v.kind === 'phone') {
    return (
      <figure className="sw-fig">
        <div className="tray tray-book tray-phone sw-phone">
          <PhoneFrame label="Screen recording of the real Bricks booking flow on brxs.ca/book with sample data: listing details, package, time, review"><PhoneVideo name="book" bar="#EFF1EE" darkBar="#1C1C14" /></PhoneFrame>
        </div>
        <figcaption>{v.caption}</figcaption>
      </figure>
    )
  }
  return (
    <figure className="sw-fig">
      <div className={`tray ${PAINT[v.screen] || 'tray-crm'} sw-screen`}>
        <div className="tray-stage sw-screen-stage">
          <ProductWindow title={v.title} src={`/screens/os.html?screen=${v.screen}&lock=1`} nw={1440} nh={920} fit="contain" zoomAt={1180} hideChrome lazy />
        </div>
      </div>
      <figcaption>{v.caption}</figcaption>
    </figure>
  )
}
