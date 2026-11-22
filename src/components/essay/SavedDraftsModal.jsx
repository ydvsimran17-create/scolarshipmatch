import { useEffect } from 'react'
import {
  X,
  FolderArchive,
  BookOpen,
  Calendar,
  Trash2,
  ExternalLink,
  Inbox,
} from 'lucide-react'
import './SavedDraftsModal.css'

export default function SavedDraftsModal({
  isOpen,
  onClose,
  drafts = [],
  onLoadDraft,
  onDeleteDraft,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="modal-backdrop-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="saved-drafts-modal-title"
    >
      <div className="saved-drafts-dialog card">
        <div className="drafts-modal-header">
          <div className="drafts-title-group">
            <FolderArchive size={20} className="drafts-crest-icon" />
            <h2 id="saved-drafts-modal-title" className="drafts-modal-title">
              Saved Essay Drafts ({drafts.length})
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close saved drafts window"
          >
            <X size={18} />
          </button>
        </div>

        <div className="drafts-modal-body">
          {drafts.length > 0 ? (
            <div className="drafts-list-stack">
              {drafts.map((draft) => {
                const words = (draft.content || '').trim().split(/\s+/).filter(Boolean).length

                return (
                  <div key={draft.id} className="draft-card-item">
                    <div className="draft-card-meta-top">
                      <span className="badge badge-indigo text-xs">
                        {draft.essayType}
                      </span>
                      <span className="badge badge-linen text-xs">
                        {draft.tone || 'Formal'} Tone
                      </span>
                      <span className="draft-words-count text-xs text-muted">
                        {words} words
                      </span>
                    </div>

                    <h3 className="draft-item-title text-sm font-semibold">
                      {draft.title || draft.essayType}
                    </h3>

                    <p className="draft-scheme-name text-xs text-secondary">
                      <BookOpen size={12} className="inline-icon" /> {draft.scholarshipName}
                    </p>

                    <p className="draft-preview-snippet text-xs text-muted">
                      {(draft.content || '').slice(0, 140)}...
                    </p>

                    <div className="draft-card-footer">
                      <span className="draft-date-stamp text-xs text-muted">
                        <Calendar size={12} className="inline-icon" /> Updated {draft.lastUpdated}
                      </span>

                      <div className="draft-card-actions">
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm draft-delete-btn"
                          onClick={() => {
                            if (window.confirm(`Delete draft "${draft.title}"?`)) {
                              onDeleteDraft(draft.id)
                            }
                          }}
                          title="Delete draft"
                        >
                          <Trash2 size={14} />
                        </button>

                        <button
                          type="button"
                          className="btn btn-primary btn-sm draft-load-btn"
                          onClick={() => {
                            onLoadDraft(draft)
                            onClose()
                          }}
                        >
                          <ExternalLink size={13} /> Open in Editor
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="drafts-empty-state">
              <Inbox size={40} className="empty-inbox-icon" />
              <strong className="text-sm text-midnight">No Saved Drafts on Record</strong>
              <p className="text-xs text-secondary">
                Generate or write an essay in the workspace, then click &ldquo;Save Draft&rdquo; to store it here.
              </p>
            </div>
          )}
        </div>

        <div className="drafts-modal-footer">
          <span className="text-xs text-muted">
            Drafts persist locally in your browser storage.
          </span>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
