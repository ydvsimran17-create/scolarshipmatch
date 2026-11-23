import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { calculateProfileCompletion } from '../../data/profileData'
import studentService from '../../services/studentService'
import welcomeIllustration from '../../assets/ai-scholarship-assistant.png'
import './WelcomeBanner.css'

export default function WelcomeBanner() {
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('Student')
  const [completion, setCompletion] = useState(0)

  // Real name and profile strength come from the saved backend profile
  useEffect(() => {
    let cancelled = false
    studentService
      .getProfile()
      .then((p) => {
        if (cancelled || !p) return
        const first = (p.fullName || '').trim().split(' ')[0]
        if (first) setDisplayName(first)
        const pct = calculateProfileCompletion(p)
        if (typeof pct === 'number' && !isNaN(pct)) setCompletion(pct)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

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

        <h1 className="welcome-heading">Welcome back, {displayName}!</h1>

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
            Profile Strength: {completion}%
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