import './help.css'

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <main className="hc" id="main" data-motion="off">{children}</main>
}
