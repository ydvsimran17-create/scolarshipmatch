import { Files, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { DOCUMENT_STATUSES } from '../../data/documentsData'
import './DocumentOverviewCards.css'

export default function DocumentOverviewCards({
  documents = [],
  activeStatusFilter = 'All',
  onSelectStatusFilter,
}) {
  const totalCount = documents.length
  const verifiedCount = documents.filter((d) => d.status === DOCUMENT_STATUSES.VERIFIED).length
  const pendingCount = documents.filter((d) => d.status === DOCUMENT_STATUSES.PENDING).length
  const missingCount = documents.filter((d) => d.status === DOCUMENT_STATUSES.MISSING).length

  const overviewCards = [
    {
      id: 'total',
      filterValue: 'All',
      title: 'Total Documents',
      count: totalCount,
      label: 'Dossier credentials cataloged',
      icon: Files,
      accentClass: 'accent-midnight',
    },
    {
      id: 'verified',
      filterValue: DOCUMENT_STATUSES.VERIFIED,
      title: 'Verified',
      count: verifiedCount,
      label: 'Officially authenticated records',
      icon: CheckCircle2,
      accentClass: 'accent-verified',
    },
    {
      id: 'pending',
      filterValue: DOCUMENT_STATUSES.PENDING,
      title: 'Pending Verification',
      count: pendingCount,
      label: 'Awaiting institutional review',
      icon: Clock,
      accentClass: 'accent-brass',
    },
    {
      id: 'missing',
      filterValue: DOCUMENT_STATUSES.MISSING,
      title: 'Missing Documents',
      count: missingCount,
      label: 'Upload required for full eligibility',
      icon: AlertCircle,
      accentClass: 'accent-currant',
    },
  ]

  return (
    <section className="document-overview-section" aria-label="Document summary metrics">
      <div className="doc-overview-grid">
        {overviewCards.map((card) => {
          const IconComponent = card.icon
          const isActive = activeStatusFilter === card.filterValue

          return (
            <div
              key={card.id}
              className={`doc-metric-card card card-interactive ${card.accentClass} ${
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
