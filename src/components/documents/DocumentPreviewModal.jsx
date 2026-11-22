import { useEffect } from 'react'
import {
  X,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Building2,
  FileText,
  Sparkles,
  Download,
} from 'lucide-react'
import DocumentStatusBadge, { DocumentTypeIcon } from './DocumentStatusBadge'
import './DocumentPreviewModal.css'

export default function DocumentPreviewModal({ document, isOpen, onClose }) {
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

  const isImage =
    document.fileType === 'JPG' ||
    document.fileType === 'JPEG' ||
    document.fileType === 'PNG'

  const hasPreviewBlob = Boolean(document.previewUrl)

  const handleOpenExternal = () => {
    if (document.previewUrl) {
      window.open(document.previewUrl, '_blank')
    }
  }

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
      aria-labelledby="preview-doc-title"
    >
      <div className="preview-modal-dialog card">
        {/* Header */}
        <div className="preview-header-bar">
          <div className="preview-title-group">
            <div className="preview-file-icon">
              <DocumentTypeIcon fileType={document.fileType} />
            </div>
            <div>
              <h2 id="preview-doc-title" className="preview-title">
                {document.name}
              </h2>
              <span className="text-xs text-muted">
                {document.category} &bull; {document.fileType} ({document.fileSize})
              </span>
            </div>
          </div>

          <div className="preview-header-actions">
            {hasPreviewBlob && (
              <button
                type="button"
                className="btn btn-outline btn-sm action-link-btn"
                onClick={handleOpenExternal}
                title="Open in new window"
              >
                <ExternalLink size={13} /> <span>Open External</span>
              </button>
            )}

            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close document preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="preview-body-container">
          {hasPreviewBlob ? (
            /* Real uploaded file preview */
            <div className="live-preview-viewport">
              {isImage ? (
                <div className="image-viewport">
                  <img
                    src={document.previewUrl}
                    alt={document.name}
                    className="uploaded-image-preview"
                  />
                </div>
              ) : (
                <div className="pdf-viewport">
                  <object
                    data={document.previewUrl}
                    type="application/pdf"
                    className="pdf-embed-object"
                  >
                    <div className="pdf-fallback-message">
                      <FileText size={48} className="fallback-pdf-icon" />
                      <p className="text-sm text-secondary">
                        PDF preview is ready. You can open it in a dedicated browser tab.
                      </p>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleOpenExternal}
                      >
                        <ExternalLink size={14} /> Open PDF in New Window
                      </button>
                    </div>
                  </object>
                </div>
              )}
            </div>
          ) : (
            /* Rich simulated demo certificate card for initial records */
            <div className="demo-certificate-preview-card">
              <div className="cert-watermark-crest">
                <ShieldCheck size={88} />
              </div>

              <div className="cert-header-seal">
                <span className="badge badge-brass text-xs">
                  <Sparkles size={11} /> Academic Dossier Record
                </span>
                <span className="cert-seal-text text-xs text-muted">
                  Document ID: {document.id}
                </span>
              </div>

              <h3 className="cert-document-title">{document.name}</h3>

              <div className="cert-status-row">
                <DocumentStatusBadge status={document.status} />
              </div>

              <p className="cert-description text-sm text-secondary">
                {document.description}
              </p>

              {/* Certificate Verification Details */}
              <div className="cert-meta-grid">
                <div className="cert-meta-item">
                  <span className="cert-meta-label text-xs text-muted">Issuing Authority:</span>
                  <div className="cert-meta-val text-xs">
                    <Building2 size={13} className="meta-icon" />
                    <strong>{document.verifiedBy}</strong>
                  </div>
                </div>

                <div className="cert-meta-item">
                  <span className="cert-meta-label text-xs text-muted">Upload Date:</span>
                  <div className="cert-meta-val text-xs">
                    <Calendar size={13} className="meta-icon" />
                    <span>{document.uploadDate}</span>
                  </div>
                </div>

                <div className="cert-meta-item">
                  <span className="cert-meta-label text-xs text-muted">File Format &amp; Size:</span>
                  <div className="cert-meta-val text-xs font-mono">
                    {document.fileType} &bull; {document.fileSize}
                  </div>
                </div>

                <div className="cert-meta-item">
                  <span className="cert-meta-label text-xs text-muted">Verification Signature:</span>
                  <div className="cert-meta-val text-xs">
                    <ShieldCheck size={13} className="meta-icon verified-green" />
                    <span className="verified-green font-semibold">Digitally Signed &bull; e-KYC</span>
                  </div>
                </div>
              </div>

              {/* Security Advisory */}
              <div className="cert-footer-advisory">
                <span className="text-xs text-muted">
                  <strong>Simulated Demo Preview:</strong> This preview models the official state repository verification dossier for student Anvaya Sharma. Files uploaded via the Upload button will render their actual uploaded pixels and PDF streams above.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="preview-modal-footer">
          <div className="footer-left-info">
            <span className="text-xs text-muted">
              {document.isDemo ? 'Sample Educational Record' : 'Student Custom Upload'}
            </span>
          </div>

          <div className="footer-right-buttons">
            {hasPreviewBlob && (
              <a
                href={document.previewUrl}
                download={document.name}
                className="btn btn-outline btn-sm"
              >
                <Download size={14} /> Download File
              </a>
            )}

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onClose}
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
