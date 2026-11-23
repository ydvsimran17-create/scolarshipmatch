import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Bell,
  CheckCircle2,
  AlertCircle,
  X,
  SlidersHorizontal,
} from 'lucide-react'
import { sampleNotifications } from '../../data/dashboardData'
import studentService from '../../services/studentService'
import './DashboardHeader.css'

export default function DashboardHeader({ onSearchChange, searchQuery = '' }) {
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(sampleNotifications)
  const [student, setStudent] = useState({ name: 'Student', initials: 'S' })
  const notifRef = useRef(null)

  const unreadCount = notifications.filter((n) => n.unread).length

  // Load the logged-in student's real name from the backend
  useEffect(() => {
    let cancelled = false
    studentService
      .getProfile()
      .then((p) => {
        if (cancelled) return
        const name = (p?.fullName || '').trim() || 'Student'
        const initials = name
          .split(/\s+/)
          .slice(0, 2)
          .map((w) => w[0]?.toUpperCase() || '')
          .join('')
        setStudent({ name, initials: initials || 'S' })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/find-scholarships?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="dashboard-header-bar">
      {/* 1. Search Bar */}
      <form
        className="header-search-form"
        role="search"
        onSubmit={handleSearchSubmit}
      >
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search scholarships by name, provider, or category..."
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            aria-label="Search scholarships"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange && onSearchChange('')}
              aria-label="Clear search query"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </form>

      {/* 2. Header Actions: Notifications & Student Profile */}
      <div className="header-actions-group">
        {/* Notification Bell Dropdown */}
        <div className="notification-dropdown-wrapper" ref={notifRef}>
          <button
            type="button"
            className={`header-icon-btn ${showNotifications ? 'active' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label={`Notifications, ${unreadCount} unread`}
            aria-expanded={showNotifications}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-counter-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-flyout card" role="region" aria-label="Notifications panel">
              <div className="flyout-header">
                <div>
                  <h4 className="flyout-title">Notifications</h4>
                  <span className="text-xs text-muted">
                    {unreadCount} unread alert{unreadCount === 1 ? '' : 's'}
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="mark-read-btn text-xs"
                    onClick={markAllAsRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notifications-list">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`notification-item ${item.unread ? 'unread' : ''}`}
                  >
                    <div className="notif-icon-circle">
                      {item.type === 'deadline' ? (
                        <AlertCircle size={15} color="var(--color-currant)" />
                      ) : (
                        <CheckCircle2 size={15} color="var(--color-brass-dark)" />
                      )}
                    </div>
                    <div className="notif-text-block">
                      <p className="notif-title">{item.title}</p>
                      <p className="notif-message text-xs text-secondary">
                        {item.message}
                      </p>
                      <span className="notif-time text-xs text-muted">
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flyout-footer">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => setShowNotifications(false)}
                >
                  Close Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Student Avatar & Profile Pill */}
        <button
          type="button"
          className="header-profile-pill"
          onClick={() => navigate('/settings')}
          title="View Student Profile & Settings"
        >
          <div className="header-avatar-circle" aria-hidden="true">
            <span>{student.initials}</span>
          </div>
          <div className="header-profile-text">
            <span className="header-student-name">{student.name}</span>
            <span className="header-student-role">Student</span>
          </div>
          <SlidersHorizontal size={14} className="header-profile-chevron" />
        </button>
      </div>
    </header>
  )
}