import { useState, useMemo } from 'react'
import {
  Sparkles,
  RotateCcw,
  Wand2,
  Minimize2,
  Maximize2,
  Save,
  Copy,
  Check,
  AlertCircle,
  FileEdit,
  FolderArchive,
} from 'lucide-react'
import './EssayEditor.css'

export default function EssayEditor({
  content,
  onContentChange,
  wordLimit,
  isGenerating,
  onGenerate,
  onRegenerate,
  onImprove,
  onShorten,
  onExpand,
  onSaveDraft,
  onOpenSavedDrafts,
  savedDraftsCount = 0,
}) {
  const [copied, setCopied] = useState(false)

  // Calculate live word count & character count
  const { wordCount, charCount } = useMemo(() => {
    if (!content || !content.trim()) return { wordCount: 0, charCount: 0 }
    const words = content.trim().split(/\s+/).filter(Boolean)
    return { wordCount: words.length, charCount: content.length }
  }, [content])

  const percentOfLimit = Math.min(100, Math.round((wordCount / wordLimit) * 100))
  const isOverLimit = wordCount > wordLimit

  const handleCopy = () => {
    if (!content) return
    try {
      navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // fallback
    }
  }

  return (
    <div className="essay-editor-card card" aria-label="Essay Writing Workspace">
      {/* Editor Top Toolbar */}
      <div className="editor-top-toolbar">
        <div className="editor-title-group">
          <FileEdit size={18} className="editor-crest-icon" />
          <h2 className="editor-title-text">2. Essay Workspace &amp; Editor</h2>
        </div>

        <div className="editor-top-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm saved-drafts-btn"
            onClick={onOpenSavedDrafts}
          >
            <FolderArchive size={14} />
            <span>Saved Drafts ({savedDraftsCount})</span>
          </button>

          <button
            type="button"
            className="btn btn-outline btn-sm copy-btn"
            onClick={handleCopy}
            disabled={!content}
            title="Copy essay text to clipboard"
          >
            {copied ? (
              <>
                <Check size={14} className="copied-icon" /> <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} /> <span>Copy Text</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Demo Mode Notice */}
      <div className="editor-demo-banner">
        <AlertCircle size={15} className="banner-alert-icon" />
        <span className="text-xs text-muted">
          <strong>Demo Mode:</strong> AI-powered essay generation will be available after backend integration. Review and personalize all generated drafts before using them.
        </span>
      </div>

      {/* Main Textarea Workspace */}
      <div className="editor-textarea-container">
        {isGenerating && (
          <div className="editor-generating-overlay">
            <div className="generating-pulse-crest">
              <Sparkles size={28} className="spinning-sparkle" />
            </div>
            <strong className="text-sm text-midnight">Generating Structured Academic Draft...</strong>
            <span className="text-xs text-muted">Synthesizing personal statement &bull; Tone: Active</span>
          </div>
        )}

        <textarea
          className={`essay-main-textarea ${isOverLimit ? 'over-limit' : ''}`}
          rows={15}
          placeholder="Write your scholarship essay draft here, or click 'Generate Draft' below to populate a personalized framework based on your profile..."
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          aria-label="Essay content editor"
        />
      </div>

      {/* Live Word Count & Limit Progress Strip */}
      <div className="editor-metrics-strip">
        <div className="metrics-counts-cluster text-xs">
          <span className="word-count-badge font-semibold">
            {wordCount} Words &bull; {charCount} Characters
          </span>
          <span className={`word-limit-indicator ${isOverLimit ? 'limit-exceeded' : ''}`}>
            {wordCount} / {wordLimit} words limit {isOverLimit && '(Limit exceeded)'}
          </span>
        </div>

        <div className="metrics-progress-bar">
          <div
            className={`metrics-progress-fill ${isOverLimit ? 'fill-exceeded' : ''}`}
            style={{ width: `${percentOfLimit}%` }}
          />
        </div>
      </div>

      {/* Action Button Strip */}
      <div className="editor-action-buttons-strip">
        <div className="primary-generate-group">
          <button
            type="button"
            className="btn btn-primary generate-main-btn"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            <Sparkles size={16} />
            <span>{content ? 'Regenerate Draft' : 'Generate Draft (Demo)'}</span>
          </button>

          {content && (
            <button
              type="button"
              className="btn btn-outline btn-sm action-tool-btn"
              onClick={onRegenerate}
              disabled={isGenerating}
              title="Generate a new variation"
            >
              <RotateCcw size={14} /> Refresh
            </button>
          )}
        </div>

        {/* Text Modifiers (Enabled when content exists) */}
        {content && (
          <div className="text-modifiers-group">
            <button
              type="button"
              className="btn btn-outline btn-sm action-tool-btn"
              onClick={onImprove}
              title="Polish vocabulary and sentence structure"
            >
              <Wand2 size={13} /> Improve
            </button>

            <button
              type="button"
              className="btn btn-outline btn-sm action-tool-btn"
              onClick={onShorten}
              title="Condense paragraphs to reduce word count"
            >
              <Minimize2 size={13} /> Shorten
            </button>

            <button
              type="button"
              className="btn btn-outline btn-sm action-tool-btn"
              onClick={onExpand}
              title="Elaborate with academic and research depth"
            >
              <Maximize2 size={13} /> Expand
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm save-draft-btn"
              onClick={onSaveDraft}
              title="Save current essay to your drafts"
            >
              <Save size={14} /> Save Draft
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
