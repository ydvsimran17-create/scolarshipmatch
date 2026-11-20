/**
 * Scholarship Match - Centralized API Service Configuration & HTTP Client
 *
 * Provides a standardized fetch wrapper with:
 * - Environment-driven Base URL resolution (import.meta.env.VITE_API_BASE_URL)
 * - Configurable request timeout with AbortController
 * - Automatic Authorization header injection from localStorage
 * - JSON and FormData body handling
 * - Normalized ApiError abstraction for predictable error states
 */

const env =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : typeof globalThis !== 'undefined' && globalThis.process?.env
      ? globalThis.process.env
      : {}

export const API_BASE_URL = (env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '')
export const API_TIMEOUT_MS = Number(env.VITE_API_TIMEOUT_MS) || 15000
export const AUTH_TOKEN_KEY = 'scholarship_auth_token'

/**
 * Checks whether the backend API base URL is configured.
 * When false, the application operates in standalone demo mode.
 * @returns {boolean}
 */
export function isApiConfigured() {
  return Boolean(API_BASE_URL && API_BASE_URL.length > 0)
}

/**
 * Retrieves the stored authentication token from localStorage.
 * @returns {string|null}
 */
export function getAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  } catch {
    return null
  }
}

/**
 * Stores the authentication token in localStorage.
 * @param {string} token
 */
export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    }
  } catch {
    // Storage access exception safeguard
  }
}

/**
 * Removes the stored authentication token.
 */
export function removeAuthToken() {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  } catch {
    // Storage access exception safeguard
  }
}

/**
 * Standardized API Error class for consistent error inspection across components.
 */
export class ApiError extends Error {
  constructor(message, status = 0, data = null, url = '') {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
    this.url = url
  }
}

/**
 * Internal core request dispatcher using native fetch.
 *
 * @param {string} endpoint - API path (e.g. '/scholarships')
 * @param {object} options - Fetch options including method, headers, params, body
 * @returns {Promise<any>}
 */
async function request(endpoint, options = {}) {
  if (!isApiConfigured()) {
    throw new ApiError(
      'Backend API is not configured. VITE_API_BASE_URL is unset.',
      0,
      null,
      endpoint
    )
  }

  const { params, headers = {}, body, timeout = API_TIMEOUT_MS, ...fetchOptions } = options

  // 1. Construct final URL with query parameters
  const sanitizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  let url = `${API_BASE_URL}${sanitizedEndpoint}`

  if (params && typeof params === 'object') {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString
    }
  }

  // 2. Prepare headers & credentials
  const finalHeaders = new Headers(headers)
  if (!finalHeaders.has('Accept')) {
    finalHeaders.set('Accept', 'application/json')
  }

  const token = getAuthToken()
  if (token && !finalHeaders.has('Authorization')) {
    finalHeaders.set('Authorization', `Bearer ${token}`)
  }

  // Set Content-Type for JSON payloads unless using FormData
  let finalBody = body
  if (body && !(body instanceof FormData) && typeof body === 'object') {
    if (!finalHeaders.has('Content-Type')) {
      finalHeaders.set('Content-Type', 'application/json')
    }
    finalBody = JSON.stringify(body)
  }

  // 3. Timeout controller
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: finalHeaders,
      body: finalBody,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // Parse response body safely
    let responseData = null
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      try {
        responseData = await response.json()
      } catch {
        responseData = null
      }
    } else {
      responseData = await response.text()
    }

    if (!response.ok) {
      const errorMessage =
        (responseData && (responseData.message || responseData.error)) ||
        `Request failed with status ${response.status}`
      throw new ApiError(errorMessage, response.status, responseData, url)
    }

    return responseData
  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      throw new ApiError(`Request timed out after ${timeout}ms`, 408, null, url)
    }
    if (err instanceof ApiError) {
      throw err
    }
    throw new ApiError(err.message || 'Network error occurred', 0, null, url)
  }
}

/**
 * Reusable API Client Interface
 */
export const apiClient = {
  get(endpoint, params = null, options = {}) {
    return request(endpoint, { method: 'GET', params, ...options })
  },

  post(endpoint, data = null, options = {}) {
    return request(endpoint, { method: 'POST', body: data, ...options })
  },

  put(endpoint, data = null, options = {}) {
    return request(endpoint, { method: 'PUT', body: data, ...options })
  },

  patch(endpoint, data = null, options = {}) {
    return request(endpoint, { method: 'PATCH', body: data, ...options })
  },

  delete(endpoint, options = {}) {
    return request(endpoint, { method: 'DELETE', ...options })
  },

  upload(endpoint, formData, options = {}) {
    return request(endpoint, {
      method: 'POST',
      body: formData,
      ...options,
    })
  },
}

export default apiClient
