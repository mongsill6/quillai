import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

const navItems = [
  { path: '/resume-bullets', label: 'Resume Builder' },
  { path: '/cover-letter', label: 'Cover Letter' },
  { path: '/interview-prep', label: 'Interview Prep' },
  { path: '/linkedin-optimizer', label: 'LinkedIn' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <span className="logo-icon">CV</span>
            QuickCV
          </Link>
          <nav className="nav">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className={location.pathname === item.path ? 'active' : ''}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link to="/resume-bullets" className="cta-btn">Start Free</Link>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <Link to="/">Home</Link>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#contact">Contact</a>
          </div>
          <p>&copy; {new Date().getFullYear()} QuickCV AI. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
