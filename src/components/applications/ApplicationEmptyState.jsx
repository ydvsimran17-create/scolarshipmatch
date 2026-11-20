import { Link } from 'react-router-dom'
import { Inbox, Search, Sparkles, RotateCcw } from 'lucide-react'
import './ApplicationEmptyState.css'

export default function ApplicationEmptyState({ isFiltered = false, onClearFilters }) {
  return (
    <div className="application-empty-card card" aria-label="No applications found">
      <div className="empty-state-crest">
        {isFiltered ? (
          <Search size={36} className="empty-state-icon" />
        ) : (
          <Inbox size={36} className="empty-state-icon" />
        )}
      </div>

      <h3 className="empty-state-heading">
        {isFiltered ? 'No Matching Applications Found' : 'No Applications on File Yet'}
      </h3>

      <p className="empty-state-subtext text-secondary text-sm">
        {isFiltered
          ? 'No applications match your active search terms or selected filters. Try broadening your criteria or reset the filters.'
          : 'You haven’t submitted any scholarship applications yet. Explore thousands of eligible grants and start your college journey.'}
      </p>

      <div className="empty-state-actions">
        {isFiltered && onClearFilters && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClearFilters}
          >
            <RotateCcw size={15} /> Clear All Filters
          </button>
        )}

        <Link to="/find-scholarships" className="btn btn-primary">
          <Sparkles size={15} /> Explore Scholarships Directory
        </Link>
      </div>
    </div>
  )
}
