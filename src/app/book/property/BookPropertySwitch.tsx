'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import PropertyCheckoutForm from './PropertyCheckoutForm'
import PropertyRequestForm from './PropertyRequestForm'

/** Checkout for one-off visits; the request form for plans and quotes. */
export default function BookPropertySwitch() {
  const params = useSearchParams()
  const [request, setRequest] = useState(params.get('request') === '1')
  if (request) {
    return (
      <>
        <p className="hint" style={{ margin: '0 0 8px' }}>
          <button type="button" onClick={() => setRequest(false)} style={{ all: 'unset', cursor: 'pointer', textDecoration: 'underline' }}>Book one visit with prices shown</button>
        </p>
        <PropertyRequestForm />
      </>
    )
  }
  return <PropertyCheckoutForm onRequest={() => setRequest(true)} />
}
