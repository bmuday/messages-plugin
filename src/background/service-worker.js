/**
 * Background Service Worker (Manifest V3)
 * Central message router for EmojiFeed extension
 * Handles communication between content scripts, popup, and Appwrite backend
 */

import authService from '../services/auth-service.js'
import reactionService from '../services/reaction-service.js'
import pageService from '../services/page-service.js'
import communityService from '../services/community-service.js'
import storageService from '../services/storage-service.js'

console.log('EmojiFeed background service worker loaded')

/**
 * Message types
 */
const MESSAGE_TYPES = {
  // Auth
  AUTH_LOGIN: 'AUTH_LOGIN',
  AUTH_REGISTER: 'AUTH_REGISTER',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  AUTH_GET_SESSION: 'AUTH_GET_SESSION',
  AUTH_GET_CURRENT_USER: 'AUTH_GET_CURRENT_USER',

  // Reactions
  REACTION_CREATE: 'REACTION_CREATE',
  REACTION_UPDATE: 'REACTION_UPDATE',
  REACTION_DELETE: 'REACTION_DELETE',
  REACTION_GET_FOR_PAGE: 'REACTION_GET_FOR_PAGE',
  REACTION_GET_USER_FOR_PAGE: 'REACTION_GET_USER_FOR_PAGE',
  REACTION_GET_COUNTS: 'REACTION_GET_COUNTS',

  // Pages
  PAGE_CREATE_OR_GET: 'PAGE_CREATE_OR_GET',
  PAGE_GET_TRENDING: 'PAGE_GET_TRENDING',
  PAGE_UPDATE_STATS: 'PAGE_UPDATE_STATS',

  // Communities
  COMMUNITY_GET_ALL: 'COMMUNITY_GET_ALL',
  COMMUNITY_GET_BY_ID: 'COMMUNITY_GET_BY_ID',

  // Storage
  STORAGE_GET: 'STORAGE_GET',
  STORAGE_SET: 'STORAGE_SET'
}

/**
 * Message handler
 * Routes messages to appropriate service methods
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, data } = message

  console.log('Background received message:', type, data)

  // Handle message asynchronously
  handleMessage(type, data)
    .then(result => {
      sendResponse({ success: true, data: result })
    })
    .catch(error => {
      console.error(`Error handling ${type}:`, error)
      sendResponse({ success: false, error: error.message })
    })

  // Return true to indicate async response
  return true
})

/**
 * Handle incoming messages
 */
async function handleMessage(type, data) {
  switch (type) {
    // Authentication
    case MESSAGE_TYPES.AUTH_LOGIN:
      return await authService.login(data.email, data.password)

    case MESSAGE_TYPES.AUTH_REGISTER:
      return await authService.register(data.email, data.password, data.username)

    case MESSAGE_TYPES.AUTH_LOGOUT:
      return await authService.logout()

    case MESSAGE_TYPES.AUTH_GET_SESSION:
      return await authService.getSession()

    case MESSAGE_TYPES.AUTH_GET_CURRENT_USER:
      return await authService.getCurrentUser()

    // Reactions
    case MESSAGE_TYPES.REACTION_CREATE:
      return await reactionService.createReaction(
        data.pageId,
        data.emoji,
        data.comment,
        data.communityId,
        data.userId
      )

    case MESSAGE_TYPES.REACTION_UPDATE:
      return await reactionService.updateReaction(data.reactionId, data.updates)

    case MESSAGE_TYPES.REACTION_DELETE:
      return await reactionService.deleteReaction(data.reactionId)

    case MESSAGE_TYPES.REACTION_GET_FOR_PAGE:
      return await reactionService.getReactionsForPage(data.pageId, data.options)

    case MESSAGE_TYPES.REACTION_GET_USER_FOR_PAGE:
      return await reactionService.getUserReactionForPage(data.pageId, data.userId)

    case MESSAGE_TYPES.REACTION_GET_COUNTS:
      return await reactionService.getReactionCounts(data.pageId)

    // Pages
    case MESSAGE_TYPES.PAGE_CREATE_OR_GET:
      return await pageService.createOrGetPage(data.url, data.title)

    case MESSAGE_TYPES.PAGE_GET_TRENDING:
      return await pageService.getTrendingPages(data.period, data.limit)

    case MESSAGE_TYPES.PAGE_UPDATE_STATS:
      return await pageService.updatePageStats(data.pageId, data.reactionCounts)

    // Communities
    case MESSAGE_TYPES.COMMUNITY_GET_ALL:
      return await communityService.getAllCommunities()

    case MESSAGE_TYPES.COMMUNITY_GET_BY_ID:
      return await communityService.getCommunityById(data.communityId)

    // Storage
    case MESSAGE_TYPES.STORAGE_GET:
      return await storageService.get(data.key)

    case MESSAGE_TYPES.STORAGE_SET:
      await storageService.set(data.key, data.value)
      return { success: true }

    default:
      throw new Error(`Unknown message type: ${type}`)
  }
}

/**
 * Listen for extension installation
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('EmojiFeed installed:', details.reason)

  if (details.reason === 'install') {
    // First install - could show welcome page
    console.log('Welcome to EmojiFeed!')
  } else if (details.reason === 'update') {
    // Extension updated
    console.log('EmojiFeed updated to', chrome.runtime.getManifest().version)
  }
})

/**
 * Keep service worker alive
 * Manifest V3 service workers can be terminated at any time
 */
chrome.alarms.create('keepAlive', { periodInMinutes: 1 })

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    // Ping to keep alive
    console.log('Service worker keepalive ping')
  }
})

/**
 * Handle tab updates (optional - for future features)
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Could notify content script of URL change
    console.log('Tab updated:', tab.url)
  }
})
