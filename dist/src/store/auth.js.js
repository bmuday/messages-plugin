/**
 * Authentication Store
 * Manages user authentication state
 */

import { defineStore } from "/vendor/.vite-deps-pinia.js__v--55807594.js"
import { ref, computed } from "/vendor/.vite-deps-vue.js__v--bbf8ba7d.js"

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const currentUser = computed(() => user.value)
  const isLoggedIn = computed(() => isAuthenticated.value)

  // Actions
  async function login(email, password) {
    isLoading.value = true
    error.value = null

    try {
      const response = await sendMessage('AUTH_LOGIN', { email, password })

      if (response.success) {
        user.value = response.data.user
        isAuthenticated.value = true
        return response.data
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

  async function register(email, password, username) {
    isLoading.value = true
    error.value = null

    try {
      const response = await sendMessage('AUTH_REGISTER', { email, password, username })

      if (response.success) {
        user.value = response.data.user
        isAuthenticated.value = true
        return response.data
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

  async function logout() {
    isLoading.value = true
    error.value = null

    try {
      const response = await sendMessage('AUTH_LOGOUT')

      if (response.success) {
        user.value = null
        isAuthenticated.value = false
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      error.value = err.message
      // Clear state anyway
      user.value = null
      isAuthenticated.value = false
    } finally {
      isLoading.value = false
    }
  }

  async function checkSession() {
    isLoading.value = true

    try {
      const response = await sendMessage('AUTH_GET_CURRENT_USER')

      if (response.success && response.data) {
        user.value = response.data
        isAuthenticated.value = true
      } else {
        user.value = null
        isAuthenticated.value = false
      }
    } catch (err) {
      user.value = null
      isAuthenticated.value = false
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    // Getters
    currentUser,
    isLoggedIn,
    // Actions
    login,
    register,
    logout,
    checkSession,
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
