<template>
  <button class="floating-button" @click="$emit('click')" title="EmojiFeed - React to this page">
    <span class="button-icon">🎭</span>
    <span v-if="count > 0" class="badge">{{ displayCount }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  count: {
    type: Number,
    default: 0
  }
})

defineEmits(['click'])

const displayCount = computed(() => {
  if (props.count > 99) {
    return '99+'
  }
  return props.count
})
</script>

<style scoped>
.button-icon {
  font-size: 24px;
}
</style>
