/**
 * Scholarship Match - Document Management API Service
 *
 * Handles student document listing, category filtering, file uploads (multipart/form-data),
 * verification status tracking, and document deletion.
 *
 * BACKEND INTEGRATION NOTE:
 * When VITE_API_BASE_URL is active, methods make network requests.
 * In Demo Mode, documents persist to localStorage ('scholarship_student_documents')
 * initialized with initialDocumentsList.
 */

import { apiClient, isApiConfigured } from './api.js'
import {
  initialDocuments,
  DOCUMENT_CATEGORIES,
  DOCUMENT_STATUSES,
} from '../data/documentsData.js'

export const DOCUMENTS_STORAGE_KEY = 'scholarship_documents_list'

/**
 * Proposed document backend endpoints.
 */
export const DOCUMENT_ENDPOINTS = {
  LIST: '/documents',
  DETAIL: (id) => `/documents/${encodeURIComponent(id)}`,
  UPLOAD: '/documents/upload',
  STATS: '/documents/stats',
}

export const documentService = {
  /**
   * Retrieves user documents, optionally filtered by category.
   *
   * @param {string} category - Category filter (e.g. 'All Documents', 'Academic Documents', etc.)
   * @returns {Promise<Array<object>>}
   */
  async getDocuments(category = 'All Documents') {
    if (isApiConfigured()) {
      return apiClient.get(DOCUMENT_ENDPOINTS.LIST, { category })
    }

    // Demo Mode Fallback: read from localStorage
    let docs
    try {
      const saved = localStorage.getItem(DOCUMENTS_STORAGE_KEY)
      docs = saved ? JSON.parse(saved) : initialDocuments
    } catch {
      docs = initialDocuments
    }

    if (category && category !== 'All Documents' && category !== 'all') {
      const catLower = category.toLowerCase()
      docs = docs.filter(
        (doc) => doc.category && doc.category.toLowerCase().includes(catLower)
      )
    }

    return docs
  },

  /**
   * Retrieves single document record.
   *
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async getDocumentById(id) {
    if (isApiConfigured()) {
      return apiClient.get(DOCUMENT_ENDPOINTS.DETAIL(id))
    }

    const docs = await this.getDocuments('All Documents')
    return docs.find((d) => d.id === id) || null
  },

  /**
   * Uploads a new document with metadata.
   *
   * @param {File} file - Browser File instance
   * @param {object} metadata - { category, documentType, notes }
   * @returns {Promise<object>}
   */
  async uploadDocument(file, metadata = {}) {
    if (isApiConfigured()) {
      const formData = new FormData()
      formData.append('file', file)
      Object.entries(metadata).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })
      return apiClient.upload(DOCUMENT_ENDPOINTS.UPLOAD, formData)
    }

    // Demo Mode Fallback: register record locally
    const docs = await this.getDocuments('All Documents')
    const sizeInKb = Math.round(file.size / 1024)
    const formattedSize =
      sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`

    const newDoc = {
      id: `doc-demo-${Date.now()}`,
      name: metadata.documentType || file.name.replace(/\.[^/.]+$/, ''),
      fileName: file.name,
      fileSize: formattedSize,
      fileType: file.type?.includes('pdf') ? 'PDF' : 'JPG/PNG',
      category: metadata.category || 'Academic Documents',
      status: DOCUMENT_STATUSES.PENDING,
      verifiedBy: 'Pending University Review',
      uploadDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      uploadDateIso: new Date().toISOString(),
      description: metadata.notes || 'Uploaded credential pending administrator verification.',
      uploadedFile: file,
      previewUrl: URL.createObjectURL(file),
      isDemo: true,
    }

    const updated = [newDoc, ...docs]
    try {
      // Exclude non-serializable File/Blob when storing in localStorage
      const serializableDocs = updated.map((doc) => {
        const copy = { ...doc }
        delete copy.uploadedFile
        delete copy.previewUrl
        return copy
      })
      localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(serializableDocs))
    } catch {
      // Storage access exception safeguard
    }
    return newDoc
  },

  /**
   * Deletes a document record.
   *
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteDocument(id) {
    if (isApiConfigured()) {
      await apiClient.delete(DOCUMENT_ENDPOINTS.DETAIL(id))
      return true
    }

    // Demo Mode Fallback
    const docs = await this.getDocuments('All Documents')
    const updated = docs.filter((d) => d.id !== id)
    try {
      localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Storage access exception safeguard
    }
    return true
  },

  /**
   * Retrieves summary counts for the documents overview cards.
   *
   * @returns {Promise<{ total: number, verified: number, pending: number, missing: number }>}
   */
  async getDocumentStats() {
    if (isApiConfigured()) {
      return apiClient.get(DOCUMENT_ENDPOINTS.STATS)
    }

    // Demo Mode Fallback
    const docs = await this.getDocuments('All Documents')
    return {
      total: docs.length,
      verified: docs.filter(
        (d) => d.status === DOCUMENT_STATUSES.VERIFIED || d.status?.toLowerCase() === 'verified'
      ).length,
      pending: docs.filter(
        (d) =>
          d.status === DOCUMENT_STATUSES.PENDING ||
          d.status?.toLowerCase() === 'pending verification' ||
          d.status?.toLowerCase() === 'pending'
      ).length,
      missing: docs.filter(
        (d) => d.status === DOCUMENT_STATUSES.MISSING || d.status?.toLowerCase() === 'missing'
      ).length,
    }
  },

  /**
   * Returns list of configured document categories.
   *
   * @returns {Array<string>}
   */
  getCategories() {
    return DOCUMENT_CATEGORIES
  },
}

export default documentService
