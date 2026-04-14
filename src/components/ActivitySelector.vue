<script setup lang="ts">
import { useDaylioStore } from '@/stores/mood'

const store = useDaylioStore()

function triggerHaptic() {
  if ('vibrate' in navigator) {
    navigator.vibrate(10)
  }
}

function toggleActivityWithHaptic(id: string) {
  triggerHaptic()
  store.toggleActivity(id)
}
</script>

<template>
  <section class="activity-selector">
    <h2>What are you up to?</h2>
    <div class="activity-grid">
      <button
        v-for="activity in store.activities"
        :key="activity.id"
        class="activity-btn"
        :class="{ selected: store.selectedActivities.includes(activity.id) }"
        @click="toggleActivityWithHaptic(activity.id)"
      >
        <span class="emoji">{{ activity.emoji }}</span>
        <span class="label">{{ activity.name }}</span>
      </button>
    </div>
  </section>
</template>
