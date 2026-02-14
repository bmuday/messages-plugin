<template>
  <div class="reaction-panel" :class="{ open: uiStore.isPanelOpen }">
    <!-- Header -->
    <div class="panel-header">
      <h2 class="panel-title">{{ pageData.title }}</h2>
      <button class="close-button" @click="uiStore.closePanel" title="Close">
        <span>✕</span>
      </button>
    </div>

    <!-- Body -->
    <div class="panel-body">
      <!-- Community Filter (placeholder for now) -->
      <div class="community-filter" v-if="communitiesStore.allCommunities.length > 0">
        <select v-model="selectedCommunity" @change="onCommunityChange">
          <option :value="null">All Communities</option>
          <option
            v-for="community in communitiesStore.allCommunities"
            :key="community.$id"
            :value="community.$id"
          >
            {{ community.icon }} {{ community.name }}
          </option>
        </select>
      </div>

      <!-- Emoji Picker -->
      <EmojiPicker
        :counts="reactionsStore.reactionCounts"
        :user-emoji="reactionsStore.userReactionEmoji"
        @select="onEmojiSelect"
      />

      <!-- Comment Input (if authenticated) -->
      <CommentInput
        v-if="authStore.isAuthenticated"
        @submit="onCommentSubmit"
      />

      <!-- Login Prompt (if not authenticated) -->
      <div v-else class="login-prompt">
        <p>Sign in to add your reaction</p>
        <button class="submit-button" @click="showLoginModal = true">Sign In</button>
      </div>

      <!-- Comment List -->
      <CommentList :reactions="reactionsStore.currentPageReactions" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import { useReactionsStore } from '@/store/reactions.js'
import { useCommunitiesStore } from '@/store/communities.js'
import { useUiStore } from '@/store/ui.js'
import EmojiPicker from './EmojiPicker.vue'
import CommentInput from './CommentInput.vue'
import CommentList from './CommentList.vue'

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

// State
const selectedCommunity = ref(null)
const showLoginModal = ref(false)

// Handlers
async function onEmojiSelect(emoji) {
  if (!authStore.isAuthenticated) {
    showLoginModal.value = true
    return
  }

  const communityId = selectedCommunity.value || communitiesStore.allCommunities[0]?.$id

  await reactionsStore.toggleEmoji(
    props.pageData.pageId,
    emoji,
    communityId,
    authStore.user.id
  )
}

async function onCommentSubmit(comment) {
  if (!authStore.isAuthenticated) {
    return
  }

  const communityId = selectedCommunity.value || communitiesStore.allCommunities[0]?.$id
  const emoji = reactionsStore.userReactionEmoji || '❤️'

  await reactionsStore.addReaction(
    props.pageData.pageId,
    emoji,
    comment,
    communityId,
    authStore.user.id
  )
}

function onCommunityChange() {
  // Refetch reactions for selected community
  reactionsStore.fetchReactionsForPage(props.pageData.pageId, {
    communityId: selectedCommunity.value
  })
}
</script>

<style scoped>
.community-filter {
  margin-bottom: 16px;
}

.community-filter select {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid var(--border);
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.login-prompt {
  text-align: center;
  padding: 20px;
  background: rgba(99, 102, 241, 0.05);
  border-radius: 8px;
  margin-bottom: 20px;
}

.login-prompt p {
  margin-bottom: 12px;
  color: var(--text-light);
}
</style>
