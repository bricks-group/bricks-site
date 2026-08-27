'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const TABS = ['Booking', 'Dispatch', 'Brokerage OS'] as const
type Tab = (typeof TABS)[number]

function BookingMock() {
  return (
    <>
      <div className="stage-kicker">New shoot</div>
      <div className="stage-head">
        <span>Address</span>
        <span>Package</span>
        <span>Date</span>
        <span>Status</span>
      </div>
      <div className="stage-row">
        <span>1847 Maple Avenue</span>
        <span>Standard</span>
        <span className="mono">4 Sep</span>
        <span className="stage-status">Confirmed</span>
      </div>
      <div className="stage-row">
        <span>92 King Street West</span>
        <span>Standard</span>
        <span className="mono">5 Sep</span>
        <span className="stage-status">Confirmed</span>
      </div>
    </>
  )
}

function DispatchMock() {
  return (
    <>
      <div className="stage-kicker">Today</div>
      <div className="stage-head">
        <span>Listing</span>
        <span>Time</span>
        <span>Status</span>
      </div>
      <div className="stage-row stage-row-3">
        <span>1847 Maple Avenue</span>
        <span className="mono">09:30</span>
        <span className="stage-status">On site</span>
      </div>
      <div className="stage-row stage-row-3">
        <span>410 Lakeshore</span>
        <span className="mono">13:00</span>
        <span className="stage-status">Uploading</span>
      </div>
    </>
  )
}

function BrokerageMock() {
  return (
    <>
      <div className="stage-stats">
        <div className="stage-stat">
          <b>12</b>
          <span>Agents</span>
        </div>
        <div className="stage-stat">
          <b>8</b>
          <span>This week</span>
        </div>
        <div className="stage-stat">
          <b>1</b>
          <span>Invoice</span>
        </div>
      </div>
      <div className="stage-head">
        <span>Agent</span>
        <span>Shoots</span>
        <span>Status</span>
      </div>
      <div className="stage-row stage-row-3">
        <span>M. Chen</span>
        <span className="mono">3</span>
        <span className="stage-status">Delivered</span>
      </div>
      <div className="stage-row stage-row-3">
        <span>A. Patel</span>
        <span className="mono">2</span>
        <span className="stage-status">On site</span>
      </div>
      <div className="stage-row stage-row-3">
        <span>J. Walsh</span>
        <span className="mono">3</span>
        <span className="stage-status">Queued</span>
      </div>
    </>
  )
}

export default function ProductStage() {
  const [tab, setTab] = useState<Tab>('Booking')

  return (
    <div className="stage">
      <div className="stage-frame">
        <div className="stage-wall">
          <Image src="/media/work/01.jpg" alt="" fill sizes="100vw" />
        </div>
        <div className="stage-window">
          <div className="stage-titlebar">
            <div className="stage-dots" aria-hidden="true"><i /><i /><i /></div>
            <span>{tab}</span>
          </div>
          <div className="stage-tabs">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tab === t}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="stage-body">
            {tab === 'Booking' && <BookingMock />}
            {tab === 'Dispatch' && <DispatchMock />}
            {tab === 'Brokerage OS' && <BrokerageMock />}
          </div>
        </div>
      </div>
      <p className="stage-note">
        Media is live. Booking, Dispatch, and Brokerage OS are in development.{' '}
        <Link href="/book">Book a shoot →</Link>
      </p>
    </div>
  )
}
