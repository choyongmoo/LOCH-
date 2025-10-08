import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Server } from "@/types/workspace";

//기존 서버 관리용
interface ServersState {
  servers: Server[];
  fetchUserServers: (userId: string) => Promise<void>;
  fetchServersWithNickname: (userId: string) => Promise<void>;
  addServer: (server: Server) => Promise<void>;
  updateServer: (server: Server) => Promise<void>;
  deleteServer: (serverId: string) => Promise<void>;
  kickMember: (serverId: string, userId: string) => Promise<void>;
  onLeaveServer: (serverId: string, userId: string) => Promise<void>;
}

//서버 참가
interface JoinServerState {
  joinServer: (serverId: string, userId: string) => Promise<void>;
}

//서버 참가
export const useJoinServer = create<JoinServerState>(() => ({
  joinServer: async (serverId, userId) => {
    try{
      const { data: existing, error: fetchError } = await supabase
        .from("server_members")
        .select("*")
        .eq("server_id", serverId)
        .eq("user_id", userId)
        .maybeSingle();

        if (fetchError) throw fetchError;

        if (existing) {
          const { error: updateError } = await supabase
            .from("server_members")
            .update({
              is_active: true,
              left_at: null,
              joined_at: new Date().toISOString(),
            })
            .eq("server_id", serverId)
            .eq("user_id", userId)

            if (updateError) throw updateError;
        } else {
          const{ error: insertError } = await supabase.from("server_members").insert([
            {
              server_id: serverId,
              user_id: userId,
              joined_at: new Date().toISOString(),
              is_active: true,
              role: "member",
            },
          ]);
          if (insertError) throw insertError;
          console.log("✅ 새 멤버 입장 처리 완료");
        } 
    } catch(err) {
      console.error("🚨 서버 입장 실패:", err);
    }
  },
}))

//기존 서버 관리용
export const useServers = create<ServersState>((set) => ({
  servers: [],

  fetchUserServers: async (userId: string) => {
    try{
      const { data: hostServers, error: hostError } = await supabase
        .from("servers")
        .select("*")
        .eq("host", userId);
      if (hostError) throw hostError;

      const { data: memberships, error: memberError } = await supabase
        .from("server_members")
        .select("server_id")
        .eq("user_id", userId)
        .eq("is_active", true);
      if (memberError) throw memberError;

      const memberServerIds = memberships?.map((m) => m.server_id) || [];

      const { data: memberServers, error: memberServersError } = await supabase
      .from("servers")
      .select("*")
      .in("id", memberServerIds)
      .not("host", "eq", userId);

    if (memberServersError) throw memberServersError;

    const allServers = [...(hostServers || []), ...(memberServers || [])];

    set({ servers: allServers });
    } catch (err) {
      console.error("서버 불러오기 실패: ", err);
      set({ servers: []});
    }
  },

  fetchServersWithNickname: async (userId: string) => {
    const { data: memberships, error: memberError } = await supabase
      .from("server_members")
      .select("server_id")
      .eq("user_id", userId);

    if (memberError || !memberships?.length) {
      console.error("서버 멤버 불러오기 실패:", memberError);
      set({ servers: [] });
      return;
    }

    const serverIds = memberships.map((m) => m.server_id);

    const { data: servers, error: serverError } = await supabase
      .from("servers")
      .select("*")
      .in("id", serverIds);

    if (serverError || !servers) {
      console.error("서버 불러오기 실패:", serverError);
      return;
    }

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

    const nicknameMap = new Map(profiles.map((p) => [p.id, p.nickname]));
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

  updateServer: async (updatedServer) => {
    const { error } = await supabase
      .from("servers")
      .update({
        room_name: updatedServer.room_name,
        description: updatedServer.description,
        max_participants: updatedServer.max_participants,
        is_private: updatedServer.is_private,
        password: updatedServer.password,
        host: updatedServer.host,
        updated_at: updatedServer.updated_at,
      })
      .eq("id", updatedServer.id);

    if (error) {
      console.error("서버 업데이트 실패:", error);
      return;
    }

    set((state) => ({
      servers: state.servers.map((s) =>
        s.id === updatedServer.id ? { ...s, ...updatedServer } : s
      ),
    }));
  },

  deleteServer: async (serverId) => {
    const { error } = await supabase
      .from("servers")
      .delete()
      .eq("id", serverId);

    if (error) {
      console.error("서버 삭제 실패:", error);
      return;
    }

    set((state) => ({
      servers: state.servers.filter((s) => s.id !== serverId),
    }));
  },

  kickMember: async (serverId, userId) => {
    const { error } = await supabase
      .from("server_members")
      .delete()
      .eq("server_id", serverId)
      .eq("user_id", userId);

    if (error) {
      console.error("멤버 추방 실패:", error);
      return;
    }

    set((state) => ({
      servers: state.servers.map((s) =>
        s.id === serverId
          ? { ...s, members: s.members?.filter((m) => m.user_id !== userId) }
          : s
      ),
    }));
  },

  onLeaveServer: async (serverId, userId) => {
    const { error } = await supabase
      .from("server_members")
      .update({
        is_active: false,
        left_at: new Date().toISOString(),
      })
      .eq("server_Id", serverId)
      .eq("user_Id", userId)
      .eq("is_active", true);

      if (error) throw error;
      set((state) => ({
        servers: state.servers.filter((s) => s.id !== serverId),
      }));
  },
}));
