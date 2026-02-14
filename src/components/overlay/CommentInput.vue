<template>
  <div class="comment-input">
    <textarea
      v-model="comment"
      class="comment-textarea"
      placeholder="Share your thoughts... (280 characters max)"
      maxlength="280"
      @keydown.ctrl.enter="submit"
      @keydown.meta.enter="submit"
    />
    <div class="comment-footer">
      <span class="char-counter">{{ comment.length }}/280</span>
      <button
        class="submit-button"
        :disabled="!canSubmit"
        @click="submit"
      >
        Post
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['submit'])

// State
const comment = ref('')

// Computed
const canSubmit = computed(() => {
  return comment.value.trim().length > 0 && comment.value.length <= 280
})

// Methods
function submit() {
  if (!canSubmit.value) return

  emit('submit', comment.value.trim())
  comment.value = ''
}
</script>

<style scoped>
/* Styles inherited from overlay-injector.js */
</style>
