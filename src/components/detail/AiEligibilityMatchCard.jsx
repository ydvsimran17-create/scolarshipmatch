import { Sparkles, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import './AiEligibilityMatchCard.css'

export default function AiEligibilityMatchCard({ matchData }) {
  if (!matchData) return null

  return (
    <section
      className="ai-match-card card"
      aria-labelledby="ai-match-heading"
    >
      {/* Header */}
      <div className="ai-match-header">
        <div className="ai-match-title-group">
          <div className="ai-badge-crest">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 id="ai-match-heading" className="ai-match-title">
              AI Eligibility Assessment
            </h2>
            <span className="text-xs text-muted">
              Evaluated against Anvaya Sharma&rsquo;s student profile
            </span>
          </div>
        </div>

        <div className="ai-match-score-pill">
          <span className="score-number">{matchData.percentage}%</span>
          <span className="score-caption">Estimated Fit</span>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="ai-match-progress-track">
        <div
          className="ai-match-progress-fill"
          style={{ width: `${matchData.percentage}%` }}
          role="progressbar"
          aria-valuenow={matchData.percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Explanation Summary */}
      <div className="ai-match-summary-box">
        <p className="text-sm text-secondary">
          <strong>Profile Analysis:</strong> {matchData.summary}
        </p>
      </div>

      {/* Matched vs Pending Criteria Grid */}
      <div className="ai-criteria-split-grid">
        {/* Left: Matched Criteria */}
        <div className="criteria-column matched-column">
          <h3 className="criteria-column-heading">
            <CheckCircle2 size={16} className="matched-icon" />
            <span>Criteria You Meet ({matchData.matchedCriteria.length})</span>
          </h3>
          <ul className="criteria-check-list">
            {matchData.matchedCriteria.map((item, idx) => (
              <li key={idx} className="criteria-check-item">
                <span className="check-bullet" />
                <span className="text-sm text-primary">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Pending Verification */}
        <div className="criteria-column pending-column">
          <h3 className="criteria-column-heading">
            <AlertTriangle size={16} className="pending-icon" />
            <span>Verification Required ({matchData.pendingVerification.length})</span>
          </h3>
          <ul className="criteria-check-list">
            {matchData.pendingVerification.map((item, idx) => (
              <li key={idx} className="criteria-check-item pending-item">
                <span className="pending-bullet" />
                <span className="text-sm text-secondary">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="ai-match-disclaimer">
        <Info size={14} className="disclaimer-info-icon" />
        <span className="text-xs text-muted">
          <strong>Demo Assessment Note:</strong> The above match scoring is a simulated
          demonstration model for user interface preview. It does not constitute official approval
          or verified algorithmic eligibility.
        </span>
      </div>
    </section>
  )
}
