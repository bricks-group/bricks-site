'use client'

import { useEffect, useState } from 'react'
import NewsletterForm from './newsletter/NewsletterForm'

type TrackProps = Record<string, string | number | boolean | null | undefined>
function evt(_name: string, _props?: TrackProps) {
  /* Vercel analytics removed */
}

export default function NewsletterPopup() {
  const [show, setShow] = useState(false)
  const [seen, setSeen] = useState(true)

  useEffect(() => {
    let alreadySeen = false
    try { alreadySeen = sessionStorage.getItem('nl_seen') === '1' } catch {}
    setSeen(alreadySeen)
    if (alreadySeen) return

    const timer = setTimeout(() => setShow(true), 4000)
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY < 10) setShow(true)
    }
    document.addEventListener('mouseout', onMouseOut)
    return () => { clearTimeout(timer); document.removeEventListener('mouseout', onMouseOut) }
  }, [])

  function hide() {
    setShow(false)
    try { sessionStorage.setItem('nl_seen', '1') } catch {}
    setSeen(true)
  }

  return (
    <>
      {!seen && !show && (
        <button className="nl-pill" aria-label="Join the Bricks list for platform and pricing updates" onClick={() => setShow(true)}>
          Platform updates
        </button>
      )}
      <div className={`nl-pop${show ? ' show' : ''}`} role="dialog" aria-label="Newsletter signup for platform and pricing updates">
        <button className="x" aria-label="Dismiss" onClick={hide}>×</button>
        <h4>Stay on the list.</h4>
        <p>One short email a month from Bricks.</p>
        <NewsletterForm source="popup" />
      </div>
    </>
  )
}
