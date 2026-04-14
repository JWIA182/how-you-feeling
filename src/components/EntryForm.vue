<script setup lang="ts">
import { ref } from 'vue'
import { useDaylioStore, type MoodEntry } from '@/stores/mood'
import { useAuthStore } from '@/stores/auth'
import { ACTIVITIES } from '@/stores/mood'
import MoodSelector from './MoodSelector.vue'
import ActivitySelector from './ActivitySelector.vue'
import Toast from './Toast.vue'

const store = useDaylioStore()
const auth = useAuthStore()

const showToast = ref(false)
const toastMessage = ref('')
const showUndo = ref(false)
const lastDeletedEntry = ref<{ entry: MoodEntry; index: number } | null>(null)
let undoTimeout: number | null = null

function triggerHaptic(pattern: 'tap' | 'success' | 'warning') {
  if ('vibrate' in navigator) {
    const patterns = {
      tap: 10,
      success: [50, 50, 50],
      warning: [100, 50, 100],
    }
    navigator.vibrate(patterns[pattern])
  }
}

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

  triggerHaptic('success')

  if (auth.isAuthenticated) {
    // Check if online
    if (navigator.onLine) {
      if (store.editingEntry) {
        // Update in Firestore
        await auth.deleteEntryFromFirestore(entry.id)
        await auth.saveEntryToFirestore(entry)
      } else {
        // Save new entry
        await auth.saveEntryToFirestore(entry)
      }
      showToastMessage(store.editingEntry ? 'Entry updated' : 'Entry saved')
    } else {
      // Queue for sync when back online
      store.addToPendingSync(entry)
      showToastMessage('Saved offline - will sync when online')
    }
  } else {
    showToastMessage(store.editingEntry ? 'Entry updated' : 'Entry saved')
  }
}

function handleCancelEdit() {
  store.cancelEdit()
  showToastMessage('Edit cancelled')
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

async function handleDelete(entry: { id: number }) {
  // Find the entry in history
  const index = store.history.findIndex((e) => e.id === entry.id)
  if (index === -1) return

  const foundEntry = store.history[index]
  if (!foundEntry) return

  // Store for undo
  lastDeletedEntry.value = { entry: foundEntry, index }
  
  // Delete from local state
  store.deleteEntry(entry.id)
  
  // Delete from Firestore if authenticated
  if (auth.isAuthenticated) {
    await auth.deleteEntryFromFirestore(entry.id)
  }
  
  // Show undo toast
  showUndo.value = true
  triggerHaptic('warning')
  
  // Auto-hide undo after 3 seconds
  if (undoTimeout) {
    clearTimeout(undoTimeout)
  }
  undoTimeout = window.setTimeout(() => {
    showUndo.value = false
    lastDeletedEntry.value = null
  }, 3000)
}

function handleUndoDelete() {
  if (!lastDeletedEntry.value) return
  
  const { entry, index } = lastDeletedEntry.value
  
  // Restore to local state
  store.history.splice(index, 0, entry)
  // Save to localStorage
  localStorage.setItem('daylio-entries', JSON.stringify(store.history))
  
  // Restore to Firestore if authenticated
  if (auth.isAuthenticated) {
    auth.saveEntryToFirestore(entry)
  }
  
  // Clear undo state
  showUndo.value = false
  lastDeletedEntry.value = null
  if (undoTimeout) clearTimeout(undoTimeout)
  
  showToastMessage('Entry restored')
  triggerHaptic('success')
}

async function handleClear() {
  if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
    if (auth.isAuthenticated) {
      for (const e of store.history) {
        await auth.deleteEntryFromFirestore(e.id)
      }
    }
    store.clearHistory()
    showToastMessage('History cleared')
  }
}
</script>

<template>
  <div class="main-content">
    <MoodSelector />
    <ActivitySelector />

    <section class="note-section">
      <h2>{{ store.editingEntry ? 'Edit Entry' : 'Note' }}</h2>
      <textarea v-model="store.note" placeholder="..." />
      <div class="button-group">
        <button class="save-btn" :disabled="!store.canSave" @click="handleSave">
          {{ store.editingEntry ? 'Update' : 'Save' }}
        </button>
        <button v-if="store.editingEntry" class="cancel-btn" @click="handleCancelEdit">
          Cancel
        </button>
      </div>
    </section>

    <section class="history-section">
      <div class="history-header">
        <h2>Recent</h2>
        <button v-if="store.history.length > 0" class="export-btn" @click="store.exportToCSV()" title="Export to CSV">
          EXP
        </button>
      </div>
      <div class="mood-history">
        <p v-if="store.history.length === 0" class="no-data">
          no entries yet.
        </p>
        <div
          v-for="entry in store.history.slice(0, 10)"
          :key="entry.id"
          class="history-item"
          @click="store.editEntry(entry)"
          style="cursor: pointer"
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
          <button class="edit-btn" @click.stop="store.editEntry(entry)" title="Edit">✎</button>
          <button class="delete-btn" @click.stop="handleDelete(entry)" title="Delete">x</button>
        </div>
      </div>
      <button v-if="store.history.length > 10" class="clear-btn" @click="handleClear">
        Clear all
      </button>
    </section>

    <Toast :message="toastMessage" :show="showToast" />
    
    <div v-if="showUndo" class="undo-toast">
      <span>Entry deleted</span>
      <button class="undo-btn" @click="handleUndoDelete">undo</button>
    </div>
  </div>
</template>
