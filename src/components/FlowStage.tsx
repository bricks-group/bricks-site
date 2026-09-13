'use client'

import PhoneDevice from '@/components/PhoneDevice'
import ProductWindow from '@/components/ProductWindow'

/**
 * Benefit band — three phones: Companion home → book flow → GO.
 * Shows how Bricks simplifies the business loop (not a single pretty tray).
 */
export default function FlowStage() {
  return (
    <div className="flow-phones" aria-label="Book to shoot to field">
      <div className="flow-phone flow-phone-a">
        <span className="flow-cap">1 · Companion</span>
        <PhoneDevice label="Companion home">
          <ProductWindow
            variant="phone"
            title="Companion"
            src="/screens/book.html?lock=1&tab=home"
            nw={390}
            nh={844}
            fit="contain"
            hideChrome
            lazy
          />
        </PhoneDevice>
      </div>
      <div className="flow-phone flow-phone-b">
        <span className="flow-cap">2 · Book</span>
        <PhoneDevice label="Booking flow">
          <ProductWindow
            variant="phone"
            title="Book"
            src="/screens/book.html?lock=1&tab=flow"
            nw={390}
            nh={844}
            fit="contain"
            hideChrome
            lazy
          />
        </PhoneDevice>
      </div>
      <div className="flow-phone flow-phone-c">
        <span className="flow-cap">3 · GO</span>
        <PhoneDevice label="GO field">
          <ProductWindow
            variant="phone"
            title="GO"
            src="/screens/disp.html?lock=1"
            nw={390}
            nh={844}
            fit="contain"
            hideChrome
            lazy
          />
        </PhoneDevice>
      </div>
    </div>
  )
}
