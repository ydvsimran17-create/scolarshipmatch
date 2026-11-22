import { Search, RotateCcw, Filter } from 'lucide-react'
import { DOCUMENT_CATEGORIES, DOCUMENT_STATUSES } from '../../data/documentsData'
import './DocumentCategoryTabs.css'

export default function DocumentCategoryTabs({
  categories = DOCUMENT_CATEGORIES,
  activeCategory = 'All Documents',
  onSelectCategory,
  searchQuery = '',
  onSearchChange,
  statusFilter = 'All',
  onStatusChange,
  onClearFilters,
  totalMatching = 0,
}) {
  const isFiltered =
    Boolean(searchQuery) ||
    activeCategory !== 'All Documents' ||
    statusFilter !== 'All'

  return (
    <div className="document-filters-container card" aria-label="Document filters and search">
      {/* Top: Category Pill Tabs */}
      <div className="category-tabs-scroll-wrapper">
        <div className="category-tabs-list" role="tablist">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`category-pill-tab ${isSelected ? 'tab-active' : ''}`}
                onClick={() => onSelectCategory(cat)}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom: Search Input & Status Dropdown & Reset */}
      <div className="filter-controls-subrow">
        {/* Search */}
        <div className="doc-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="doc-search-input"
            placeholder="Search document by name or issuing authority..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search documents"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              title="Clear search query"
            >
              &times;
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="status-select-wrap">
          <select
            className="doc-status-select"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by verification status"
          >
            <option value="All">All Verification Statuses</option>
            <option value={DOCUMENT_STATUSES.VERIFIED}>Verified Only</option>
            <option value={DOCUMENT_STATUSES.PENDING}>Pending Verification</option>
            <option value={DOCUMENT_STATUSES.MISSING}>Missing Documents</option>
          </select>
        </div>

        {/* Count & Reset */}
        <div className="filter-actions-group">
          <span className="results-count-chip text-xs">
            <Filter size={13} className="chip-icon" />
            <span>
              <strong>{totalMatching}</strong> {totalMatching === 1 ? 'record' : 'records'}
            </span>
          </span>

          {isFiltered && (
            <button
              type="button"
              className="clear-filters-link text-xs"
              onClick={onClearFilters}
            >
              <RotateCcw size={13} /> Reset
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
