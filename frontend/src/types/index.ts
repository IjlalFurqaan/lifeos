// Core types for LifeOS

export interface User {
    id: string;
    name: string;
    avatar?: string;
    xp: number;
    level: number;
    streak: number;
    joinedAt: string;
}

export interface Goal {
    id: string;
    title: string;
    description: string;
    category: 'career' | 'health' | 'finance' | 'personal' | 'learning' | 'relationships';
    deadline?: string;
    milestones: Milestone[];
    progress: number;
    createdAt: string;
    completedAt?: string;
}

export interface Milestone {
    id: string;
    title: string;
    completed: boolean;
    completedAt?: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    priority: 'urgent' | 'high' | 'medium' | 'low';
    category?: string;
    dueDate?: string;
    completed: boolean;
    completedAt?: string;
    createdAt: string;
    goalId?: string;
}

export interface Habit {
    id: string;
    title: string;
    description?: string;
    frequency: 'daily' | 'weekly';
    icon: string;
    color: string;
    streak: number;
    bestStreak: number;
    completedDates: string[];
    createdAt: string;
}

export interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    currency?: string; // Currency code (e.g., 'USD', 'EUR', 'INR')
    category: string;
    description: string;
    date: string;
    createdAt: string;
}

export interface Budget {
    id: string;
    category: string;
    limit: number;
    spent: number;
    period: 'monthly' | 'weekly';
}

export interface HealthEntry {
    id: string;
    date: string;
    workout?: {
        type: string;
        duration: number;
        calories?: number;
    };
    water: number;
    sleep?: number;
    mood?: 1 | 2 | 3 | 4 | 5;
    notes?: string;
}

export interface LearningItem {
    id: string;
    title: string;
    type: 'course' | 'book' | 'skill' | 'project';
    category: string;
    progress: number;
    notes?: string;
    startedAt: string;
    completedAt?: string;
}

export interface Idea {
    id: string;
    title: string;
    content: string;
    category?: string;
    tags: string[];
    pinned: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface FocusSession {
    id: string;
    duration: number;
    type: 'pomodoro' | 'deep-work' | 'custom';
    taskId?: string;
    completedAt: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    xpReward: number;
    unlockedAt?: string;
    condition: {
        type: string;
        target: number;
    };
}

export interface DailyReflection {
    id: string;
    date: string;
    gratitude: string[];
    wins: string[];
    improvements: string[];
    mood: 1 | 2 | 3 | 4 | 5;
    energyLevel: 1 | 2 | 3 | 4 | 5;
}

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
