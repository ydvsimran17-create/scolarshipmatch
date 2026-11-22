import { useEffect } from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'
import './DeleteConfirmModal.css'

export default function DeleteConfirmModal({
  document,
  isOpen,
  onClose,
  onConfirmDelete,
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

  if (!isOpen || !document) return null

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
      aria-labelledby="delete-confirm-title"
    >
      <div className="delete-modal-dialog card">
        <div className="delete-modal-header">
          <div className="delete-title-wrap">
            <AlertTriangle size={20} className="delete-alert-icon" />
            <h3 id="delete-confirm-title" className="delete-modal-title">
              Delete Document Record?
            </h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Cancel deletion"
          >
            <X size={18} />
          </button>
        </div>

        <div className="delete-modal-body">
          <p className="delete-prompt-text text-sm">
            Are you sure you want to remove <strong>&ldquo;{document.name}&rdquo;</strong> from your scholarship documents dossier?
          </p>

          <div className="delete-item-summary">
            <span className="text-xs text-muted">Category:</span>
            <span className="text-xs font-semibold">{document.category}</span>
            <span className="text-xs text-muted">File:</span>
            <span className="text-xs font-semibold">
              {document.fileType} ({document.fileSize})
            </span>
          </div>

          <p className="delete-warning-note text-xs text-muted">
            {document.isDemo
              ? 'This demo item will be removed from your view. You can restore default demo records anytime with the "Reset to Demo Records" option.'
              : 'This uploaded file will be removed from your active session.'}
          </p>
        </div>

        <div className="delete-modal-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-currant btn-sm delete-confirm-btn"
            onClick={() => onConfirmDelete(document.id)}
          >
            <Trash2 size={14} /> Delete Document
          </button>
        </div>
      </div>
    </div>
  )
}
