// Local storage utilities for LifeOS data persistence

const STORAGE_PREFIX = 'lifeos_';

export const storage = {
    get: <T>(key: string, defaultValue: T): T => {
        try {
            const item = localStorage.getItem(STORAGE_PREFIX + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },

    set: <T>(key: string, value: T): void => {
        try {
            localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    remove: (key: string): void => {
        localStorage.removeItem(STORAGE_PREFIX + key);
    },

    clear: (): void => {
        Object.keys(localStorage)
            .filter(key => key.startsWith(STORAGE_PREFIX))
            .forEach(key => localStorage.removeItem(key));
    },
};

// Storage keys
export const STORAGE_KEYS = {
    USER: 'user',
    GOALS: 'goals',
    TASKS: 'tasks',
    HABITS: 'habits',
    TRANSACTIONS: 'transactions',
    BUDGETS: 'budgets',
    HEALTH: 'health',
    LEARNING: 'learning',
    IDEAS: 'ideas',
    FOCUS_SESSIONS: 'focus_sessions',
    ACHIEVEMENTS: 'achievements',
    REFLECTIONS: 'reflections',
    SETTINGS: 'settings',
    GEMINI_KEY: 'gemini_key',
} as const;
