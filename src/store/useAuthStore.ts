import { create } from "zustand";

interface AuthState {
    userId?: string;
    email?: string;
    logout: () => void;
    setUser: (id: string, email: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    userId: undefined,
    email: undefined,
    logout: () => set({ userId: undefined, email: undefined }),
    setUser: (id, email) => set({ userId: id, email }),
}));
