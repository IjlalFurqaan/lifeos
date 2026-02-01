import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Goal, Task, Habit, Transaction, Budget, HealthEntry, LearningItem, Idea, FocusSession, Achievement, DailyReflection } from '../types';

interface AppState {
    // Auth
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;

    // User
    user: User;
    updateUser: (user: Partial<User>) => void;
    addXP: (amount: number) => void;

    // Goals
    goals: Goal[];
    addGoal: (goal: Goal) => void;
    updateGoal: (id: string, goal: Partial<Goal>) => void;
    deleteGoal: (id: string) => void;

    // Tasks
    tasks: Task[];
    addTask: (task: Task) => void;
    updateTask: (id: string, task: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    toggleTask: (id: string) => void;

    // Habits
    habits: Habit[];
    addHabit: (habit: Habit) => void;
    updateHabit: (id: string, habit: Partial<Habit>) => void;
    deleteHabit: (id: string) => void;
    toggleHabitDay: (id: string, date: string) => void;

    // Finance
    transactions: Transaction[];
    budgets: Budget[];
    addTransaction: (transaction: Transaction) => void;
    deleteTransaction: (id: string) => void;
    updateBudget: (id: string, budget: Partial<Budget>) => void;

    // Health
    healthEntries: HealthEntry[];
    addHealthEntry: (entry: HealthEntry) => void;
    updateHealthEntry: (id: string, entry: Partial<HealthEntry>) => void;

    // Learning
    learningItems: LearningItem[];
    addLearningItem: (item: LearningItem) => void;
    updateLearningItem: (id: string, item: Partial<LearningItem>) => void;
    deleteLearningItem: (id: string) => void;

    // Ideas
    ideas: Idea[];
    addIdea: (idea: Idea) => void;
    updateIdea: (id: string, idea: Partial<Idea>) => void;
    deleteIdea: (id: string) => void;

    // Focus
    focusSessions: FocusSession[];
    addFocusSession: (session: FocusSession) => void;

    // Achievements
    achievements: Achievement[];
    unlockAchievement: (id: string) => void;

    // Reflections
    reflections: DailyReflection[];
    addReflection: (reflection: DailyReflection) => void;

    // Settings
    settings: {
        theme: 'dark' | 'light';
        geminiApiKey: string;
        sidebarCollapsed: boolean;
    };
    updateSettings: (settings: Partial<AppState['settings']>) => void;
}

const defaultUser: User = {
    id: '1',
    name: 'User',
    xp: 0,
    level: 1,
    streak: 0,
    joinedAt: new Date().toISOString(),
};

const defaultAchievements: Achievement[] = [
    { id: '1', title: 'First Steps', description: 'Complete your first task', icon: '🎯', xpReward: 50, condition: { type: 'tasks', target: 1 } },
    { id: '2', title: 'Task Master', description: 'Complete 10 tasks', icon: '✅', xpReward: 100, condition: { type: 'tasks', target: 10 } },
    { id: '3', title: 'Habit Builder', description: 'Maintain a 7-day streak', icon: '🔥', xpReward: 150, condition: { type: 'streak', target: 7 } },
    { id: '4', title: 'Goal Setter', description: 'Create your first goal', icon: '🎯', xpReward: 50, condition: { type: 'goals', target: 1 } },
    { id: '5', title: 'Focused Mind', description: 'Complete 10 focus sessions', icon: '🧘', xpReward: 100, condition: { type: 'focus', target: 10 } },
    { id: '6', title: 'Idea Factory', description: 'Capture 25 ideas', icon: '💡', xpReward: 100, condition: { type: 'ideas', target: 25 } },
    { id: '7', title: 'Centurion', description: 'Complete 100 tasks', icon: '🏆', xpReward: 500, condition: { type: 'tasks', target: 100 } },
    { id: '8', title: 'Streak Legend', description: '30-day streak', icon: '⚡', xpReward: 300, condition: { type: 'streak', target: 30 } },
];

const calculateLevel = (xp: number): number => {
    return Math.floor(xp / 500) + 1;
};

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Auth
            isAuthenticated: false,
            setUser: (user) => {
                if (user) {
                    set({ user, isAuthenticated: true });
                } else {
                    set({ user: defaultUser, isAuthenticated: false });
                }
            },
            logout: () => {
                localStorage.removeItem('lifeos_token');
                set({ user: defaultUser, isAuthenticated: false });
            },

            // User
            user: defaultUser,
            updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
            addXP: (amount) => set((state) => {
                const newXP = state.user.xp + amount;
                const newLevel = calculateLevel(newXP);
                return { user: { ...state.user, xp: newXP, level: newLevel } };
            }),

            // Goals
            goals: [],
            addGoal: (goal) => {
                set((state) => ({ goals: [...state.goals, goal] }));
                get().addXP(25);
            },
            updateGoal: (id, updates) => set((state) => ({
                goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
            })),
            deleteGoal: (id) => set((state) => ({
                goals: state.goals.filter((g) => g.id !== id),
            })),

            // Tasks
            tasks: [],
            addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
            updateTask: (id, updates) => set((state) => ({
                tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
            })),
            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id),
            })),
            toggleTask: (id) => {
                const state = get();
                const task = state.tasks.find((t) => t.id === id);
                if (task) {
                    const completing = !task.completed;
                    set({
                        tasks: state.tasks.map((t) =>
                            t.id === id
                                ? { ...t, completed: completing, completedAt: completing ? new Date().toISOString() : undefined }
                                : t
                        ),
                    });
                    if (completing) {
                        get().addXP(10);
                    }
                }
            },

            // Habits
            habits: [],
            addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
            updateHabit: (id, updates) => set((state) => ({
                habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
            })),
            deleteHabit: (id) => set((state) => ({
                habits: state.habits.filter((h) => h.id !== id),
            })),
            toggleHabitDay: (id, date) => {
                const state = get();
                const habit = state.habits.find((h) => h.id === id);
                if (habit) {
                    const isCompleted = habit.completedDates.includes(date);
                    const newDates = isCompleted
                        ? habit.completedDates.filter((d) => d !== date)
                        : [...habit.completedDates, date];

                    // Calculate streak
                    let streak = 0;
                    const today = new Date();
                    for (let i = 0; i < 365; i++) {
                        const checkDate = new Date(today);
                        checkDate.setDate(checkDate.getDate() - i);
                        const dateStr = checkDate.toISOString().split('T')[0];
                        if (newDates.includes(dateStr)) {
                            streak++;
                        } else if (i > 0) {
                            break;
                        }
                    }

                    set({
                        habits: state.habits.map((h) =>
                            h.id === id
                                ? {
                                    ...h,
                                    completedDates: newDates,
                                    streak,
                                    bestStreak: Math.max(h.bestStreak, streak),
                                }
                                : h
                        ),
                    });

                    if (!isCompleted) {
                        get().addXP(15);
                    }
                }
            },

            // Finance
            transactions: [],
            budgets: [],
            addTransaction: (transaction) => set((state) => ({
                transactions: [...state.transactions, transaction]
            })),
            deleteTransaction: (id) => set((state) => ({
                transactions: state.transactions.filter((t) => t.id !== id),
            })),
            updateBudget: (id, updates) => set((state) => ({
                budgets: state.budgets.map((b) => (b.id === id ? { ...b, ...updates } : b)),
            })),

            // Health
            healthEntries: [],
            addHealthEntry: (entry) => {
                set((state) => ({ healthEntries: [...state.healthEntries, entry] }));
                get().addXP(5);
            },
            updateHealthEntry: (id, updates) => set((state) => ({
                healthEntries: state.healthEntries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
            })),

            // Learning
            learningItems: [],
            addLearningItem: (item) => set((state) => ({
                learningItems: [...state.learningItems, item]
            })),
            updateLearningItem: (id, updates) => set((state) => ({
                learningItems: state.learningItems.map((i) => (i.id === id ? { ...i, ...updates } : i)),
            })),
            deleteLearningItem: (id) => set((state) => ({
                learningItems: state.learningItems.filter((i) => i.id !== id),
            })),

            // Ideas
            ideas: [],
            addIdea: (idea) => {
                set((state) => ({ ideas: [...state.ideas, idea] }));
                get().addXP(5);
            },
            updateIdea: (id, updates) => set((state) => ({
                ideas: state.ideas.map((i) => (i.id === id ? { ...i, ...updates } : i)),
            })),
            deleteIdea: (id) => set((state) => ({
                ideas: state.ideas.filter((i) => i.id !== id),
            })),

            // Focus
            focusSessions: [],
            addFocusSession: (session) => {
                set((state) => ({ focusSessions: [...state.focusSessions, session] }));
                get().addXP(Math.floor(session.duration / 5));
            },

            // Achievements
            achievements: defaultAchievements,
            unlockAchievement: (id) => set((state) => ({
                achievements: state.achievements.map((a) =>
                    a.id === id ? { ...a, unlockedAt: new Date().toISOString() } : a
                ),
            })),

            // Reflections
            reflections: [],
            addReflection: (reflection) => {
                set((state) => ({ reflections: [...state.reflections, reflection] }));
                get().addXP(20);
            },

            // Settings
            settings: {
                theme: 'dark',
                geminiApiKey: '',
                sidebarCollapsed: false,
            },
            updateSettings: (updates) => set((state) => ({
                settings: { ...state.settings, ...updates },
            })),
        }),
        {
            name: 'lifeos-storage',
        }
    )
);
