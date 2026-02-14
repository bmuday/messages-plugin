<template>
  <div class="emoji-picker">
    <button
      v-for="emojiData in EMOJIS"
      :key="emojiData.id"
      class="emoji-button"
      :class="{ active: userEmoji === emojiData.emoji }"
      :title="emojiData.label"
      @click="$emit('select', emojiData.emoji)"
    >
      <span class="emoji">{{ emojiData.emoji }}</span>
      <span v-if="counts[emojiData.emoji] > 0" class="emoji-count">
        {{ counts[emojiData.emoji] }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { EMOJIS } from '@/utils/emoji-constants.js'

defineProps({
  counts: {
    type: Object,
    default: () => ({})
  },
  userEmoji: {
    type: String,
    default: null
  }
})

defineEmits(['select'])
</script>

<style scoped>
.emoji {
  display: block;
}
</style>
