<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true
  try {
    if (isLogin.value) {
      await auth.login(email.value, password.value)
    } else {
      await auth.register(email.value, password.value)
    }
  } catch {
    // error handled in store
  } finally {
    submitting.value = false
  }
}

async function handleGoogle() {
  try {
    await auth.loginWithGoogle()
  } catch {
    // error handled in store
  }
}
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h1 class="auth-title">how you feeling?</h1>
      <p class="auth-sub">sign in to sync your mood data</p>

      <button class="auth-btn auth-btn--google" @click="handleGoogle">
        google sign-in
      </button>

      <div class="auth-divider">or</div>

      <form @submit.prevent="handleSubmit">
        <input
          v-model="email"
          type="email"
          placeholder="email"
          class="auth-input"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="password"
          class="auth-input"
          required
          minlength="6"
        />

        <button
          type="submit"
          class="auth-btn auth-btn--primary"
          :disabled="submitting"
        >
          {{ submitting ? '...' : isLogin ? 'sign in' : 'create account' }}
        </button>
      </form>

      <button class="auth-toggle" @click="isLogin = !isLogin">
        {{ isLogin ? 'need an account? register' : 'have an account? sign in' }}
      </button>

      <p v-if="auth.error" class="auth-error">{{ auth.error }}</p>
    </div>
  </div>
</template>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.auth-card {
  border: 1px solid #000;
  padding: 1.5rem;
  width: 100%;
  max-width: 320px;
  background: #fff;
}

.auth-title {
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.25rem;
}

.auth-sub {
  font-size: 0.7rem;
  color: #666;
  margin-bottom: 1rem;
}

.auth-btn {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #000;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: none;
}

.auth-btn--google {
  background: #fff;
  color: #000;
}

.auth-btn--google:hover {
  background: #000;
  color: #fff;
}

.auth-btn--primary {
  background: #000;
  color: #fff;
}

.auth-btn--primary:hover:not(:disabled) {
  background: #fff;
  color: #000;
}

.auth-btn--primary:disabled {
  border-color: #ccc;
  color: #ccc;
}

.auth-divider {
  text-align: center;
  font-size: 0.7rem;
  color: #666;
  margin: 1rem 0;
}

.auth-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #000;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  background: #fff;
  color: #000;
}

.auth-input:focus {
  outline: none;
  box-shadow: 2px 2px 0 #000;
}

.auth-toggle {
  width: 100%;
  padding: 0.5rem;
  background: none;
  border: none;
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  color: #666;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 0.75rem;
}

.auth-toggle:hover {
  color: #000;
}

.auth-error {
  font-size: 0.7rem;
  color: #000;
  border: 1px solid #000;
  padding: 0.5rem;
  margin-top: 0.5rem;
  text-transform: uppercase;
}

body.dark-mode .auth-card {
  background: #000;
  border-color: #fff;
  color: #fff;
}

body.dark-mode .auth-sub,
body.dark-mode .auth-divider,
body.dark-mode .auth-toggle {
  color: #999;
}

body.dark-mode .auth-toggle:hover {
  color: #fff;
}

body.dark-mode .auth-btn--google {
  background: #000;
  border-color: #fff;
  color: #fff;
}

body.dark-mode .auth-btn--google:hover {
  background: #fff;
  color: #000;
}

body.dark-mode .auth-input {
  background: #000;
  border-color: #fff;
  color: #fff;
}

body.dark-mode .auth-input:focus {
  box-shadow: 2px 2px 0 #fff;
}

body.dark-mode .auth-error {
  border-color: #fff;
  color: #fff;
}
</style>
