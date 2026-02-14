/**
 * Overlay Injector
 * Creates Shadow DOM and mounts Vue app into it
 * This isolates our UI from the host page's CSS
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import OverlayApp from '../components/overlay/OverlayApp.vue'

/**
 * Inject overlay into page
 * @param {Object} pageData - Current page data
 * @returns {Object} Vue app instance
 */
export async function injectOverlay(pageData) {
  // Create container div
  const container = document.createElement('div')
  container.id = 'emojifeed-root'
  container.style.cssText = 'position: fixed; z-index: 2147483647; top: 0; left: 0; width: 0; height: 0;'

  // Attach shadow DOM (closed mode for security)
  const shadowRoot = container.attachShadow({ mode: 'closed' })

  // Create mount point inside shadow DOM
  const mountPoint = document.createElement('div')
  mountPoint.id = 'app'
  shadowRoot.appendChild(mountPoint)

  // Inject styles into shadow DOM
  const styleElement = document.createElement('style')
  styleElement.textContent = getOverlayStyles()
  shadowRoot.appendChild(styleElement)

  // Create Vue app instance
  const pinia = createPinia()
  const app = createApp(OverlayApp, {
    pageData
  })

  app.use(pinia)

  // Mount app to shadow DOM
  app.mount(mountPoint)

  // Append container to body
  document.body.appendChild(container)

  console.log('Vue app mounted in shadow DOM')

  return {
    app,
    shadowRoot,
    container,
    unmount: () => {
      app.unmount()
      container.remove()
    }
  }
}

/**
 * Get overlay styles
 * These styles are injected into shadow DOM
 */
function getOverlayStyles() {
  return `
    /* CSS Reset for Shadow DOM */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    /* CSS Variables */
    :host {
      --primary-color: #6366f1;
      --primary-hover: #4f46e5;
      --background: #ffffff;
      --text: #1f2937;
      --text-light: #6b7280;
      --border: #e5e7eb;
      --shadow: rgba(0, 0, 0, 0.1);
      --shadow-lg: rgba(0, 0, 0, 0.15);
      --danger: #ef4444;
      --success: #10b981;
      --warning: #f59e0b;
    }

    /* Typography */
    #app {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: var(--text);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Floating Button */
    .floating-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px var(--shadow-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      z-index: 1000;
    }

    .floating-button:hover {
      background: var(--primary-hover);
      transform: scale(1.05);
    }

    .floating-button:active {
      transform: scale(0.95);
    }

    /* Badge */
    .badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: var(--danger);
      color: white;
      border-radius: 12px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: 600;
      min-width: 20px;
      text-align: center;
    }

    /* Panel */
    .reaction-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 400px;
      height: 100vh;
      background: var(--background);
      box-shadow: -4px 0 24px var(--shadow-lg);
      display: flex;
      flex-direction: column;
      z-index: 1001;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    }

    .reaction-panel.open {
      transform: translateX(0);
    }

    /* Panel Header */
    .panel-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .panel-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text);
    }

    .close-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      color: var(--text-light);
      transition: color 0.2s;
    }

    .close-button:hover {
      color: var(--text);
    }

    /* Panel Body */
    .panel-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px 20px;
    }

    /* Emoji Picker */
    .emoji-picker {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }

    .emoji-button {
      flex: 1;
      padding: 12px;
      background: var(--background);
      border: 2px solid var(--border);
      border-radius: 8px;
      cursor: pointer;
      font-size: 24px;
      transition: all 0.2s;
      position: relative;
    }

    .emoji-button:hover {
      border-color: var(--primary-color);
      transform: scale(1.05);
    }

    .emoji-button.active {
      border-color: var(--primary-color);
      background: rgba(99, 102, 241, 0.1);
    }

    .emoji-count {
      position: absolute;
      bottom: 4px;
      right: 4px;
      font-size: 10px;
      font-weight: 600;
      color: var(--text-light);
    }

    /* Comment Input */
    .comment-input {
      margin-bottom: 20px;
    }

    .comment-textarea {
      width: 100%;
      min-height: 80px;
      padding: 12px;
      border: 2px solid var(--border);
      border-radius: 8px;
      resize: vertical;
      font-family: inherit;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .comment-textarea:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .comment-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
    }

    .char-counter {
      font-size: 12px;
      color: var(--text-light);
    }

    .submit-button {
      padding: 8px 16px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s;
    }

    .submit-button:hover {
      background: var(--primary-hover);
    }

    .submit-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Comment List */
    .comment-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .comment-item {
      padding: 12px;
      background: var(--background);
      border: 1px solid var(--border);
      border-radius: 8px;
    }

    .comment-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }

    .comment-username {
      font-weight: 600;
      font-size: 14px;
    }

    .comment-time {
      font-size: 12px;
      color: var(--text-light);
      margin-left: auto;
    }

    .comment-emoji {
      font-size: 20px;
      margin-bottom: 4px;
    }

    .comment-text {
      font-size: 14px;
      color: var(--text);
      line-height: 1.5;
    }

    /* Loading */
    .loading {
      text-align: center;
      padding: 20px;
      color: var(--text-light);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-light);
    }

    /* Animations */
    @keyframes slideIn {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    /* Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: var(--text-light);
    }
  `
}
