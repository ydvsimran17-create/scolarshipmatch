import { Search, Filter, RotateCcw, ArrowUpDown } from 'lucide-react'
import { APPLICATION_STATUSES } from '../../data/applicationsData'
import './ApplicationFilters.css'

export default function ApplicationFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  providerFilter,
  onProviderChange,
  sortOption,
  onSortChange,
  onClearFilters,
  providers = [],
  totalResults = 0,
}) {
  const isFiltered =
    Boolean(searchQuery) ||
    statusFilter !== 'All' ||
    providerFilter !== 'All' ||
    sortOption !== 'newest'

  return (
    <div className="application-filters-card card" aria-label="Applications search and filter tools">
      <div className="filters-main-row">
        {/* Search input */}
        <div className="filter-search-box">
          <Search size={18} className="search-box-icon" />
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search by scholarship or scheme name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search applications"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-pill text-xs"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="filter-select-group">
          <label htmlFor="filter-status-select" className="filter-select-label text-xs text-muted">
            Status
          </label>
          <div className="custom-select-wrapper">
            <select
              id="filter-status-select"
              className="filter-select-control"
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value={APPLICATION_STATUSES.SUBMITTED}>Submitted</option>
              <option value={APPLICATION_STATUSES.UNDER_REVIEW}>Under Review</option>
              <option value={APPLICATION_STATUSES.ACTION_REQUIRED}>Action Required</option>
              <option value={APPLICATION_STATUSES.APPROVED}>Approved</option>
              <option value={APPLICATION_STATUSES.REJECTED}>Rejected</option>
            </select>
          </div>
        </div>

        {/* Provider Filter */}
        <div className="filter-select-group">
          <label htmlFor="filter-provider-select" className="filter-select-label text-xs text-muted">
            Provider
          </label>
          <div className="custom-select-wrapper">
            <select
              id="filter-provider-select"
              className="filter-select-control"
              value={providerFilter}
              onChange={(e) => onProviderChange(e.target.value)}
            >
              <option value="All">All Providers</option>
              {providers.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-select-group">
          <label htmlFor="filter-sort-select" className="filter-select-label text-xs text-muted">
            <ArrowUpDown size={12} className="inline-icon" /> Sort
          </label>
          <div className="custom-select-wrapper">
            <select
              id="filter-sort-select"
              className="filter-select-control"
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="newest">Submission: Newest First</option>
              <option value="oldest">Submission: Oldest First</option>
              <option value="updated">Recently Updated</option>
              <option value="amount-high">Amount: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Bottom Sub-bar */}
      <div className="filters-status-subbar">
        <div className="results-count-chip">
          <Filter size={14} className="count-icon" />
          <span className="text-xs">
            Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'application' : 'applications'}
          </span>
        </div>

        {isFiltered && (
          <button
            type="button"
            className="clear-all-filters-btn text-xs"
            onClick={onClearFilters}
          >
            <RotateCcw size={13} /> Reset Filters
          </button>
        )}
      </div>
    </div>
  )
}
