import { useNavigate } from 'react-router-dom'
import {
  Zap,
  UserCheck,
  Compass,
  UploadCloud,
  ArrowRight,
} from 'lucide-react'
import { quickActions } from '../../data/dashboardData'
import './QuickActions.css'

export default function QuickActions() {
  const navigate = useNavigate()

  const getActionIcon = (name) => {
    switch (name) {
      case 'UserCheck':
        return <UserCheck size={18} />
      case 'Compass':
        return <Compass size={18} />
      case 'UploadCloud':
        return <UploadCloud size={18} />
      default:
        return <Zap size={18} />
    }
  }

  return (
    <section className="quick-actions-card card" aria-labelledby="quick-actions-heading">
      <div className="quick-actions-header">
        <div className="quick-actions-title-row">
          <Zap size={18} className="quick-icon-brass" />
          <h3 id="quick-actions-heading" className="quick-actions-title">
            Quick Actions
          </h3>
        </div>
      </div>

      <div className="quick-actions-list">
        {quickActions.map((action) => (
          <div
            key={action.id}
            className="action-item"
            onClick={() => navigate(action.route)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate(action.route)
              }
            }}
          >
            <div className="action-icon-circle">
              {getActionIcon(action.iconName)}
            </div>

            <div className="action-text-block">
              <div className="action-title-row">
                <span className="action-title">{action.title}</span>
                <span className="badge badge-linen text-xs">
                  {action.badgeText}
                </span>
              </div>
              <p className="action-desc text-xs text-secondary">
                {action.description}
              </p>
            </div>

            <ArrowRight size={16} className="action-chevron" />
          </div>
        ))}
      </div>
    </section>
  )
}
