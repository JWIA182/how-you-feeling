<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useDaylioStore } from '@/stores/mood'
import { useAuthStore } from '@/stores/auth'
import BottomNav from '@/components/BottomNav.vue'
import EntryForm from '@/components/EntryForm.vue'
import CalendarView from '@/components/CalendarView.vue'
import StatsView from '@/components/StatsView.vue'
import GoalsView from '@/components/GoalsView.vue'
import AuthView from '@/components/AuthView.vue'
import UserMenu from '@/components/UserMenu.vue'

const store = useDaylioStore()
const auth = useAuthStore()
const isLoading = ref(true)

onMounted(() => {
  // Handle redirect from 404.html
  const redirect = sessionStorage.getItem('redirect')
  if (redirect) {
    sessionStorage.removeItem('redirect')
  }

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
      isLoading.value = true
      const cloudEntries = await auth.loadEntriesFromFirestore()
      if (cloudEntries.length > 0) {
        const localIds = new Set(store.history.map((e) => e.id))
        const newCloud = cloudEntries.filter((e) => !localIds.has(e.id))
        store.history = [...newCloud, ...store.history]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      }
      isLoading.value = false
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

// Sync pending offline entries when back online
watch(
  () => store.isOnline,
  async (online) => {
    if (online && auth.isAuthenticated && store.pendingSync.length > 0) {
      for (const entry of store.pendingSync) {
        await auth.saveEntryToFirestore(entry)
      }
      store.clearPendingSync()
    }
  },
)
</script>

<template>
  <AuthView v-if="!auth.isAuthenticated" />

  <template v-else>
    <header class="app-header">
      <h1>How You Feeling?</h1>
      <div class="header-actions">
        <span v-if="!store.isOnline || store.pendingSync.length > 0" class="sync-status">
          <span v-if="!store.isOnline" class="offline-indicator" title="Offline">○</span>
          <span v-else-if="store.pendingSync.length > 0" class="sync-indicator" title="{{ store.pendingSync.length }} pending sync">
            ↻({{ store.pendingSync.length }})
          </span>
        </span>
        <UserMenu />
        <button class="icon-btn" @click="store.toggleDark()" title="Toggle dark mode">
          {{ store.darkMode ? 'D' : 'N' }}
        </button>
      </div>
    </header>

    <div v-if="isLoading" class="loading-skeleton">
      <div class="skeleton-bar"></div>
      <div class="skeleton-bar"></div>
      <div class="skeleton-bar"></div>
      <div class="skeleton-grid">
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
      </div>
    </div>

    <template v-else>
      <EntryForm v-if="store.activeTab === 'entry'" />
      <CalendarView v-if="store.activeTab === 'calendar'" />
      <StatsView v-if="store.activeTab === 'stats'" />
      <GoalsView v-if="store.activeTab === 'goals'" />
    </template>

    <BottomNav />
  </template>
</template>
