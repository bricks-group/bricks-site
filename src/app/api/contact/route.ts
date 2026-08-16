import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'Email service is not configured.' }, { status: 500 })
  }

  let body: { name?: string; email?: string; message?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const name = (body.name || '').toString().trim()
  const email = (body.email || '').toString().trim()
  const message = (body.message || '').toString().trim()

  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !message) {
    return NextResponse.json({ ok: false, error: 'Fill in name, a valid email, and a message.' }, { status: 400 })
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Bricks Contact <booking@brxs.ca>',
        to: ['booking@brxs.ca'],
        reply_to: [email],
        subject: `Bricks — message from ${name}`,
        text: `${name} (${email})\n\n${message}\n\n— sent from the Bricks contact page`,
      }),
    })
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: 'Could not send message. Please email booking@brxs.ca directly.' },
        { status: 502 },
      )
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Could not send message. Please email booking@brxs.ca directly.' },
      { status: 502 },
    )
  }
}
