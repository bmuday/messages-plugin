/**
 * Popup Entry Point
 * Initializes Vue app for extension popup
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Popup from './Popup.vue'

console.log('EmojiFeed popup loading...')

// Create Pinia instance
const pinia = createPinia()

// Create Vue app
const app = createApp(Popup)

// Use Pinia
app.use(pinia)

// Mount app
app.mount('#app')

console.log('EmojiFeed popup loaded')
