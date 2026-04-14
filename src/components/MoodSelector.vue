<script setup lang="ts">
import { useDaylioStore } from '@/stores/mood'

const store = useDaylioStore()

function triggerHaptic() {
  if ('vibrate' in navigator) {
    navigator.vibrate(10)
  }
}

function selectMoodWithHaptic(mood: typeof store.moods[number]) {
  triggerHaptic()
  store.selectMood(mood)
}
</script>

<template>
  <section class="mood-selector">
    <h2>How's your mood?</h2>
    <div class="mood-grid">
      <button
        v-for="mood in store.moods"
        :key="mood.name"
        class="mood-btn"
        :class="{ selected: store.selectedMood?.name === mood.name }"
        @click="selectMoodWithHaptic(mood)"
      >
        <span class="emoji">{{ mood.emoji }}</span>
        <span class="label">{{ mood.name }}</span>
      </button>
    </div>
  </section>
</template>
