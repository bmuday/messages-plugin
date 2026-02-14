/**
 * Content Script Entry Point
 * Injected into every web page
 * Creates shadow DOM and mounts Vue overlay app
 */

import { normalizeUrl, hashUrl } from '../utils/url-utils.js'
import { injectOverlay } from './overlay-injector.js'

console.log('EmojiFeed content script loaded on:', window.location.href)

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

let overlayApp = null
let currentPageData = null

/**
 * Initialize EmojiFeed on the page
 */
async function init() {
  try {
    // Get current page info
    currentPageData = await getCurrentPageData()

    console.log('EmojiFeed initializing for page:', currentPageData)

    // Create or get page in database via background worker
    const pageResponse = await sendMessage('PAGE_CREATE_OR_GET', {
      url: currentPageData.url,
      title: currentPageData.title
    })

    if (!pageResponse.success) {
      console.error('Failed to create/get page:', pageResponse.error)
      return
    }

    currentPageData.pageId = pageResponse.data.$id

    // Inject overlay UI
    overlayApp = await injectOverlay(currentPageData)

    console.log('EmojiFeed overlay injected successfully')
  } catch (error) {
    console.error('EmojiFeed initialization failed:', error)
  }
}

/**
 * Get current page data
 */
async function getCurrentPageData() {
  const url = window.location.href
  const normalizedUrl = normalizeUrl(url)
  const urlHash = await hashUrl(normalizedUrl)
  const title = document.title || 'Untitled Page'

  return {
    url: normalizedUrl,
    urlHash,
    title,
    pageId: null // Will be set after creating/getting page
  }
}

/**
 * Send message to background service worker
 */
async function sendMessage(type, data) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type, data }, (response) => {
      resolve(response)
    })
  })
}

/**
 * Listen for URL changes (for SPAs)
 */
let lastUrl = window.location.href
const urlObserver = new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href
    console.log('URL changed to:', lastUrl)

    // Reinitialize for new page
    if (overlayApp) {
      overlayApp.unmount()
    }
    init()
  }
})

// Start observing
urlObserver.observe(document.body, {
  childList: true,
  subtree: true
})

/**
 * Listen for messages from background worker
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message)

  // Handle realtime updates, etc.
  if (message.type === 'REALTIME_EVENT') {
    // Forward to overlay app
    if (overlayApp && overlayApp.handleRealtimeEvent) {
      overlayApp.handleRealtimeEvent(message.data)
    }
  }

  sendResponse({ received: true })
  return true
})

// Export for debugging
window.__emojifeed = {
  currentPageData,
  overlayApp,
  sendMessage
}
