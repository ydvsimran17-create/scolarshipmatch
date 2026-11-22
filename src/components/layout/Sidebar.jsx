import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  GraduationCap,
  LayoutDashboard,
  Search,
  ClipboardList,
  FolderOpen,
  PenTool,
  Settings,
  LogOut,
  X,
  Sparkles,
  UserCheck,
} from 'lucide-react'
import './Sidebar.css'

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  // Navigation Items Specification
  const navItems = [
    { label: 'Dashboard', to: '/', icon: LayoutDashboard, end: true },
    { label: 'Find Scholarships', to: '/find-scholarships', icon: Search },
    { label: 'My Applications', to: '/applications', icon: ClipboardList },
    { label: 'Documents', to: '/documents', icon: FolderOpen },
    { label: 'Student Profile', to: '/profile', icon: UserCheck },
    { label: 'Essay Assistant', to: '/essay-assistant', icon: PenTool },
  ]

  // Close mobile drawer on route transition
  useEffect(() => {
    if (isOpen && onClose) {
      onClose()
    }
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleLogout = () => {
    alert('Logged out (Demo action).')
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`app-sidebar ${isOpen ? 'sidebar-open' : ''}`}
        aria-label="Application Sidebar"
      >
        {/* ==================================================================
            A. BRAND SECTION
            ================================================================== */}
        <div className="sidebar-brand-wrapper">
          <div className="sidebar-brand">
            <div className="brand-crest-frame">
              <GraduationCap className="brand-icon" size={24} />
            </div>
            <div className="brand-meta">
              <div className="brand-title-row">
                <span className="brand-name">Scholarship Match</span>
              </div>
              <span className="brand-tagline">Your Future, Funded.</span>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close navigation sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* ==================================================================
            B. NAVIGATION SECTION
            ================================================================== */}
        <nav className="sidebar-nav" aria-label="Main Navigation">
          <div className="nav-group-header">
            <span>Main Menu</span>
            <Sparkles size={12} className="nav-group-accent" />
          </div>

          <ul className="nav-list">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.to} className="nav-item">
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'nav-link-active' : ''}`
                    }
                  >
                    <Icon className="nav-icon" size={20} />
                    <span className="nav-label">{item.label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* ==================================================================
            C. BOTTOM SECTION
            ================================================================== */}
        <div className="sidebar-bottom">
          <div className="sidebar-bottom-actions">
            {/* Settings Link */}
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `nav-link bottom-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              <Settings className="nav-icon" size={19} />
              <span className="nav-label">Settings</span>
            </NavLink>

            {/* Logout Action */}
            <button
              type="button"
              className="nav-link bottom-link logout-btn"
              onClick={handleLogout}
              title="Log out of session"
            >
              <LogOut className="nav-icon" size={19} />
              <span className="nav-label">Logout</span>
            </button>
          </div>

          {/* Student Profile Row */}
          <NavLink to="/profile" className="sidebar-profile-card" title="View & Edit Student Profile">
            <div className="profile-avatar-circle" aria-hidden="true">
              <span>AS</span>
            </div>
            <div className="profile-details">
              <div className="profile-name">Anvaya Sharma</div>
              <div className="profile-role">Student</div>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  )
}
