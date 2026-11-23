
import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, GraduationCap } from 'lucide-react'
import Sidebar from './Sidebar'
import studentService from '../../services/studentService'
import './DashboardLayout.css'

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [studentName, setStudentName] = useState('Student')
  const [studentInitials, setStudentInitials] = useState('S')

  useEffect(() => {
    let cancelled = false

    studentService
      .getProfile()
      .then((profile) => {
        if (cancelled) return

        const name = (profile?.fullName || '').trim() || 'Student'
        const initials = name
          .split(/\s+/)
          .slice(0, 2)
          .map((word) => word[0]?.toUpperCase() || '')
          .join('')

        setStudentName(name)
        setStudentInitials(initials || 'S')
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="dashboard-container">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="dashboard-main-frame">
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

          <div
            className="mobile-profile-avatar"
            title={`${studentName} (Student)`}
          >
            <span>{studentInitials}</span>
          </div>
        </header>

        <main className="dashboard-workspace-viewport">
          <div className="dashboard-content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
