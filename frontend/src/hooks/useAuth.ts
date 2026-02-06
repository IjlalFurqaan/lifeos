import { useEffect, useState, useCallback } from 'react';
import { useStore } from '../store';
import { authApi, setAuthToken, getAuthToken } from '../services/api';
import type { User } from '../types';

interface UseAuthReturn {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<boolean>;
}

export const useAuth = (): UseAuthReturn => {
    const { user, isAuthenticated, setUser, logout: storeLogout } = useStore();
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is authenticated on mount
    const checkAuth = useCallback(async (): Promise<boolean> => {
        const token = getAuthToken();

        if (!token) {
            setIsLoading(false);
            return false;
        }

        try {
            const userData = await authApi.me();
            setUser(userData);
            setIsLoading(false);
            return true;
        } catch (error) {
            // Token is invalid or expired
            setAuthToken(null);
            setUser(null);
            setIsLoading(false);
            return false;
        }
    }, [setUser]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (email: string, password: string): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await authApi.login({ email, password });
            setAuthToken(response.token);
            setUser(response.user);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, password: string, name: string): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await authApi.register({ email, password, name });
            setAuthToken(response.token);
            setUser(response.user);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = (): void => {
        setAuthToken(null);
        storeLogout();
    };

    return {
        isAuthenticated,
        isLoading,
        user: isAuthenticated ? user : null,
        login,
        register,
        logout,
        checkAuth,
    };
};

export default useAuth;
