import { Link } from 'react-router-dom'
import {
  ChevronRight,
  Building2,
  Sparkles,
  ShieldAlert,
  IndianRupee,
  Calendar,
  GraduationCap,
  MapPin,
} from 'lucide-react'
import './ScholarshipHeader.css'

export default function ScholarshipHeader({ scholarship }) {
  return (
    <header className="scholarship-header-card card">
      {/* 1. Breadcrumb Navigation */}
      <nav className="header-breadcrumbs" aria-label="Breadcrumbs">
        <Link to="/" className="breadcrumb-link">
          Dashboard
        </Link>
        <ChevronRight size={14} className="breadcrumb-sep" />
        <Link to="/find-scholarships" className="breadcrumb-link">
          Find Scholarships
        </Link>
        <ChevronRight size={14} className="breadcrumb-sep" />
        <span className="breadcrumb-current" aria-current="page">
          {scholarship.name}
        </span>
      </nav>

      {/* 2. Badges Row */}
      <div className="header-badges-group">
        <span className="badge badge-brass">
          <Sparkles size={13} /> {scholarship.eligibilityMatch}% Profile Match
        </span>
        <span className="badge badge-indigo">
          {scholarship.categoryBadge}
        </span>
        <span className="badge badge-linen">
          {scholarship.scholarshipType.join(' • ')}
        </span>
        <span className="demo-data-tag">
          <ShieldAlert size={12} /> Sample / Demo Data
        </span>
      </div>

      {/* 3. Main Title & Provider */}
      <h1 className="header-scheme-name">{scholarship.name}</h1>

      <p className="header-provider-line">
        <Building2 size={18} className="provider-icon-accent" />
        <span>{scholarship.provider}</span>
      </p>

      {/* 4. Short Description */}
      <p className="header-short-description text-secondary">
        {scholarship.shortDescription}
      </p>

      {/* 5. Highlight Metrics Strip */}
      <div className="header-quick-metrics">
        <div className="quick-metric-item">
          <span className="metric-caption">Award Value</span>
          <div className="metric-content">
            <IndianRupee size={16} className="metric-icon-brass" />
            <strong className="metric-text">{scholarship.amount}</strong>
          </div>
        </div>

        <div className="quick-metric-item">
          <span className="metric-caption">Application Deadline</span>
          <div className="metric-content">
            <Calendar size={16} className="metric-icon-brass" />
            <span className="metric-text">{scholarship.deadline}</span>
          </div>
        </div>

        <div className="quick-metric-item">
          <span className="metric-caption">Education Level</span>
          <div className="metric-content">
            <GraduationCap size={16} className="metric-icon-brass" />
            <span className="metric-text">{scholarship.educationLevel.join(', ')}</span>
          </div>
        </div>

        <div className="quick-metric-item">
          <span className="metric-caption">State / Jurisdiction</span>
          <div className="metric-content">
            <MapPin size={16} className="metric-icon-brass" />
            <span className="metric-text">{scholarship.state}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
