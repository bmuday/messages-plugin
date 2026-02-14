/**
 * UI Store
 * Manages UI state (panel open/closed, etc.)
 */

import { defineStore } from "/vendor/.vite-deps-pinia.js__v--55807594.js"
import { ref } from "/vendor/.vite-deps-vue.js__v--bbf8ba7d.js"

export const useUiStore = defineStore('ui', () => {
  // State
  const isPanelOpen = ref(false)
  const isLoading = ref(false)
  const error = ref(null)
  const notification = ref(null)

  // Actions
  function togglePanel() {
    isPanelOpen.value = !isPanelOpen.value
  }

  function openPanel() {
    isPanelOpen.value = true
  }

  function closePanel() {
    isPanelOpen.value = false
  }

  function setLoading(loading) {
    isLoading.value = loading
  }

  function setError(errorMessage) {
    error.value = errorMessage
  }

  function clearError() {
    error.value = null
  }

  function showNotification(message, type = 'info') {
    notification.value = { message, type }

    // Auto-clear after 3 seconds
    setTimeout(() => {
      notification.value = null
    }, 3000)
  }

  function clearNotification() {
    notification.value = null
  }

  return {
    // State
    isPanelOpen,
    isLoading,
    error,
    notification,
    // Actions
    togglePanel,
    openPanel,
    closePanel,
    setLoading,
    setError,
    clearError,
    showNotification,
    clearNotification
  }
})
