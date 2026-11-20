import {
  Calendar,
  IndianRupee,
  Building2,
  Eye,
  ShieldAlert,
} from 'lucide-react'
import ApplicationStatusBadge from './ApplicationStatusBadge'
import './ApplicationTable.css'

export default function ApplicationTable({ applications = [], onViewDetails }) {
  return (
    <div className="application-table-card card">
      <div className="table-responsive-wrapper">
        <table className="application-tracking-table" aria-label="Student Scholarship Applications Table">
          <thead>
            <tr>
              <th scope="col" className="th-scholarship">Scholarship Name</th>
              <th scope="col" className="th-provider">Provider</th>
              <th scope="col" className="th-date">Submitted</th>
              <th scope="col" className="th-amount">Amount</th>
              <th scope="col" className="th-status">Status</th>
              <th scope="col" className="th-updated">Last Updated</th>
              <th scope="col" className="th-action text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="app-table-row">
                {/* Scholarship Name & Demo ID */}
                <td className="td-scholarship">
                  <div className="cell-scholarship-wrap">
                    <span className="app-scheme-title font-semibold text-sm">
                      {app.scholarshipName}
                    </span>
                    <div className="app-meta-tag-line">
                      <span className="badge badge-linen text-xs">
                        {app.category}
                      </span>
                      <span className="demo-ref-tag text-xs text-muted">
                        <ShieldAlert size={11} className="inline-icon" /> {app.referenceId}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Provider */}
                <td className="td-provider">
                  <div className="cell-provider-wrap">
                    <Building2 size={14} className="cell-provider-icon" />
                    <span className="text-xs text-secondary">{app.provider}</span>
                  </div>
                </td>

                {/* Submission Date */}
                <td className="td-date">
                  <div className="cell-date-wrap">
                    <Calendar size={13} className="cell-date-icon" />
                    <span className="text-xs">{app.submissionDate}</span>
                  </div>
                </td>

                {/* Amount */}
                <td className="td-amount">
                  <div className="cell-amount-wrap">
                    <IndianRupee size={13} className="cell-rupee-icon" />
                    <strong className="text-xs text-midnight">{app.amount}</strong>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="td-status">
                  <ApplicationStatusBadge status={app.status} />
                </td>

                {/* Last Updated */}
                <td className="td-updated">
                  <span className="text-xs text-muted">{app.lastUpdated}</span>
                </td>

                {/* Action Button */}
                <td className="td-action text-right">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm app-view-btn"
                    onClick={() => onViewDetails(app)}
                    title={`View details for ${app.scholarshipName}`}
                  >
                    <Eye size={14} /> View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer Note */}
      <div className="table-footer-bar">
        <span className="text-xs text-muted">
          <ShieldAlert size={13} className="footer-demo-icon" /> All application identifiers and review milestones shown are simulated sample data for project demonstration.
        </span>
      </div>
    </div>
  )
}
