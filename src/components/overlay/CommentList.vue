<template>
  <div class="comment-list">
    <!-- Empty state -->
    <div v-if="reactions.length === 0" class="empty-state">
      <p>No reactions yet. Be the first! 🎉</p>
    </div>

    <!-- Comments -->
    <CommentItem
      v-for="reaction in reactions"
      :key="reaction.$id"
      :reaction="reaction"
    />
  </div>
</template>

<script setup>
import CommentItem from './CommentItem.vue'

defineProps({
  reactions: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
/* Styles inherited from overlay-injector.js */
</style>
