
'use client';

import { useEffect, useState } from "react";
import { FirebaseProvider } from "./provider";

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
    const [isFirebaseInitialized, setFirebaseInitialized] = useState(false);

    useEffect(() => {
        // The dynamic import ensures that Firebase is only loaded on the client side.
        import('./index').then((firebaseModule) => {
            firebaseModule.initializeFirebase();
            setFirebaseInitialized(true);
        });
    }, []);

    if (!isFirebaseInitialized) {
        // You can return a loading spinner or null here
        return null;
    }

    return <FirebaseProvider>{children}</FirebaseProvider>
}
