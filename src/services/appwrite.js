/**
 * Appwrite SDK client initialization
 * Used across background service worker and content scripts
 */

import { Client, Account, Databases, Query } from 'appwrite'
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  validateConfig
} from '@/config/appwrite-config.js'

// Validate configuration on load
validateConfig()

/**
 * Initialize Appwrite client
 */
export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)

/**
 * Appwrite services
 */
export const account = new Account(client)
export const databases = new Databases(client)

/**
 * Database ID
 */
export const databaseId = APPWRITE_DATABASE_ID

/**
 * Re-export Query for convenience
 */
export { Query }

/**
 * Helper to set session from JWT
 */
export function setSession(jwt) {
  client.setJWT(jwt)
}

/**
 * Helper to clear session
 */
export function clearSession() {
  client.setJWT('')
}

export default {
  client,
  account,
  databases,
  databaseId,
  Query,
  setSession,
  clearSession
}
