<script setup lang="ts">
import { ref } from 'vue'
import { useDaylioStore, ACTIVITIES } from '@/stores/mood'

const store = useDaylioStore()

interface Goal {
  id: string
  name: string
  code: string
  target: number
  period: 'daily' | 'weekly' | 'monthly'
}

const goals = ref<Goal[]>([
  { id: 'g1', name: 'Exercise', code: 'EXR', target: 3, period: 'weekly' },
  { id: 'g2', name: 'Meditation', code: 'MDT', target: 5, period: 'weekly' },
  { id: 'g3', name: 'Reading', code: 'RDG', target: 30, period: 'monthly' },
  { id: 'g4', name: 'Nature Walk', code: 'NTR', target: 2, period: 'weekly' },
])

function getProgress(goal: Goal) {
  const now = new Date()
  const entries = store.history

  let filtered = entries
  if (goal.period === 'daily') {
    const today = now.toLocaleDateString('en-CA')
    filtered = entries.filter(
      (e) => new Date(e.timestamp).toLocaleDateString('en-CA') === today,
    )
  } else if (goal.period === 'weekly') {
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay())
    weekStart.setHours(0, 0, 0, 0)
    filtered = entries.filter((e) => new Date(e.timestamp) >= weekStart)
  } else {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    filtered = entries.filter((e) => new Date(e.timestamp) >= monthStart)
  }

  const count = filtered.filter((e) => {
    const act = ACTIVITIES.find((a) => a.name.toLowerCase() === goal.name.toLowerCase())
    return act && e.activities.includes(act.id)
  }).length
  return { count, target: goal.target, percent: Math.min(Math.round((count / goal.target) * 100), 100) }
}
</script>

<template>
  <div class="main-content">
    <div class="goals-section">
      <h2 style="padding: 0.5rem 0; margin: 0">Goals</h2>

      <div
        v-for="goal in goals"
        :key="goal.id"
        class="stat-card"
      >
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem">
          <div style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; flex: 1">
            {{ goal.name }}
          </div>
          <div
            style="
              font-size: 0.75rem;
              font-weight: 700;
            "
          >
            {{ getProgress(goal).count }}/{{ goal.target }}
          </div>
        </div>
        <div class="stat-bar" style="height: 4px">
          <div
            class="stat-bar-fill"
            :style="{ width: `${getProgress(goal).percent}%` }"
          />
        </div>
        <div
          style="
            text-align: right;
            font-size: 0.65rem;
            color: #666;
            margin-top: 0.25rem;
          "
        >
          {{ getProgress(goal).percent }}%
        </div>
      </div>
    </div>
  </div>
</template>
