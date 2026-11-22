import { useNavigate } from 'react-router-dom'
import { PenTool, Sparkles, ArrowRight, Check } from 'lucide-react'
import './AiEssayAssistantCard.css'

export default function AiEssayAssistantCard() {
  const navigate = useNavigate()

  return (
    <article
      className="ai-essay-card card"
      aria-label="AI Essay Assistant Feature"
    >
      <div className="ai-essay-header">
        <div className="ai-icon-frame">
          <PenTool size={22} className="ai-pen-icon" />
          <Sparkles size={12} className="ai-sparkle-icon" />
        </div>
        <span className="badge badge-brass text-xs">AI Assistant</span>
      </div>

      <div className="ai-essay-content">
        <h3 className="ai-essay-title">AI Essay Assistant</h3>
        <p className="ai-essay-desc text-sm">
          Draft compelling, tailored scholarship statements of purpose and merit
          essays with instant feedback on tone and structure.
        </p>

        <ul className="ai-perks-list">
          <li className="ai-perk-item text-xs text-secondary">
            <Check size={13} className="perk-check" /> Tailored to scheme prompts
          </li>
          <li className="ai-perk-item text-xs text-secondary">
            <Check size={13} className="perk-check" /> Academic tone refinement
          </li>
        </ul>
      </div>

      <div className="ai-essay-footer">
        <button
          type="button"
          className="btn btn-primary ai-start-btn"
          onClick={() => navigate('/essay-assistant')}
        >
          Start Writing <ArrowRight size={15} />
        </button>
      </div>
    </article>
  )
}
