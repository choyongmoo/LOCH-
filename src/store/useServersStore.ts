import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export interface Server {
    id: string;
    room_name: string;
    description?: string;
    host: string;
    host_nickname?: string;
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
    fetchServersWithNickname: (userId: string) => Promise<void>;
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

    fetchServersWithNickname: async (userId: string) => {
        const { data: servers, error: serverError } = await supabase
            .from("servers")
            .select("*")
            .eq("host", userId);

        if (serverError || !servers) return;

        const hostIds = servers.map((s) => s.host);

        const { data: profiles, error: profileError } = await supabase
            .from("profile")
            .select("id, nickname")
            .in("id", hostIds);

        if (profileError) {
            console.error("프로필 불러오기 실패:", profileError);
            set({ servers });
            return;
        }

        const nicknameMap = new Map(profiles?.map((p) => [p.id, p.nickname]));
        const mapped = servers.map((s) => ({
            ...s,
            host_nickname: nicknameMap.get(s.host) ?? "-",
        }));

        set({ servers: mapped });
    },

    addServer: async (server) => {
        const { data: profile } = await supabase
            .from("profile")
            .select("nickname")
            .eq("id", server.host)
            .maybeSingle();

        set((state) => ({
            servers: [
                ...state.servers,
                { ...server, host_nickname: profile?.nickname ?? "-" },
            ],
        }));
    },
}));
