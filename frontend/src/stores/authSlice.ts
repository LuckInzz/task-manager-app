import { type StateCreator } from 'zustand';
import type { UserResponse, LoginRequest, RegisterRequest } from '../types/Auth';
import { login as loginApi, register as registerApi, getMe, logout as logoutApi } from '../services/AuthService';
import { type StoreState } from './useStore';

export interface AuthSlice {
    user: UserResponse | null;
    checkAuth: () => Promise<void>;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
}

export const createAuthSlice: StateCreator<
    StoreState,
    [],
    [],
    AuthSlice
> = (set, get) => ({
    user: null,

    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const userData = await getMe();
            set({ user: userData });
            await get().fetchInitialData();
        } catch (error) {
            get().logout();
        }
        set({ isLoading: false });
    },

    login: async (credentials: LoginRequest) => {
        await loginApi(credentials);
        const userData = await getMe();
        set({ user: userData });
        await get().fetchInitialData();
    },

    register: async (userData: RegisterRequest) => {
        await registerApi(userData);
    },

    logout: async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error("Logout error", error);
        }
        set({ user: null, tasks: [], taskLists: [], error: null });
    },
});
