/**
 * Scholarship Match - Scholarship API Service
 *
 * Handles scholarship discovery, keyword search, multi-faceted filtering, sorting,
 * eligibility match computation, and bookmarking.
 *
 * BACKEND INTEGRATION NOTE:
 * When VITE_API_BASE_URL is active, queries are sent to backend endpoints.
 * In Demo Mode, operations execute against discoveryScholarships, recommendedScholarships,
 * and localStorage ('scholarship_bookmarked_ids').
 */

import { apiClient, isApiConfigured } from './api.js'
import {
  discoveryScholarships,
  filterOptions,
} from '../data/scholarshipsDiscoveryData.js'
import { recommendedScholarships, upcomingDeadlines } from '../data/dashboardData.js'

export const BOOKMARKS_STORAGE_KEY = 'scholarship_bookmarks'

/**
 * Proposed scholarship backend endpoints.
 */
export const SCHOLARSHIP_ENDPOINTS = {
  LIST: '/scholarships',
  DETAIL: (id) => `/scholarships/${encodeURIComponent(id)}`,
  RECOMMENDED: '/scholarships/recommended',
  MATCH: (id) => `/scholarships/${encodeURIComponent(id)}/match`,
  BOOKMARKS: '/scholarships/bookmarked',
  DEADLINES: '/scholarships/deadlines',
}

export const scholarshipService = {
  /**
   * Retrieves scholarship listings with optional search query, filters, and sort metric.
   *
   * @param {object} filters - { search, educationLevel, category, state, incomeRange, scholarshipType }
   * @param {string} sort - 'match' | 'amount' | 'deadline'
   * @returns {Promise<Array<object>>}
   */
  async getScholarships(filters = {}, sort = 'match') {
    if (isApiConfigured()) {
      return apiClient.get(SCHOLARSHIP_ENDPOINTS.LIST, { ...filters, sort })
    }

    // Demo Mode Fallback: client-side filter engine
    let results = [...discoveryScholarships]

    // 1. Keyword search
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim()
      results = results.filter((s) => {
        const titleMatch = s.name.toLowerCase().includes(q)
        const providerMatch = s.provider.toLowerCase().includes(q)
        const descMatch = s.shortDescription?.toLowerCase().includes(q)
        const keywordMatch = s.keywords?.some((k) => k.toLowerCase().includes(q))
        return titleMatch || providerMatch || descMatch || keywordMatch
      })
    }

    // 2. Education Level filter
    if (filters.educationLevel && filters.educationLevel !== 'All') {
      results = results.filter((s) =>
        s.educationLevel.some((lvl) => lvl.toLowerCase() === filters.educationLevel.toLowerCase())
      )
    }

    // 3. Category filter
    if (filters.category && filters.category !== 'All') {
      results = results.filter((s) =>
        s.eligibleCategories.some((c) => c.toLowerCase() === filters.category.toLowerCase())
      )
    }

    // 4. State filter
    if (filters.state && filters.state !== 'All') {
      results = results.filter(
        (s) => s.state === 'All-India' || s.state.toLowerCase() === filters.state.toLowerCase()
      )
    }

    // 5. Income Range filter
    if (filters.incomeRange && filters.incomeRange !== 'All') {
      results = results.filter((s) => {
        if (s.incomeLimit === 'No Income Limit') return true
        if (filters.incomeRange === 'Under ₹2.5 Lakhs') {
          return s.incomeLimit.includes('2.5') || s.incomeLimit.includes('2,50,000')
        }
        if (filters.incomeRange === 'Under ₹4.5 Lakhs') {
          return s.incomeLimit.includes('4.5') || s.incomeLimit.includes('2.5')
        }
        return true
      })
    }

    // 6. Scholarship Type filter
    if (filters.scholarshipType && filters.scholarshipType !== 'All') {
      results = results.filter((s) =>
        s.scholarshipType.some((t) => t.toLowerCase() === filters.scholarshipType.toLowerCase())
      )
    }

    // 7. Sort
    results.sort((a, b) => {
      if (sort === 'amount') {
        return (b.amountValue || 0) - (a.amountValue || 0)
      }
      if (sort === 'deadline') {
        return new Date(a.deadlineDate || '2099-01-01') - new Date(b.deadlineDate || '2099-01-01')
      }
      // default: match score
      return (b.eligibilityMatch || 0) - (a.eligibilityMatch || 0)
    })

    return results
  },

  /**
   * Retrieves full details for a single scholarship by ID.
   *
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async getScholarshipById(id) {
    if (isApiConfigured()) {
      return apiClient.get(SCHOLARSHIP_ENDPOINTS.DETAIL(id))
    }

    // Demo Mode Fallback
    const found = discoveryScholarships.find((s) => s.id === id)
    return found || null
  },

  /**
   * Retrieves curated top-matched recommended scholarships.
   *
   * @returns {Promise<Array<object>>}
   */
  async getRecommendedScholarships() {
    if (isApiConfigured()) {
      return apiClient.get(SCHOLARSHIP_ENDPOINTS.RECOMMENDED)
    }

    return recommendedScholarships
  },

  /**
   * Evaluates eligibility match score for a given student profile against a scholarship.
   *
   * @param {string} scholarshipId
   * @param {object} studentProfileData
   * @returns {Promise<{ matchScore: number, explanation: object }>}
   */
  async matchScholarship(scholarshipId, studentProfileData) {
    if (isApiConfigured()) {
      return apiClient.post(SCHOLARSHIP_ENDPOINTS.MATCH(scholarshipId), {
        profile: studentProfileData,
      })
    }

    // Demo Mode Fallback: return pre-calculated match structure
    const sch = discoveryScholarships.find((s) => s.id === scholarshipId)
    return {
      matchScore: sch?.eligibilityMatch || 80,
      explanation: sch?.matchExplanation || {
        percentage: sch?.eligibilityMatch || 80,
        summary: 'Demo eligibility evaluation based on academic criteria.',
        matchedCriteria: ['Merit performance meets threshold criteria.'],
        pendingVerification: ['Document verification pending.'],
      },
    }
  },

  /**
   * Retrieves upcoming deadlines for time-sensitive scholarships.
   *
   * @returns {Promise<Array<object>>}
   */
  async getUpcomingDeadlines() {
    if (isApiConfigured()) {
      return apiClient.get(SCHOLARSHIP_ENDPOINTS.DEADLINES)
    }

    return upcomingDeadlines
  },

  /**
   * Retrieves list of bookmarked scholarship IDs.
   *
   * @returns {Promise<Array<string>>}
   */
  async getBookmarkedIds() {
    if (isApiConfigured()) {
      return apiClient.get(SCHOLARSHIP_ENDPOINTS.BOOKMARKS)
    }

    try {
      const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY)
      return saved ? JSON.parse(saved) : ['csss-scholarship', 'hdfc-parivartan-ecss']
    } catch {
      return ['csss-scholarship', 'hdfc-parivartan-ecss']
    }
  },

  /**
   * Toggles bookmark state for a scholarship.
   *
   * @param {string} scholarshipId
   * @returns {Promise<{ bookmarked: boolean, bookmarkedIds: Array<string> }>}
   */
  async toggleBookmark(scholarshipId) {
    if (isApiConfigured()) {
      return apiClient.post(SCHOLARSHIP_ENDPOINTS.BOOKMARKS, { scholarshipId })
    }

    // Demo Mode Fallback
    try {
      const current = await this.getBookmarkedIds()
      let updated
      let isBookmarked = false
      if (current.includes(scholarshipId)) {
        updated = current.filter((id) => id !== scholarshipId)
        isBookmarked = false
      } else {
        updated = [...current, scholarshipId]
        isBookmarked = true
      }
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated))
      return { bookmarked: isBookmarked, bookmarkedIds: updated }
    } catch {
      return { bookmarked: false, bookmarkedIds: [] }
    }
  },

  /**
   * Retrieves available filter choices and sorting parameters.
   *
   * @returns {object}
   */
  getFilterOptions() {
    return filterOptions
  },
}

export default scholarshipService
