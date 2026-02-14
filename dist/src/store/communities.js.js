/**
 * Communities Store
 * Manages community data and selection
 */

import { defineStore } from "/vendor/.vite-deps-pinia.js__v--55807594.js"
import { ref, computed } from "/vendor/.vite-deps-vue.js__v--bbf8ba7d.js"

export const useCommunitiesStore = defineStore('communities', () => {
  // State
  const allCommunities = ref([])
  const selectedCommunityId = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const selectedCommunity = computed(() => {
    if (!selectedCommunityId.value) return null
    return allCommunities.value.find(c => c.$id === selectedCommunityId.value)
  })

  const availableCommunities = computed(() => allCommunities.value)

  // Actions
  async function fetchCommunities() {
    isLoading.value = true
    error.value = null

    try {
      const response = await sendMessage('COMMUNITY_GET_ALL')

      if (response.success) {
        allCommunities.value = response.data
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch communities:', err)
    } finally {
      isLoading.value = false
    }
  }

  function selectCommunity(communityId) {
    selectedCommunityId.value = communityId
  }

  function clearSelection() {
    selectedCommunityId.value = null
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    allCommunities,
    selectedCommunityId,
    isLoading,
    error,
    // Getters
    selectedCommunity,
    availableCommunities,
    // Actions
    fetchCommunities,
    selectCommunity,
    clearSelection,
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
