import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Bookmark,
  X,
  SearchX,
  ArrowUpDown,
  RotateCcw,
  Info,
} from 'lucide-react'
import { filterOptions } from '../data/scholarshipsDiscoveryData'
import scholarshipService from '../services/scholarshipService'
import authService from '../services/authService'
import ScholarshipFilterPanel from '../components/discovery/ScholarshipFilterPanel'
import DiscoveryScholarshipCard from '../components/discovery/DiscoveryScholarshipCard'
import './FindScholarships.css'

const INITIAL_FILTERS = {
  educationLevel: 'All',
  category: 'All',
  state: 'All',
  incomeRange: 'All',
  scholarshipType: 'All',
}

export default function FindScholarships() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [sortBy, setSortBy] = useState('match')
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Scholarships loaded through the service layer (backend, or demo data if no backend)
  const [scholarships, setScholarships] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  // Personal match scores (id -> percentage), only available when the student is logged in
  const [matchScores, setMatchScores] = useState({})

  // Local storage persisted bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('scholarship_bookmarks')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Total number of scholarships (without any filter), loaded once
  useEffect(() => {
    scholarshipService
      .getScholarships()
      .then((data) => setTotalCount(data.length))
      .catch(() => {})
  }, [reloadKey])

  // If the student is logged in, load their personal match scores
  useEffect(() => {
    if (!authService.isAuthenticated()) return
    let cancelled = false

    scholarshipService
      .getRecommendedScholarships()
      .then((data) => {
        if (cancelled) return
        const scores = {}
        data.forEach((s) => {
          scores[s.id] = s.eligibilityMatch
        })
        setMatchScores(scores)
      })
      .catch(() => {
        // Not logged in properly or no profile yet: keep showing the public list
      })

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  // Load the (filtered and sorted) scholarships whenever search, filters or sort change
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    scholarshipService
      .getScholarships({ search: searchQuery, ...filters }, sortBy)
      .then((data) => {
        if (!cancelled) setScholarships(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Could not load scholarships.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [searchQuery, filters, sortBy, reloadKey])

  // Update search query via URL search params (no effect needed)
  const handleSearchChange = (val) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (val.trim()) {
          next.set('q', val)
        } else {
          next.delete('q')
        }
        return next
      },
      { replace: true }
    )
  }

  // Persist bookmarks
  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
      try {
        localStorage.setItem('scholarship_bookmarks', JSON.stringify(next))
      } catch {
        // fallback
      }
      return next
    })
  }

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }))
  }

  // Reset all filters and search query
  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS)
    setShowSavedOnly(false)
    setSortBy('match')
    setSearchParams({}, { replace: true })
  }

  // Count active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.educationLevel !== 'All') count++
    if (filters.category !== 'All') count++
    if (filters.state !== 'All') count++
    if (filters.incomeRange !== 'All') count++
    if (filters.scholarshipType !== 'All') count++
    if (showSavedOnly) count++
    if (searchQuery.trim()) count++
    return count
  }, [filters, showSavedOnly, searchQuery])

  // Search, filters and "sort by amount/deadline" are done by the service/backend.
  // Here we add the personal match scores, apply the saved-bookmarks filter
  // (bookmarks live in this browser), and sort by match when asked.
  const filteredAndSortedScholarships = useMemo(() => {
    const hasScores = Object.keys(matchScores).length > 0

    let list = hasScores
      ? scholarships.map((s) =>
          matchScores[s.id] !== undefined ? { ...s, eligibilityMatch: matchScores[s.id] } : s
        )
      : scholarships

    if (showSavedOnly) {
      list = list.filter((item) => bookmarkedIds.includes(item.id))
    }

    if (hasScores && sortBy === 'match') {
      list = [...list].sort((a, b) => b.eligibilityMatch - a.eligibilityMatch)
    }

    return list
  }, [scholarships, matchScores, showSavedOnly, bookmarkedIds, sortBy])

  return (
    <div className="discovery-page-wrapper">
      {/* 1. Page Header */}
      <header className="discovery-header card">
        <div className="discovery-header-text">
          <div className="discovery-badge-row">
            <span className="badge badge-brass">
              <Sparkles size={13} /> AI-Powered Discovery
            </span>
            <span className="text-xs text-muted">
              {totalCount} Scholarship Profiles (Sample Data)
            </span>
          </div>

          <h1 className="discovery-page-title">Find Scholarships</h1>

          <p className="discovery-page-subtitle">
            Discover financial opportunities that match your academic goals.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="discovery-search-container">
          <div className="search-bar-frame">
            <Search size={18} className="search-icon-muted" />
            <input
              type="text"
              className="discovery-search-input"
              placeholder="Search by scholarship name, provider, or keyword..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label="Search scholarships"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-icon-btn"
                onClick={() => handleSearchChange('')}
                aria-label="Clear search text"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Demo Data Notice Bar */}
      <div className="discovery-notice-banner">
        <Info size={16} className="notice-icon" />
        <p className="text-xs text-secondary">
          <strong>Demonstration Data:</strong> The listings below represent realistic sample
          scholarship profiles for testing search, multi-criteria filtering, and bookmarks. Official eligibility and closing dates must be verified on designated institutional portals.
        </p>
      </div>

      {/* 3. Main Discovery Workspace: Filter Sidebar + Results */}
      <div className="discovery-layout-split">
        {/* Left Filter Panel Component */}
        <ScholarshipFilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          activeFilterCount={activeFilterCount}
          isMobileOpen={isMobileFilterOpen}
          onMobileClose={() => setIsMobileFilterOpen(false)}
        />

        {/* Right Results Content Area */}
        <section className="discovery-results-column" aria-label="Scholarship Results">
          {/* Controls Bar: Mobile Filter Toggle, Results Count, Saved Filter & Sorting */}
          <div className="results-controls-bar card">
            <div className="controls-left-group">
              {/* Mobile Filter Toggle Button */}
              <button
                type="button"
                className="btn btn-outline btn-sm mobile-filter-trigger"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <SlidersHorizontal size={14} /> Filters
                {activeFilterCount > 0 && (
                  <span className="badge badge-brass text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <span className="results-count-text text-sm">
                Showing <strong>{filteredAndSortedScholarships.length}</strong> of{' '}
                {totalCount} opportunities
              </span>
            </div>

            <div className="controls-right-group">
              {/* Saved / Bookmarked Filter Toggle */}
              <button
                type="button"
                className={`btn btn-sm bookmark-filter-btn ${
                  showSavedOnly ? 'active' : ''
                }`}
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                title="Filter by saved bookmarks"
              >
                <Bookmark size={14} className={showSavedOnly ? 'filled' : ''} />
                <span>Saved ({bookmarkedIds.length})</span>
              </button>

              {/* Sorting Dropdown */}
              <div className="sort-select-wrapper">
                <ArrowUpDown size={14} className="sort-icon-muted" />
                <select
                  className="input-field sort-dropdown"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort scholarships"
                >
                  {filterOptions.sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      Sort: {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Pills Bar (if filters are active) */}
          {activeFilterCount > 0 && (
            <div className="active-filters-chips-bar">
              <span className="text-xs text-muted">Applied filters:</span>

              {searchQuery && (
                <span className="applied-pill">
                  Query: &ldquo;{searchQuery}&rdquo;
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                  >
                    &times;
                  </button>
                </span>
              )}

              {filters.educationLevel !== 'All' && (
                <span className="applied-pill">
                  Level: {filters.educationLevel}
                  <button
                    type="button"
                    onClick={() => handleFilterChange('educationLevel', 'All')}
                  >
                    &times;
                  </button>
                </span>
              )}

              {filters.category !== 'All' && (
                <span className="applied-pill">
                  Category: {filters.category}
                  <button
                    type="button"
                    onClick={() => handleFilterChange('category', 'All')}
                  >
                    &times;
                  </button>
                </span>
              )}

              {filters.state !== 'All' && (
                <span className="applied-pill">
                  State: {filters.state}
                  <button
                    type="button"
                    onClick={() => handleFilterChange('state', 'All')}
                  >
                    &times;
                  </button>
                </span>
              )}

              {filters.incomeRange !== 'All' && (
                <span className="applied-pill">
                  Income: {filters.incomeRange}
                  <button
                    type="button"
                    onClick={() => handleFilterChange('incomeRange', 'All')}
                  >
                    &times;
                  </button>
                </span>
              )}

              {filters.scholarshipType !== 'All' && (
                <span className="applied-pill">
                  Type: {filters.scholarshipType}
                  <button
                    type="button"
                    onClick={() => handleFilterChange('scholarshipType', 'All')}
                  >
                    &times;
                  </button>
                </span>
              )}

              {showSavedOnly && (
                <span className="applied-pill">
                  Saved Bookmarks Only
                  <button type="button" onClick={() => setShowSavedOnly(false)}>
                    &times;
                  </button>
                </span>
              )}

              <button
                type="button"
                className="reset-all-text-btn text-xs"
                onClick={handleResetFilters}
              >
                Clear all
              </button>
            </div>
          )}

          {/* Loading, error, cards list or empty state */}
          {loading ? (
            <div className="discovery-empty-state card">
              <p className="text-sm text-secondary">Loading scholarships&hellip;</p>
            </div>
          ) : error ? (
            <div className="discovery-empty-state card">
              <h3 className="empty-state-title">Could not load scholarships</h3>
              <p className="empty-state-subtitle text-sm text-secondary">{error}</p>
              <button
                type="button"
                className="btn btn-primary btn-sm empty-reset-btn"
                onClick={() => setReloadKey((k) => k + 1)}
              >
                <RotateCcw size={14} /> Try again
              </button>
            </div>
          ) : filteredAndSortedScholarships.length > 0 ? (
            <div className="discovery-cards-grid">
              {filteredAndSortedScholarships.map((scholarship) => (
                <DiscoveryScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                  isBookmarked={bookmarkedIds.includes(scholarship.id)}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </div>
          ) : (
            <div className="discovery-empty-state card">
              <div className="empty-icon-circle">
                <SearchX size={32} />
              </div>
              <h3 className="empty-state-title">No matching scholarships found</h3>
              <p className="empty-state-subtitle text-sm text-secondary">
                We couldn&rsquo;t find any scholarships matching your active search
                or filter combinations. Try loosening some criteria or clearing filters.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm empty-reset-btn"
                onClick={handleResetFilters}
              >
                <RotateCcw size={14} /> Clear All Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}