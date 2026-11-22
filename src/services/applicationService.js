/**
 * Scholarship Match - Application Tracking API Service
 *
 * Handles scholarship application submission, tracking, status timeline retrieval,
 * and application stage statistics.
 *
 * BACKEND INTEGRATION NOTE:
 * When VITE_API_BASE_URL is active, queries dispatch to backend endpoints.
 * In Demo Mode, operations read and write to localStorage ('scholarship_user_applications')
 * initialized with initialApplicationsList.
 */

import { apiClient, isApiConfigured } from './api.js'
import { sampleApplications, APPLICATION_STATUSES } from '../data/applicationsData.js'

export const APPLICATIONS_STORAGE_KEY = 'scholarship_user_applications'

/**
 * Proposed application backend endpoints.
 */
export const APPLICATION_ENDPOINTS = {
  LIST: '/applications',
  DETAIL: (id) => `/applications/${encodeURIComponent(id)}`,
  CREATE: '/applications',
  UPDATE: (id) => `/applications/${encodeURIComponent(id)}`,
  STATS: '/applications/stats',
}

export const applicationService = {
  /**
   * Retrieves user applications, optionally filtered by status tab or keyword.
   *
   * @param {object} filters - { status, search }
   * @returns {Promise<Array<object>>}
   */
  async getApplications(filters = {}) {
    if (isApiConfigured()) {
      return apiClient.get(APPLICATION_ENDPOINTS.LIST, filters)
    }

    // Demo Mode Fallback: read from localStorage
    let apps
    try {
      const saved = localStorage.getItem(APPLICATIONS_STORAGE_KEY)
      apps = saved ? JSON.parse(saved) : sampleApplications
    } catch {
      apps = sampleApplications
    }

    if (filters.status && filters.status !== 'All' && filters.status !== 'all') {
      const targetStatus = filters.status.toLowerCase()
      apps = apps.filter(
        (app) => (app.status && app.status.toLowerCase() === targetStatus)
      )
    }

    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim()
      apps = apps.filter(
        (app) =>
          (app.scholarshipName && app.scholarshipName.toLowerCase().includes(q)) ||
          (app.provider && app.provider.toLowerCase().includes(q)) ||
          (app.referenceId && app.referenceId.toLowerCase().includes(q)) ||
          (app.applicationNumber && app.applicationNumber.toLowerCase().includes(q))
      )
    }

    return apps
  },

  /**
   * Retrieves a single application record with its timeline milestones.
   *
   * @param {string} applicationId
   * @returns {Promise<object|null>}
   */
  async getApplicationById(applicationId) {
    if (isApiConfigured()) {
      return apiClient.get(APPLICATION_ENDPOINTS.DETAIL(applicationId))
    }

    // Demo Mode Fallback
    const apps = await this.getApplications()
    return apps.find((app) => app.id === applicationId) || null
  },

  /**
   * Submits a new scholarship application.
   *
   * @param {object} applicationData - Application payload
   * @returns {Promise<object>}
   */
  async createApplication(applicationData) {
    if (isApiConfigured()) {
      return apiClient.post(APPLICATION_ENDPOINTS.CREATE, applicationData)
    }

    // Demo Mode Fallback: generate tracking record and save
    const current = await this.getApplications()
    const refNum = `SM-2026-${Math.floor(100000 + Math.random() * 900000)}`
    const nowIso = new Date().toISOString()
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })

    const newRecord = {
      id: `app-demo-${Date.now()}`,
      referenceId: refNum,
      applicationNumber: refNum,
      status: APPLICATION_STATUSES.SUBMITTED,
      statusLabel: 'Submitted',
      submissionDate: formattedDate,
      submissionDateIso: nowIso,
      lastUpdated: 'Just now',
      lastUpdatedIso: nowIso,
      progressTimeline: [
        {
          stage: 'Application Submitted',
          date: formattedDate,
          state: 'completed',
          description: 'Application successfully received and registered in portal.',
        },
        {
          stage: 'Document Verification',
          date: 'Pending',
          state: 'in-progress',
          description: 'Nodal verification of submitted transcripts and certificates.',
        },
      ],
      ...applicationData,
    }

    const updated = [newRecord, ...current]
    try {
      localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Storage access exception safeguard
    }
    return newRecord
  },

  /**
   * Updates an application status or internal notes.
   *
   * @param {string} applicationId
   * @param {object} updates
   * @returns {Promise<object>}
   */
  async updateApplication(applicationId, updates) {
    if (isApiConfigured()) {
      return apiClient.put(APPLICATION_ENDPOINTS.UPDATE(applicationId), updates)
    }

    // Demo Mode Fallback
    const apps = await this.getApplications()
    const index = apps.findIndex((a) => a.id === applicationId)
    if (index === -1) {
      throw new Error(`Application with ID "${applicationId}" not found.`)
    }

    const updatedItem = {
      ...apps[index],
      ...updates,
      lastUpdated: 'Just now',
      lastUpdatedIso: new Date().toISOString(),
    }
    apps[index] = updatedItem
    try {
      localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(apps))
    } catch {
      // Storage access exception safeguard
    }
    return updatedItem
  },

  /**
   * Retrieves summary counts for the application overview cards.
   *
   * @returns {Promise<{ total: number, submitted: number, underReview: number, actionRequired: number }>}
   */
  async getApplicationStats() {
    if (isApiConfigured()) {
      return apiClient.get(APPLICATION_ENDPOINTS.STATS)
    }

    // Demo Mode Fallback
    const apps = await this.getApplications()
    return {
      total: apps.length,
      submitted: apps.filter(
        (a) => a.status === APPLICATION_STATUSES.SUBMITTED || a.status?.toLowerCase() === 'submitted'
      ).length,
      underReview: apps.filter(
        (a) => a.status === APPLICATION_STATUSES.UNDER_REVIEW || a.status?.toLowerCase() === 'under review'
      ).length,
      actionRequired: apps.filter(
        (a) => a.status === APPLICATION_STATUSES.ACTION_REQUIRED || a.status?.toLowerCase() === 'action required'
      ).length,
    }
  },
}

export default applicationService
