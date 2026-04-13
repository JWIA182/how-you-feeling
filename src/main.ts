import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useAuthStore } from './stores/auth'
import { useDaylioStore } from './stores/mood'
import './firebase'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')

// Sync Firestore when user logs in
const auth = useAuthStore()
const store = useDaylioStore()

import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    const existing = document.getElementById('pwa-update')
    if (existing) return

    const bar = document.createElement('div')
    bar.id = 'pwa-update'
    bar.style.cssText = `
      position: fixed;
      bottom: 5rem;
      left: 50%;
      transform: translateX(-50%);
      background: #000;
      color: #fff;
      padding: 0.75rem 1rem;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      z-index: 9999;
      box-shadow: 2px 2px 0 #666;
    `
    bar.innerHTML = `
      <span>update available</span>
      <button id="pwa-reload" style="
        background: #fff;
        color: #000;
        border: none;
        padding: 0.25rem 0.75rem;
        font-family: inherit;
        font-size: 0.7rem;
        cursor: pointer;
        text-transform: uppercase;
        font-weight: 700;
      ">reload</button>
      <button id="pwa-close" style="
        background: none;
        border: none;
        color: #666;
        font-size: 1rem;
        cursor: pointer;
        padding: 0.25rem;
      ">x</button>
    `
    document.body.appendChild(bar)

    document.getElementById('pwa-reload')?.addEventListener('click', () => {
      updateSW(true)
    })

    document.getElementById('pwa-close')?.addEventListener('click', () => {
      bar.remove()
    })
  },
  onOfflineReady() {
    console.log('[PWA] App ready for offline use')
  },
})
