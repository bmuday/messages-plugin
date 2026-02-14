<template>
  <div class="user-profile">
    <div class="profile-header">
      <div class="avatar-large">
        {{ userInitial }}
      </div>
      <h2 class="username">{{ authStore.user?.username || 'User' }}</h2>
      <p class="email">{{ authStore.user?.email }}</p>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="stat-value">0</div>
        <div class="stat-label">Reactions</div>
      </div>
      <div class="stat">
        <div class="stat-value">{{ authStore.user?.communities?.length || 0 }}</div>
        <div class="stat-label">Communities</div>
      </div>
    </div>

    <div class="communities-section">
      <h3>Your Communities</h3>
      <div v-if="communitiesStore.allCommunities.length === 0" class="empty">
        <p>No communities yet</p>
      </div>
      <div v-else class="community-list">
        <div
          v-for="community in communitiesStore.allCommunities"
          :key="community.$id"
          class="community-badge"
          :style="{ borderColor: community.color }"
        >
          <span class="community-icon">{{ community.icon }}</span>
          <span class="community-name">{{ community.name }}</span>
        </div>
      </div>
    </div>

    <button class="button secondary" @click="handleLogout">
      Logout
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import { useCommunitiesStore } from '@/store/communities.js'

const authStore = useAuthStore()
const communitiesStore = useCommunitiesStore()

const userInitial = computed(() => {
  const username = authStore.user?.username || authStore.user?.email || 'U'
  return username.charAt(0).toUpperCase()
})

onMounted(async () => {
  await communitiesStore.fetchCommunities()
})

async function handleLogout() {
  await authStore.logout()
}
</script>

<style scoped>
.user-profile {
  padding: 24px;
}

.profile-header {
  text-align: center;
  margin-bottom: 24px;
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  margin: 0 auto 12px;
}

.username {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.email {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.stats {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat {
  flex: 1;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.communities-section {
  margin-bottom: 24px;
}

.communities-section h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.community-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.community-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: white;
  border: 2px solid;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.community-icon {
  font-size: 16px;
}

.empty {
  text-align: center;
  padding: 20px;
  color: #9ca3af;
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

.button.secondary {
  background: #f3f4f6;
  color: #1f2937;
}

.button.secondary:hover {
  background: #e5e7eb;
}
</style>
