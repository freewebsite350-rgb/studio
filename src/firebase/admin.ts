
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    // Check if the service account environment variable is set
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
        throw new Error('The FIREBASE_SERVICE_ACCOUNT environment variable is not set. It is required for server-side Firebase operations.');
    }
    
    // Parse the service account key from the environment variable
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const adminDb = admin.firestore();

export { admin, adminDb };
