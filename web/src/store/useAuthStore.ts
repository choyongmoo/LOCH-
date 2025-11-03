import { create } from "zustand";
import { supabase } from "@/lib/supabase";

interface AuthState {
  user: any;
  setUser: (user: any) => void;

  updatePassword: (newPassword: string) => Promise<{ data?: any; error?: any }>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    return { data, error };
  },
}));
