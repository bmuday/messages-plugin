/**
 * Reaction service
 * Handles CRUD operations for reactions
 */

import { databases, databaseId, Query } from './appwrite.js'
import { COLLECTIONS } from '@/config/appwrite-config.js'
import { ID } from 'appwrite'

/**
 * Create a new reaction
 * @param {string} pageId - Page document ID
 * @param {string} emoji - Emoji character
 * @param {string} comment - Optional comment text
 * @param {string} communityId - Community ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Created reaction document
 */
export async function createReaction(pageId, emoji, comment, communityId, userId) {
  try {
    const now = new Date().toISOString()

    const reaction = await databases.createDocument(
      databaseId,
      COLLECTIONS.REACTIONS,
      ID.unique(),
      {
        pageId,
        userId,
        communityId,
        emoji,
        comment: comment || '',
        createdAt: now,
        updatedAt: now
      }
    )

    return reaction
  } catch (error) {
    console.error('Create reaction failed:', error)
    throw error
  }
}

/**
 * Update an existing reaction
 * @param {string} reactionId - Reaction document ID
 * @param {Object} updates - Fields to update (emoji, comment)
 * @returns {Promise<Object>} Updated reaction document
 */
export async function updateReaction(reactionId, updates) {
  try {
    const reaction = await databases.updateDocument(
      databaseId,
      COLLECTIONS.REACTIONS,
      reactionId,
      {
        ...updates,
        updatedAt: new Date().toISOString()
      }
    )

    return reaction
  } catch (error) {
    console.error('Update reaction failed:', error)
    throw error
  }
}

/**
 * Delete a reaction
 * @param {string} reactionId - Reaction document ID
 * @returns {Promise<void>}
 */
export async function deleteReaction(reactionId) {
  try {
    await databases.deleteDocument(
      databaseId,
      COLLECTIONS.REACTIONS,
      reactionId
    )
  } catch (error) {
    console.error('Delete reaction failed:', error)
    throw error
  }
}

/**
 * Get reactions for a specific page
 * @param {string} pageId - Page document ID
 * @param {Object} options - Query options
 * @param {string} options.communityId - Filter by community
 * @param {number} options.limit - Limit results
 * @param {number} options.offset - Offset for pagination
 * @returns {Promise<Array>} Array of reaction documents
 */
export async function getReactionsForPage(pageId, options = {}) {
  try {
    const { communityId, limit = 50, offset = 0 } = options

    const queries = [
      Query.equal('pageId', pageId),
      Query.orderDesc('createdAt'),
      Query.limit(limit),
      Query.offset(offset)
    ]

    if (communityId) {
      queries.push(Query.equal('communityId', communityId))
    }

    const response = await databases.listDocuments(
      databaseId,
      COLLECTIONS.REACTIONS,
      queries
    )

    return response.documents
  } catch (error) {
    console.error('Get reactions for page failed:', error)
    throw error
  }
}

/**
 * Get user's reaction for a specific page
 * @param {string} pageId - Page document ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User's reaction or null
 */
export async function getUserReactionForPage(pageId, userId) {
  try {
    const response = await databases.listDocuments(
      databaseId,
      COLLECTIONS.REACTIONS,
      [
        Query.equal('pageId', pageId),
        Query.equal('userId', userId),
        Query.limit(1)
      ]
    )

    return response.documents[0] || null
  } catch (error) {
    console.error('Get user reaction failed:', error)
    return null
  }
}

/**
 * Get reaction count by emoji for a page
 * @param {string} pageId - Page document ID
 * @returns {Promise<Object>} Object with emoji counts
 */
export async function getReactionCounts(pageId) {
  try {
    // Get all reactions for page
    const reactions = await getReactionsForPage(pageId, { limit: 1000 })

    // Count by emoji
    const counts = reactions.reduce((acc, reaction) => {
      const emoji = reaction.emoji
      acc[emoji] = (acc[emoji] || 0) + 1
      return acc
    }, {})

    return counts
  } catch (error) {
    console.error('Get reaction counts failed:', error)
    return {}
  }
}

export default {
  createReaction,
  updateReaction,
  deleteReaction,
  getReactionsForPage,
  getUserReactionForPage,
  getReactionCounts
}
