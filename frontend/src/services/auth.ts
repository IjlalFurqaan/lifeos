import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    User,
    UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from './firebase';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Types
export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    xp: number;
    level: number;
    streak: number;
    joinedAt: string;
    lastActiveAt: string;
}

// Convert Firebase User to AuthUser
const toAuthUser = (user: User): AuthUser => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
});

// Create user profile in Firestore
const createUserProfile = async (user: User): Promise<void> => {
    const db = getFirebaseDb();
    if (!db) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const profile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'User',
            photoURL: user.photoURL || undefined,
            xp: 0,
            level: 1,
            streak: 0,
            joinedAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
        };

        await setDoc(userRef, {
            ...profile,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    } else {
        // Update last active
        await setDoc(userRef, { lastActiveAt: new Date().toISOString(), updatedAt: serverTimestamp() }, { merge: true });
    }
};

// Sign up with email and password
export const signUpWithEmail = async (
    email: string,
    password: string,
    displayName: string
): Promise<AuthUser> => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase not initialized');

    const credential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update display name
    await updateProfile(credential.user, { displayName });

    // Create user profile in Firestore
    await createUserProfile(credential.user);

    return toAuthUser(credential.user);
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<AuthUser> => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase not initialized');

    const credential = await signInWithEmailAndPassword(auth, email, password);
    await createUserProfile(credential.user);

    return toAuthUser(credential.user);
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<AuthUser> => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase not initialized');

    const credential = await signInWithPopup(auth, googleProvider);
    await createUserProfile(credential.user);

    return toAuthUser(credential.user);
};

// Sign out
export const signOut = async (): Promise<void> => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase not initialized');

    await firebaseSignOut(auth);
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase not initialized');

    await sendPasswordResetEmail(auth, email);
};

// Subscribe to auth state changes
export const subscribeToAuthState = (
    callback: (user: AuthUser | null) => void
): (() => void) => {
    const auth = getFirebaseAuth();
    if (!auth) {
        callback(null);
        return () => { };
    }

    return onAuthStateChanged(auth, (user) => {
        callback(user ? toAuthUser(user) : null);
    });
};

// Get current user
export const getCurrentUser = (): AuthUser | null => {
    const auth = getFirebaseAuth();
    if (!auth?.currentUser) return null;
    return toAuthUser(auth.currentUser);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    const auth = getFirebaseAuth();
    return Boolean(auth?.currentUser);
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const db = getFirebaseDb();
    if (!db) return null;

    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
    }

    return null;
};

// Update user profile
export const updateUserProfile = async (
    uid: string,
    updates: Partial<UserProfile>
): Promise<void> => {
    const db = getFirebaseDb();
    if (!db) return;

    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { ...updates, updatedAt: serverTimestamp() }, { merge: true });
};
