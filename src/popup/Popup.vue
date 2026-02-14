<template>
  <div class="popup-container">
    <!-- Header -->
    <header class="popup-header">
      <div class="logo">
        <span class="logo-icon">🎭</span>
        <h1 class="logo-text">EmojiFeed</h1>
      </div>
    </header>

    <!-- Authentication Required -->
    <div v-if="!authStore.isAuthenticated" class="auth-container">
      <div class="auth-form">
        <h2>{{ isLoginMode ? 'Sign In' : 'Sign Up' }}</h2>

        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="input"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="input"
        />

        <input
          v-if="!isLoginMode"
          v-model="username"
          type="text"
          placeholder="Username"
          class="input"
        />

        <button
          class="button primary"
          :disabled="authStore.isLoading"
          @click="handleAuth"
        >
          {{ authStore.isLoading ? 'Loading...' : (isLoginMode ? 'Sign In' : 'Sign Up') }}
        </button>

        <p class="error" v-if="authStore.error">{{ authStore.error }}</p>

        <p class="switch-mode">
          {{ isLoginMode ? "Don't have an account?" : 'Already have an account?' }}
          <a @click="isLoginMode = !isLoginMode">
            {{ isLoginMode ? 'Sign Up' : 'Sign In' }}
          </a>
        </p>
      </div>
    </div>

    <!-- Main Content (Authenticated) -->
    <div v-else class="main-content">
      <!-- Tabs -->
      <nav class="tabs">
        <button
          class="tab"
          :class="{ active: activeTab === 'profile' }"
          @click="activeTab = 'profile'"
        >
          Profile
        </button>
        <button
          class="tab"
          :class="{ active: activeTab === 'trending' }"
          @click="activeTab = 'trending'"
        >
          Trending
        </button>
        <button
          class="tab"
          :class="{ active: activeTab === 'settings' }"
          @click="activeTab = 'settings'"
        >
          Settings
        </button>
      </nav>

      <!-- Tab Content -->
      <div class="tab-content">
        <UserProfile v-if="activeTab === 'profile'" />
        <TrendingPages v-else-if="activeTab === 'trending'" />
        <Settings v-else-if="activeTab === 'settings'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import UserProfile from './components/UserProfile.vue'
import TrendingPages from './components/TrendingPages.vue'
import Settings from './components/Settings.vue'

// Stores
const authStore = useAuthStore()

// State
const activeTab = ref('profile')
const isLoginMode = ref(true)
const email = ref('')
const password = ref('')
const username = ref('')

// Initialize
onMounted(async () => {
  await authStore.checkSession()
})

// Methods
async function handleAuth() {
  try {
    if (isLoginMode.value) {
      await authStore.login(email.value, password.value)
    } else {
      await authStore.register(email.value, password.value, username.value)
    }

    // Clear form
    email.value = ''
    password.value = ''
    username.value = ''
  } catch (error) {
    console.error('Auth failed:', error)
  }
}
</script>

<style scoped>
.popup-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f9fafb;
}

.popup-header {
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.auth-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-form {
  width: 100%;
  max-width: 320px;
}

.auth-form h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #1f2937;
  text-align: center;
}

.input {
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: #6366f1;
}

.button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.button.primary {
  background: #6366f1;
  color: white;
}

.button.primary:hover {
  background: #4f46e5;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  margin-top: 12px;
  padding: 8px 12px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 13px;
}

.switch-mode {
  margin-top: 16px;
  text-align: center;
  font-size: 13px;
  color: #6b7280;
}

.switch-mode a {
  color: #6366f1;
  cursor: pointer;
  text-decoration: none;
}

.switch-mode a:hover {
  text-decoration: underline;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tabs {
  display: flex;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.tab {
  flex: 1;
  padding: 12px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
}

.tab:hover {
  color: #1f2937;
}

.tab.active {
  color: #6366f1;
  border-bottom-color: #6366f1;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  background: white;
}
</style>
