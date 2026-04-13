<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

async function handleLogout() {
  await auth.logout()
}
</script>

<template>
  <div class="user-menu">
    <span class="user-email">{{ auth.email }}</span>
    <button class="icon-btn" @click="handleLogout" title="sign out">
      out
    </button>
  </div>
</template>

<style scoped>
.user-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-email {
  font-size: 0.7rem;
  font-family: 'Courier New', monospace;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-btn {
  background: none;
  border: 1px solid #000;
  padding: 0.25rem 0.5rem;
  font-family: 'Courier New', monospace;
  font-size: 0.65rem;
  cursor: pointer;
  text-transform: uppercase;
}

.icon-btn:hover {
  background: #000;
  color: #fff;
}

body.dark-mode .icon-btn {
  border-color: #fff;
  color: #fff;
}

body.dark-mode .icon-btn:hover {
  background: #fff;
  color: #000;
}
</style>
