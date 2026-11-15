import { getFirestoreDb } from './firebase'
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  increment,
  serverTimestamp
} from 'firebase/firestore'

export interface UserStats {
  xp: number
  level: number
  totalAttempts: number
  gamesPlayed: Record<string, number>
}

// Fetch or initialize user stats in Firestore
export async function getUserStats(uid: string): Promise<UserStats> {
  const db = getFirestoreDb()
  const userRef = doc(db, 'users', uid)
  const snap = await getDoc(userRef)

  if (snap.exists()) {
    const data = snap.data()
    return {
      xp: data.xp || 0,
      level: Math.floor((data.xp || 0) / 100) + 1,
      totalAttempts: data.totalAttempts || 0,
      gamesPlayed: data.gamesPlayed || {}
    }
  }

  const defaultStats: UserStats = {
    xp: 0,
    level: 1,
    totalAttempts: 0,
    gamesPlayed: {}
  }

  await setDoc(userRef, { ...defaultStats, createdAt: serverTimestamp() }, { merge: true })
  return defaultStats
}

// Update user stats directly (called from GamePage for quick XP & attempt increments)
export async function updateUserStats(
  uid: string,
  { xpGained, gameId }: { xpGained: number; gameId: string }
) {
  const db = getFirestoreDb()
  const userRef = doc(db, 'users', uid)
  
  await setDoc(
    userRef,
    {
      xp: increment(xpGained),
      totalAttempts: increment(1),
      [`gamesPlayed.${gameId}`]: increment(1)
    },
    { merge: true }
  )

  return xpGained
}

// Save a completed challenge attempt with detailed prompt and image data
export async function recordGameResult(
  uid: string,
  gameId: string,
  score: number,
  prompt: string,
  imageUrl?: string
) {
  const earnedXp = Math.max(10, Math.round(score * 0.5))

  const db = getFirestoreDb()
  const attemptsRef = collection(db, 'users', uid, 'attempts')
  await addDoc(attemptsRef, {
    gameId,
    prompt,
    score,
    imageUrl: imageUrl || null,
    xpAwarded: earnedXp,
    createdAt: serverTimestamp()
  })

  const userRef = doc(db, 'users', uid)
  await setDoc(
    userRef,
    {
      xp: increment(earnedXp),
      totalAttempts: increment(1),
      [`gamesPlayed.${gameId}`]: increment(1)
    },
    { merge: true }
  )

  return earnedXp
}