
'use client';

import { useEffect, useState, useMemo } from "react";
import { FirebaseProvider } from "./provider";
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

// This component is the single source of truth for Firebase initialization on the client.
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
    const [firebaseInstances, setFirebaseInstances] = useState<{
        app: FirebaseApp;
        auth: Auth;
        firestore: Firestore;
    } | null>(null);

    useEffect(() => {
        const firebaseConfig = {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };

        // Initialize Firebase only once
        if (!getApps().length) {
            app = initializeApp(firebaseConfig);
        } else {
            app = getApp();
        }
        
        auth = getAuth(app);
        firestore = getFirestore(app);

        setFirebaseInstances({ app, auth, firestore });
    }, []);

    // Return a loading state or null until Firebase is initialized.
    if (!firebaseInstances) {
        return null;
    }

    // Once initialized, provide the instances to the rest of the app.
    return <FirebaseProvider instances={firebaseInstances}>{children}</FirebaseProvider>
}
