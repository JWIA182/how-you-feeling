<script setup lang="ts">
import { computed } from 'vue'
import { useDaylioStore, MOODS, ACTIVITIES } from '@/stores/mood'

const store = useDaylioStore()

const totalEntries = computed(() => store.history.length)

const moodBreakdown = computed(() => {
  return MOODS.map((mood) => ({
    ...mood,
    count: store.getMoodCount(mood.name),
    percentage:
      totalEntries.value > 0
        ? Math.round((store.getMoodCount(mood.name) / totalEntries.value) * 100)
        : 0,
  }))
})

const topActivities = computed(() => {
  const impacts = ACTIVITIES.map((act) => store.getActivityImpact(act.id))
    .filter((item) => item !== null && item.count > 0)
    .sort((a, b) => (b?.avgMood ?? 0) - (a?.avgMood ?? 0))
  return impacts.slice(0, 8)
})

const moodTrend = computed(() => {
  if (store.history.length < 2) return null

  const recent = store.history.slice(0, 7).reverse()
  return recent.map((e) => ({
    mood: e.mood,
    date: new Date(e.timestamp).toLocaleDateString('en-US', {
      weekday: 'short',
    }),
  }))
})

const avgMood = computed(() => {
  if (store.history.length === 0) return null
  const sum = store.history.reduce((acc, e) => acc + e.mood.value, 0)
  const avg = sum / store.history.length
  const closest = Math.round(avg)
  return MOODS.find((m) => m.value === closest)
})
</script>

<template>
  <div class="stats-section">
    <!-- Average mood -->
    <div v-if="avgMood" class="streak-card">
      <div
        style="
          font-size: 1.5rem;
          font-weight: 700;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #000;
        "
      >
        {{ avgMood.emoji }}
      </div>
      <div class="streak-info">
        <h4>avg: {{ avgMood.name }}</h4>
        <p>{{ totalEntries }} entries</p>
      </div>
    </div>

    <!-- Mood breakdown -->
    <div v-if="totalEntries > 0" class="stat-card">
      <h3>Moods</h3>
      <div
        v-for="mood in moodBreakdown"
        :key="mood.name"
        class="stat-row"
      >
        <div
          style="
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #000;
            font-size: 0.65rem;
            font-weight: 700;
          "
        >
          {{ mood.emoji }}
        </div>
        <div style="flex: 1">
          <div style="display: flex; justify-content: space-between">
            <span class="label">{{ mood.name }}</span>
            <span class="value">{{ mood.count }} [{{ mood.percentage }}%]</span>
          </div>
          <div class="stat-bar">
            <div
              class="stat-bar-fill"
              :style="{ width: `${mood.percentage}%` }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Recent trend -->
    <div v-if="moodTrend" class="stat-card">
      <h3>Trend</h3>
      <div
        v-for="(item, idx) in moodTrend"
        :key="idx"
        class="stat-row"
      >
        <span class="label">{{ item.date }}</span>
        <span class="value">{{ item.mood.name }}</span>
      </div>
    </div>

    <!-- Top activities by mood -->
    <div v-if="topActivities.length > 0" class="stat-card">
      <h3>Activities / Mood</h3>
      <div
        v-for="impact in topActivities"
        :key="impact?.activity?.id"
        class="activity-impact"
      >
        <span class="name">{{ impact?.activity?.emoji }}</span>
        <div class="mood-indicator">
          <span
            v-for="i in 5"
            :key="i"
            class="dot"
            :class="{ filled: i <= Math.round(impact?.avgMood ?? 0) }"
          />
        </div>
        <span class="mood-score">{{ impact?.avgMood?.toFixed(1) }}</span>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="totalEntries === 0" class="stat-card">
      <p class="no-data">log entries to see stats.</p>
    </div>
  </div>
</template>
