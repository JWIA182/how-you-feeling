# How You Feeling?

A **minimalist, monospace PWA mood tracker** inspired by Daylio. Built with Vue 3, TypeScript, Pinia, and Firebase. Deployed on GitHub Pages.

**Live:** https://jwia182.github.io/how-you-feeling/

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Language | TypeScript |
| Build | Vite 7 |
| State | Pinia 3 |
| Auth | Firebase Authentication (Email/Password + Google) |
| Database | Firebase Firestore (cloud sync per user) |
| Offline | PWA (workbox, injectManifest service worker) |
| Styling | CSS (brutalist monochrome, no frameworks) |
| Linting | oxlint + ESLint + vue-eslint |
| E2E | Playwright |
| CI/CD | GitHub Actions → GitHub Pages |

---

## Project Structure

```
src/
├── assets/
│   ├── main.css          # All styles — monochrome brutalist, iPhone-safe
│   └── base.css          # Minimal reset
├── components/
│   ├── ActivitySelector.vue   # Activity grid (WRK, EXR, RDG, etc.)
│   ├── AppHeader.vue          # Top bar with title + dark toggle
│   ├── AuthView.vue           # Login/register/google auth screen
│   ├── BottomNav.vue          # Tab nav: LOG | CAL | STT | GOA
│   ├── CalendarView.vue       # Month calendar with mood dots
│   ├── EntryForm.vue          # Main entry: mood + activity + note + history
│   ├── GoalsView.vue          # Goals tracking + theme picker
│   ├── MoodSelector.vue       # Mood picker (1-5, Rad → Awful)
│   ├── StatsView.vue          # Mood breakdown bars, trends, activity scores
│   ├── Toast.vue              # PWA-style update notification
│   └── UserMenu.vue           # Email display + sign out
├── stores/
│   ├── auth.ts           # Firebase auth + Firestore CRUD helpers
│   └── mood.ts           # Mood/activity constants, localStorage sync, stats
├── App.vue               # Root: auth gate → tab views
├── firebase.ts           # Firebase init (auth, db, google provider)
├── main.ts               # PWA register → Vue mount → stores
├── sw.ts                 # Service worker: precache + Firebase runtime caching
└── vite-env.d.ts         # Type declarations for virtual modules

public/
├── 404.html              # SPA fallback redirect for GitHub Pages
├── icon-192.png          # PWA icons
├── icon-512.png
├── apple-touch-icon.png
└── favicon.ico
```

---

## Key Commands

```sh
# Install
npm install --legacy-peer-deps

# Dev server (hot reload)
npm run dev

# Type-check + build
npm run build

# Build only (no type-check)
npm run build-only

# Preview production build
npm run preview

# Type-check only
npm run type-check

# Lint + format
npm run lint
npm run format

# Deploy to GitHub Pages
npm run deploy:github

# Deploy to Firebase Hosting
npm run deploy:firebase
```

---

## PWA Features

- **Service worker** precaches all assets + caches Firebase API responses offline
- **Installable** — prompts "Add to Home Screen" on mobile browsers
- **Auto-update** — shows brutalist update banner when new version available
- **SPA fallback** — `public/404.html` redirects deep links on GitHub Pages
- **Offline-ready** — app shell + cached Firestore data works without network

---

## Firebase Setup

### Firestore Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/entries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Authorized Domains
In Firebase Console → Authentication → Settings → Authorized domains:
- `jwia182.github.io`
- `localhost`

### Sign-in Methods
Enable in Firebase Console → Authentication → Sign-in method:
- **Email/Password**
- **Google**

---

## Design

- **Brutalist monochrome** — black/white only, 1px borders, no shadows/gradients
- **Monospace** — Courier New throughout
- **44px touch targets** — Apple HIG compliant for iPhone
- **Safe area** — respects Dynamic Island and home indicator on iPhone 16
- **Dark mode** — full inversion toggle
- **No emojis** — mood numbers (1-5) and activity codes (WRK, EXR, etc.)

---

## Deployment

### GitHub Pages (Primary)
Push to `main` → GitHub Actions builds and deploys automatically.

### Firebase Hosting (Alternative)
1. `npm install -g firebase-tools`
2. `firebase login`
3. `firebase deploy --only hosting`

---

## Notes

- `--legacy-peer-deps` is required due to vite-plugin-pwa / vite version peer dependency conflicts
- The `base` path is `/how-you-feeling/` for GitHub Pages — change this if deploying to a different path
- Service worker path in `sw.ts` uses the same base path for navigation fallback
- `firebase.ts` API key is safe to commit (it's a web client key, not a service account key)
