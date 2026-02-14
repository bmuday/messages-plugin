/**
 * Chrome Storage API wrapper
 * Provides simple interface for storing and retrieving data
 */

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  SESSION: 'emojifeed_session',
  USER: 'emojifeed_user',
  SELECTED_COMMUNITY: 'emojifeed_selected_community',
  SETTINGS: 'emojifeed_settings'
}

/**
 * Get item from Chrome storage
 * @param {string} key
 * @returns {Promise<any>}
 */
export async function get(key) {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      const result = await chrome.storage.sync.get(key)
      return result[key]
    }
    // Fallback to localStorage for testing
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.error('Storage get error:', error)
    return null
  }
}

/**
 * Set item in Chrome storage
 * @param {string} key
 * @param {any} value
 * @returns {Promise<void>}
 */
export async function set(key, value) {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.sync.set({ [key]: value })
    } else {
      // Fallback to localStorage for testing
      localStorage.setItem(key, JSON.stringify(value))
    }
  } catch (error) {
    console.error('Storage set error:', error)
  }
}

/**
 * Remove item from Chrome storage
 * @param {string} key
 * @returns {Promise<void>}
 */
export async function remove(key) {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.sync.remove(key)
    } else {
      // Fallback to localStorage for testing
      localStorage.removeItem(key)
    }
  } catch (error) {
    console.error('Storage remove error:', error)
  }
}

/**
 * Clear all EmojiFeed data from storage
 * @returns {Promise<void>}
 */
export async function clear() {
  const keys = Object.values(STORAGE_KEYS)
  try {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.sync.remove(keys)
    } else {
      keys.forEach(key => localStorage.removeItem(key))
    }
  } catch (error) {
    console.error('Storage clear error:', error)
  }
}

/**
 * Get session data
 * @returns {Promise<Object|null>}
 */
export async function getSession() {
  return await get(STORAGE_KEYS.SESSION)
}

/**
 * Set session data
 * @param {Object} session
 * @returns {Promise<void>}
 */
export async function setSession(session) {
  await set(STORAGE_KEYS.SESSION, session)
}

/**
 * Remove session data
 * @returns {Promise<void>}
 */
export async function removeSession() {
  await remove(STORAGE_KEYS.SESSION)
}

/**
 * Get user data
 * @returns {Promise<Object|null>}
 */
export async function getUser() {
  return await get(STORAGE_KEYS.USER)
}

/**
 * Set user data
 * @param {Object} user
 * @returns {Promise<void>}
 */
export async function setUser(user) {
  await set(STORAGE_KEYS.USER, user)
}

/**
 * Remove user data
 * @returns {Promise<void>}
 */
export async function removeUser() {
  await remove(STORAGE_KEYS.USER)
}

export default {
  get,
  set,
  remove,
  clear,
  getSession,
  setSession,
  removeSession,
  getUser,
  setUser,
  removeUser,
  STORAGE_KEYS
}
