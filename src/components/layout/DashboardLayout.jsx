import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, GraduationCap } from 'lucide-react'
import Sidebar from './Sidebar'
import './DashboardLayout.css'

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="dashboard-container">
      {/* Full-Height Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="dashboard-main-frame">
        {/* Mobile Top Navigation Bar (Active on <1024px) */}
        <header className="mobile-top-bar" aria-label="Mobile Navigation Bar">
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar menu"
          >
            <Menu size={22} />
          </button>

          <div className="mobile-brand">
            <div className="mobile-brand-icon-frame">
              <GraduationCap size={18} />
            </div>
            <span className="mobile-brand-text">Scholarship Match</span>
          </div>

          <div className="mobile-profile-avatar" title="Anvaya Sharma (Student)">
            <span>AS</span>
          </div>
        </header>

        {/* Primary Workspace Content Area */}
        <main className="dashboard-workspace-viewport">
          <div className="dashboard-content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
