'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [msg, setMsg] = useState('')

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = e.currentTarget
    const name = (f.elements.namedItem('name') as HTMLInputElement).value.trim()
    const email = (f.elements.namedItem('email') as HTMLInputElement).value.trim()
    const body = (f.elements.namedItem('msg') as HTMLTextAreaElement).value.trim()

    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !body) {
      setMsg('Fill in name, a valid email, and a message.')
      return
    }
    const subject = 'Bricks — message from ' + name
    const mailBody = `${name} (${email})\n\n${body}\n\n— sent from the Bricks contact page`
    window.location.href = 'mailto:booking@brxs.ca?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(mailBody)
    setMsg('✓ Opening your email app…')
  }

  return (
    <form className="cform" onSubmit={submit}>
      <div>
        <label htmlFor="cName">Name</label>
        <input type="text" id="cName" name="name" placeholder="Your name" required />
      </div>
      <div>
        <label htmlFor="cEmail">Email</label>
        <input type="email" id="cEmail" name="email" placeholder="you@brokerage.com" required />
      </div>
      <div>
        <label htmlFor="cMsg">Message</label>
        <textarea id="cMsg" name="msg" placeholder="Property address, shoot type, preferred date — anything we should know." required />
      </div>
      <div className="cta-row">
        <button type="submit" className="btn btn-brick">Send message</button>
        <a className="btn btn-sec" href="/book">Or book a shoot →</a>
      </div>
      <div className="nlmsg">{msg}</div>

      <style>{`
        .cform{display:grid;gap:14px;max-width:540px;margin-top:6px;}
        .cform label{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.12em;
          text-transform:uppercase;color:var(--inkMute);display:block;margin-bottom:6px;}
        .cform input,.cform textarea{width:100%;font-family:'General Sans',sans-serif;font-size:15px;
          color:var(--ink);background:var(--paperDeep);border:1px solid var(--hairStrong);
          border-radius:2px;padding:12px 14px;outline:none;}
        .cform input:focus,.cform textarea:focus{border-color:var(--brick);}
        .cform textarea{resize:vertical;min-height:120px;}
        .nlmsg{font-size:13px;color:var(--brickDeep);min-height:18px;}
      `}</style>
    </form>
  )
}
