<script setup lang="ts">
import { useDaylioStore } from '@/stores/mood'

const store = useDaylioStore()
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
        @click="store.toggleActivity(activity.id)"
      >
        <span class="emoji">{{ activity.emoji }}</span>
        <span class="label">{{ activity.name }}</span>
      </button>
    </div>
  </section>
</template>
