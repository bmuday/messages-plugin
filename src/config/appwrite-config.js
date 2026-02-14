/**
 * Appwrite configuration
 * Load from environment variables
 */

export const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'
export const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
export const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID

/**
 * Collection IDs
 */
export const COLLECTIONS = {
  USERS: 'users',
  COMMUNITIES: 'communities',
  PAGES: 'pages',
  REACTIONS: 'reactions',
  TRENDING: 'trending'
}

/**
 * Validate configuration
 */
export function validateConfig() {
  if (!APPWRITE_PROJECT_ID) {
    console.error('VITE_APPWRITE_PROJECT_ID is not set in environment variables')
    return false
  }
  if (!APPWRITE_DATABASE_ID) {
    console.error('VITE_APPWRITE_DATABASE_ID is not set in environment variables')
    return false
  }
  return true
}
