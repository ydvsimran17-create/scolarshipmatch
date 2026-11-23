import { useState, useEffect } from 'react'
import {
  PenTool,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FolderArchive,
} from 'lucide-react'
import {
  initialSavedDrafts,
  ESSAY_PROMPTS,
  generateMockDraft,
  improveDraftText,
  shortenDraftText,
  expandDraftText,
} from '../data/essayData'
import { initialStudentProfile } from '../data/profileData'
import essayService from '../services/essayService'
import EssayConfigPanel from '../components/essay/EssayConfigPanel'
import EssayEditor from '../components/essay/EssayEditor'
import EssaySupportingPanel from '../components/essay/EssaySupportingPanel'
import SavedDraftsModal from '../components/essay/SavedDraftsModal'
import './AiEssayAssistant.css'

export default function AiEssayAssistant() {
  const draftsStorageKey = 'scholarship_essay_drafts'
  const profileStorageKey = 'scholarship_student_profile'

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Read student profile for context
  const [studentProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(profileStorageKey)
      return saved ? JSON.parse(saved) : initialStudentProfile
    } catch {
      return initialStudentProfile
    }
  })

  // Read saved drafts from localStorage
  const [savedDrafts, setSavedDrafts] = useState(() => {
    try {
      const saved = localStorage.getItem(draftsStorageKey)
      return saved ? JSON.parse(saved) : initialSavedDrafts
    } catch {
      return initialSavedDrafts
    }
  })

  // Synchronize drafts with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(draftsStorageKey, JSON.stringify(savedDrafts))
    } catch {
      // storage fallback
    }
  }, [savedDrafts])

  // Configuration state
  const [essayType, setEssayType] = useState('Statement of Purpose')
  const [scholarshipName, setScholarshipName] = useState('Adobe Women in Technology Scholarship')
  const [topic, setTopic] = useState(ESSAY_PROMPTS['Statement of Purpose'])
  const [wordLimit, setWordLimit] = useState(500)
  const [tone, setTone] = useState('Professional')
  const [useProfileContext, setUseProfileContext] = useState(true)

  // Editor content state (pre-filled with initial sample or empty)
  const [content, setContent] = useState(() => {
    return initialSavedDrafts[0]?.content || ''
  })

  // Interaction feedback states
  const [isGenerating, setIsGenerating] = useState(false)
  const [feedbackToast, setFeedbackToast] = useState('')
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false)

  const showToast = (message) => {
    setFeedbackToast(message)
    const timer = setTimeout(() => {
      setFeedbackToast('')
    }, 3500)
    return () => clearTimeout(timer)
  }

  // 1. Generate Draft (Simulated AI generation)
    const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const result = await essayService.generateEssayDraft({
        essayType,
        scholarshipName,
        topic,
        tone,
        wordLimit,
        useProfileContext,
        studentProfile,
      })
      setContent(result.draft)
      showToast('Generated fresh scholarship essay draft! Personalize with your milestones.')
    } catch (err) {
      showToast(err?.data?.error || err?.message || 'Could not generate the draft.')
    } finally {
      setIsGenerating(false)
    }
  }

  // 2. Regenerate
  const handleRegenerate = () => {
    handleGenerate()
  }

  // 3. Improve Writing
  const handleImprove = () => {
    if (!content) return
    const improved = improveDraftText(content)
    setContent(improved)
    showToast('Vocabulary and formal phrasing refined.')
  }

  // 4. Shorten
  const handleShorten = () => {
    if (!content) return
    const shortened = shortenDraftText(content)
    setContent(shortened)
    showToast('Draft condensed to key thematic paragraphs.')
  }

  // 5. Expand
  const handleExpand = () => {
    if (!content) return
    const expanded = expandDraftText(content)
    setContent(expanded)
    showToast('Expanded with additional research and community impact depth.')
  }

  // 6. Save Draft
  const handleSaveDraft = () => {
    if (!content.trim()) return

    const newDraft = {
      id: `draft-${Date.now()}`,
      title: `${essayType} - ${scholarshipName.split('(')[0].trim()}`,
      essayType,
      scholarshipName,
      wordLimit,
      tone,
      useProfileContext,
      lastUpdated: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      lastUpdatedIso: new Date().toISOString().split('T')[0],
      content,
    }

    setSavedDrafts((prev) => [newDraft, ...prev])
    showToast(`Draft "${newDraft.title}" saved to your drafts archive!`)
  }

  // 7. Delete Draft
  const handleDeleteDraft = (id) => {
    setSavedDrafts((prev) => prev.filter((d) => d.id !== id))
    showToast('Draft removed from archive.')
  }

  // 8. Load Draft into Editor
  const handleLoadDraft = (draft) => {
    setContent(draft.content || '')
    if (draft.essayType) setEssayType(draft.essayType)
    if (draft.scholarshipName) setScholarshipName(draft.scholarshipName)
    if (draft.wordLimit) setWordLimit(draft.wordLimit)
    if (draft.tone) setTone(draft.tone)
    showToast(`Loaded draft "${draft.title}" into workspace.`)
  }

  return (
    <div className="ai-essay-assistant-page">
      {/* 1. Page Header */}
      <header className="essay-page-header card">
        <div className="header-info-cluster">
          <div className="header-badges-row">
            <span className="badge badge-indigo">
              <PenTool size={13} /> AI Essay Assistant
            </span>
            <span className="badge badge-currant">
              <ShieldAlert size={12} /> Demo Mode
            </span>
            <span className="badge badge-brass">
              <Sparkles size={12} /> Structured Writing Companion
            </span>
          </div>

          <h1 className="essay-page-heading">AI Essay Assistant</h1>

          <p className="essay-page-subtitle text-secondary">
            Create personalized scholarship essay drafts based on your goals and academic journey, align your narrative with committee prompts, and polish drafts for submission.
          </p>
        </div>

        <div className="header-actions-cluster">
          <button
            type="button"
            className="btn btn-outline btn-sm open-drafts-top-btn"
            onClick={() => setIsDraftsModalOpen(true)}
          >
            <FolderArchive size={14} />
            <span>Saved Drafts ({savedDrafts.length})</span>
          </button>
        </div>
      </header>

      {/* Floating / Top Toast Alert */}
      {feedbackToast && (
        <div className="essay-toast-banner" role="status">
          <CheckCircle2 size={16} className="toast-icon" />
          <span className="text-sm font-semibold">{feedbackToast}</span>
        </div>
      )}

      {/* 2. Main 2-Column Responsive Workspace */}
      <div className="essay-layout-grid">
        {/* Left Column: Configuration + Editor */}
        <div className="essay-primary-column">
          {/* A. Essay Configuration Form */}
          <EssayConfigPanel
            essayType={essayType}
            onEssayTypeChange={setEssayType}
            scholarshipName={scholarshipName}
            onScholarshipChange={setScholarshipName}
            topic={topic}
            onTopicChange={setTopic}
            wordLimit={wordLimit}
            onWordLimitChange={setWordLimit}
            tone={tone}
            onToneChange={setTone}
            useProfileContext={useProfileContext}
            onToggleProfileContext={setUseProfileContext}
            studentProfile={studentProfile}
          />

          {/* B. Writing Workspace Editor */}
          <EssayEditor
            content={content}
            onContentChange={setContent}
            wordLimit={wordLimit}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            onRegenerate={handleRegenerate}
            onImprove={handleImprove}
            onShorten={handleShorten}
            onExpand={handleExpand}
            onSaveDraft={handleSaveDraft}
            onOpenSavedDrafts={() => setIsDraftsModalOpen(true)}
            savedDraftsCount={savedDrafts.length}
          />

          {/* Ethics & Personalization Reminder */}
          <div className="essay-ethics-disclaimer card">
            <AlertCircle size={18} className="ethics-icon" />
            <div className="ethics-text-wrap">
              <strong className="text-xs text-midnight">Important Personalization Guideline:</strong>
              <p className="text-xs text-muted" style={{ margin: 0 }}>
                Generated frameworks provide structural suggestions. Ensure you review and personalize each paragraph with your authentic college experiences, individual accomplishments, and genuine financial context before submitting to university or government scholarship portals.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Supporting Side Panel */}
        <div className="essay-sidebar-column">
          <EssaySupportingPanel />
        </div>
      </div>

      {/* Saved Drafts Modal */}
      <SavedDraftsModal
        isOpen={isDraftsModalOpen}
        onClose={() => setIsDraftsModalOpen(false)}
        drafts={savedDrafts}
        onLoadDraft={handleLoadDraft}
        onDeleteDraft={handleDeleteDraft}
      />
    </div>
  )
}
