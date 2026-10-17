export default function StatusBar() {
  return (
    <div className="pfs-bar">
      <span className="pfs-time">9:41</span>
      <span className="pfs-sys">
        <svg viewBox="0 0 18 12" aria-hidden="true"><path d="M1 11h2V8H1zM5 11h2V6H5zM9 11h2V4H9zM13 11h2V1h-2z" fill="currentColor" /></svg>
        <svg viewBox="0 0 26 12" aria-hidden="true"><rect x="1" y="1" width="21" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1" opacity=".5" /><rect x="3" y="3" width="15" height="6" rx="1.2" fill="currentColor" /><path d="M24 4.5v3" stroke="currentColor" strokeWidth="1.2" opacity=".5" /></svg>
      </span>
    </div>
  )
}
