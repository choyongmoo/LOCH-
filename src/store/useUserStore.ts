import { create } from "zustand";
import type { Profile } from "@/types/workspace";
import { supabase } from "@/lib/supabase";

interface UserState {
    user: Profile | null;
    setUser: (user: Profile) => void;
    updateNickname: (nickname: string) => Promise<void>;
    updateBio: (bio: string) => Promise<void>;
    updateAccentColor: (accent_color: string) => Promise<void>;
    updateCameraLabel: (cameraLabel: string) => Promise<void>;
    updateMicLabel: (micLabel: string) => Promise<void>;
}

export const useUserStore = create<UserState & { logout: () => Promise<void> }> ((set, get) => ({
    user: null,
    setUser: (user) => set({ user }),

    logout: async () => {
        const { error } = await supabase.auth.signOut();
        if(error) {
            console.error(error);
            return;
        }
        set ({ user: null });
        window.location.href = "/";
    },
    
    updateNickname: async (nickname: string) => {
        const user = get().user;
        if(!user) return;

        const { error } = await supabase
            .from("profile")
            .update({nickname})
            .eq("id", user.id);

        if(error) {
            console.error(error);
            return;
        }

        set({ user: {...user, nickname } });
    },

    updateBio: async (bio: string) => {
        const user = get().user;
        if(!user) return;

        const { error } = await supabase
            .from("profile")
            .update({ bio })
            .eq("id", user.id);
        if(error) return console.error(error);

        set({ user: { ...user, bio } });
    },

    updateAccentColor: async (accent_color: string) => {
        const user = get().user;
        if(!user) return;

        const { error } = await supabase
            .from("profile")
            .update({ accent_color })
            .eq("id", user.id);
        if(error) return console.error(error);

        set({ user: { ...user, accent_color } });
    },

    updateCameraLabel: async (cameraLabel: string) => {
        const user = get().user;
        if(!user) return;

        const { error } = await supabase
            .from("profile")
            .update({ cameraLabel })
            .eq("id", user.id);
        if(error) return console.error(error);

        set({ user: { ...user, cameraLabel } });
    },

    updateMicLabel: async (micLabel: string) => {
        const user = get().user;
        if(!user) return;

        const { error } = await supabase
            .from("profile")
            .update({ micLabel })
            .eq("id", user.id);
        if(error) return console.error(error);

        set({ user: { ...user, micLabel } });
    },
}));
