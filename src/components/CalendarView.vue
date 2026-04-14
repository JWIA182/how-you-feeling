<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDaylioStore, MOODS, type MoodEntry } from '@/stores/mood'

const store = useDaylioStore()

const currentDate = ref(new Date())

const calendarData = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - startDate.getDay())

  const days: { date: Date; entries: MoodEntry[]; isCurrentMonth: boolean; isToday: boolean }[] = []

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const current = new Date(startDate)
  const endDate = new Date(lastDay)
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))

  const data = store.getCalendarData()

  while (current <= endDate) {
    const dateStr = current.toLocaleDateString('en-CA')
    const entries = data.get(dateStr) || []
    const isCurrentMonth = current.getMonth() === month
    const isToday = current.getTime() === today.getTime()

    days.push({
      date: new Date(current),
      entries,
      isCurrentMonth,
      isToday,
    })

    current.setDate(current.getDate() + 1)
  }

  return { days, year, month }
})

const monthName = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
})

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const streak = computed(() => store.getStreak())

function prevMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1,
  )
}

function nextMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1,
  )
}

function getAvgMoodColor(entries: MoodEntry[]) {
  if (entries.length === 0) return 'transparent'
  const avg = entries.reduce((sum, e) => sum + e.mood.value, 0) / entries.length
  const idx = Math.round(avg) - 1
  return MOODS[idx]?.color || 'transparent'
}

function getDayOfMonth(date: Date) {
  return date.getDate()
}
</script>

<template>
  <div class="main-content">
    <section class="calendar-section">
      <div class="calendar-header">
        <button class="calendar-nav-btn" @click="prevMonth">‹</button>
        <h3>{{ monthName }}</h3>
        <button class="calendar-nav-btn" @click="nextMonth">›</button>
      </div>

      <div class="calendar-weekdays">
        <div v-for="day in weekdays" :key="day" class="calendar-weekday">
          {{ day }}
        </div>
      </div>

      <div class="calendar-grid">
        <div
          v-for="(day, idx) in calendarData.days"
          :key="idx"
          class="calendar-day"
          :class="{
            'has-entry': day.entries.length > 0,
            'other-month': !day.isCurrentMonth,
            today: day.isToday,
          }"
        >
          <span>{{ getDayOfMonth(day.date) }}</span>
          <span
            v-if="day.entries.length > 0"
            class="mood-dot"
            :style="{ backgroundColor: getAvgMoodColor(day.entries) }"
          />
        </div>
      </div>
    </section>

    <!-- Streak info -->
    <div class="streak-card">
      <div
        style="
          font-size: 0.8rem;
          font-weight: 700;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #000;
        "
      >
        STR
      </div>
      <div class="streak-info">
        <h4>streak: {{ streak.current }}d</h4>
        <p v-if="streak.current === 0">log daily to build one</p>
        <p v-else>best: {{ streak.longest }}d</p>
      </div>
    </div>
  </div>
</template>
