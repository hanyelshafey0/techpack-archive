import './Header.css'

export default function Header({ onUpload }) {
  return (
    <header className="header">
      <div className="header-logo">
        <div className="logo-icon">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7"/>
          </svg>
        </div>
        <div>
          <div className="logo-name">أرشيف الموديلات</div>
          <div className="logo-sub">Tech Pack Archive</div>
        </div>
      </div>
      <button className="btn-upload" onClick={onUpload}>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
        </svg>
        رفع Tech Pack
      </button>
    </header>
  )
}
