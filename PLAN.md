# Improvement & Update Plan

## Phase 1 — Polish (Next)

### UI Fixes
- [ ] **iOS tap ghost** — black flash on tap on non-interactive areas (add `user-select: none`, `-webkit-tap-highlight-color` on body)
- [ ] **Calendar month navigation** — add smooth transition animation
- [ ] **EntryForm save feedback** — haptic feedback on save (Vibration API)
- [ ] **Empty state icons** — replace text with minimal line-art SVGs
- [ ] **Loading skeleton** — show placeholder while Firestore loads on login

### UX Improvements
- [ ] **Undo delete** — 3-second undo toast after deleting an entry
- [ ] **Swipe to delete** — swipe left on history item to reveal delete button
- [ ] **Pull to refresh** — pull down on calendar/stats to sync with Firestore
- [ ] **Confirmation dialog** — before clearing all history
- [ ] **Edit entries** — tap an entry to edit mood, activities, or note

---

## Phase 2 — Features

### Data & Sync
- [ ] **Offline queue** — queue entries when offline, sync when reconnected
- [ ] **Conflict resolution** — merge local + cloud entries on reconnect
- [ ] **Export data** — CSV/PDF download of mood history
- [ ] **Import data** — restore from exported file
- [ ] **Cross-device sync indicator** — show sync status badge

### Analytics
- [ ] **Weekly summary card** — "This week you felt Good 4x, Awful 1x"
- [ ] **Activity correlation chart** — bar chart showing avg mood per activity
- [ ] **Mood trend line** — sparkline graph over last 7/30/90 days
- [ ] **Best/worst days** — identify which day of week has best mood
- [ ] **Streak counter** — consecutive days logged

### Customization
- [ ] **Custom activities** — add/remove/rename activities
- [ ] **Custom moods** — add own mood names and emojis
- [ ] **Multiple goal sets** — weekly + monthly goals with separate tracking
- [ ] **Notes search** — full-text search through mood notes
- [ ] **Filter history** — filter by mood, activity, or date range

---

## Phase 3 — PWA & Performance

### Offline
- [ ] **Background sync** — use BackgroundSync API for reliable sync
- [ ] **IndexedDB** — replace localStorage with IndexedDB for larger storage
- [ ] **Optimistic updates** — show entry immediately, sync in background
- [ ] **Cache strategies** — fine-tune per-route caching (stale-while-revalidate for stats)

### Performance
- [ ] **Virtual scroll** — virtualize long history lists (100+ entries)
- [ ] **Code splitting** — lazy-load Calendar, Stats, Goals views
- [ ] **Image optimization** — compress PWA icons, add SVG versions
- [ ] **Reduce bundle** — tree-shake Firebase modules, remove unused workbox
- [ ] **Web app manifest** — add share_target for "share mood to app"

---

## Phase 4 — Polish & Platform

### iOS Native Feel
- [ ] **Haptic feedback** — light tap on mood select, success on save
- [ ] **Spring animations** — mood select bounce, list item slide-in
- [ ] **Pull-to-refresh gesture** — native-style pull gesture
- [ ] **Bottom sheet** — edit entries in a slide-up sheet
- [ ] **Context menus** — long-press on entry for edit/delete/share

### Accessibility
- [ ] **ARIA labels** — all buttons and interactive elements labeled
- [ ] **Keyboard navigation** — full keyboard support for desktop
- [ ] **Screen reader** — VoiceOver/TalkBack compatible
- [ ] **Reduced motion** — respect `prefers-reduced-motion`
- [ ] **High contrast mode** — support system high contrast

### Social (Optional)
- [ ] **Share mood card** — generate image of today's mood to share
- [ ] **Anonymous aggregates** — opt-in global mood trends by community
- [ ] **Therapist export** — generate PDF report to share with therapist
- [ ] **Reminders** — push notification to log mood at set time

---

## Technical Debt
- [ ] **Remove Playwright deps** — not using e2e tests currently
- [ ] **Upgrade vite-plugin-pwa** — once serialize-javascript vulnerability is fixed upstream
- [ ] **Firebase config** — move to environment variables (`.env`)
- [ ] **TypeScript strict mode** — enable `strict: true` in tsconfig
- [ ] **Component tests** — add Vitest + Vue Test Utils for critical components
- [ ] **CI pipeline** — add test + lint steps to GitHub Actions

---

## Priority Order
1. **iOS tap ghost fix** ← current
2. Undo delete + edit entries
3. Offline queue + IndexedDB
4. Weekly summary + streak counter
5. Export data (CSV/PDF)
6. Custom activities + moods
7. Haptic feedback + animations
8. Accessibility (ARIA, keyboard)
9. Push notification reminders
10. Share mood card + therapist export
