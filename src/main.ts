// PWA: Register service worker FIRST
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
      padding: 0.5rem 1rem;
      border: 1px solid #000;
      font-family: 'Courier New', monospace;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      z-index: 9999;
      box-shadow: 2px 2px 0 #666;
    `
    bar.innerHTML = `
      <span>update</span>
      <button id="pwa-reload" style="
        background: #fff;
        color: #000;
        border: none;
        padding: 0.25rem 0.5rem;
        font-family: inherit;
        font-size: 0.65rem;
        cursor: pointer;
        text-transform: uppercase;
        font-weight: 700;
      ">reload</button>
      <button id="pwa-close" style="
        background: none;
        border: 1px solid #666;
        color: #666;
        font-size: 0.65rem;
        cursor: pointer;
        padding: 0.15rem 0.375rem;
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
    console.log('[PWA] ready for offline')
  },
})

// App
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
