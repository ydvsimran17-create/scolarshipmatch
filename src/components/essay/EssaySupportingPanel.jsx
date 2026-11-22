import { useState } from 'react'
import {
  Lightbulb,
  Layers,
  CheckCircle,
  Square,
  CheckSquare,
  Sparkles,
} from 'lucide-react'
import {
  ESSAY_TIPS,
  ESSAY_STRUCTURE,
  WRITING_CHECKLIST,
} from '../../data/essayData'
import './EssaySupportingPanel.css'

export default function EssaySupportingPanel() {
  const [checkedItems, setCheckedItems] = useState(['chk-prompt', 'chk-voice'])

  const toggleCheck = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <aside className="essay-supporting-panel" aria-label="Essay Writing Guidance">
      {/* 1. Essay Writing Tips */}
      <div className="support-card card">
        <div className="support-card-header">
          <Lightbulb size={18} className="support-crest-icon" />
          <h3 className="support-heading">Essay Writing Tips</h3>
        </div>

        <div className="tips-list">
          {ESSAY_TIPS.map((tip, idx) => (
            <div key={idx} className="tip-item">
              <strong className="tip-title text-xs text-midnight">
                {idx + 1}. {tip.title}
              </strong>
              <p className="tip-desc text-xs text-secondary">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Suggested Essay Structure */}
      <div className="support-card card">
        <div className="support-card-header">
          <Layers size={18} className="support-crest-icon" />
          <h3 className="support-heading">Suggested Essay Structure</h3>
        </div>

        <div className="structure-timeline">
          {ESSAY_STRUCTURE.map((step, idx) => (
            <div key={idx} className="structure-node">
              <span className="node-stage-tag text-xs font-semibold text-midnight">
                {step.stage}
              </span>
              <p className="node-desc text-xs text-secondary">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Important Points to Include & Interactive Checklist */}
      <div className="support-card card">
        <div className="support-card-header">
          <CheckCircle size={18} className="support-crest-icon" />
          <div>
            <h3 className="support-heading">Writing Checklist</h3>
            <span className="text-xs text-muted">
              {checkedItems.length} of {WRITING_CHECKLIST.length} checkpoints verified
            </span>
          </div>
        </div>

        <div className="checklist-items-stack">
          {WRITING_CHECKLIST.map((item) => {
            const isChecked = checkedItems.includes(item.id)
            return (
              <div
                key={item.id}
                className={`checklist-row ${isChecked ? 'is-checked' : ''}`}
                onClick={() => toggleCheck(item.id)}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault()
                    toggleCheck(item.id)
                  }
                }}
              >
                <div className="checklist-box-icon">
                  {isChecked ? (
                    <CheckSquare size={16} className="checked-box" />
                  ) : (
                    <Square size={16} className="unchecked-box" />
                  )}
                </div>
                <span className="checklist-text text-xs">
                  {item.text}
                </span>
              </div>
            )
          })}
        </div>

        <div className="checklist-badge-note">
          <Sparkles size={12} className="inline-sparkle" />
          <span className="text-xs text-muted">
            Ensure you personalize bracketed placeholders like <code>[Project Title]</code> with your actual academic work.
          </span>
        </div>
      </div>
    </aside>
  )
}
