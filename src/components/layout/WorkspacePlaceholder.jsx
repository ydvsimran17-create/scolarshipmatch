import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowLeft, Construction } from 'lucide-react'
import './WorkspacePlaceholder.css'

export default function WorkspacePlaceholder({ currentSection = 'Module' }) {
  const navigate = useNavigate()

  return (
    <div className="workspace-hero-wrapper">
      <div className="workspace-badge-row">
        <span className="badge badge-brass">
          <Sparkles size={14} /> Academic Module
        </span>
        <span className="badge badge-indigo">
          Section: {currentSection}
        </span>
      </div>

      <div className="workspace-welcome-card card">
        <div className="workspace-welcome-header">
          <div className="placeholder-icon-badge">
            <Construction size={28} />
          </div>
          <div>
            <h1 className="workspace-main-title">{currentSection}</h1>
            <p className="workspace-main-subtitle">
              This module is scheduled for upcoming implementation. The complete student dashboard
              with scholarship recommendations, deadlines, and metrics is available now.
            </p>
          </div>
        </div>

        <hr className="divider" />

        <div className="workspace-welcome-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={16} /> Return to Dashboard
          </button>
          <span className="badge badge-linen text-xs">
            Scholarship Match v1.0
          </span>
        </div>
      </div>
    </div>
  )
}
