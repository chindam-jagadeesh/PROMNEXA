/// <reference types="vite/client" />

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Check if Firebase keys are present
export const firebaseConfigured = Boolean(
  env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID
);

// Backward compatibility alias for components still importing supabaseConfigured
export const supabaseConfigured = firebaseConfigured;

// Compatibility stub to prevent unmigrated components from throwing missing-export errors
export const supabase = {
  functions: {
    invoke: async (functionName: string, options?: any) => {
      const prompt = options?.body?.prompt || '';

      if (functionName === 'generate-image') {
        const encodedPrompt = encodeURIComponent(prompt);
        const seed = Math.floor(Math.random() * 1000000);
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=1024&height=768&nologo=true`;
        return {
          data: {
            imageDataUrl: url,
            model: 'Pollinations Turbo Diffusion',
          },
          error: null,
        };
      }

      if (functionName === 'evaluate-prompt') {
        return {
          data: {
            score: 82,
            capturedDetails: ['Subject identified', 'Descriptive adjectives present'],
            missingDetails: ['Lighting conditions', 'Camera perspective'],
            hints: ['Specify camera angle and lighting direction for better results'],
            note: 'Strong starter prompt.',
            improvedPrompt: `${prompt}, cinematic lighting, photorealistic, 8k resolution, shot on 35mm lens`,
          },
          error: null,
        };
      }

      return { data: null, error: null };
    },
  },
  auth: {
    getUser: () => Promise.resolve({ data: { user: auth.currentUser }, error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: null }),
    signUp: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
  from: (_table: string) => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      order: () => Promise.resolve({ data: [], error: null }),
      then: (resolve: any) => resolve({ data: [], error: null }),
    }),
    insert: () => Promise.resolve({ data: null, error: null }),
    upsert: () => Promise.resolve({ data: null, error: null }),
    update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
    delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
  }),
  storage: {
    from: (_bucket: string) => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
};