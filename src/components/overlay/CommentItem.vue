<template>
  <div class="comment-item">
    <div class="comment-header">
      <div class="avatar">
        {{ userInitial }}
      </div>
      <span class="comment-username">{{ username }}</span>
      <span class="comment-time">{{ relativeTime }}</span>
    </div>

    <div class="comment-emoji">{{ reaction.emoji }}</div>

    <div v-if="reaction.comment" class="comment-text">
      {{ reaction.comment }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatRelativeTime } from '@/utils/date-utils.js'

const props = defineProps({
  reaction: {
    type: Object,
    required: true
  }
})

// Computed
const username = computed(() => {
  // In a real app, you'd fetch user data
  // For now, use userId
  return props.reaction.userId.substring(0, 8)
})

const userInitial = computed(() => {
  return username.value.charAt(0).toUpperCase()
})

const relativeTime = computed(() => {
  return formatRelativeTime(props.reaction.createdAt)
})
</script>

<style scoped>
/* Styles inherited from overlay-injector.js */
</style>
