const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Auth token storage
let authToken: string | null = localStorage.getItem('lifeos_token');

export const setAuthToken = (token: string | null) => {
    authToken = token;
    if (token) {
        localStorage.setItem('lifeos_token', token);
    } else {
        localStorage.removeItem('lifeos_token');
    }
};

export const getAuthToken = () => authToken;

// Base fetch with auth
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        setAuthToken(null);
        window.location.href = '/login';
    }

    return response;
};

// Generic API methods
const api = {
    get: async <T>(endpoint: string): Promise<T> => {
        const res = await fetchWithAuth(endpoint);
        if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
        return res.json();
    },

    post: async <T>(endpoint: string, data?: unknown): Promise<T> => {
        const res = await fetchWithAuth(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
        return res.json();
    },

    patch: async <T>(endpoint: string, data: unknown): Promise<T> => {
        const res = await fetchWithAuth(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
        return res.json();
    },

    delete: async <T>(endpoint: string): Promise<T> => {
        const res = await fetchWithAuth(endpoint, { method: 'DELETE' });
        if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
        return res.json();
    },
};

// Auth API
export const authApi = {
    register: (data: { email: string; password: string; name: string }) =>
        api.post<{ token: string; user: any }>('/auth/register', data),
    login: (data: { email: string; password: string }) =>
        api.post<{ token: string; user: any }>('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    me: () => api.get<any>('/auth/me'),
};

// User API
export const userApi = {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data: { name?: string; avatar?: string }) => api.patch('/user/profile', data),
    addXp: (amount: number) => api.post('/user/xp', { amount }),
    getStats: () => api.get('/user/stats'),
};

// Goals API
export const goalsApi = {
    getAll: () => api.get('/goals'),
    create: (data: any) => api.post('/goals', data),
    update: (id: string, data: any) => api.patch(`/goals/${id}`, data),
    delete: (id: string) => api.delete(`/goals/${id}`),
};

// Tasks API
export const tasksApi = {
    getAll: (params?: { completed?: boolean; priority?: string }) => {
        const query = params ? `?${new URLSearchParams(params as any)}` : '';
        return api.get(`/tasks${query}`);
    },
    create: (data: any) => api.post('/tasks', data),
    update: (id: string, data: any) => api.patch(`/tasks/${id}`, data),
    delete: (id: string) => api.delete(`/tasks/${id}`),
};

// Habits API
export const habitsApi = {
    getAll: () => api.get('/habits'),
    create: (data: any) => api.post('/habits', data),
    toggle: (id: string, date: string) => api.post(`/habits/${id}/toggle`, { date }),
    update: (id: string, data: any) => api.patch(`/habits/${id}`, data),
    delete: (id: string) => api.delete(`/habits/${id}`),
};

// Transactions API
export const transactionsApi = {
    getAll: () => api.get('/transactions'),
    getSummary: () => api.get('/transactions/summary'),
    create: (data: any) => api.post('/transactions', data),
    delete: (id: string) => api.delete(`/transactions/${id}`),
};

// Health API
export const healthApi = {
    getAll: () => api.get('/health'),
    getToday: () => api.get('/health/today'),
    update: (id: string, data: any) => api.patch(`/health/${id}`, data),
    addWorkout: (id: string, data: any) => api.post(`/health/${id}/workouts`, data),
};

// Learning API
export const learningApi = {
    getAll: () => api.get('/learning'),
    create: (data: any) => api.post('/learning', data),
    update: (id: string, data: any) => api.patch(`/learning/${id}`, data),
    delete: (id: string) => api.delete(`/learning/${id}`),
};

// Ideas API
export const ideasApi = {
    getAll: (params?: { search?: string; category?: string }) => {
        const query = params ? `?${new URLSearchParams(params as any)}` : '';
        return api.get(`/ideas${query}`);
    },
    create: (data: any) => api.post('/ideas', data),
    update: (id: string, data: any) => api.patch(`/ideas/${id}`, data),
    togglePin: (id: string) => api.post(`/ideas/${id}/toggle-pin`),
    delete: (id: string) => api.delete(`/ideas/${id}`),
};

// Focus API
export const focusApi = {
    getAll: () => api.get('/focus'),
    getStats: () => api.get('/focus/stats'),
    create: (data: any) => api.post('/focus', data),
};

export default api;
