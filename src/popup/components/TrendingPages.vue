<template>
  <div class="trending-pages">
    <div class="period-selector">
      <button
        v-for="option in periodOptions"
        :key="option.value"
        class="period-button"
        :class="{ active: selectedPeriod === option.value }"
        @click="selectPeriod(option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <div v-if="isLoading" class="loading">
      <p>Loading trending pages...</p>
    </div>

    <div v-else-if="trendingPages.length === 0" class="empty">
      <p>No trending pages yet</p>
    </div>

    <div v-else class="page-list">
      <div
        v-for="page in trendingPages"
        :key="page.$id"
        class="page-card"
        @click="openPage(page.normalizedUrl)"
      >
        <h3 class="page-title">{{ page.pageTitle }}</h3>
        <p class="page-domain">{{ page.domain }}</p>
        <div class="page-stats">
          <span class="reaction-count">
            🎭 {{ page.totalReactions }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const periodOptions = [
  { value: '24h', label: '24h' },
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' }
]

const selectedPeriod = ref('24h')
const trendingPages = ref([])
const isLoading = ref(false)

onMounted(async () => {
  await fetchTrendingPages()
})

async function selectPeriod(period) {
  selectedPeriod.value = period
  await fetchTrendingPages()
}

async function fetchTrendingPages() {
  isLoading.value = true

  try {
    const response = await sendMessage('PAGE_GET_TRENDING', {
      period: selectedPeriod.value,
      limit: 20
    })

    if (response.success) {
      trendingPages.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch trending pages:', error)
  } finally {
    isLoading.value = false
  }
}

function openPage(url) {
  chrome.tabs.create({ url })
}

function sendMessage(type, data = {}) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type, data }, (response) => {
      resolve(response)
    })
  })
}
</script>

<style scoped>
.trending-pages {
  padding: 16px;
}

.period-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.period-button {
  flex: 1;
  padding: 8px 16px;
  background: #f3f4f6;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
}

.period-button:hover {
  background: #e5e7eb;
}

.period-button.active {
  background: white;
  border-color: #6366f1;
  color: #6366f1;
}

.loading,
.empty {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.page-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.page-card {
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-card:hover {
  border-color: #6366f1;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
}

.page-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-domain {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #9ca3af;
}

.page-stats {
  display: flex;
  gap: 12px;
}

.reaction-count {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}
</style>
