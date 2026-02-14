<template>
  <div id="emojifeed-overlay">
    <FloatingButton
      :count="reactionsStore.totalReactions"
      @click="uiStore.togglePanel"
    />

    <ReactionPanel
      v-if="uiStore.isPanelOpen"
      :page-data="pageData"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import { useReactionsStore } from '@/store/reactions.js'
import { useCommunitiesStore } from '@/store/communities.js'
import { useUiStore } from '@/store/ui.js'
import FloatingButton from './FloatingButton.vue'
import ReactionPanel from './ReactionPanel.vue'

const props = defineProps({
  pageData: {
    type: Object,
    required: true
  }
})

// Stores
const authStore = useAuthStore()
const reactionsStore = useReactionsStore()
const communitiesStore = useCommunitiesStore()
const uiStore = useUiStore()

// Initialize on mount
onMounted(async () => {
  console.log('OverlayApp mounted for page:', props.pageData)

  // Check authentication
  await authStore.checkSession()

  // Fetch communities
  await communitiesStore.fetchCommunities()

  // Fetch reactions for this page
  if (props.pageData.pageId) {
    await reactionsStore.fetchReactionsForPage(props.pageData.pageId)

    // Fetch user's reaction if authenticated
    if (authStore.isAuthenticated && authStore.user) {
      await reactionsStore.fetchUserReaction(props.pageData.pageId, authStore.user.id)
    }
  }
})

onUnmounted(() => {
  console.log('OverlayApp unmounted')
})
</script>

<style scoped>
#emojifeed-overlay {
  all: initial;
}
</style>
