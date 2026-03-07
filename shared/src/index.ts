// Core types for LifeOS - Shared between frontend and backend

// ============ User & Auth ============
export interface User {
    id: string;
    email?: string;
    name: string;
    avatar?: string;
    xp: number;
    level: number;
    streak: number;
    lastActiveAt?: string;
    createdAt?: string;
    joinedAt?: string; // Alias for frontend compatibility
}

export interface AuthResponse {
    token: string;
    user: User;
}

// ============ Goals ============
export interface Goal {
    id: string;
    title: string;
    description?: string;
    category: GoalCategory;
    progress: number;
    targetDate?: string;
    deadline?: string; // Alias for frontend compatibility
    milestones: Milestone[];
    createdAt: string;
    completedAt?: string;
    userId?: string;
}

export type GoalCategory = 'career' | 'health' | 'finance' | 'personal' | 'learning' | 'relationships';

export interface Milestone {
    id: string;
    title: string;
    completed: boolean;
    completedAt?: string;
    goalId?: string;
}

// ============ Tasks ============
export interface Task {
    id: string;
    title: string;
    description?: string;
    priority: TaskPriority;
    category?: string;
    dueDate?: string;
    completed: boolean;
    completedAt?: string;
    createdAt: string;
    goalId?: string;
    userId?: string;
}

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

// ============ Habits ============
export interface Habit {
    id: string;
    name?: string;
    title?: string; // Alias for frontend compatibility
    description?: string;
    frequency: 'daily' | 'weekly';
    icon: string;
    color: string;
    streak: number;
    bestStreak: number;
    completedDates: string[];
    createdAt: string;
    userId?: string;
}

// ============ Finance ============
export interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description?: string;
    date: string;
    createdAt: string;
    userId?: string;
}

export interface Budget {
    id: string;
    category: string;
    limit: number;
    spent: number;
    period: 'monthly' | 'weekly';
}

// ============ Health ============
export interface HealthEntry {
    id: string;
    date: string;
    waterIntake: number;
    water?: number; // Alias for frontend compatibility
    sleepHours?: number;
    sleep?: number; // Alias for frontend compatibility
    mood?: MoodLevel | MoodString;
    workouts?: Workout[];
    workout?: {
        type: string;
        duration: number;
        calories?: number;
    };
    notes?: string;
    createdAt?: string;
    userId?: string;
}

export type MoodLevel = 1 | 2 | 3 | 4 | 5;
export type MoodString = 'great' | 'good' | 'okay' | 'bad' | 'terrible';

export interface Workout {
    id: string;
    type: string;
    duration: number;
    caloriesBurned?: number;
    notes?: string;
    healthEntryId?: string;
}

// ============ Learning ============
export interface LearningItem {
    id: string;
    title: string;
    type: LearningType;
    category: string;
    progress: number;
    notes?: string;
    url?: string;
    startedAt?: string;
    createdAt?: string;
    completedAt?: string;
    userId?: string;
}

export type LearningType = 'course' | 'book' | 'skill' | 'project';

// ============ Ideas ============
export interface Idea {
    id: string;
    title: string;
    content?: string;
    category?: string;
    tags: string[];
    isPinned?: boolean;
    pinned?: boolean; // Alias for frontend compatibility
    createdAt: string;
    updatedAt?: string;
    userId?: string;
}

// ============ Focus ============
export interface FocusSession {
    id: string;
    duration: number;
    type: FocusType;
    taskId?: string;
    completedAt: string;
    userId?: string;
}

export type FocusType = 'pomodoro' | 'shortBreak' | 'longBreak' | 'deep-work' | 'custom';

// ============ Achievements ============
export interface Achievement {
    id: string;
    name?: string;
    title?: string; // Alias for frontend compatibility
    description: string;
    icon: string;
    xpReward?: number;
    unlockedAt?: string;
    condition?: {
        type: string;
        target: number;
    };
    userId?: string;
}

// ============ Reflections ============
export interface DailyReflection {
    id: string;
    date: string;
    gratitude: string[];
    wins: string[];
    improvements: string[];
    mood: MoodLevel;
    energyLevel: MoodLevel;
}

// ============ Module Types ============
export type ModuleType =
    | 'dashboard'
    | 'goals'
    | 'tasks'
    | 'habits'
    | 'finance'
    | 'health'
    | 'learning'
    | 'ideas'
    | 'focus'
    | 'analytics'
    | 'settings';

// ============ API Types ============
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}
