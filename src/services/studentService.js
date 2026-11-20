/**
 * Scholarship Match - Student Profile API Service
 *
 * Handles student academic profile retrieval, profile updates, and completion score calculations.
 *
 * BACKEND INTEGRATION NOTE:
 * When VITE_API_BASE_URL is set, methods execute calls to the backend REST API.
 * In Demo Mode, operations read and write to localStorage ('scholarship_student_profile')
 * seeded by initialStudentProfile.
 */

import { apiClient, isApiConfigured } from './api.js'
import { initialStudentProfile, calculateProfileCompletion } from '../data/profileData.js'

export const STUDENT_PROFILE_STORAGE_KEY = 'scholarship_student_profile'

/**
 * Proposed student backend endpoints.
 */
export const STUDENT_ENDPOINTS = {
  PROFILE: '/student/profile',
  STATS: '/student/stats',
}

export const studentService = {
  /**
   * Retrieves the current student's full profile details.
   *
   * @returns {Promise<object>}
   */
  async getProfile() {
    if (isApiConfigured()) {
      return apiClient.get(STUDENT_ENDPOINTS.PROFILE)
    }

    // Demo Mode Fallback: read from localStorage or default
    try {
      const saved = localStorage.getItem(STUDENT_PROFILE_STORAGE_KEY)
      return saved ? JSON.parse(saved) : initialStudentProfile
    } catch {
      return initialStudentProfile
    }
  },

  /**
   * Updates student profile fields (personal, academic, financial, eligibility, interests).
   *
   * @param {object} profileData - Updated profile object
   * @returns {Promise<object>}
   */
  async updateProfile(profileData) {
    if (isApiConfigured()) {
      return apiClient.put(STUDENT_ENDPOINTS.PROFILE, profileData)
    }

    // Demo Mode Fallback: persist in localStorage
    try {
      localStorage.setItem(STUDENT_PROFILE_STORAGE_KEY, JSON.stringify(profileData))
    } catch {
      // Storage access exception safeguard
    }
    return {
      ...profileData,
      completionPercentage: calculateProfileCompletion(profileData),
      updatedAt: new Date().toISOString(),
    }
  },

  /**
   * Resets student profile to default demo baseline.
   *
   * @returns {Promise<object>}
   */
  async resetProfile() {
    if (isApiConfigured()) {
      return apiClient.post(`${STUDENT_ENDPOINTS.PROFILE}/reset`)
    }

    try {
      localStorage.setItem(STUDENT_PROFILE_STORAGE_KEY, JSON.stringify(initialStudentProfile))
    } catch {
      // Storage access exception safeguard
    }
    return initialStudentProfile
  },

  /**
   * Calculates the percentage score of profile completeness across all monitored fields.
   *
   * @param {object} profileData
   * @returns {number} 0 - 100
   */
  getProfileCompletion(profileData) {
    return calculateProfileCompletion(profileData)
  },
}

export default studentService
