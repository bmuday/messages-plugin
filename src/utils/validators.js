/**
 * Input validation utilities
 */

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate username
 * Must be 3-50 characters, alphanumeric, underscores, hyphens
 * @param {string} username
 * @returns {boolean}
 */
export function isValidUsername(username) {
  if (!username || username.length < 3 || username.length > 50) {
    return false
  }
  const usernameRegex = /^[a-zA-Z0-9_-]+$/
  return usernameRegex.test(username)
}

/**
 * Validate password
 * Must be at least 8 characters
 * @param {string} password
 * @returns {boolean}
 */
export function isValidPassword(password) {
  return password && password.length >= 8
}

/**
 * Validate comment length
 * @param {string} comment
 * @param {number} maxLength - Default 280
 * @returns {boolean}
 */
export function isValidComment(comment, maxLength = 280) {
  return comment && comment.trim().length > 0 && comment.length <= maxLength
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} str
 * @returns {string}
 */
export function sanitizeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}
