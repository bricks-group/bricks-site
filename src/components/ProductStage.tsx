import ProductWindow from '@/components/ProductWindow'

/** Overview is the desk. The overlapping window is a deal in motion, not a shoot queue.
 *  Marketing hero: dual-stack visual only — locked screens, no interaction. */
export default function ProductStage() {
  return (
    <div className="prod-stack" aria-hidden="true">
      <div className="prod-stack-main" style={{ zIndex: 10 }}>
        <ProductWindow
          title="bricks"
          src="/screens/os.html?screen=overview&lock=1"
          nw={1440}
          nh={920}
          fit="width"
        />
      </div>
      <div className="prod-stack-sub" style={{ zIndex: 15 }}>
        <ProductWindow
          title="bricks"
          src="/screens/os.html?screen=transactions&lock=1"
          nw={1440}
          nh={920}
          fit="width"
        />
      </div>
    </div>
  )
}
