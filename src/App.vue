<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useDaylioStore } from '@/stores/mood'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import EntryForm from '@/components/EntryForm.vue'
import CalendarView from '@/components/CalendarView.vue'
import StatsView from '@/components/StatsView.vue'
import GoalsView from '@/components/GoalsView.vue'
import AuthView from '@/components/AuthView.vue'
import UserMenu from '@/components/UserMenu.vue'

const store = useDaylioStore()
const auth = useAuthStore()

onMounted(() => {
  if (store.darkMode) {
    document.body.classList.add('dark-mode')
  }
  document.body.classList.add(`theme-${store.themeColor}`)
})

// Sync Firestore entries when user logs in
watch(
  () => auth.isAuthenticated,
  async (loggedIn) => {
    if (loggedIn) {
      const cloudEntries = await auth.loadEntriesFromFirestore()
      if (cloudEntries.length > 0) {
        const localIds = new Set(store.history.map((e) => e.id))
        const newCloud = cloudEntries.filter((e) => !localIds.has(e.id))
        store.history = [...newCloud, ...store.history]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      }
    }
  },
)

watch(
  () => store.darkMode,
  (isDark) => {
    document.body.classList.toggle('dark-mode', isDark)
  },
)

watch(
  () => store.themeColor,
  (color, oldColor) => {
    document.body.classList.remove(`theme-${oldColor}`)
    document.body.classList.add(`theme-${color}`)
  },
)
</script>

<template>
  <AuthView v-if="!auth.isAuthenticated" />

  <template v-else>
    <header class="app-header">
      <h1>How You Feeling?</h1>
      <div class="header-actions">
        <UserMenu />
        <button class="icon-btn" @click="store.toggleDark()" title="Toggle dark mode">
          {{ store.darkMode ? 'D' : 'N' }}
        </button>
      </div>
    </header>

    <EntryForm v-if="store.activeTab === 'entry'" />
    <CalendarView v-if="store.activeTab === 'calendar'" />
    <StatsView v-if="store.activeTab === 'stats'" />
    <GoalsView v-if="store.activeTab === 'goals'" />

    <BottomNav />
  </template>
</template>
