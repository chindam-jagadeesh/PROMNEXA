import { useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Atom, LayoutDashboard, Gamepad2, BookOpen, FlaskConical, Trophy, User, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'

export default function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/games', label: 'Game arena', icon: Gamepad2 },
    { to: '/learn', label: 'Learning path', icon: BookOpen },
    { to: '/ai-lab', label: 'AI Lab', icon: FlaskConical },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/profile', label: 'My Profile', icon: User }
  ]

  const userEmail = user?.email || ''
  const userInitial = (userEmail[0] || 'P').toUpperCase()
  const userName = user?.displayName || userEmail.split('@')[0] || 'Prompt explorer'

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`} style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <Link to="/" className="brand">
          <span className="brand-mark"><Atom size={20}/></span>
          <span>PROM<span>NEXA</span></span>
        </Link>
        <div className="side-label">WORKSPACE</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink 
              onClick={() => setOpen(false)} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
              to={to} 
              key={to}
            >
              <Icon size={18}/>{label}
            </NavLink>
          ))}
        </nav>
        
        {/* Sidebar Bottom Container with proper spacing */}
        <div className="sidebar-bottom" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
          <div className="mini-plan">
            <div className="mini-plan-icon"><Atom size={18}/></div>
            <b>Your next level awaits</b>
            <p>Practice a little every day.</p>
            <Link to="/games">Explore games ↗</Link>
          </div>
          <div className="user-row">
            <div className="avatar">{userInitial}</div>
            <div className="user-copy">
              <b>{userName}</b>
              <small>{userEmail || 'Signed in'}</small>
            </div>
            <button className="icon-btn" title="Sign out" onClick={async () => { await signOut(); navigate('/'); }}>
              <LogOut size={16}/>
            </button>
          </div>
        </div>
      </aside>

      {open && <button className="mobile-scrim" onClick={() => setOpen(false)} aria-label="Close navigation"/>}
      
      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu icon-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X/> : <Menu/>}
          </button>
          <div className="breadcrumb">
            Workspace <span>/</span> <b>{links.find(l => location.pathname.startsWith(l.to))?.label || 'Overview'}</b>
          </div>
          <div className="topbar-right">
            <span className="status-dot"/> AI playground <span className="top-avatar">{userInitial}</span>
          </div>
        </header>
        <div className="page-content">{children}</div>
      </main>
    </div>
  )
}