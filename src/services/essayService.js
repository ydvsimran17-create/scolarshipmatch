/**
 * Scholarship Match - AI Essay Assistant API Service
 *
 * Handles AI-powered essay generation, smart rewriting (improve flow, shorten, expand),
 * and essay draft saving/retrieval.
 *
 * BACKEND INTEGRATION NOTE:
 * When VITE_API_BASE_URL is set, methods communicate with the backend LLM endpoints.
 * In Demo Mode, operations use client-side templates from mockGenerateEssayDraft
 * and mockRewriteEssay, persisting drafts to localStorage ('scholarship_ai_essay_drafts').
 */

import { apiClient, isApiConfigured } from './api.js'
import {
  generateMockDraft,
  improveDraftText,
  shortenDraftText,
  expandDraftText,
  ESSAY_TYPES,
  WRITING_TONES,
  WORD_LIMITS,
  ESSAY_PROMPTS,
  initialSavedDrafts,
} from '../data/essayData.js'

export const ESSAY_DRAFTS_STORAGE_KEY = 'scholarship_essay_drafts'

/**
 * Proposed AI essay backend endpoints.
 */
export const ESSAY_ENDPOINTS = {
  GENERATE: '/ai/essay/generate',
  REWRITE: '/ai/essay/rewrite',
  DRAFTS: '/ai/essay/drafts',
  DRAFT_DETAIL: (id) => `/ai/essay/drafts/${encodeURIComponent(id)}`,
}

export const essayService = {
  /**
   * Generates a tailored scholarship essay draft.
   *
   * @param {object} config - { essayType, scholarshipName, topic, tone, wordLimit, useProfileContext, studentProfile }
   * @returns {Promise<{ draft: string, generatedAt: string, wordCount: number }>}
   */
  async generateEssayDraft(config = {}) {
    if (isApiConfigured()) {
      return apiClient.post(ESSAY_ENDPOINTS.GENERATE, config)
    }

    // Demo Mode Fallback: use simulated dynamic essay generator
    const draftText = generateMockDraft({
      essayType: config.essayType || config.scholarshipType || 'Statement of Purpose',
      scholarshipName: config.scholarshipName || 'Scholarship Award',
      topic: config.topic || config.prompt || ESSAY_PROMPTS['Statement of Purpose'],
      tone: config.tone || 'Professional',
      wordLimit: config.wordLimit || config.wordCount || 500,
      useProfileContext: config.useProfileContext ?? true,
      studentProfile: config.studentProfile || null,
    })
    const words = draftText.trim().split(/\s+/).filter(Boolean).length
    return {
      draft: draftText,
      generatedAt: new Date().toISOString(),
      wordCount: words,
      config,
    }
  },

  /**
   * Rewrites an existing essay draft with a targeted refinement action.
   *
   * @param {string} text - Current essay text
   * @param {'improve'|'shorten'|'expand'} action - Rewrite goal
   * @returns {Promise<{ draft: string, action: string, wordCount: number }>}
   */
  async rewriteEssay(text, action) {
    if (isApiConfigured()) {
      return apiClient.post(ESSAY_ENDPOINTS.REWRITE, { text, action })
    }

    // Demo Mode Fallback
    let rewritten
    switch (action) {
      case 'improve':
        rewritten = improveDraftText(text)
        break
      case 'shorten':
        rewritten = shortenDraftText(text)
        break
      case 'expand':
        rewritten = expandDraftText(text)
        break
      default:
        rewritten = text || ''
    }

    const words = rewritten.trim().split(/\s+/).filter(Boolean).length
    return {
      draft: rewritten,
      action,
      wordCount: words,
    }
  },

  /**
   * Retrieves all saved essay drafts.
   *
   * @returns {Promise<Array<object>>}
   */
  async getSavedDrafts() {
    if (isApiConfigured()) {
      return apiClient.get(ESSAY_ENDPOINTS.DRAFTS)
    }

    // Demo Mode Fallback
    try {
      const saved = localStorage.getItem(ESSAY_DRAFTS_STORAGE_KEY)
      return saved ? JSON.parse(saved) : initialSavedDrafts
    } catch {
      return initialSavedDrafts
    }
  },

  /**
   * Saves or updates an essay draft.
   *
   * @param {object} draft - { title, content, essayType, scholarshipName, wordCount }
   * @returns {Promise<object>}
   */
  async saveDraft(draft) {
    if (isApiConfigured()) {
      return apiClient.post(ESSAY_ENDPOINTS.DRAFTS, draft)
    }

    // Demo Mode Fallback
    const drafts = await this.getSavedDrafts()
    const newDraft = {
      id: draft.id || `draft-demo-${Date.now()}`,
      title: draft.title || 'Untitled Essay Draft',
      content: draft.content || '',
      essayType: draft.essayType || 'Statement of Purpose',
      scholarshipName: draft.scholarshipName || 'Scholarship Award',
      wordCount: (draft.content || '').trim().split(/\s+/).filter(Boolean).length,
      savedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    const filtered = drafts.filter((d) => d.id !== newDraft.id)
    const updated = [newDraft, ...filtered]
    try {
      localStorage.setItem(ESSAY_DRAFTS_STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Storage access exception safeguard
    }
    return newDraft
  },

  /**
   * Deletes a saved essay draft.
   *
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteDraft(id) {
    if (isApiConfigured()) {
      await apiClient.delete(ESSAY_ENDPOINTS.DRAFT_DETAIL(id))
      return true
    }

    // Demo Mode Fallback
    const drafts = await this.getSavedDrafts()
    const updated = drafts.filter((d) => d.id !== id)
    try {
      localStorage.setItem(ESSAY_DRAFTS_STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Storage access exception safeguard
    }
    return true
  },

  /**
   * Options accessors for essay configuration forms
   */
  getEssayTypes() {
    return ESSAY_TYPES
  },
  getPrompts() {
    return ESSAY_PROMPTS
  },
  getTones() {
    return WRITING_TONES
  },
  getWordLimits() {
    return WORD_LIMITS
  },
}

export default essayService
