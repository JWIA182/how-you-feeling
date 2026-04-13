<script setup lang="ts">
import { useDaylioStore } from '@/stores/mood'

const store = useDaylioStore()
</script>

<template>
  <div class="app-header">
    <h1>How You Feeling?</h1>
    <div class="header-actions">
      <button class="icon-btn" @click="store.toggleDark()" title="Toggle dark mode">
        {{ store.darkMode ? 'D' : 'N' }}
      </button>
    </div>
  </div>
</template>
