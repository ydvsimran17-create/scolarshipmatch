import {
  Sparkles,
  Calendar,
  Building2,
  IndianRupee,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'

export default function ScholarshipCard({ scholarship, onViewDetails }) {
  return (
    <article className="scholarship-card card">
      {/* Top Meta Bar */}
      <div className="scholarship-card-header">
        <div className="header-tags-row">
          <span className="badge badge-brass">
            <Sparkles size={12} /> {scholarship.eligibilityMatch}% Match
          </span>
          <span className="badge badge-linen text-xs">
            {scholarship.category}
          </span>
        </div>

        <span
          className="demo-data-pill"
          title="This entry is illustrative demo data"
        >
          <ShieldAlert size={12} /> Demo Data
        </span>
      </div>

      {/* Scholarship Title & Provider */}
      <div className="scholarship-title-block">
        <h3 className="scholarship-card-title">{scholarship.name}</h3>
        <p className="scholarship-provider">
          <Building2 size={15} className="provider-icon" />
          <span>{scholarship.provider}</span>
        </p>
      </div>

      {/* Short Description */}
      <p className="scholarship-description text-sm text-secondary">
        {scholarship.shortDescription}
      </p>

      {/* Highlights: Amount & Deadline */}
      <div className="scholarship-meta-grid">
        <div className="meta-box">
          <span className="meta-label">Award Value</span>
          <div className="meta-val-row">
            <IndianRupee size={15} className="rupee-icon" />
            <strong className="meta-val">{scholarship.amount}</strong>
          </div>
        </div>

        <div className="meta-box">
          <span className="meta-label">Application Deadline</span>
          <div className="meta-val-row">
            <Calendar size={15} className="calendar-icon" />
            <strong className="meta-val">{scholarship.deadline}</strong>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="scholarship-card-footer">
        <span className="text-xs text-muted">
          Based on 2nd Year B.Tech profile
        </span>
        <button
          type="button"
          className="btn btn-primary btn-sm view-details-btn"
          onClick={() => onViewDetails(scholarship)}
        >
          View Details <ArrowRight size={14} />
        </button>
      </div>
    </article>
  )
}
