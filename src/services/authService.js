/**
 * Scholarship Match - Authentication API Service
 *
 * Handles student authentication, registration, session validation, and token persistence.
 *
 * BACKEND INTEGRATION NOTE:
 * When VITE_API_BASE_URL is configured, these methods dispatch HTTP calls via apiClient.
 * When in Demo Mode (VITE_API_BASE_URL is unset), methods return sample student session data
 * without triggering network errors, allowing frontend development to proceed smoothly.
 */

import { apiClient, isApiConfigured, getAuthToken, setAuthToken, removeAuthToken } from './api.js'
import { studentProfile } from '../data/dashboardData.js'

/**
 * Proposed backend endpoint paths.
 * The backend developer can adjust these mappings if their route names differ.
 */
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
}

export const authService = {
  /**
   * Authenticates an existing student.
   *
   * @param {object} credentials - { email, password }
   * @returns {Promise<{ user: object, token: string }>}
   */
  async login(credentials) {
    if (isApiConfigured()) {
      const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, credentials)
      if (response?.token) {
        setAuthToken(response.token)
      }
      return response
    }

    // Demo Mode Fallback: simulate successful session
    const demoToken = 'demo_jwt_token_anvaya_sharma'
    setAuthToken(demoToken)
    return {
      user: studentProfile,
      token: demoToken,
      isDemo: true,
    }
  },

  /**
   * Registers a new student account.
   *
   * @param {object} userData - { fullName, email, password, phone, institution }
   * @returns {Promise<{ user: object, token: string }>}
   */
  async register(userData) {
    if (isApiConfigured()) {
      const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, userData)
      if (response?.token) {
        setAuthToken(response.token)
      }
      return response
    }

    // Demo Mode Fallback
    const demoToken = 'demo_jwt_token_new_user'
    setAuthToken(demoToken)
    return {
      user: {
        ...studentProfile,
        name: userData.fullName || studentProfile.name,
        firstName: (userData.fullName || studentProfile.name).split(' ')[0],
      },
      token: demoToken,
      isDemo: true,
    }
  },

  /**
   * Retrieves the currently authenticated student profile session.
   *
   * @returns {Promise<object>}
   */
  async getCurrentUser() {
    if (isApiConfigured()) {
      return apiClient.get(AUTH_ENDPOINTS.ME)
    }

    // Demo Mode Fallback
    return studentProfile
  },

  /**
   * Logs out the current student and clears credentials.
   *
   * @returns {Promise<void>}
   */
  async logout() {
    if (isApiConfigured()) {
      try {
        await apiClient.post(AUTH_ENDPOINTS.LOGOUT)
      } catch {
        // Proceed with local cleanup even if remote logout fails
      }
    }
    removeAuthToken()
  },

  /**
   * Checks whether an active authentication token exists.
   *
   * @returns {boolean}
   */
  isAuthenticated() {
    return Boolean(getAuthToken())
  },

  /**
   * Exposes raw token accessors
   */
  getToken: getAuthToken,
  setToken: setAuthToken,
}

export default authService
