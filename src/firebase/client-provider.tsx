
'use client';

import { useEffect, useState } from "react";
import { FirebaseProvider } from "./provider";
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;


function MissingEnvVarsMessage() {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-background">
            <div className="max-w-md rounded-lg border bg-card p-8 text-card-foreground shadow-lg">
                <h1 className="text-2xl font-bold text-destructive">Configuration Error</h1>
                <p className="mt-2 text-muted-foreground">
                    Your Firebase environment variables are not set. The application cannot connect to Firebase without them.
                </p>
                <div className="mt-6">
                    <p className="font-semibold">What to do:</p>
                    <ol className="mt-2 list-inside list-decimal space-y-1 text-sm">
                        <li>Create a <code className="bg-muted px-1 py-0.5 rounded-sm">.env.local</code> file in the root of your project.</li>
                        <li>Add your Firebase project configuration to it. You can get this from the Firebase Console.</li>
                    </ol>
                </div>
                <div className="mt-4 rounded-md bg-secondary p-4 font-mono text-xs text-secondary-foreground">
                    <p>NEXT_PUBLIC_FIREBASE_API_KEY=..._</p>
                    <p>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...</p>
                    <p>NEXT_PUBLIC_FIREBASE_PROJECT_ID=...</p>
                    <p>...</p>
                </div>
                 <p className="mt-4 text-xs text-muted-foreground">
                    After adding your keys, you will need to restart the development server.
                </p>
            </div>
        </div>
    );
}


// This component is the single source of truth for Firebase initialization on the client.
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
    const [firebaseInstances, setFirebaseInstances] = useState<{
        app: FirebaseApp;
        auth: Auth;
        firestore: Firestore;
    } | null>(null);

    const [isConfigMissing, setIsConfigMissing] = useState(false);

    useEffect(() => {
        const firebaseConfig = {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };

        if (!firebaseConfig.apiKey) {
            setIsConfigMissing(true);
            return;
        }

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

    if (isConfigMissing) {
        return <MissingEnvVarsMessage />;
    }

    // Return a loading state or null until Firebase is initialized.
    if (!firebaseInstances) {
        return null;
    }

    // Once initialized, provide the instances to the rest of the app.
    return <FirebaseProvider instances={firebaseInstances}>{children}</FirebaseProvider>
}
