/**
 * Utility functions for URL normalization and hashing
 * Critical for tracking reactions across URL variations
 */

/**
 * Common tracking parameters to remove from URLs
 */
const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'msclkid',
  'ref', 'source', 'campaign_id',
  '_ga', '_gid', '_gl',
  'mc_cid', 'mc_eid'
]

/**
 * Normalize a URL for consistent tracking
 * Removes tracking parameters, normalizes protocol, lowercase domain
 *
 * @param {string} url - The URL to normalize
 * @returns {string} - Normalized URL
 */
export function normalizeUrl(url) {
  try {
    const urlObj = new URL(url)

    // Normalize protocol (http -> https for common domains)
    if (urlObj.protocol === 'http:' && !urlObj.hostname.includes('localhost')) {
      urlObj.protocol = 'https:'
    }

    // Lowercase hostname
    urlObj.hostname = urlObj.hostname.toLowerCase()

    // Remove tracking parameters
    const searchParams = new URLSearchParams(urlObj.search)
    TRACKING_PARAMS.forEach(param => searchParams.delete(param))

    // Sort remaining parameters for consistency
    const sortedParams = new URLSearchParams(
      [...searchParams.entries()].sort((a, b) => a[0].localeCompare(b[0]))
    )

    urlObj.search = sortedParams.toString()

    // Remove hash fragment (unless needed for SPA routing)
    // Keep hash if it looks like a route (starts with #/ or #!)
    if (urlObj.hash && !urlObj.hash.match(/^#[!/]/)) {
      urlObj.hash = ''
    }

    // Remove trailing slash from pathname (unless it's just "/")
    if (urlObj.pathname !== '/' && urlObj.pathname.endsWith('/')) {
      urlObj.pathname = urlObj.pathname.slice(0, -1)
    }

    return urlObj.toString()
  } catch (error) {
    console.error('Failed to normalize URL:', error)
    return url
  }
}

/**
 * Generate SHA-256 hash of a string
 * Used for creating unique page IDs from URLs
 *
 * @param {string} str - The string to hash
 * @returns {Promise<string>} - Hex string of the hash
 */
export async function hashString(str) {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * Generate URL hash for database key
 *
 * @param {string} url - The URL to hash
 * @returns {Promise<string>} - SHA-256 hash of normalized URL
 */
export async function hashUrl(url) {
  const normalized = normalizeUrl(url)
  return await hashString(normalized)
}

/**
 * Extract domain from URL
 *
 * @param {string} url - The URL to parse
 * @returns {string} - The hostname
 */
export function extractDomain(url) {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch (error) {
    console.error('Failed to extract domain:', error)
    return ''
  }
}

/**
 * Extract page title from URL (fallback if document.title not available)
 *
 * @param {string} url - The URL to parse
 * @returns {string} - Simple title from URL
 */
export function extractTitleFromUrl(url) {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname

    // Remove leading/trailing slashes and get last segment
    const segments = pathname.split('/').filter(s => s.length > 0)
    if (segments.length === 0) {
      return urlObj.hostname
    }

    // Get last segment and clean it up
    const lastSegment = segments[segments.length - 1]
    return lastSegment
      .replace(/[-_]/g, ' ')
      .replace(/\.[^.]+$/, '') // Remove file extension
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  } catch (error) {
    return 'Unknown Page'
  }
}

/**
 * Check if URL is valid
 *
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid
 */
export function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
