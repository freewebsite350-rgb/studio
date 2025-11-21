
'use client';
import { FirebaseApp, getApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { useUser } from './auth/use-user';
import { useAuthUser, useFirestore, FirebaseProvider } from './provider';
import { FirebaseClientProvider } from './client-provider';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

function initializeFirebase() {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  
  // This is a sanity check to ensure the config is not empty.
  if (!firebaseConfig.apiKey) {
    console.error("Firebase config is missing. Check your .env file.");
    // We will still try to initialize, but it will likely fail.
  }

  try {
    app = getApp();
  } catch (e) {
    app = initializeApp(firebaseConfig);
  }
  auth = getAuth(app);
  firestore = getFirestore(app);
  return { app, auth, firestore };
}

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useUser,
  useFirestore,
  useAuthUser
};
