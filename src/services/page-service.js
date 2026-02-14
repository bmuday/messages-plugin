/**
 * Page service
 * Handles page tracking and management
 */

import { databases, databaseId, Query } from './appwrite.js'
import { COLLECTIONS } from '@/config/appwrite-config.js'
import { normalizeUrl, hashUrl, extractDomain } from '@/utils/url-utils.js'
import { ID } from 'appwrite'

/**
 * Create or get page by URL
 * If page exists, return it. Otherwise, create new page.
 * @param {string} url - Page URL
 * @param {string} title - Page title
 * @returns {Promise<Object>} Page document
 */
export async function createOrGetPage(url, title) {
  try {
    const normalizedUrl = normalizeUrl(url)
    const urlHash = await hashUrl(normalizedUrl)
    const domain = extractDomain(normalizedUrl)

    // Try to find existing page
    const existingPages = await databases.listDocuments(
      databaseId,
      COLLECTIONS.PAGES,
      [
        Query.equal('urlHash', urlHash),
        Query.limit(1)
      ]
    )

    if (existingPages.documents.length > 0) {
      // Update last activity
      const page = existingPages.documents[0]
      await databases.updateDocument(
        databaseId,
        COLLECTIONS.PAGES,
        page.$id,
        {
          lastActivityAt: new Date().toISOString()
        }
      )
      return page
    }

    // Create new page
    const now = new Date().toISOString()
    const newPage = await databases.createDocument(
      databaseId,
      COLLECTIONS.PAGES,
      ID.unique(),
      {
        urlHash,
        normalizedUrl,
        pageTitle: title || domain,
        domain,
        totalReactions: 0,
        reactionBreakdown: JSON.stringify({}),
        firstSeenAt: now,
        lastActivityAt: now
      }
    )

    return newPage
  } catch (error) {
    console.error('Create or get page failed:', error)
    throw error
  }
}

/**
 * Get page by URL hash
 * @param {string} urlHash - SHA-256 hash of normalized URL
 * @returns {Promise<Object|null>} Page document or null
 */
export async function getPageByHash(urlHash) {
  try {
    const pages = await databases.listDocuments(
      databaseId,
      COLLECTIONS.PAGES,
      [
        Query.equal('urlHash', urlHash),
        Query.limit(1)
      ]
    )

    return pages.documents[0] || null
  } catch (error) {
    console.error('Get page by hash failed:', error)
    return null
  }
}

/**
 * Update page statistics
 * @param {string} pageId - Page document ID
 * @param {Object} reactionCounts - Emoji counts object
 * @returns {Promise<Object>} Updated page document
 */
export async function updatePageStats(pageId, reactionCounts) {
  try {
    const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + count, 0)

    const page = await databases.updateDocument(
      databaseId,
      COLLECTIONS.PAGES,
      pageId,
      {
        totalReactions,
        reactionBreakdown: JSON.stringify(reactionCounts),
        lastActivityAt: new Date().toISOString()
      }
    )

    return page
  } catch (error) {
    console.error('Update page stats failed:', error)
    throw error
  }
}

/**
 * Get trending pages
 * @param {string} period - "24h", "7d", or "30d"
 * @param {number} limit - Number of results
 * @returns {Promise<Array>} Array of page documents
 */
export async function getTrendingPages(period = '24h', limit = 20) {
  try {
    // For now, just get pages sorted by total reactions
    // In production, use trending collection with calculated scores
    const pages = await databases.listDocuments(
      databaseId,
      COLLECTIONS.PAGES,
      [
        Query.orderDesc('totalReactions'),
        Query.limit(limit)
      ]
    )

    return pages.documents
  } catch (error) {
    console.error('Get trending pages failed:', error)
    return []
  }
}

/**
 * Get page by ID
 * @param {string} pageId - Page document ID
 * @returns {Promise<Object|null>} Page document or null
 */
export async function getPageById(pageId) {
  try {
    const page = await databases.getDocument(
      databaseId,
      COLLECTIONS.PAGES,
      pageId
    )
    return page
  } catch (error) {
    console.error('Get page by ID failed:', error)
    return null
  }
}

export default {
  createOrGetPage,
  getPageByHash,
  updatePageStats,
  getTrendingPages,
  getPageById
}
