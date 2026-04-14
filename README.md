# How You Feeling? 🎯

A **minimalist, monospace PWA mood tracker** inspired by Daylio. Built with Vue 3, TypeScript, Pinia, and Firebase. Track your daily mood, activities, and build streaks of self-awareness.

**Live:** https://jwia182.github.io/how-you-feeling/

---

## ✨ Features

### 🎭 Core Features
- **Mood Tracking** — Log your mood on a 5-point scale (Rad → Awful)
- **Activity Tagging** — Associate activities with moods (work, exercise, reading, etc.)
- **Quick Notes** — Add context to your mood entries
- **History** — Browse recent entries with timestamps

### 📊 Analytics & Insights
- **Streak Counter** — Track consecutive days of logging
- **Mood Breakdown** — Visual percentage bars of mood distribution
- **Activity Impact** — See how activities affect your mood (1-5 scale)
- **Recent Trends** — 7-day mood trend overview
- **Average Mood** — Overall mood score across all entries

### 📅 Calendar View
- **Month Navigation** — Browse mood history by month
- **Mood Dots** — Color-coded days based on average mood
- **Today Highlight** — Quick visual reference for current day

### 🎯 Goals Tracking
- **Weekly/Monthly Goals** — Set targets for activities
- **Progress Bars** — Visual progress toward goals
- **Customizable** — Multiple goal periods (daily, weekly, monthly)

### 🔄 Sync & Offline
- **Cloud Sync** — Firebase Firestore sync across devices
- **Offline Queue** — Save entries offline, auto-sync when reconnected
- **PWA Support** — Install on device, works without internet
- **Export Data** — Download mood history as CSV

### 📱 UX Polish
- **Edit Entries** — Tap to edit mood, activities, or notes
- **Undo Delete** — 3-second undo window after deletion
- **Haptic Feedback** — Tactile feedback on interactions (mobile)
- **Dark Mode** — Full inversion toggle
- **Loading Skeleton** — Smooth loading states
- **Confirmation Dialogs** — Prevent accidental data loss

---

## 🛠️ Tech Stack

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

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19.0+ or 22.12.0+
- npm (comes with Node.js)

### Installation
```sh
npm install --legacy-peer-deps
```

### Development
```sh
npm run dev
```

### Production Build
```sh
npm run build
```

### Preview Production Build
```sh
npm run preview
```

---

## 📦 Key Commands

```sh
# Type-check
npm run type-check

# Lint & format
npm run lint
npm run format

# Build
npm run build

# Deploy to GitHub Pages
npm run deploy:github

# Deploy to Firebase Hosting
npm run deploy:firebase
```

---

## 🎨 Design Philosophy

### Brutalist Monochrome
- **Black & White Only** — No colors, pure monochrome aesthetic
- **Monospace Font** — Courier New throughout for consistency
- **1px Borders** — Clean, sharp edges
- **No Shadows/Gradients** — Flat, brutalist design

### Mobile-First
- **44px Touch Targets** — Apple HIG compliant
- **iPhone Safe Areas** — Respects Dynamic Island and home indicator
- **Responsive Layout** — Optimized for 480px max-width

---

## 🔐 Firebase Setup

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

## 📱 PWA Features

- **Service Worker** — Precaches all assets + caches Firebase API responses
- **Installable** — Prompts "Add to Home Screen" on mobile
- **Auto-Update** — Shows update banner when new version available
- **Offline-Ready** — App shell + cached data works without network
- **Background Sync** — Queues offline entries, syncs when reconnected

---

## 📊 Data Export

Export your mood history as CSV:
1. Go to the Log tab
2. Click the **EXP** button (visible when you have entries)
3. Downloads `mood-data-YYYY-MM-DD.csv`

CSV includes:
- Date & Time
- Mood name & value (1-5)
- Activities (comma-separated)
- Notes

---

## 🌐 Deployment

### GitHub Pages (Primary)
Push to `main` → GitHub Actions builds and deploys automatically.

### Firebase Hosting (Alternative)
```sh
npm install -g firebase-tools
firebase login
firebase deploy --only hosting
```

---

## 📁 Project Structure

```
src/
├── assets/
│   ├── main.css          # All styles — monochrome brutalist
│   └── base.css          # Minimal reset
├── components/
│   ├── ActivitySelector.vue   # Activity grid
│   ├── AppHeader.vue          # Top bar
│   ├── AuthView.vue           # Login/register screen
│   ├── BottomNav.vue          # Tab navigation
│   ├── CalendarView.vue       # Month calendar with mood dots
│   ├── EntryForm.vue          # Main entry form + history
│   ├── GoalsView.vue          # Goals tracking
│   ├── MoodSelector.vue       # Mood picker (1-5)
│   ├── StatsView.vue          # Analytics & trends
│   ├── Toast.vue              # Update notification
│   └── UserMenu.vue           # User display + sign out
├── stores/
│   ├── auth.ts           # Firebase auth + Firestore helpers
│   └── mood.ts           # Mood data, localStorage, stats
├── App.vue               # Root component
├── firebase.ts           # Firebase initialization
├── main.ts               # PWA register → Vue mount
├── sw.ts                 # Service worker configuration
└── vite-env.d.ts         # Type declarations
```

---

## 🔧 Notes

- `--legacy-peer-deps` is required due to vite-plugin-pwa version conflicts
- Base path is `/how-you-feeling/` for GitHub Pages
- Firebase API key is safe (web client key, not service account)
- Haptic feedback requires mobile device with Vibration API support

---

## 📈 Version History

- **v1.2.0** — Edit entries, streak counter, offline queue, CSV export, undo delete, haptic feedback, loading skeleton
- **v1.0.0** — Initial release: mood tracking, activities, cloud sync, PWA

---

## 📄 License

MIT License — See LICENSE file for details

---

**Built with Vue 3 + TypeScript + Firebase**
