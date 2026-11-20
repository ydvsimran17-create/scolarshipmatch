import { useState, useEffect } from 'react'
import {
  X,
  Send,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  Building2,
  Sparkles,
} from 'lucide-react'
import './ApplyDemoModal.css'

export default function ApplyDemoModal({
  scholarship,
  isOpen,
  onClose,
  onApplicationComplete,
}) {
  const [agreed, setAgreed] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [refNumber, setRefNumber] = useState('')

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !scholarship) return null

  // Read saved document checklist count on each render when modal is active
  let docsReadyCount = 3
  try {
    const saved = localStorage.getItem(`scholarship_docs_${scholarship.id}`)
    if (saved) {
      const parsed = JSON.parse(saved)
      docsReadyCount = parsed.length
    }
  } catch {
    // fallback to default 3
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!agreed) return

    const randomRef = `SCH-2026-AS-${Math.floor(1000 + Math.random() * 9000)}`
    setRefNumber(randomRef)
    setSubmitted(true)
    if (onApplicationComplete) {
      onApplicationComplete()
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="modal-backdrop-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-apply-title"
    >
      <div className="modal-dialog-box card">
        {/* Modal Header */}
        <div className="modal-header-bar">
          <div className="modal-title-wrap">
            <Send size={18} className="modal-title-icon" />
            <h2 id="demo-apply-title" className="modal-title">
              {submitted ? 'Application Submitted (Demo Mode)' : 'Demo Application Submission'}
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="modal-form-body">
            {/* Applicant Summary Banner */}
            <div className="applicant-summary-strip">
              <div className="applicant-avatar">AS</div>
              <div className="applicant-details">
                <span className="applicant-name">Anvaya Sharma</span>
                <span className="applicant-meta text-xs text-muted">
                  B.Tech (CSE) &bull; 2nd Year &bull; Roll No: 2024-CS-0412
                </span>
              </div>
              <div className="applicant-match-pill badge badge-brass">
                <Sparkles size={12} /> {scholarship.eligibilityMatch}% Fit
              </div>
            </div>

            {/* Target Scheme Box */}
            <div className="target-scholarship-summary">
              <h3 className="target-scheme-title">{scholarship.name}</h3>
              <p className="target-scheme-provider text-xs text-secondary">
                <Building2 size={13} className="inline-icon" /> {scholarship.provider}
              </p>
              <div className="target-scheme-badges">
                <span className="badge badge-linen text-xs">
                  Award: {scholarship.amount}
                </span>
                <span className="badge badge-indigo text-xs">
                  Deadline: {scholarship.deadline}
                </span>
              </div>
            </div>

            {/* Document Checklist Readiness Summary */}
            <div className="readiness-check-box">
              <div className="readiness-header">
                <FileCheck size={16} className="readiness-icon" />
                <span className="readiness-title text-sm font-semibold">
                  Document Readiness Status:
                </span>
                <span className="readiness-count badge badge-brass">
                  {docsReadyCount} of 6 Documents Prepared
                </span>
              </div>
              <p className="readiness-subtext text-xs text-secondary">
                {docsReadyCount >= 4
                  ? 'Your document checklist is well-prepared for official review.'
                  : 'You can update your checklist anytime on the details page prior to final submission.'}
              </p>
            </div>

            {/* Demo Notice */}
            <div className="modal-demo-notice">
              <AlertCircle size={15} className="notice-icon" />
              <p className="text-xs text-muted">
                <strong>Project Demonstration Notice:</strong> Submitting this form creates a simulated demo application entry in your student session. No live transaction or external government filing is executed.
              </p>
            </div>

            {/* Declarations Checkbox */}
            <label className="modal-agree-checkbox">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span className="text-xs text-primary">
                I confirm that student particulars for Anvaya Sharma are reviewed and ready for illustrative submission.
              </span>
            </label>

            {/* Modal Actions */}
            <div className="modal-buttons-row">
              <button
                type="button"
                className="btn btn-outline"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!agreed}
              >
                <Send size={15} /> Confirm &amp; Submit Application
              </button>
            </div>
          </form>
        ) : (
          <div className="modal-success-body">
            <div className="success-crest">
              <CheckCircle2 size={44} className="success-icon" />
            </div>

            <h3 className="success-heading">Application Successfully Logged!</h3>
            <p className="text-secondary text-sm success-desc">
              Your demo application for <strong>{scholarship.name}</strong> has been registered in the student mock ledger.
            </p>

            <div className="application-receipt-box">
              <div className="receipt-row">
                <span className="receipt-label text-xs text-muted">Reference ID:</span>
                <strong className="receipt-val font-mono">{refNumber}</strong>
              </div>
              <div className="receipt-row">
                <span className="receipt-label text-xs text-muted">Applicant:</span>
                <span className="receipt-val text-xs">Anvaya Sharma (AS)</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label text-xs text-muted">Award Scheme:</span>
                <span className="receipt-val text-xs">{scholarship.name}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label text-xs text-muted">Submission Date:</span>
                <span className="receipt-val text-xs">
                  {new Date().toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label text-xs text-muted">Next Review:</span>
                <span className="receipt-val text-xs">Institutional Verification</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={onClose}
            >
              Done &amp; Return to Details
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
