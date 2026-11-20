import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  Calendar,
  IndianRupee,
  ShieldAlert,
  FileCheck2,
  AlertTriangle,
  Upload,
  ExternalLink,
  Info,
  Clock,
  Sparkles,
  FileText,
} from 'lucide-react'
import ApplicationProgressTimeline from './ApplicationProgressTimeline'
import ApplicationStatusBadge from './ApplicationStatusBadge'
import './ApplicationDetailView.css'

export default function ApplicationDetailView({ application, onBack }) {
  if (!application) return null

  const handleDemoUpload = (docName) => {
    alert(`Demo Mode: File upload triggered for "${docName}". (Simulated document attachment)`)
  }

  return (
    <div className="application-detail-view-container" aria-label="Application Detailed View">
      {/* Back Navigation Bar */}
      <nav className="detail-view-nav">
        <button
          type="button"
          className="btn-back-link"
          onClick={onBack}
        >
          <ArrowLeft size={16} /> Back to All Applications
        </button>

        <span className="demo-ref-pill">
          <ShieldAlert size={12} className="inline-icon" /> Demo Ref: {application.referenceId}
        </span>
      </nav>

      {/* Main Header Card */}
      <header className="app-detail-header-card card">
        <div className="detail-header-top-row">
          <div className="detail-badges-wrap">
            <ApplicationStatusBadge status={application.status} />
            <span className="badge badge-indigo text-xs">
              {application.category}
            </span>
            <span className="badge badge-linen text-xs">
              Academic Year {application.academicYear}
            </span>
          </div>

          <div className="detail-header-actions">
            {application.scholarshipId && (
              <Link
                to={`/find-scholarships/${application.scholarshipId}`}
                className="btn btn-outline btn-sm view-scheme-link"
              >
                <span>View Scholarship Listing</span>
                <ExternalLink size={13} />
              </Link>
            )}
          </div>
        </div>

        <h1 className="app-detail-scheme-title">
          {application.scholarshipName}
        </h1>

        <p className="app-detail-provider-line">
          <Building2 size={18} className="provider-icon-accent" />
          <span>{application.provider}</span>
        </p>

        {/* Highlight Metrics */}
        <div className="app-detail-metrics-grid">
          <div className="metric-box">
            <span className="metric-box-label text-xs text-muted">Award Amount</span>
            <div className="metric-box-val">
              <IndianRupee size={16} className="metric-box-icon" />
              <strong>{application.amount}</strong>
            </div>
          </div>

          <div className="metric-box">
            <span className="metric-box-label text-xs text-muted">Application Date</span>
            <div className="metric-box-val">
              <Calendar size={15} className="metric-box-icon" />
              <span>{application.submissionDate}</span>
            </div>
          </div>

          <div className="metric-box">
            <span className="metric-box-label text-xs text-muted">Last System Update</span>
            <div className="metric-box-val">
              <Clock size={15} className="metric-box-icon" />
              <span>{application.lastUpdated}</span>
            </div>
          </div>

          <div className="metric-box">
            <span className="metric-box-label text-xs text-muted">Applicant ID</span>
            <div className="metric-box-val">
              <span className="applicant-badge-pill">
                {application.applicantName} ({application.applicantRoll})
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Required Next Actions Banner (Highlighted) */}
      <section className="app-next-action-card card" aria-labelledby="action-banner-heading">
        <div className="action-banner-header">
          <div className="action-banner-icon-crest">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 id="action-banner-heading" className="action-banner-title">
              Required Next Actions &amp; Institutional Directives
            </h2>
            <span className="text-xs text-muted">
              Current action items for this application lifecycle
            </span>
          </div>
        </div>

        <p className="action-banner-text text-sm">
          {application.requiredNextActions}
        </p>

        {application.notes && (
          <div className="action-notes-row">
            <Info size={14} className="notes-icon" />
            <span className="text-xs text-secondary">
              <strong>Audit Note:</strong> {application.notes}
            </span>
          </div>
        )}
      </section>

      {/* Two Column Layout: Timeline (Left) & Documents (Right) */}
      <div className="app-detail-split-layout">
        {/* Left Column: Progress Timeline */}
        <div className="detail-timeline-column">
          <div className="timeline-wrapper-card card">
            <div className="detail-card-header-bar">
              <Clock size={20} className="detail-section-icon" />
              <h3 className="detail-section-title">
                Application Progress Timeline
              </h3>
            </div>
            <p className="text-secondary text-sm">
              Track the step-by-step progress of your submission from initial entry to disbursement.
            </p>

            <ApplicationProgressTimeline timeline={application.progressTimeline} />
          </div>
        </div>

        {/* Right Column: Submitted & Pending Documents */}
        <div className="detail-documents-column">
          {/* Section: Pending Documents (if any) */}
          {application.pendingDocuments && application.pendingDocuments.length > 0 && (
            <div className="pending-docs-card card">
              <div className="detail-card-header-bar">
                <AlertTriangle size={20} className="pending-section-icon" />
                <h3 className="detail-section-title pending-title">
                  Pending Documents ({application.pendingDocuments.length})
                </h3>
              </div>
              <p className="text-xs text-secondary">
                Action required: please provide the missing credentials before the respective cutoffs.
              </p>

              <div className="pending-docs-list">
                {application.pendingDocuments.map((doc, idx) => (
                  <div key={idx} className="pending-doc-item">
                    <div className="pending-doc-meta">
                      <strong className="pending-doc-name text-sm">
                        {doc.name}
                      </strong>
                      <p className="pending-doc-reason text-xs text-currant">
                        {doc.reason}
                      </p>
                      <span className="pending-doc-deadline text-xs text-muted">
                        Cutoff Deadline: <strong>{doc.deadline}</strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-currant btn-sm upload-action-btn"
                      onClick={() => handleDemoUpload(doc.name)}
                    >
                      <Upload size={14} /> Upload Document
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Submitted Documents */}
          <div className="submitted-docs-card card">
            <div className="detail-card-header-bar">
              <FileCheck2 size={20} className="detail-section-icon" />
              <h3 className="detail-section-title">
                Submitted Documents ({application.submittedDocuments.length})
              </h3>
            </div>
            <p className="text-xs text-secondary">
              Verified records securely stored in your student application dossier.
            </p>

            <div className="submitted-docs-grid">
              {application.submittedDocuments.map((doc, idx) => (
                <div key={idx} className="submitted-doc-chip">
                  <div className="doc-icon-frame">
                    <FileText size={18} />
                  </div>
                  <div className="doc-meta-details">
                    <span className="doc-title-text text-sm font-semibold">
                      {doc.name}
                    </span>
                    <span className="doc-file-sub text-xs text-muted">
                      {doc.type} &bull; {doc.size} &bull; Uploaded {doc.date}
                    </span>
                  </div>
                  <span className="doc-status-verified text-xs">
                    <Sparkles size={11} /> Attached
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
