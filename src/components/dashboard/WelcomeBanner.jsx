import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { calculateProfileCompletion } from '../../data/profileData'
import welcomeIllustration from '../../assets/ai-scholarship-assistant.png'
import './WelcomeBanner.css'

export default function WelcomeBanner({ studentName = 'Anvaya' }) {
  const navigate = useNavigate()

  const [profileData] = useState(() => {
    try {
      const saved = localStorage.getItem('scholarship_student_profile')
      if (saved) {
        const parsed = JSON.parse(saved)
        const pct = calculateProfileCompletion(parsed)
        const first =
          parsed.fullName && typeof parsed.fullName === 'string' && parsed.fullName.trim()
            ? parsed.fullName.trim().split(' ')[0]
            : studentName
        return {
          completion: typeof pct === 'number' && !isNaN(pct) ? pct : 80,
          displayName: first,
        }
      }
    } catch {
      // Retain fallback defaults
    }
    return {
      completion: 80,
      displayName: studentName,
    }
  })

  return (
    <section className="welcome-banner-card card" aria-label="Welcome Overview">
      <div className="welcome-banner-content">
        <div className="welcome-badge-pill">
          <span className="badge badge-brass">
            <Sparkles size={13} /> AI Scholarship Matcher
          </span>
          <span className="text-xs text-muted welcome-term-text">
            Academic Session 2026–2027
          </span>
        </div>

        <h1 className="welcome-heading">Welcome back, {profileData.displayName}!</h1>

        <p className="welcome-subtitle">
          Discover opportunities that bring your academic dreams closer.
        </p>

        <div className="welcome-actions-row">
          <button
            type="button"
            className="btn btn-primary welcome-explore-btn"
            onClick={() => navigate('/find-scholarships')}
          >
            Explore Scholarships <ArrowRight size={16} />
          </button>

          <button
            type="button"
            className="btn btn-outline welcome-profile-btn"
            onClick={() => navigate('/settings')}
            title="Update your student profile in Settings"
          >
            Profile Strength: {profileData.completion}%
          </button>
        </div>
      </div>

      {/* AI Scholarship Assistant Illustration */}
      <div className="welcome-banner-graphic">
        <img
          src={welcomeIllustration}
          alt="AI scholarship assistant with laptop and books"
          className="welcome-illustration-img"
        />
      </div>
    </section>
  )
}
