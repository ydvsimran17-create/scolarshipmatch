import { ClipboardList, Send, Clock, AlertTriangle } from 'lucide-react'
import './ApplicationOverviewCards.css'

export default function ApplicationOverviewCards({
  applications = [],
  activeFilter = 'All',
  onSelectStatusFilter,
}) {
  const totalCount = applications.length
  const submittedCount = applications.filter((app) => app.status === 'Submitted').length
  const underReviewCount = applications.filter((app) => app.status === 'Under Review').length
  const actionRequiredCount = applications.filter((app) => app.status === 'Action Required').length

  const overviewCards = [
    {
      id: 'total',
      filterValue: 'All',
      title: 'Total Applications',
      count: totalCount,
      label: 'Active academic track',
      icon: ClipboardList,
      accentClass: 'accent-midnight',
    },
    {
      id: 'submitted',
      filterValue: 'Submitted',
      title: 'Submitted',
      count: submittedCount,
      label: 'Dossier successfully logged',
      icon: Send,
      accentClass: 'accent-linen',
    },
    {
      id: 'under-review',
      filterValue: 'Under Review',
      title: 'Under Review',
      count: underReviewCount,
      label: 'Institutional / agency audit',
      icon: Clock,
      accentClass: 'accent-brass',
    },
    {
      id: 'action-required',
      filterValue: 'Action Required',
      title: 'Action Required',
      count: actionRequiredCount,
      label: 'Attention / re-upload required',
      icon: AlertTriangle,
      accentClass: 'accent-currant',
    },
  ]

  return (
    <section className="application-overview-section" aria-label="Application summary metrics">
      <div className="overview-cards-grid">
        {overviewCards.map((card) => {
          const IconComponent = card.icon
          const isActive = activeFilter === card.filterValue

          return (
            <div
              key={card.id}
              className={`overview-metric-card card card-interactive ${card.accentClass} ${
                isActive ? 'card-filter-active' : ''
              }`}
              onClick={() => onSelectStatusFilter && onSelectStatusFilter(card.filterValue)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectStatusFilter && onSelectStatusFilter(card.filterValue)
                }
              }}
              title={`Click to filter by ${card.title}`}
            >
              <div className="metric-header-row">
                <span className="metric-title-text text-sm font-semibold text-secondary">
                  {card.title}
                </span>
                <div className="metric-icon-frame">
                  <IconComponent size={20} />
                </div>
              </div>

              <div className="metric-count-row">
                <span className="metric-big-number">{card.count}</span>
                {isActive && card.filterValue !== 'All' && (
                  <span className="active-filter-badge badge badge-indigo text-xs">
                    Filtered
                  </span>
                )}
              </div>

              <p className="metric-label-subtext text-xs text-muted">
                {card.label}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
