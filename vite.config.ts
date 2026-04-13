import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VitePWA } from 'vite-plugin-pwa'

const BASE_PATH = '/how-you-feeling/'

export default defineConfig({
  base: BASE_PATH,
  plugins: [
    vue(),
    vueJsx(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'How You Feeling?',
        short_name: 'HYF',
        description: 'Track your mood, understand yourself better.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: BASE_PATH,
        start_url: BASE_PATH,
        icons: [
          {
            src: `${BASE_PATH}icon-192.png`,
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: `${BASE_PATH}icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: `${BASE_PATH}icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
