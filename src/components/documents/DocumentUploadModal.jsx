import { useState, useRef, useEffect } from 'react'
import {
  X,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  ShieldAlert,
} from 'lucide-react'
import { DOCUMENT_CATEGORIES } from '../../data/documentsData'
import './DocumentUploadModal.css'

export default function DocumentUploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
  prefillDoc = null,
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [docName, setDocName] = useState(() => prefillDoc?.name || '')
  const [category, setCategory] = useState(() => prefillDoc?.category || 'Academic Documents')
  const [errorMsg, setErrorMsg] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef(null)

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isUploading) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isUploading, onClose])

  if (!isOpen) return null

  // File validation
  const validateAndSetFile = (file) => {
    setErrorMsg('')
    if (!file) return

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg('Invalid file format. Please upload a PDF, JPG, or PNG document.')
      return
    }

    const maxSizeInBytes = 5 * 1024 * 1024 // 5 MB
    if (file.size > maxSizeInBytes) {
      setErrorMsg('File size exceeds the 5MB limit. Please upload a compressed copy.')
      return
    }

    setSelectedFile(file)
    // Auto populate docName if empty
    if (!docName.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      setDocName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0]
    validateAndSetFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files && e.dataTransfer.files[0]
    validateAndSetFile(file)
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB'
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }
    return `${Math.round(bytes / 1024)} KB`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedFile) {
      setErrorMsg('Please select a file to upload.')
      return
    }
    if (!docName.trim()) {
      setErrorMsg('Please enter a descriptive document name.')
      return
    }

    setIsUploading(true)
    setUploadProgress(25)

    // Simulate upload progression
    const timer1 = setTimeout(() => setUploadProgress(65), 250)
    const timer2 = setTimeout(() => setUploadProgress(100), 550)
    const timer3 = setTimeout(() => {
      setIsUploading(false)
      setIsSuccess(true)

      // Create object URL for instant preview
      const previewUrl = URL.createObjectURL(selectedFile)

      const fileExtension = selectedFile.name.split('.').pop().toUpperCase()
      const newDocument = {
        id: prefillDoc?.id || `doc-custom-${Date.now()}`,
        name: docName.trim(),
        category: category,
        uploadDate: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        uploadDateIso: new Date().toISOString().split('T')[0],
        fileType: fileExtension,
        fileSize: formatFileSize(selectedFile.size),
        status: 'Verified', // User uploaded files are marked verified for demo
        verifiedBy: 'Self Upload & Format Checked',
        description: `Student uploaded ${fileExtension} document for ${category}.`,
        previewUrl: previewUrl,
        isCustomUpload: true,
        isDemo: false,
      }

      setTimeout(() => {
        onUploadSuccess(newDocument)
        onClose()
      }, 700)
    }, 850)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isUploading) {
      onClose()
    }
  }

  const availableCategories = DOCUMENT_CATEGORIES.filter((c) => c !== 'All Documents')

  return (
    <div
      className="modal-backdrop-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
    >
      <div className="modal-dialog-box card">
        {/* Header */}
        <div className="upload-modal-header">
          <div className="upload-header-title-wrap">
            <Upload size={18} className="upload-header-icon" />
            <h2 id="upload-modal-title" className="upload-modal-title">
              Upload Scholarship Document
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isUploading}
            aria-label="Close upload dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success View */}
        {isSuccess ? (
          <div className="upload-success-state">
            <div className="success-crest">
              <CheckCircle2 size={42} className="success-icon" />
            </div>
            <h3 className="success-title">Document Successfully Attached!</h3>
            <p className="text-secondary text-sm">
              &ldquo;{docName}&rdquo; has been added to your scholarship documents dossier.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="upload-form-body">
            {/* Drag & Drop Area */}
            <div
              className={`file-drop-zone ${isDragging ? 'is-dragging' : ''} ${
                selectedFile ? 'has-file' : ''
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  fileInputRef.current && fileInputRef.current.click()
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden-file-input"
              />

              {!selectedFile ? (
                <div className="drop-zone-placeholder">
                  <div className="drop-icon-bubble">
                    <Upload size={24} />
                  </div>
                  <strong className="drop-prompt-text text-sm">
                    Drag and drop your file here, or <span className="browse-text">browse files</span>
                  </strong>
                  <span className="drop-file-types text-xs text-muted">
                    Supports PDF, JPG, PNG &bull; Maximum file size: 5 MB
                  </span>
                </div>
              ) : (
                <div className="drop-zone-selected">
                  <div className="selected-file-icon">
                    {selectedFile.type === 'application/pdf' ? (
                      <FileText size={28} className="pdf-color" />
                    ) : (
                      <ImageIcon size={28} className="img-color" />
                    )}
                  </div>
                  <div className="selected-file-meta">
                    <span className="selected-file-name text-sm font-semibold">
                      {selectedFile.name}
                    </span>
                    <span className="selected-file-size text-xs text-muted">
                      {formatFileSize(selectedFile.size)} &bull; Ready to upload
                    </span>
                  </div>
                  <button
                    type="button"
                    className="replace-file-btn text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFile(null)
                    }}
                  >
                    Change File
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="upload-error-banner">
                <AlertCircle size={15} className="error-icon" />
                <span className="text-xs">{errorMsg}</span>
              </div>
            )}

            {/* Document Name */}
            <div className="form-group">
              <label htmlFor="doc-name-input" className="form-label text-xs">
                Document Title / Name <span className="req-star">*</span>
              </label>
              <input
                id="doc-name-input"
                type="text"
                className="form-input"
                placeholder="e.g., Class 12 Marksheet, Income Certificate"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="doc-category-select" className="form-label text-xs">
                Document Category <span className="req-star">*</span>
              </label>
              <select
                id="doc-category-select"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Progress Bar (while uploading) */}
            {isUploading && (
              <div className="upload-progress-container">
                <div className="upload-progress-bar">
                  <div
                    className="upload-progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-xs text-muted upload-progress-text">
                  Uploading and running format validation... {uploadProgress}%
                </span>
              </div>
            )}

            {/* Browser Persistence Notice */}
            <div className="browser-persistence-notice">
              <ShieldAlert size={14} className="notice-icon" />
              <p className="text-xs text-muted">
                <strong>Session Storage Notice:</strong> Uploaded files are previewed in-memory using browser-managed object URLs for this session. To protect private credentials, documents do not persist to external servers without backend storage integration.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="upload-modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={onClose}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isUploading || !selectedFile || !docName.trim()}
              >
                <Upload size={15} /> Upload Document
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
