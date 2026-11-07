import ProductWindow from '@/components/ProductWindow'
import PhoneFrame from '@/components/phone/PhoneFrame'
import PhoneVideo from '@/components/phone/PhoneVideo'
import { FeaturePic } from '@/components/features/FeatureShot'
import type { ModuleVisual as V } from '@/lib/software-modules'
import '@/components/features/features.css'
import './software.css'

/** The five painted backgrounds (lake, hills, coast, sunset, sage). Pages rotate through them so no two neighbouring panels match. */
export const PAINTS = ['tray-os', 'tray-crm', 'tx', 'book', 'disp'].map((p) => (p.startsWith('tray-') ? p : `tray-${p}`))

/** One product visual. Mock screens follow the site theme (light and dark) through ProductWindow. */
export default function ModuleVisual({ v, paint = PAINTS[1] }: { v: V; paint?: string }) {
  if (v.kind === 'shot') {
    return (
      <figure className="sw-fig">
        <div className={`tray ${paint} sw-screen sw-shot-tray`}>
          <div className="tray-stage sw-shot-stage">
            <FeaturePic name={v.name} alt={v.alt} sizes="(max-width:900px) 92vw, 720px" />
          </div>
        </div>
        <figcaption>{v.caption ?? 'Sample data'}</figcaption>
      </figure>
    )
  }
  if (v.kind === 'phone') {
    return (
      <figure className="sw-fig">
        <div className={`tray ${paint} tray-phone sw-phone`}>
          <PhoneFrame label="Screen recording of the real Bricks booking flow on brxs.ca/book with sample data: listing details, package, time, review"><PhoneVideo name="book" bar="#EFF1EE" darkBar="#1C1C14" /></PhoneFrame>
        </div>
        <figcaption>{v.caption}</figcaption>
      </figure>
    )
  }
  return (
    <figure className="sw-fig">
      <div className={`tray ${paint} sw-screen`}>
        <div className="tray-stage sw-screen-stage">
          <ProductWindow title={v.title} src={`/screens/os.html?screen=${v.screen}&lock=1`} nw={1440} nh={920} fit="contain" zoomAt={1180} hideChrome lazy />
        </div>
      </div>
      <figcaption>{v.caption}</figcaption>
    </figure>
  )
}
