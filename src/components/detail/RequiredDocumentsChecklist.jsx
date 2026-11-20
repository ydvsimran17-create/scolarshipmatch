import { useState, useEffect } from 'react'
import { FileCheck, CheckSquare, Square, Info, Sparkles } from 'lucide-react'
import { standardRequiredDocuments } from '../../data/scholarshipsDiscoveryData'
import './RequiredDocumentsChecklist.css'

export default function RequiredDocumentsChecklist({ scholarshipId }) {
  // Persist checked status in localStorage per scholarship
  const storageKey = `scholarship_docs_${scholarshipId}`

  const [checkedDocs, setCheckedDocs] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved
        ? JSON.parse(saved)
        : ['aadhaar', 'marksheet', 'bonafide'] // default 3 prepared for demo
    } catch {
      return ['aadhaar', 'marksheet', 'bonafide']
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checkedDocs))
    } catch {
      // fallback
    }
  }, [checkedDocs, storageKey])

  const toggleDoc = (id) => {
    setCheckedDocs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const markAll = () => {
    setCheckedDocs(standardRequiredDocuments.map((d) => d.id))
  }

  const clearAll = () => {
    setCheckedDocs([])
  }

  const completedCount = checkedDocs.length
  const totalCount = standardRequiredDocuments.length
  const percentComplete = Math.round((completedCount / totalCount) * 100)

  return (
    <section className="documents-checklist-card card" aria-labelledby="documents-heading">
      <div className="detail-card-header-bar">
        <FileCheck size={20} className="detail-section-icon" />
        <h2 id="documents-heading" className="detail-section-title">
          Required Document Checklist
        </h2>
        <div className="checklist-counter-badge badge badge-brass">
          {completedCount} of {totalCount} Ready ({percentComplete}%)
        </div>
      </div>

      <div className="checklist-subtext-row">
        <p className="text-sm text-secondary">
          Mark documents you have scanned and prepared. These items are illustrative verification requirements for your application dossier.
        </p>

        <div className="checklist-batch-actions">
          <button type="button" className="text-xs batch-action-btn" onClick={markAll}>
            Select All
          </button>
          <span className="dot-sep">&bull;</span>
          <button type="button" className="text-xs batch-action-btn" onClick={clearAll}>
            Reset
          </button>
        </div>
      </div>

      {/* Progress Track */}
      <div className="checklist-progress-bar">
        <div
          className="checklist-progress-fill"
          style={{ width: `${percentComplete}%` }}
        />
      </div>

      {/* Interactive Checkbox Items */}
      <div className="checklist-items-grid">
        {standardRequiredDocuments.map((doc) => {
          const isChecked = checkedDocs.includes(doc.id)
          return (
            <div
              key={doc.id}
              className={`checklist-item ${isChecked ? 'completed' : ''}`}
              onClick={() => toggleDoc(doc.id)}
              role="checkbox"
              aria-checked={isChecked}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault()
                  toggleDoc(doc.id)
                }
              }}
            >
              <div className="custom-checkbox">
                {isChecked ? (
                  <CheckSquare size={18} className="checkbox-icon checked" />
                ) : (
                  <Square size={18} className="checkbox-icon unchecked" />
                )}
              </div>

              <div className="checklist-item-content">
                <span className={`checklist-label ${isChecked ? 'checked' : ''}`}>
                  {doc.label}
                </span>
                <span className="checklist-status-hint text-xs">
                  {isChecked ? 'Ready & Verified in profile' : 'Pending upload'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Disclaimer */}
      <div className="checklist-disclaimer">
        <Info size={14} className="disclaimer-icon" />
        <span className="text-xs text-muted">
          <Sparkles size={11} className="inline-sparkle" /> Document requirements are sample educational guidelines. Ensure files are under 2MB in PDF/JPEG format during final submission.
        </span>
      </div>
    </section>
  )
}
