import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Calendar,
  Building2,
  IndianRupee,
  Bookmark,
  ArrowRight,
  ShieldAlert,
  GraduationCap,
} from 'lucide-react'
import './DiscoveryScholarshipCard.css'

export default function DiscoveryScholarshipCard({
  scholarship,
  isBookmarked,
  onToggleBookmark,
}) {
  const navigate = useNavigate()

  return (
    <article className="discovery-card card" aria-labelledby={`title-${scholarship.id}`}>
      {/* Top Meta Bar */}
      <div className="discovery-card-header">
        <div className="discovery-badges-row">
          <span className="badge badge-brass">
            <Sparkles size={12} /> {scholarship.eligibilityMatch}% Match
          </span>
          <span className="badge badge-indigo text-xs">
            {scholarship.categoryBadge}
          </span>
          <span className="demo-data-badge" title="Illustrative sample data">
            <ShieldAlert size={12} /> Demo Data
          </span>
        </div>

        {/* Bookmark Action Button */}
        <button
          type="button"
          className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
          onClick={() => onToggleBookmark(scholarship.id)}
          aria-label={
            isBookmarked
              ? `Remove ${scholarship.name} from saved scholarships`
              : `Save ${scholarship.name} to bookmarks`
          }
          title={isBookmarked ? 'Saved to bookmarks' : 'Save scholarship'}
        >
          <Bookmark
            size={18}
            className={`bookmark-icon ${isBookmarked ? 'filled' : ''}`}
          />
        </button>
      </div>

      {/* Title & Provider */}
      <div className="discovery-title-block">
        <h3 id={`title-${scholarship.id}`} className="discovery-card-title">
          {scholarship.name}
        </h3>
        <p className="discovery-provider-line">
          <Building2 size={15} className="provider-icon" />
          <span>{scholarship.provider}</span>
        </p>
      </div>

      {/* Short Description */}
      <p className="discovery-description text-sm text-secondary">
        {scholarship.shortDescription}
      </p>

      {/* Key Metric Highlights */}
      <div className="discovery-metrics-row">
        <div className="metric-chip">
          <span className="metric-tag">Award Value</span>
          <div className="metric-content">
            <IndianRupee size={15} className="metric-icon" />
            <strong className="metric-highlight">{scholarship.amount}</strong>
          </div>
        </div>

        <div className="metric-chip">
          <span className="metric-tag">Application Deadline</span>
          <div className="metric-content">
            <Calendar size={15} className="metric-icon" />
            <span className="metric-text">{scholarship.deadline}</span>
          </div>
        </div>

        <div className="metric-chip">
          <span className="metric-tag">State / Region</span>
          <div className="metric-content">
            <GraduationCap size={15} className="metric-icon" />
            <span className="metric-text">{scholarship.state}</span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="discovery-card-footer">
        <div className="eligibility-tag-pill text-xs">
          Level: <strong>{scholarship.educationLevel.join(', ')}</strong>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm view-details-action"
          onClick={() => navigate(`/find-scholarships/${scholarship.id}`)}
        >
          View Details <ArrowRight size={14} />
        </button>
      </div>
    </article>
  )
}
