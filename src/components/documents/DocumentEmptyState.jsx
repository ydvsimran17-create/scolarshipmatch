import { FolderOpen, Search, Upload, RotateCcw } from 'lucide-react'
import './DocumentEmptyState.css'

export default function DocumentEmptyState({
  isFiltered = false,
  onClearFilters,
  onOpenUpload,
}) {
  return (
    <div className="document-empty-card card" aria-label="No documents found">
      <div className="empty-crest-circle">
        {isFiltered ? (
          <Search size={34} className="empty-crest-icon" />
        ) : (
          <FolderOpen size={34} className="empty-crest-icon" />
        )}
      </div>

      <h3 className="empty-crest-title">
        {isFiltered ? 'No Documents Match Your Filters' : 'No Documents Uploaded Yet'}
      </h3>

      <p className="empty-crest-subtitle text-secondary text-sm">
        {isFiltered
          ? 'Try refining your search keyword or selecting a different document category/verification status.'
          : 'Keep your scholarship files organized in one secure place. Upload your Aadhaar card, marksheets, and income certificates to speed up your applications.'}
      </p>

      <div className="empty-crest-actions">
        {isFiltered && onClearFilters && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClearFilters}
          >
            <RotateCcw size={14} /> Clear All Filters
          </button>
        )}

        <button
          type="button"
          className="btn btn-primary"
          onClick={onOpenUpload}
        >
          <Upload size={14} /> Upload New Document
        </button>
      </div>
    </div>
  )
}
