/**
 * Community service
 * Handles community management
 */

import { databases, databaseId, Query } from './appwrite.js'
import { COLLECTIONS } from '@/config/appwrite-config.js'

/**
 * Get all communities
 * @returns {Promise<Array>} Array of community documents
 */
export async function getAllCommunities() {
  try {
    const response = await databases.listDocuments(
      databaseId,
      COLLECTIONS.COMMUNITIES,
      [
        Query.orderAsc('name'),
        Query.limit(100)
      ]
    )

    return response.documents
  } catch (error) {
    console.error('Get all communities failed:', error)
    return []
  }
}

/**
 * Get community by slug
 * @param {string} slug - Community slug
 * @returns {Promise<Object|null>} Community document or null
 */
export async function getCommunityBySlug(slug) {
  try {
    const response = await databases.listDocuments(
      databaseId,
      COLLECTIONS.COMMUNITIES,
      [
        Query.equal('slug', slug),
        Query.limit(1)
      ]
    )

    return response.documents[0] || null
  } catch (error) {
    console.error('Get community by slug failed:', error)
    return null
  }
}

/**
 * Get community by ID
 * @param {string} communityId - Community document ID
 * @returns {Promise<Object|null>} Community document or null
 */
export async function getCommunityById(communityId) {
  try {
    const community = await databases.getDocument(
      databaseId,
      COLLECTIONS.COMMUNITIES,
      communityId
    )
    return community
  } catch (error) {
    console.error('Get community by ID failed:', error)
    return null
  }
}

/**
 * Join a community (add to user's communities list)
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @returns {Promise<void>}
 */
export async function joinCommunity(userId, communityId) {
  try {
    // This would update the user's communities array
    // Implementation depends on how you store user-community relationships
    // For now, this is a placeholder
    console.log(`User ${userId} joined community ${communityId}`)
  } catch (error) {
    console.error('Join community failed:', error)
    throw error
  }
}

/**
 * Leave a community
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @returns {Promise<void>}
 */
export async function leaveCommunity(userId, communityId) {
  try {
    // This would remove from the user's communities array
    // Implementation depends on how you store user-community relationships
    // For now, this is a placeholder
    console.log(`User ${userId} left community ${communityId}`)
  } catch (error) {
    console.error('Leave community failed:', error)
    throw error
  }
}

export default {
  getAllCommunities,
  getCommunityBySlug,
  getCommunityById,
  joinCommunity,
  leaveCommunity
}
