import { useState, useEffect } from 'react'
import {
  CheckSquare,
  Square,
  Sparkles,
  Info,
  ListChecks,
} from 'lucide-react'
import { standardDocumentChecklist } from '../../data/documentsData'
import './DocumentChecklistCard.css'

export default function DocumentChecklistCard() {
  const storageKey = 'scholarship_documents_checklist'

  const [checkedIds, setCheckedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved
        ? JSON.parse(saved)
        : standardDocumentChecklist.filter((c) => c.defaultChecked).map((c) => c.id)
    } catch {
      return standardDocumentChecklist.filter((c) => c.defaultChecked).map((c) => c.id)
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checkedIds))
    } catch {
      // storage fallback
    }
  }, [checkedIds])

  const toggleCheck = (id) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const markAll = () => {
    setCheckedIds(standardDocumentChecklist.map((c) => c.id))
  }

  const resetAll = () => {
    setCheckedIds([])
  }

  const completedCount = checkedIds.length
  const totalCount = standardDocumentChecklist.length
  const percentage = Math.round((completedCount / totalCount) * 100)

  return (
    <section className="document-checklist-card card" aria-labelledby="doc-checklist-heading">
      <div className="checklist-header-bar">
        <div className="checklist-title-group">
          <ListChecks size={20} className="checklist-crest-icon" />
          <div>
            <h3 id="doc-checklist-heading" className="checklist-heading">
              Standard Scholarship Documents Checklist
            </h3>
            <span className="text-xs text-muted">
              Pre-flight readiness checklist for State &amp; Central portals
            </span>
          </div>
        </div>

        <div className="checklist-badge-counter badge badge-brass">
          <Sparkles size={12} /> {completedCount} of {totalCount} Ready ({percentage}%)
        </div>
      </div>

      {/* Progress Track */}
      <div className="checklist-progress-track">
        <div
          className="checklist-progress-fill"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Quick Controls */}
      <div className="checklist-controls-row">
        <p className="text-xs text-secondary">
          Check off items as you obtain verified physical or digital copies from your college and district authorities.
        </p>

        <div className="checklist-batch-buttons">
          <button type="button" className="batch-btn text-xs" onClick={markAll}>
            Select All
          </button>
          <span className="dot-sep">&bull;</span>
          <button type="button" className="batch-btn text-xs" onClick={resetAll}>
            Reset
          </button>
        </div>
      </div>

      {/* Checklist Items Grid */}
      <div className="checklist-items-grid">
        {standardDocumentChecklist.map((item) => {
          const isChecked = checkedIds.includes(item.id)

          return (
            <div
              key={item.id}
              className={`doc-check-item ${isChecked ? 'item-checked' : ''}`}
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
              <div className="check-box-icon">
                {isChecked ? (
                  <CheckSquare size={18} className="box-icon checked" />
                ) : (
                  <Square size={18} className="box-icon unchecked" />
                )}
              </div>

              <div className="check-text-column">
                <span className={`check-item-label text-sm ${isChecked ? 'label-checked' : ''}`}>
                  {item.label}
                </span>
                <span className="check-item-desc text-xs text-muted">
                  {item.description}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mandatory Disclaimer */}
      <div className="checklist-advisory-box">
        <Info size={15} className="advisory-icon" />
        <span className="text-xs text-muted">
          <strong>Institutional Note:</strong> Actual document specifications (attestation, file format, and income ceilings) vary across scholarship schemes. Verify specific requirements on each scholarship&rsquo;s details page.
        </span>
      </div>
    </section>
  )
}
