import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    Timestamp,
    QueryConstraint,
    DocumentData,
    Unsubscribe,
    QuerySnapshot,
    DocumentSnapshot,
    QueryDocumentSnapshot,
} from 'firebase/firestore';
import { getFirebaseDb } from './firebase';
import type { Goal, Task, Habit, Transaction, HealthEntry, LearningItem, Idea, FocusSession } from '../types';

// Collection names
export const COLLECTIONS = {
    USERS: 'users',
    GOALS: 'goals',
    TASKS: 'tasks',
    HABITS: 'habits',
    TRANSACTIONS: 'transactions',
    HEALTH_ENTRIES: 'healthEntries',
    LEARNING_ITEMS: 'learningItems',
    IDEAS: 'ideas',
    FOCUS_SESSIONS: 'focusSessions',
    ACHIEVEMENTS: 'achievements',
    REFLECTIONS: 'reflections',
} as const;

// Helper to get user collection reference
const getUserCollection = (userId: string, collectionName: string) => {
    const db = getFirebaseDb();
    if (!db) throw new Error('Firestore not initialized');
    return collection(db, COLLECTIONS.USERS, userId, collectionName);
};

// Helper to get user document reference
const getUserDoc = (userId: string, collectionName: string, docId: string) => {
    const db = getFirebaseDb();
    if (!db) throw new Error('Firestore not initialized');
    return doc(db, COLLECTIONS.USERS, userId, collectionName, docId);
};

// Convert Firestore timestamp to ISO string
const convertTimestamps = <T extends DocumentData>(data: T): T => {
    const result = { ...data };
    for (const key in result) {
        const val = (result as any)[key];
        if (val instanceof Timestamp) {
            (result as any)[key] = val.toDate().toISOString();
        }
    }
    return result;
};

// Generic CRUD operations
export const firestoreService = {
    // Create document
    async create<T extends { id: string }>(
        userId: string,
        collectionName: string,
        data: Omit<T, 'id'>
    ): Promise<string> {
        const collectionRef = getUserCollection(userId, collectionName);
        const docRef = await addDoc(collectionRef, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    },

    // Create with custom ID
    async createWithId<T extends { id: string }>(
        userId: string,
        collectionName: string,
        docId: string,
        data: Omit<T, 'id'>
    ): Promise<void> {
        const db = getFirebaseDb();
        if (!db) throw new Error('Firestore not initialized');

        const docRef = doc(db, COLLECTIONS.USERS, userId, collectionName, docId);
        const { id, ...dataWithoutId } = data as any;
        await updateDoc(docRef, {
            ...dataWithoutId,
            id: docId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }).catch(async () => {
            // Document doesn't exist, create it
            const { setDoc } = await import('firebase/firestore');
            await setDoc(docRef, {
                ...dataWithoutId,
                id: docId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        });
    },

    // Read single document
    async get<T>(
        userId: string,
        collectionName: string,
        docId: string
    ): Promise<T | null> {
        const docRef = getUserDoc(userId, collectionName, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...convertTimestamps(docSnap.data()) } as T;
        }
        return null;
    },

    // Read all documents in collection
    async getAll<T>(
        userId: string,
        collectionName: string,
        ...queryConstraints: QueryConstraint[]
    ): Promise<T[]> {
        const collectionRef = getUserCollection(userId, collectionName);
        const q = queryConstraints.length > 0
            ? query(collectionRef, ...queryConstraints)
            : collectionRef;

        const querySnap = await getDocs(q);
        return querySnap.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...convertTimestamps(doc.data()),
        })) as T[];
    },

    // Update document
    async update<T>(
        userId: string,
        collectionName: string,
        docId: string,
        data: Partial<T>
    ): Promise<void> {
        const docRef = getUserDoc(userId, collectionName, docId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    },

    // Delete document
    async delete(
        userId: string,
        collectionName: string,
        docId: string
    ): Promise<void> {
        const docRef = getUserDoc(userId, collectionName, docId);
        await deleteDoc(docRef);
    },

    // Subscribe to collection changes (real-time)
    subscribe<T>(
        userId: string,
        collectionName: string,
        callback: (data: T[]) => void,
        ...queryConstraints: QueryConstraint[]
    ): Unsubscribe {
        const collectionRef = getUserCollection(userId, collectionName);
        const q = queryConstraints.length > 0
            ? query(collectionRef, ...queryConstraints)
            : collectionRef;

        return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
            const data = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
                id: doc.id,
                ...convertTimestamps(doc.data()),
            })) as T[];
            callback(data);
        });
    },

    // Subscribe to single document changes
    subscribeToDoc<T>(
        userId: string,
        collectionName: string,
        docId: string,
        callback: (data: T | null) => void
    ): Unsubscribe {
        const docRef = getUserDoc(userId, collectionName, docId);

        return onSnapshot(docRef, (docSnap: DocumentSnapshot<DocumentData>) => {
            if (docSnap.exists()) {
                callback({ id: docSnap.id, ...convertTimestamps(docSnap.data()) } as T);
            } else {
                callback(null);
            }
        });
    },
};

// Typed service functions for each collection
export const goalsService = {
    create: (userId: string, goal: Omit<Goal, 'id'>) =>
        firestoreService.create<Goal>(userId, COLLECTIONS.GOALS, goal),
    getAll: (userId: string) =>
        firestoreService.getAll<Goal>(userId, COLLECTIONS.GOALS, orderBy('createdAt', 'desc')),
    update: (userId: string, id: string, data: Partial<Goal>) =>
        firestoreService.update<Goal>(userId, COLLECTIONS.GOALS, id, data),
    delete: (userId: string, id: string) =>
        firestoreService.delete(userId, COLLECTIONS.GOALS, id),
    subscribe: (userId: string, callback: (goals: Goal[]) => void) =>
        firestoreService.subscribe<Goal>(userId, COLLECTIONS.GOALS, callback, orderBy('createdAt', 'desc')),
};

export const tasksService = {
    create: (userId: string, task: Omit<Task, 'id'>) =>
        firestoreService.create<Task>(userId, COLLECTIONS.TASKS, task),
    getAll: (userId: string) =>
        firestoreService.getAll<Task>(userId, COLLECTIONS.TASKS, orderBy('createdAt', 'desc')),
    update: (userId: string, id: string, data: Partial<Task>) =>
        firestoreService.update<Task>(userId, COLLECTIONS.TASKS, id, data),
    delete: (userId: string, id: string) =>
        firestoreService.delete(userId, COLLECTIONS.TASKS, id),
    subscribe: (userId: string, callback: (tasks: Task[]) => void) =>
        firestoreService.subscribe<Task>(userId, COLLECTIONS.TASKS, callback, orderBy('createdAt', 'desc')),
};

export const habitsService = {
    create: (userId: string, habit: Omit<Habit, 'id'>) =>
        firestoreService.create<Habit>(userId, COLLECTIONS.HABITS, habit),
    getAll: (userId: string) =>
        firestoreService.getAll<Habit>(userId, COLLECTIONS.HABITS),
    update: (userId: string, id: string, data: Partial<Habit>) =>
        firestoreService.update<Habit>(userId, COLLECTIONS.HABITS, id, data),
    delete: (userId: string, id: string) =>
        firestoreService.delete(userId, COLLECTIONS.HABITS, id),
    subscribe: (userId: string, callback: (habits: Habit[]) => void) =>
        firestoreService.subscribe<Habit>(userId, COLLECTIONS.HABITS, callback),
};

export const transactionsService = {
    create: (userId: string, transaction: Omit<Transaction, 'id'>) =>
        firestoreService.create<Transaction>(userId, COLLECTIONS.TRANSACTIONS, transaction),
    getAll: (userId: string) =>
        firestoreService.getAll<Transaction>(userId, COLLECTIONS.TRANSACTIONS, orderBy('date', 'desc')),
    delete: (userId: string, id: string) =>
        firestoreService.delete(userId, COLLECTIONS.TRANSACTIONS, id),
    subscribe: (userId: string, callback: (transactions: Transaction[]) => void) =>
        firestoreService.subscribe<Transaction>(userId, COLLECTIONS.TRANSACTIONS, callback, orderBy('date', 'desc')),
};

export const healthService = {
    create: (userId: string, entry: Omit<HealthEntry, 'id'>) =>
        firestoreService.create<HealthEntry>(userId, COLLECTIONS.HEALTH_ENTRIES, entry),
    getAll: (userId: string) =>
        firestoreService.getAll<HealthEntry>(userId, COLLECTIONS.HEALTH_ENTRIES, orderBy('date', 'desc')),
    update: (userId: string, id: string, data: Partial<HealthEntry>) =>
        firestoreService.update<HealthEntry>(userId, COLLECTIONS.HEALTH_ENTRIES, id, data),
    subscribe: (userId: string, callback: (entries: HealthEntry[]) => void) =>
        firestoreService.subscribe<HealthEntry>(userId, COLLECTIONS.HEALTH_ENTRIES, callback, orderBy('date', 'desc')),
};

export const learningService = {
    create: (userId: string, item: Omit<LearningItem, 'id'>) =>
        firestoreService.create<LearningItem>(userId, COLLECTIONS.LEARNING_ITEMS, item),
    getAll: (userId: string) =>
        firestoreService.getAll<LearningItem>(userId, COLLECTIONS.LEARNING_ITEMS),
    update: (userId: string, id: string, data: Partial<LearningItem>) =>
        firestoreService.update<LearningItem>(userId, COLLECTIONS.LEARNING_ITEMS, id, data),
    delete: (userId: string, id: string) =>
        firestoreService.delete(userId, COLLECTIONS.LEARNING_ITEMS, id),
    subscribe: (userId: string, callback: (items: LearningItem[]) => void) =>
        firestoreService.subscribe<LearningItem>(userId, COLLECTIONS.LEARNING_ITEMS, callback),
};

export const ideasService = {
    create: (userId: string, idea: Omit<Idea, 'id'>) =>
        firestoreService.create<Idea>(userId, COLLECTIONS.IDEAS, idea),
    getAll: (userId: string) =>
        firestoreService.getAll<Idea>(userId, COLLECTIONS.IDEAS, orderBy('createdAt', 'desc')),
    update: (userId: string, id: string, data: Partial<Idea>) =>
        firestoreService.update<Idea>(userId, COLLECTIONS.IDEAS, id, data),
    delete: (userId: string, id: string) =>
        firestoreService.delete(userId, COLLECTIONS.IDEAS, id),
    subscribe: (userId: string, callback: (ideas: Idea[]) => void) =>
        firestoreService.subscribe<Idea>(userId, COLLECTIONS.IDEAS, callback, orderBy('createdAt', 'desc')),
};

export const focusService = {
    create: (userId: string, session: Omit<FocusSession, 'id'>) =>
        firestoreService.create<FocusSession>(userId, COLLECTIONS.FOCUS_SESSIONS, session),
    getAll: (userId: string) =>
        firestoreService.getAll<FocusSession>(userId, COLLECTIONS.FOCUS_SESSIONS, orderBy('completedAt', 'desc')),
    subscribe: (userId: string, callback: (sessions: FocusSession[]) => void) =>
        firestoreService.subscribe<FocusSession>(userId, COLLECTIONS.FOCUS_SESSIONS, callback, orderBy('completedAt', 'desc')),
};
