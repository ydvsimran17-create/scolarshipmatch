import { Send, Clock, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { APPLICATION_STATUSES } from '../../data/applicationsData'

export default function ApplicationStatusBadge({ status }) {
  switch (status) {
    case APPLICATION_STATUSES.SUBMITTED:
      return (
        <span className="app-status-badge badge-status-submitted">
          <Send size={12} /> Submitted
        </span>
      )
    case APPLICATION_STATUSES.UNDER_REVIEW:
      return (
        <span className="app-status-badge badge-status-review">
          <Clock size={12} /> Under Review
        </span>
      )
    case APPLICATION_STATUSES.ACTION_REQUIRED:
      return (
        <span className="app-status-badge badge-status-action">
          <AlertTriangle size={12} /> Action Required
        </span>
      )
    case APPLICATION_STATUSES.APPROVED:
      return (
        <span className="app-status-badge badge-status-approved">
          <CheckCircle2 size={12} /> Approved
        </span>
      )
    case APPLICATION_STATUSES.REJECTED:
      return (
        <span className="app-status-badge badge-status-rejected">
          <XCircle size={12} /> Rejected
        </span>
      )
    default:
      return (
        <span className="app-status-badge badge-status-neutral">
          {status}
        </span>
      )
  }
}
