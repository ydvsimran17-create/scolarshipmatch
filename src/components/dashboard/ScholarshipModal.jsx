import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X,
  AlertCircle,
  Calendar,
  IndianRupee,
  Building2,
  CheckCircle,
  FileText,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

export default function ScholarshipModal({ scholarship, onClose }) {
  const navigate = useNavigate()
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!scholarship) return null

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-container card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="modal-badges-row">
              <span className="badge badge-brass">
                <Sparkles size={12} /> {scholarship.eligibilityMatch}% Match
              </span>
              <span className="badge badge-linen">{scholarship.category}</span>
              <span className="badge badge-currant">Demo / Sample Data</span>
            </div>
            <h2 id="modal-title" className="modal-title">
              {scholarship.name}
            </h2>
            <p className="modal-provider">
              <Building2 size={16} /> {scholarship.provider}
            </p>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close scholarship details modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Disclaimer Warning */}
        <div className="sample-data-alert">
          <AlertCircle size={18} className="sample-alert-icon" />
          <p className="text-xs">
            <strong>Sample Demonstration Data:</strong> Deadlines, award amounts, and criteria
            shown below are illustrative models for the Scholarship Match platform. Always
            verify official portals for real applications.
          </p>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Key Metrics */}
          <div className="modal-metrics-grid">
            <div className="modal-metric-card">
              <span className="metric-label">Award Value</span>
              <div className="metric-value-row">
                <IndianRupee size={16} />
                <span className="metric-val">{scholarship.amount}</span>
              </div>
            </div>

            <div className="modal-metric-card">
              <span className="metric-label">Application Deadline</span>
              <div className="metric-value-row">
                <Calendar size={16} />
                <span className="metric-val">{scholarship.deadline}</span>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="modal-section">
            <h4 className="modal-section-title">Overview</h4>
            <p className="text-sm text-secondary">
              {scholarship.details?.overview || scholarship.shortDescription}
            </p>
          </div>

          {/* Eligibility Criteria */}
          {scholarship.details?.eligibility && (
            <div className="modal-section">
              <h4 className="modal-section-title">Eligibility Criteria</h4>
              <ul className="modal-list">
                {scholarship.details.eligibility.map((point, index) => (
                  <li key={index} className="modal-list-item">
                    <CheckCircle size={16} className="modal-check-icon" />
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Documents Required */}
          {scholarship.details?.documentsRequired && (
            <div className="modal-section">
              <h4 className="modal-section-title">Required Documents</h4>
              <ul className="modal-list">
                {scholarship.details.documentsRequired.map((doc, index) => (
                  <li key={index} className="modal-list-item">
                    <FileText size={16} className="modal-doc-icon" />
                    <span className="text-sm">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              alert(`Saved "${scholarship.name}" to your demo applications list!`)
              onClose()
            }}
          >
            Save to Applications
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onClose()
              navigate(`/find-scholarships/${scholarship.id}`)
            }}
          >
            Full Details &amp; Checklist <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
