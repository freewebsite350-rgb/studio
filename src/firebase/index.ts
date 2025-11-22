
'use client';
import { useAuthUser, useFirestore, FirebaseProvider } from './provider';
import { FirebaseClientProvider } from './client-provider';

// This file intentionally does not export useUser since auth is disabled.

export {
  FirebaseProvider,
  FirebaseClientProvider,
  useFirestore,
  useAuthUser
};
