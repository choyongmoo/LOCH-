import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export interface Server {
    id: string;
    room_name: string;
    description?: string;
    host: string;
    created_at: string;
    updated_at: string;
    status: string;
    max_participants: number;
    is_private: boolean;
    password?: string | null;
}

interface ServersState {
    servers: Server[];
    fetchUserServers: (userId: string) => Promise<void>;
    addServer: (server: Server) => void;
}

export const useServers = create<ServersState>((set) => ({
    servers: [],
    fetchUserServers: async (userId: string) => {
        const { data, error } = await supabase
        .from("servers")
        .select("*")
        .eq("host", userId);

        if (!error && data) set({ servers: data });
    },
    addServer: (server) => set((state) => ({ servers: [...state.servers, server] })),
}));