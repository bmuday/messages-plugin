/**
 * Reactions Store
 * Manages reactions for the current page
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { EMOJIS } from '@/utils/emoji-constants.js'

export const useReactionsStore = defineStore('reactions', () => {
  // State
  const currentPageReactions = ref([])
  const userReaction = ref(null)
  const reactionCounts = ref({})
  const isLoading = ref(false)
  const error = ref(null)
  const currentPageId = ref(null)

  // Getters
  const totalReactions = computed(() => currentPageReactions.value.length)

  const reactionsByEmoji = computed(() => {
    return currentPageReactions.value.reduce((acc, reaction) => {
      const emoji = reaction.emoji
      if (!acc[emoji]) {
        acc[emoji] = []
      }
      acc[emoji].push(reaction)
      return acc
    }, {})
  })

  const hasUserReacted = computed(() => userReaction.value !== null)

  const userReactionEmoji = computed(() => userReaction.value?.emoji || null)

  // Actions
  async function fetchReactionsForPage(pageId, options = {}) {
    isLoading.value = true
    error.value = null
    currentPageId.value = pageId

    try {
      const response = await sendMessage('REACTION_GET_FOR_PAGE', { pageId, options })

      if (response.success) {
        currentPageReactions.value = response.data
        updateReactionCounts()
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch reactions:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUserReaction(pageId, userId) {
    try {
      const response = await sendMessage('REACTION_GET_USER_FOR_PAGE', { pageId, userId })

      if (response.success) {
        userReaction.value = response.data
      }
    } catch (err) {
      console.error('Failed to fetch user reaction:', err)
    }
  }

  async function addReaction(pageId, emoji, comment, communityId, userId) {
    isLoading.value = true
    error.value = null

    try {
      // If user already has a reaction, update it
      if (userReaction.value) {
        return await updateReaction(userReaction.value.$id, { emoji, comment })
      }

      // Create new reaction
      const response = await sendMessage('REACTION_CREATE', {
        pageId,
        emoji,
        comment,
        communityId,
        userId
      })

      if (response.success) {
        const newReaction = response.data
        currentPageReactions.value.unshift(newReaction)
        userReaction.value = newReaction
        updateReactionCounts()
        return newReaction
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateReaction(reactionId, updates) {
    isLoading.value = true
    error.value = null

    try {
      const response = await sendMessage('REACTION_UPDATE', { reactionId, updates })

      if (response.success) {
        const updatedReaction = response.data

        // Update in list
        const index = currentPageReactions.value.findIndex(r => r.$id === reactionId)
        if (index !== -1) {
          currentPageReactions.value[index] = updatedReaction
        }

        // Update user reaction if it's the user's
        if (userReaction.value?.$id === reactionId) {
          userReaction.value = updatedReaction
        }

        updateReactionCounts()
        return updatedReaction
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteReaction(reactionId) {
    isLoading.value = true
    error.value = null

    try {
      const response = await sendMessage('REACTION_DELETE', { reactionId })

      if (response.success) {
        // Remove from list
        currentPageReactions.value = currentPageReactions.value.filter(r => r.$id !== reactionId)

        // Clear user reaction if it's the user's
        if (userReaction.value?.$id === reactionId) {
          userReaction.value = null
        }

        updateReactionCounts()
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function toggleEmoji(pageId, emoji, communityId, userId) {
    // If user has this emoji, remove reaction
    if (userReaction.value?.emoji === emoji) {
      await deleteReaction(userReaction.value.$id)
    } else {
      // Add or update reaction
      await addReaction(pageId, emoji, '', communityId, userId)
    }
  }

  function updateReactionCounts() {
    const counts = {}
    EMOJIS.forEach(({ emoji }) => {
      counts[emoji] = 0
    })

    currentPageReactions.value.forEach(reaction => {
      const emoji = reaction.emoji
      counts[emoji] = (counts[emoji] || 0) + 1
    })

    reactionCounts.value = counts
  }

  function handleRealtimeUpdate(event) {
    // Handle realtime events from Appwrite
    const { type, payload } = event

    if (type === 'create') {
      currentPageReactions.value.unshift(payload)
      updateReactionCounts()
    } else if (type === 'update') {
      const index = currentPageReactions.value.findIndex(r => r.$id === payload.$id)
      if (index !== -1) {
        currentPageReactions.value[index] = payload
        updateReactionCounts()
      }
    } else if (type === 'delete') {
      currentPageReactions.value = currentPageReactions.value.filter(r => r.$id !== payload.$id)
      updateReactionCounts()
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    currentPageReactions,
    userReaction,
    reactionCounts,
    isLoading,
    error,
    currentPageId,
    // Getters
    totalReactions,
    reactionsByEmoji,
    hasUserReacted,
    userReactionEmoji,
    // Actions
    fetchReactionsForPage,
    fetchUserReaction,
    addReaction,
    updateReaction,
    deleteReaction,
    toggleEmoji,
    handleRealtimeUpdate,
    clearError
  }
})

/**
 * Helper to send messages to background worker
 */
function sendMessage(type, data = {}) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type, data }, (response) => {
      resolve(response)
    })
  })
}
