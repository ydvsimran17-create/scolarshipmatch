import { useNavigate } from 'react-router-dom'
import { Calendar, AlertTriangle, Clock, ArrowUpRight } from 'lucide-react'
import { upcomingDeadlines } from '../../data/dashboardData'
import './UpcomingDeadlines.css'

export default function UpcomingDeadlines() {
  const navigate = useNavigate()

  const deadlineToScholarshipMap = {
    'dl-1': 'csss-scholarship',
    'dl-2': 'hdfc-parivartan-ecss',
    'dl-3': 'reliance-foundation-ug',
    'dl-4': 'inspire-she-fellowship',
  }

  const handleDeadlineClick = (id) => {
    const scholarshipId = deadlineToScholarshipMap[id] || 'csss-scholarship'
    navigate(`/find-scholarships/${scholarshipId}`)
  }

  const getUrgencyBadge = (level, days) => {
    switch (level) {
      case 'high':
        return (
          <span className="urgency-badge urgency-high">
            <span className="urgency-pulse" />
            {days} days left
          </span>
        )
      case 'medium':
        return (
          <span className="urgency-badge urgency-medium">
            <Clock size={11} /> {days} days left
          </span>
        )
      default:
        return (
          <span className="urgency-badge urgency-normal">
            <Clock size={11} /> {days} days left
          </span>
        )
    }
  }

  return (
    <section className="deadlines-card card" aria-labelledby="deadlines-heading">
      <div className="deadlines-card-header">
        <div className="deadlines-title-row">
          <Calendar size={18} className="deadlines-icon" />
          <h3 id="deadlines-heading" className="deadlines-title">
            Upcoming Deadlines
          </h3>
        </div>
        <span className="text-xs text-muted">Sample dates</span>
      </div>

      <div className="deadlines-list">
        {upcomingDeadlines.map((item) => (
          <div
            key={item.id}
            className="deadline-item"
            role="button"
            tabIndex={0}
            onClick={() => handleDeadlineClick(item.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleDeadlineClick(item.id)
              }
            }}
            title="Click to view full scholarship details & checklist"
            aria-label={`${item.name}, closing ${item.deadlineDate}. Click to view details.`}
          >
            <div className="deadline-main-info">
              <span className="deadline-name">
                {item.name}
                <ArrowUpRight size={13} className="deadline-link-icon" />
              </span>
              <div className="deadline-meta-row">
                <span className="deadline-date text-xs text-secondary">
                  Closes: {item.deadlineDate}
                </span>
                <span className="deadline-status-pill text-xs">
                  {item.status}
                </span>
              </div>
            </div>

            <div className="deadline-urgency-wrapper">
              {getUrgencyBadge(item.urgencyLevel, item.daysRemaining)}
            </div>
          </div>
        ))}
      </div>

      <div className="deadlines-footer">
        <p className="text-xs text-muted">
          <AlertTriangle size={12} className="inline-icon" /> Sample deadlines for tracking UI preview. Click any deadline to view details.
        </p>
      </div>
    </section>
  )
}
