import { Filter, RotateCcw, X, Check } from 'lucide-react'
import { filterOptions } from '../../data/scholarshipsDiscoveryData'
import './ScholarshipFilterPanel.css'

export default function ScholarshipFilterPanel({
  filters,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
  isMobileOpen,
  onMobileClose,
}) {
  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="filter-mobile-backdrop"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`filter-sidebar-panel card ${isMobileOpen ? 'mobile-open' : ''}`}
        aria-label="Scholarship Filters"
      >
        {/* Panel Header */}
        <div className="filter-panel-header">
          <div className="filter-title-group">
            <Filter size={18} className="filter-header-icon" />
            <h3 className="filter-panel-title">Filter Criteria</h3>
            {activeFilterCount > 0 && (
              <span className="badge badge-brass text-xs">
                {activeFilterCount} Active
              </span>
            )}
          </div>

          <div className="filter-header-actions">
            {activeFilterCount > 0 && (
              <button
                type="button"
                className="btn-clear-filters text-xs"
                onClick={onResetFilters}
                title="Reset all filter selections"
              >
                <RotateCcw size={12} /> Clear All
              </button>
            )}
            <button
              type="button"
              className="filter-mobile-close-btn"
              onClick={onMobileClose}
              aria-label="Close filter panel"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="filter-sections-scrollable">
          {/* 1. Education Level */}
          <div className="filter-group">
            <label className="filter-group-label" htmlFor="education-level-select">
              Education Level
            </label>
            <div className="filter-pills-row">
              {filterOptions.educationLevels.map((level) => {
                const isSelected = filters.educationLevel === level
                return (
                  <button
                    key={level}
                    type="button"
                    className={`filter-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => onFilterChange('educationLevel', level)}
                  >
                    {isSelected && <Check size={12} className="chip-check" />}
                    {level}
                  </button>
                )
              })}
            </div>
          </div>

          <hr className="filter-divider" />

          {/* 2. Category (Social / Caste / Reservation) */}
          <div className="filter-group">
            <label className="filter-group-label" htmlFor="category-select">
              Caste &amp; Community Category
            </label>
            <select
              id="category-select"
              className="input-field filter-select"
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
            >
              {filterOptions.categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories (General, SC, ST, OBC...)' : cat}
                </option>
              ))}
            </select>
          </div>

          <hr className="filter-divider" />

          {/* 3. Indian State */}
          <div className="filter-group">
            <label className="filter-group-label" htmlFor="state-select">
              State / Domicile
            </label>
            <select
              id="state-select"
              className="input-field filter-select"
              value={filters.state}
              onChange={(e) => onFilterChange('state', e.target.value)}
            >
              {filterOptions.states.map((st) => (
                <option key={st} value={st}>
                  {st === 'All' ? 'All States (National & Domicile)' : st}
                </option>
              ))}
            </select>
          </div>

          <hr className="filter-divider" />

          {/* 4. Annual Family Income */}
          <div className="filter-group">
            <label className="filter-group-label" htmlFor="income-select">
              Annual Family Income
            </label>
            <select
              id="income-select"
              className="input-field filter-select"
              value={filters.incomeRange}
              onChange={(e) => onFilterChange('incomeRange', e.target.value)}
            >
              {filterOptions.incomeRanges.map((inc) => (
                <option key={inc} value={inc}>
                  {inc === 'All' ? 'All Income Ranges' : inc}
                </option>
              ))}
            </select>
          </div>

          <hr className="filter-divider" />

          {/* 5. Scholarship Type */}
          <div className="filter-group">
            <label className="filter-group-label">
              Scholarship Type
            </label>
            <div className="filter-pills-row">
              {filterOptions.scholarshipTypes.map((type) => {
                const isSelected = filters.scholarshipType === type
                return (
                  <button
                    key={type}
                    type="button"
                    className={`filter-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => onFilterChange('scholarshipType', type)}
                  >
                    {isSelected && <Check size={12} className="chip-check" />}
                    {type}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Panel Footer (Mobile) */}
        <div className="filter-panel-footer">
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={onMobileClose}
          >
            Apply Filters
          </button>
        </div>
      </aside>
    </>
  )
}
