import { Routes, Route, NavLink } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import ArchivePage from './pages/ArchivePage'
import BuilderPage from './pages/BuilderPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="main-nav">
          <div className="nav-logo">
            <div className="logo-icon">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7"/>
              </svg>
            </div>
            <div>
              <div className="nav-title">مصنع التريكو</div>
              <div className="nav-sub">نظام إدارة الإنتاج</div>
            </div>
          </div>
          <div className="nav-links">
            <NavLink to="/" end className={({isActive})=>isActive?'nav-link active':'nav-link'}>
              Tech Pack Builder
            </NavLink>
            <NavLink to="/archive" className={({isActive})=>isActive?'nav-link active':'nav-link'}>
              الأرشيف
            </NavLink>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<BuilderPage />} />
            <Route path="/archive" element={<ArchivePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
