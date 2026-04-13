import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  type DocumentData,
} from 'firebase/firestore'
import { auth, db, googleProvider } from '@/firebase'
import type { Mood, MoodEntry, Activity } from '@/stores/mood'
import { MOODS, ACTIVITIES, STORAGE_KEY } from '@/stores/mood'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => user.value !== null)
  const email = computed(() => user.value?.email ?? null)
  const displayName = computed(() => user.value?.displayName ?? null)

  // Initialize auth state
  onAuthStateChanged(auth, (u) => {
    user.value = u
    loading.value = false
  })

  async function login(email: string, password: string) {
    error.value = null
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (e: unknown) {
      error.value = (e as { code?: string }).code?.replace('auth/', '').replace(/-/g, ' ') || 'login failed'
      throw e
    }
  }

  async function register(email: string, password: string) {
    error.value = null
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (e: unknown) {
      error.value = (e as { code?: string }).code?.replace('auth/', '').replace(/-/g, ' ') || 'register failed'
      throw e
    }
  }

  async function loginWithGoogle() {
    error.value = null
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (e: unknown) {
      error.value = (e as { code?: string }).code?.replace('auth/', '').replace(/-/g, ' ') || 'google login failed'
      throw e
    }
  }

  async function logout() {
    await signOut(auth)
  }

  // Firestore helpers
  function userEntriesRef() {
    return collection(db, 'users', user.value!.uid, 'entries')
  }

  async function saveEntryToFirestore(entry: MoodEntry) {
    if (!user.value) return
    await addDoc(userEntriesRef(), entry)
  }

  async function deleteEntryFromFirestore(id: number) {
    if (!user.value) return
    const q = query(userEntriesRef(), where('id', '==', id))
    const snap = await getDocs(q)
    snap.forEach((d) => deleteDoc(doc(db, 'users', user.value!.uid, 'entries', d.id)))
  }

  async function loadEntriesFromFirestore(): Promise<MoodEntry[]> {
    if (!user.value) return []
    const q = query(userEntriesRef(), orderBy('timestamp', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => d.data() as MoodEntry)
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    email,
    displayName,
    login,
    register,
    loginWithGoogle,
    logout,
    saveEntryToFirestore,
    deleteEntryFromFirestore,
    loadEntriesFromFirestore,
  }
})
