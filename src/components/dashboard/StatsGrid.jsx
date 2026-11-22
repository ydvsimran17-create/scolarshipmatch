import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  ClipboardCheck,
  FolderClock,
  CalendarClock,
} from 'lucide-react'
import { dashboardStats } from '../../data/dashboardData'
import './StatsGrid.css'

export default function StatsGrid() {
  const navigate = useNavigate()

  const handleCardClick = (id) => {
    switch (id) {
      case 'matches':
        navigate('/find-scholarships')
        break
      case 'applied':
        navigate('/applications')
        break
      case 'documents':
        navigate('/documents')
        break
      case 'deadlines':
        navigate('/find-scholarships')
        break
      default:
        navigate('/find-scholarships')
    }
  }

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles size={22} />
      case 'ClipboardCheck':
        return <ClipboardCheck size={22} />
      case 'FolderClock':
        return <FolderClock size={22} />
      case 'CalendarClock':
        return <CalendarClock size={22} />
      default:
        return <Sparkles size={22} />
    }
  }

  const getBadgeClass = (type) => {
    switch (type) {
      case 'brass':
        return 'badge-brass'
      case 'currant':
        return 'badge-currant'
      case 'indigo':
        return 'badge-indigo'
      default:
        return 'badge-linen'
    }
  }

  return (
    <section className="stats-section" aria-label="Key Performance Statistics">
      <div className="stats-grid">
        {dashboardStats.map((item) => (
          <div
            key={item.id}
            className="stat-card card"
            role="button"
            tabIndex={0}
            onClick={() => handleCardClick(item.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleCardClick(item.id)
              }
            }}
            aria-label={`${item.title}: ${item.value}. Click to view details.`}
          >
            <div className="stat-header">
              <div
                className="stat-icon-wrapper"
                style={{
                  color: item.accentColor,
                  backgroundColor: item.accentBg,
                }}
              >
                {getIcon(item.iconName)}
              </div>
              <span className={`badge ${getBadgeClass(item.badgeType)} text-xs`}>
                {item.badgeText}
              </span>
            </div>

            <div className="stat-body">
              <div className="stat-value">{item.value}</div>
              <h3 className="stat-title">{item.title}</h3>
              <p className="stat-subtitle text-xs text-muted">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
