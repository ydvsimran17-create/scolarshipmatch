import { Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react'
import './ProfileCompletionCard.css'

export default function ProfileCompletionCard({
  profile,
  completionPercentage,
}) {
  return (
    <aside className="profile-completion-card card" aria-label="Profile completion status">
      {/* Student Badge Row */}
      <div className="profile-student-header">
        <div className="student-crest-avatar" aria-hidden="true">
          <span>AS</span>
        </div>
        <div className="student-crest-meta">
          <div className="student-name-title">
            <h3 className="student-full-name">{profile.fullName || 'Anvaya Sharma'}</h3>
            <span className="verified-identity-pill badge badge-brass text-xs">
              <ShieldCheck size={12} /> Student Verified
            </span>
          </div>
          <p className="student-academic-sub text-xs text-muted">
            {profile.course || 'Computer Science & Engineering'} &bull; {profile.institution || 'Delhi Technological University'}
          </p>
        </div>
      </div>

      <hr className="completion-divider" />

      {/* Completion Meter */}
      <div className="completion-meter-block">
        <div className="completion-meter-labels">
          <span className="completion-label-text text-sm font-semibold">
            Profile Strength &amp; Eligibility Match
          </span>
          <span className="completion-pct-value font-bold text-sm">
            {completionPercentage}% Complete
          </span>
        </div>

        <div className="completion-progress-track">
          <div
            className="completion-progress-fill"
            style={{ width: `${completionPercentage}%` }}
            role="progressbar"
            aria-valuenow={completionPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Advisory Tips */}
      <div className="completion-advisory-box">
        <div className="advisory-title-line">
          <Sparkles size={14} className="advisory-icon" />
          <span className="text-xs font-semibold text-midnight">AI Discovery Boost</span>
        </div>
        <p className="advisory-desc text-xs text-secondary">
          {completionPercentage >= 90
            ? 'Excellent! Your comprehensive profile unlocks 95%+ accurate match recommendations across state and central portals.'
            : 'Complete remaining fields to increase scholarship discovery accuracy and pre-fill applications automatically.'}
        </p>
      </div>

      {/* Check Highlights */}
      <div className="profile-highlights-list">
        <div className="highlight-row text-xs">
          <CheckCircle2 size={13} className="check-icon" />
          <span>Aadhaar e-KYC linked to state domicile</span>
        </div>
        <div className="highlight-row text-xs">
          <CheckCircle2 size={13} className="check-icon" />
          <span>Academic merit transcripts verified</span>
        </div>
        <div className="highlight-row text-xs">
          <CheckCircle2 size={13} className="check-icon" />
          <span>Family income slab under ₹4.5 Lakhs ceiling</span>
        </div>
      </div>
    </aside>
  )
}
