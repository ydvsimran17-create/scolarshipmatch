import { Inbox } from 'lucide-react'
import './EmptyState.css'

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items matching your criteria at this time.',
  actionLabel = '',
  onAction = null,
  className = '',
}) {
  return (
    <div className={`generic-empty-card card ${className}`}>
      <div className="generic-empty-icon-wrapper">
        <Icon size={32} className="generic-empty-icon" />
      </div>

      <h3 className="generic-empty-title">{title}</h3>
      <p className="generic-empty-description">{description}</p>

      {actionLabel && onAction && (
        <button
          type="button"
          className="btn btn-secondary btn-sm generic-empty-btn"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
