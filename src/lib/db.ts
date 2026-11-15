import { getFirestoreDb } from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  xp: number;
  level: number;
  createdAt?: any;
}

// Fetch or initialize user profile
export async function getOrCreateUserProfile(user: { uid: string; displayName?: string | null; email?: string | null }): Promise<UserProfile> {
  const db = getFirestoreDb();
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    return snap.data() as UserProfile;
  }

  const initialProfile: UserProfile = {
    uid: user.uid,
    displayName: user.displayName || 'Prompter',
    email: user.email || '',
    xp: 0,
    level: 1,
    createdAt: serverTimestamp(),
  };

  await setDoc(userRef, initialProfile);
  return initialProfile;
}

// Award XP after completing a challenge/game
export async function addExperience(uid: string, xpPoints: number) {
  const db = getFirestoreDb();
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    xp: increment(xpPoints),
  });
}

// Save a generated prompt history record
export async function savePromptAttempt(uid: string, data: { gameId: string; prompt: string; score?: number; imageUrl?: string }) {
  const db = getFirestoreDb();
  const attemptsRef = collection(db, 'users', uid, 'attempts');
  return await addDoc(attemptsRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
}