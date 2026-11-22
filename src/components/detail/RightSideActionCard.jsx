import { Link } from 'react-router-dom'
import {
  IndianRupee,
  Sparkles,
  Building2,
  Bookmark,
  Send,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  Share2,
  Check,
} from 'lucide-react'
import { useState } from 'react'
import './RightSideActionCard.css'

export default function RightSideActionCard({
  scholarship,
  isBookmarked,
  onToggleBookmark,
  onOpenApplyModal,
  hasApplied,
}) {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // ignore
    }
  }

  return (
    <aside className="right-action-panel" aria-label="Scholarship Quick Action Panel">
      <div className="sticky-action-card card">
        {/* Top Summary Banner */}
        <div className="action-card-amount-header">
          <span className="action-amount-caption text-xs">Estimated Award Value</span>
          <div className="action-amount-row">
            <IndianRupee size={22} className="action-rupee-icon" />
            <span className="action-amount-number">{scholarship.amount}</span>
          </div>
          <div className="action-pill-row">
            <span className="badge badge-brass">
              <Sparkles size={12} /> {scholarship.eligibilityMatch}% Profile Match
            </span>
            <span className="badge badge-currant text-xs">
              Deadline: {scholarship.deadline}
            </span>
          </div>
        </div>

        {/* Action Buttons Group */}
        <div className="action-buttons-container">
          <button
            type="button"
            className={`btn ${hasApplied ? 'btn-applied' : 'btn-primary'} action-main-btn`}
            onClick={onOpenApplyModal}
          >
            {hasApplied ? (
              <>
                <CheckCircle size={16} /> Application Submitted (Demo)
              </>
            ) : (
              <>
                <Send size={16} /> Apply Now (Demo Mode)
              </>
            )}
          </button>

          <button
            type="button"
            className={`btn btn-outline action-secondary-btn ${isBookmarked ? 'is-saved' : ''}`}
            onClick={onToggleBookmark}
          >
            <Bookmark
              size={16}
              className={`bookmark-icon ${isBookmarked ? 'filled' : ''}`}
            />
            <span>{isBookmarked ? 'Saved to Bookmarks' : 'Save Scholarship'}</span>
          </button>
        </div>

        {/* Quick Parameters Table */}
        <div className="action-meta-list">
          <div className="action-meta-item">
            <span className="meta-key text-xs text-muted">Awarding Body:</span>
            <span className="meta-val text-xs font-semibold">
              <Building2 size={12} className="inline-icon" /> {scholarship.provider}
            </span>
          </div>
          <div className="action-meta-item">
            <span className="meta-key text-xs text-muted">Income Limit:</span>
            <span className="meta-val text-xs font-semibold">{scholarship.incomeLimit}</span>
          </div>
          <div className="action-meta-item">
            <span className="meta-key text-xs text-muted">Level:</span>
            <span className="meta-val text-xs font-semibold">
              {scholarship.educationLevel.join(', ')}
            </span>
          </div>
          <div className="action-meta-item">
            <span className="meta-key text-xs text-muted">Jurisdiction:</span>
            <span className="meta-val text-xs font-semibold">{scholarship.state}</span>
          </div>
          <div className="action-meta-item">
            <span className="meta-key text-xs text-muted">Categories:</span>
            <span className="meta-val text-xs font-semibold">
              {scholarship.eligibleCategories.join(', ')}
            </span>
          </div>
        </div>

        <hr className="action-card-divider" />

        {/* Essay Assistant Callout */}
        <div className="essay-assistant-callout">
          <div className="essay-callout-header">
            <HelpCircle size={16} className="callout-icon" />
            <h4 className="callout-title">Need Help with Statements?</h4>
          </div>
          <p className="callout-desc text-xs text-secondary">
            Draft statements of purpose and scholarship essays with AI guidance.
          </p>
          <Link to="/essay-assistant" className="callout-link text-xs">
            Open Essay Assistant &rarr;
          </Link>
        </div>

        {/* Secondary Utility Links */}
        <div className="action-footer-links">
          <button
            type="button"
            className="share-link-btn text-xs text-muted"
            onClick={handleShare}
          >
            {copied ? (
              <>
                <Check size={12} className="share-icon" /> Link Copied to Clipboard
              </>
            ) : (
              <>
                <Share2 size={12} className="share-icon" /> Share Opportunity
              </>
            )}
          </button>

          <Link to="/find-scholarships" className="return-link text-xs">
            <ArrowLeft size={12} /> Back to Search List
          </Link>
        </div>
      </div>
    </aside>
  )
}
