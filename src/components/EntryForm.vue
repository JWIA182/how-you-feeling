<script setup lang="ts">
import { ref } from 'vue'
import { useDaylioStore } from '@/stores/mood'
import { useAuthStore } from '@/stores/auth'
import { ACTIVITIES } from '@/stores/mood'
import MoodSelector from './MoodSelector.vue'
import ActivitySelector from './ActivitySelector.vue'
import Toast from './Toast.vue'

const store = useDaylioStore()
const auth = useAuthStore()

const showToast = ref(false)
const toastMessage = ref('')

function showToastMessage(message: string) {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

async function handleSave() {
  const entry = store.saveEntry()
  if (!entry) return

  if (auth.isAuthenticated) {
    await auth.saveEntryToFirestore(entry)
  }
  showToastMessage('Entry saved')
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`
  return date.toLocaleDateString()
}

function getActivity(id: string) {
  return ACTIVITIES.find((a) => a.id === id)
}

async function handleDelete(id: number) {
  store.deleteEntry(id)
  if (auth.isAuthenticated) {
    await auth.deleteEntryFromFirestore(id)
  }
}

async function handleClear() {
  if (auth.isAuthenticated) {
    for (const e of store.history) {
      await auth.deleteEntryFromFirestore(e.id)
    }
  }
  store.clearHistory()
}
</script>

<template>
  <div class="main-content">
    <MoodSelector />
    <ActivitySelector />

    <section class="note-section">
      <h2>Note</h2>
      <textarea v-model="store.note" placeholder="..." />
      <button class="save-btn" :disabled="!store.canSave" @click="handleSave">
        Save
      </button>
    </section>

    <section class="history-section">
      <h2>Recent</h2>
      <div class="mood-history">
        <p v-if="store.history.length === 0" class="no-data">
          no entries yet.
        </p>
        <div
          v-for="entry in store.history.slice(0, 10)"
          :key="entry.id"
          class="history-item"
        >
          <div
            style="
              width: 24px;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1px solid #000;
              font-size: 0.7rem;
              font-weight: 700;
              flex-shrink: 0;
            "
          >
            {{ entry.mood.emoji }}
          </div>
          <div class="content">
            <div class="mood-label">{{ entry.mood.name }}</div>
            <div class="timestamp">{{ formatTime(entry.timestamp) }}</div>
            <div v-if="entry.activities.length" class="activity-tags">
              <span
                v-for="actId in entry.activities"
                :key="actId"
                class="activity-tag"
              >
                {{ getActivity(actId)?.emoji ?? actId }}
              </span>
            </div>
            <div v-if="entry.note" class="note-text">{{ entry.note }}</div>
          </div>
          <button class="delete-btn" @click="handleDelete(entry.id)">x</button>
        </div>
      </div>
      <button v-if="store.history.length > 10" class="clear-btn" @click="handleClear">
        Clear all
      </button>
    </section>

    <Toast :message="toastMessage" :show="showToast" />
  </div>
</template>
