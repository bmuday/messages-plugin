/**
 * Pinia Store Setup
 * Creates Pinia instance for state management
 */

import { createPinia } from 'pinia'

/**
 * Create Pinia store instance
 * Each Vue app (overlay, popup) gets its own instance
 */
export function createStore() {
  return createPinia()
}

export default createStore
