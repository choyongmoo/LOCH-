import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Server } from "@/types/workspace";

//기존 서버 관리용
interface ServersState {
  servers: Server[];
  fetchAllUserServers: (userId: string) => Promise<void>;
  addServer: (server: Server) => Promise<void>;
  updateServer: (server: Server) => Promise<void>;
  deleteServer: (serverId: string) => Promise<void>;
  onLeaveServer: (serverId: string, userId: string) => Promise<void>;
}

//서버 참가
interface JoinServerState {
  joinServer: (serverId: string, userId: string) => Promise<void>;
}

//서버 참가
export const useJoinServer = create<JoinServerState>(() => ({
  joinServer: async (serverId, userId) => {
    try {
      // 1. 서버 정보 가져오기
      const { data: server, error: serverError } = await supabase
        .from("servers")
        .select("max_participants")
        .eq("id", serverId)
        .maybeSingle();
      if (serverError || !server) throw serverError ?? new Error("서버 정보를 가져올 수 없습니다.");

      // 2. 현재 참여자 수 확인
      const { data: members, error: membersError } = await supabase
        .from("server_members")
        .select("*")
        .eq("server_id", serverId)
        .eq("is_active", true);
      if (membersError) throw membersError;

      const currentCount = members?.length ?? 0;

      // 3. 최대 인원 체크
      if (currentCount >= server.max_participants) {
        alert("서버 인원이 꽉 찼습니다.");
        return;
      }

      // 4. 기존 join 로직
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
          .eq("user_id", userId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("server_members").insert([
          {
            server_id: serverId,
            user_id: userId,
            joined_at: new Date().toISOString(),
            is_active: true,
            role: "participant",
          },
        ]);
        if (insertError) throw insertError;
      }
    } catch (err) {
      console.error("🚨 서버 입장 실패:", err);
    }
  },
}));


//기존 서버 관리용
export const useServers = create<ServersState>((set) => ({
  servers: [],

  fetchAllUserServers: async (userId: string) => {
  try {
    // 1. 사용자가 호스트인 서버 가져오기
    const { data: hostServers, error: hostError } = await supabase
      .from("servers")
      .select("*")
      .eq("host", userId);

    if (hostError) throw hostError;

    // 2. 사용자가 멤버로 참여 중인 서버 ID 가져오기
    const { data: memberships, error: memberError } = await supabase
      .from("server_members")
      .select("server_id")
      .eq("user_id", userId)
      .eq("is_active", true);

    if (memberError) throw memberError;

    const memberServerIds = memberships?.map((m) => m.server_id) || [];

    // 3. 멤버 서버 정보 가져오기 (호스트 서버는 제외)
    const { data: memberServers, error: memberServersError } = await supabase
      .from("servers")
      .select("*")
      .in("id", memberServerIds)
      .not("host", "eq", userId);

    if (memberServersError) throw memberServersError;

    // 4. 호스트 서버 + 멤버 서버 합치기
    const allServers = [...(hostServers || []), ...(memberServers || [])];

    set({ servers: allServers });
  } catch (err) {
    console.error("서버 불러오기 실패:", err);
    set({ servers: [] });
  }
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
  
  onLeaveServer: async (serverId, userId) => {
    const { error } = await supabase
      .from("server_members")
      .delete()
      .eq("server_id", serverId)
      .eq("user_id", userId)
      .eq("is_active", true);

      if (error) throw error;
      set((state) => ({
        servers: state.servers.filter((s) => s.id !== serverId),
      }));
  },
}));
