import { initializeApp, getApps, FirebaseApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function initFirebaseClient(): FirebaseApp | null {
  // Do not initialize Firebase on the server (build/SSR)
  if (typeof window === 'undefined') return null;

  // Missing API key -> skip initialization (prevents build-time errors)
  if (!firebaseConfig.apiKey) {
    console.warn('NEXT_PUBLIC_FIREBASE_API_KEY not set; skipping Firebase init');
    return null;
  }

  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }

  return getApps()[0];
}