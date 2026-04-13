<script setup lang="ts">
import { useDaylioStore } from '@/stores/mood'

const store = useDaylioStore()

const tabs = [
  { id: 'entry', icon: 'LOG', label: 'log' },
  { id: 'calendar', icon: 'CAL', label: 'cal' },
  { id: 'stats', icon: 'STT', label: 'stats' },
  { id: 'goals', icon: 'GOA', label: 'goals' },
]
</script>

<template>
  <nav class="bottom-nav">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="nav-item"
      :class="{ active: store.activeTab === tab.id }"
      @click="store.setTab(tab.id)"
    >
      <span class="nav-icon">{{ tab.icon }}</span>
      <span class="nav-label">{{ tab.label }}</span>
    </button>
  </nav>
</template>
