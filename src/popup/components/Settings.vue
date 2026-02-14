<template>
  <div class="settings">
    <div class="setting-section">
      <h3>Default Community</h3>
      <select v-model="defaultCommunity" class="select">
        <option :value="null">None</option>
        <option
          v-for="community in communitiesStore.allCommunities"
          :key="community.$id"
          :value="community.$id"
        >
          {{ community.icon }} {{ community.name }}
        </option>
      </select>
    </div>

    <div class="setting-section">
      <h3>Notifications</h3>
      <label class="checkbox-label">
        <input type="checkbox" v-model="notificationsEnabled" />
        <span>Enable notifications</span>
      </label>
    </div>

    <div class="setting-section">
      <h3>About</h3>
      <p class="about-text">
        EmojiFeed v1.0.0<br />
        Share emoji reactions on any webpage with communities.
      </p>
      <a
        href="https://github.com/your-repo/emojifeed"
        target="_blank"
        class="link"
      >
        View on GitHub
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCommunitiesStore } from '@/store/communities.js'

const communitiesStore = useCommunitiesStore()

const defaultCommunity = ref(null)
const notificationsEnabled = ref(true)

onMounted(async () => {
  await communitiesStore.fetchCommunities()

  // Load settings from storage
  const settings = await getSettings()
  if (settings) {
    defaultCommunity.value = settings.defaultCommunity
    notificationsEnabled.value = settings.notificationsEnabled ?? true
  }
})

async function getSettings() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { type: 'STORAGE_GET', data: { key: 'emojifeed_settings' } },
      (response) => {
        resolve(response.success ? response.data : null)
      }
    )
  })
}
</script>

<style scoped>
.settings {
  padding: 24px;
}

.setting-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.setting-section:last-child {
  border-bottom: none;
}

.setting-section h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.select {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #4b5563;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.about-text {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
}

.link {
  color: #6366f1;
  text-decoration: none;
  font-size: 14px;
}

.link:hover {
  text-decoration: underline;
}
</style>
