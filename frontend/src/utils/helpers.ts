export const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export const formatTime = (date: string | Date): string => {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatRelativeTime = (date: string | Date): string => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
};

import { getCurrencyByCode } from './currencies';

export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
    const currency = getCurrencyByCode(currencyCode);
    const locale = currency?.locale || 'en-US';
    const code = currency?.code || 'USD';

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: code,
    }).format(amount);
};

export const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
};

export const getTodayDateString = (): string => {
    return new Date().toISOString().split('T')[0];
};

export const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};

export const getWeekDates = (date: Date = new Date()): Date[] => {
    const week: Date[] = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        week.push(day);
    }

    return week;
};

export const calculateProgress = (completed: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
};

export const getXPForLevel = (level: number): number => {
    return level * 500;
};

export const getXPProgress = (xp: number): { current: number; required: number; percentage: number } => {
    const level = Math.floor(xp / 500) + 1;
    const currentLevelXP = (level - 1) * 500;
    const nextLevelXP = level * 500;
    const current = xp - currentLevelXP;
    const required = nextLevelXP - currentLevelXP;
    const percentage = Math.round((current / required) * 100);

    return { current, required, percentage };
};

export const categoryColors: Record<string, string> = {
    career: '#0ea5e9',
    health: '#22c55e',
    finance: '#f59e0b',
    personal: '#8b5cf6',
    learning: '#ec4899',
    relationships: '#ef4444',
    food: '#f97316',
    transport: '#06b6d4',
    entertainment: '#a855f7',
    shopping: '#eab308',
    bills: '#64748b',
    other: '#94a3b8',
};

export const priorityColors: Record<string, string> = {
    urgent: '#ef4444',
    high: '#f59e0b',
    medium: '#0ea5e9',
    low: '#22c55e',
};

export const moodEmojis: Record<number, string> = {
    1: '😢',
    2: '😕',
    3: '😐',
    4: '🙂',
    5: '😄',
};
