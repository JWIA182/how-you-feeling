import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Mood {
  name: string
  emoji: string
  color: string
  value: number // 1-5 scale
}

export interface Activity {
  id: string
  name: string
  emoji: string
}

export interface MoodEntry {
  id: number
  mood: Mood
  activities: string[] // activity ids
  note: string
  timestamp: string
}

export const MOODS: Mood[] = [
  { name: 'Rad', emoji: '5', color: '#000', value: 5 },
  { name: 'Good', emoji: '4', color: '#333', value: 4 },
  { name: 'Meh', emoji: '3', color: '#666', value: 3 },
  { name: 'Meh+', emoji: '2', color: '#999', value: 2 },
  { name: 'Awful', emoji: '1', color: '#ccc', value: 1 },
]

export const ACTIVITIES: Activity[] = [
  { id: 'work', name: 'Work', emoji: 'WRK' },
  { id: 'exercise', name: 'Exercise', emoji: 'EXR' },
  { id: 'reading', name: 'Reading', emoji: 'RDG' },
  { id: 'gaming', name: 'Gaming', emoji: 'GME' },
  { id: 'social', name: 'Social', emoji: 'SOC' },
  { id: 'music', name: 'Music', emoji: 'MSC' },
  { id: 'cooking', name: 'Cooking', emoji: 'CKG' },
  { id: 'movies', name: 'Movies', emoji: 'MOV' },
  { id: 'nature', name: 'Nature', emoji: 'NTR' },
  { id: 'sleep', name: 'Sleep', emoji: 'SLP' },
  { id: 'shopping', name: 'Shop', emoji: 'SHP' },
  { id: 'cleaning', name: 'Clean', emoji: 'CLN' },
  { id: 'study', name: 'Study', emoji: 'STD' },
  { id: 'meditation', name: 'Meditate', emoji: 'MDT' },
  { id: 'art', name: 'Art', emoji: 'ART' },
  { id: 'pets', name: 'Pets', emoji: 'PTS' },
]

export const STORAGE_KEY = 'daylio-entries'
export const THEME_KEY = 'daylio-theme'
export const DARK_KEY = 'daylio-dark'

function loadHistory(): MoodEntry[] {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return []
    }
  }
  return []
}

function loadTheme(): string {
  return localStorage.getItem(THEME_KEY) || 'purple'
}

function loadDark(): boolean {
  return localStorage.getItem(DARK_KEY) === 'true'
}

function saveHistory(history: MoodEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export const useDaylioStore = defineStore('daylio', () => {
  const history = ref<MoodEntry[]>(loadHistory())
  const selectedMood = ref<Mood | null>(null)
  const selectedActivities = ref<string[]>([])
  const note = ref('')
  const activeTab = ref('entry') // entry | calendar | stats | goals
  const darkMode = ref(loadDark())
  const themeColor = ref(loadTheme())

  const canSave = computed(() => selectedMood.value !== null)

  function selectMood(mood: Mood) {
    selectedMood.value = mood
  }

  function toggleActivity(id: string) {
    const idx = selectedActivities.value.indexOf(id)
    if (idx === -1) {
      selectedActivities.value.push(id)
    } else {
      selectedActivities.value.splice(idx, 1)
    }
  }

  function saveEntry(): MoodEntry | null {
    if (!selectedMood.value) return null

    const entry: MoodEntry = {
      id: Date.now(),
      mood: selectedMood.value,
      activities: [...selectedActivities.value],
      note: note.value,
      timestamp: new Date().toISOString(),
    }

    history.value.unshift(entry)
    saveHistory(history.value)
    selectedMood.value = null
    selectedActivities.value = []
    note.value = ''
    return entry
  }

  function deleteEntry(id: number) {
    history.value = history.value.filter((e) => e.id !== id)
    saveHistory(history.value)
  }

  function clearHistory() {
    history.value = []
    saveHistory(history.value)
  }

  function getMoodCount(moodName: string): number {
    return history.value.filter((e) => e.mood.name === moodName).length
  }

  function getActivityImpact(activityId: string) {
    const withActivity = history.value.filter((e) =>
      e.activities.includes(activityId),
    )
    if (withActivity.length === 0) return null

    const avgMood =
      withActivity.reduce((sum, e) => sum + e.mood.value, 0) /
      withActivity.length
    const activity = ACTIVITIES.find((a) => a.id === activityId)
    return { activity, avgMood, count: withActivity.length }
  }

  function getMostCommonMood(): Mood | null {
    if (history.value.length === 0) return null

    const counts: Record<string, number> = {}
    for (const entry of history.value) {
      counts[entry.mood.name] = (counts[entry.mood.name] || 0) + 1
    }

    const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    return mostCommon
      ? MOODS.find((m) => m.name === mostCommon[0]) ?? null
      : null
  }

  function getCalendarData() {
    const map = new Map<string, MoodEntry[]>()
    for (const entry of history.value) {
      const date = new Date(entry.timestamp).toLocaleDateString('en-CA') // YYYY-MM-DD
      const existing = map.get(date) || []
      existing.push(entry)
      map.set(date, existing)
    }
    return map
  }

  function toggleDark() {
    darkMode.value = !darkMode.value
    localStorage.setItem(DARK_KEY, String(darkMode.value))
  }

  function setTheme(color: string) {
    themeColor.value = color
    localStorage.setItem(THEME_KEY, color)
  }

  function setTab(tab: string) {
    activeTab.value = tab
  }

  return {
    history,
    selectedMood,
    selectedActivities,
    note,
    activeTab,
    darkMode,
    themeColor,
    moods: MOODS,
    activities: ACTIVITIES,
    canSave,
    selectMood,
    toggleActivity,
    saveEntry,
    deleteEntry,
    clearHistory,
    getMoodCount,
    getActivityImpact,
    getMostCommonMood,
    getCalendarData,
    toggleDark,
    setTheme,
    setTab,
  }
})
