import { useState, useEffect } from 'react'
import { Sparkles, Building2, Sliders, UserCheck, BookOpen } from 'lucide-react'
import {
  ESSAY_TYPES,
  WRITING_TONES,
  WORD_LIMITS,
  ESSAY_PROMPTS,
} from '../../data/essayData'
import scholarshipService from '../../services/scholarshipService'
import './EssayConfigPanel.css'

export default function EssayConfigPanel({
  essayType,
  onEssayTypeChange,
  scholarshipName,
  onScholarshipChange,
  topic,
  onTopicChange,
  wordLimit,
  onWordLimitChange,
  tone,
  onToneChange,
  useProfileContext,
  onToggleProfileContext,
  studentProfile,
}) {
  // Scholarships for the dropdown come from the backend
  const [scholarships, setScholarships] = useState([])

  useEffect(() => {
    scholarshipService
      .getScholarships()
      .then((data) => setScholarships(data))
      .catch(() => {})
  }, [])

  const handleTypeSelect = (type) => {
    onEssayTypeChange(type)
    // If topic is empty or matches previous default prompt, pre-fill with appropriate prompt
    if (!topic || Object.values(ESSAY_PROMPTS).includes(topic)) {
      onTopicChange(ESSAY_PROMPTS[type] || '')
    }
  }

  return (
    <div className="essay-config-card card" aria-label="Essay generator configuration">
      <div className="config-header-row">
        <div className="config-title-group">
          <Sliders size={18} className="config-crest-icon" />
          <h2 className="config-title-text">1. Essay Configuration</h2>
        </div>
        <span className="badge badge-linen text-xs">
          Interactive Prompt Builder
        </span>
      </div>

      <div className="config-fields-flow">
        {/* Essay Type Selection */}
        <div className="config-field-group">
          <label htmlFor="essay-type-select" className="config-label text-xs">
            Essay Type
          </label>
          <select
            id="essay-type-select"
            className="config-select"
            value={essayType}
            onChange={(e) => handleTypeSelect(e.target.value)}
          >
            {ESSAY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Target Scholarship Selection */}
        <div className="config-field-group">
          <label htmlFor="scholarship-select" className="config-label text-xs">
            <Building2 size={12} className="inline-icon" /> Target Scholarship Scheme
          </label>
          <select
            id="scholarship-select"
            className="config-select"
            value={scholarshipName}
            onChange={(e) => onScholarshipChange(e.target.value)}
          >
            <option value="General Academic Scholarship">General Academic Scholarship</option>
            {scholarships.map((sch) => (
              <option key={sch.id} value={sch.name}>
                {sch.name} ({sch.provider})
              </option>
            ))}
          </select>
        </div>

        {/* Prompt / Topic Question */}
        <div className="config-field-group">
          <div className="prompt-label-row">
            <label htmlFor="essay-topic-input" className="config-label text-xs">
              <BookOpen size={12} className="inline-icon" /> Essay Topic / Committee Prompt
            </label>
            <button
              type="button"
              className="use-default-prompt-btn text-xs text-muted"
              onClick={() => onTopicChange(ESSAY_PROMPTS[essayType] || '')}
              title="Reset prompt to standard question"
            >
              Reset to Prompt
            </button>
          </div>
          <textarea
            id="essay-topic-input"
            rows={3}
            className="config-textarea"
            placeholder="Enter the specific prompt or question requested by the scholarship provider..."
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
          />
        </div>

        {/* Two Columns: Word Limit & Writing Tone */}
        <div className="config-split-row">
          {/* Word Limit */}
          <div className="config-field-group flex-1">
            <label htmlFor="word-limit-select" className="config-label text-xs">
              Target Word Limit
            </label>
            <select
              id="word-limit-select"
              className="config-select"
              value={wordLimit}
              onChange={(e) => onWordLimitChange(Number(e.target.value))}
            >
              {WORD_LIMITS.map((limit) => (
                <option key={limit.value} value={limit.value}>
                  {limit.label}
                </option>
              ))}
            </select>
          </div>

          {/* Writing Tone */}
          <div className="config-field-group flex-1">
            <label htmlFor="tone-select" className="config-label text-xs">
              Writing Tone
            </label>
            <select
              id="tone-select"
              className="config-select"
              value={tone}
              onChange={(e) => onToneChange(e.target.value)}
            >
              {WRITING_TONES.map((t) => (
                <option key={t} value={t}>
                  {t} Tone
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Profile Context Toggle */}
        <div className="profile-context-box">
          <label className="context-checkbox-label">
            <input
              type="checkbox"
              checked={useProfileContext}
              onChange={(e) => onToggleProfileContext(e.target.checked)}
              className="context-checkbox-input"
            />
            <div className="context-checkbox-text">
              <span className="context-title text-xs font-semibold">
                <UserCheck size={14} className="inline-icon profile-icon" /> Use Student Profile Information as Context
              </span>
              <p className="context-desc text-xs text-secondary">
                Tailors draft with <strong>{studentProfile?.fullName || 'Anvaya Sharma'}</strong> &bull; {studentProfile?.course || 'Computer Science & Engineering'} &bull; {studentProfile?.institution || 'DTU'}.
              </p>
            </div>
          </label>
          {useProfileContext && (
            <span className="badge badge-brass text-xs context-active-badge">
              <Sparkles size={11} /> Profile Linked
            </span>
          )}
        </div>
      </div>
    </div>
  )
}