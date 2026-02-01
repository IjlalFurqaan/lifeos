import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore, connectFirestoreEmulator, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Singleton instances
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

// Check if Firebase is properly configured
export const isFirebaseConfigured = (): boolean => {
    return Boolean(
        firebaseConfig.apiKey &&
        firebaseConfig.authDomain &&
        firebaseConfig.projectId
    );
};

// Initialize Firebase
export const initializeFirebase = async (): Promise<void> => {
    if (!isFirebaseConfigured()) {
        console.warn('Firebase not configured. Running in offline mode.');
        return;
    }

    if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);

        // Enable offline persistence for Firestore
        try {
            await enableIndexedDbPersistence(db);
            console.log('Firestore offline persistence enabled');
        } catch (err: any) {
            if (err.code === 'failed-precondition') {
                console.warn('Multiple tabs open, persistence enabled in first tab only');
            } else if (err.code === 'unimplemented') {
                console.warn('Browser does not support persistence');
            }
        }

        // Initialize Analytics (only in production and if supported)
        if (import.meta.env.PROD) {
            const analyticsSupported = await isSupported();
            if (analyticsSupported) {
                analytics = getAnalytics(app);
            }
        }

        // Use emulators in development if configured
        if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
            connectAuthEmulator(auth, 'http://localhost:9099');
            connectFirestoreEmulator(db, 'localhost', 8080);
            console.log('Using Firebase emulators');
        }
    } else {
        app = getApps()[0];
        auth = getAuth(app);
        db = getFirestore(app);
    }
};

// Get Firebase instances
export const getFirebaseApp = (): FirebaseApp | null => app;
export const getFirebaseAuth = (): Auth | null => auth;
export const getFirebaseDb = (): Firestore | null => db;
export const getFirebaseAnalytics = (): Analytics | null => analytics;

// Export config check for components
export { firebaseConfig };
