import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Participant, Server } from "@/types/workspace";

export interface ServerDetailWithCount extends Server {
  currentParticipants: number;
  host_nickname?: string;
}

export function useServerDetail(selectedServerId?: string, servers: Server[] = []) {
  const [serverDetail, setServerDetail] = useState<ServerDetailWithCount | undefined>(undefined);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isParticipantsLoading, setIsParticipantsLoading] = useState(false);

  // 서버 상세 및 호스트 닉네임 가져오기
  useEffect(() => {
    const updateServerDetail = async () => {
      if (!selectedServerId) {
        setServerDetail(undefined);
        setParticipants([]);
        setIsLoading(false);
        return;
      }

      const s = servers.find((srv) => srv.id === selectedServerId);
      if (!s) {
        setServerDetail(undefined);
        setParticipants([]);
        return;
      }

      setIsLoading(true);

      // 참여자 수 가져오기
      const { count, error: countError } = await supabase
        .from("server_members")
        .select("*", { count: "exact" })
        .eq("server_id", s.id);

      if (countError) console.error(countError);

      // 호스트 닉네임 가져오기
      const { data: hostProfile, error: hostError } = await supabase
        .from("profile")
        .select("nickname")
        .eq("id", s.host)
        .maybeSingle();

      if (hostError) console.error(hostError);

      setServerDetail({
        ...s,
        currentParticipants: count ?? 0,
        host_nickname: hostProfile?.nickname ?? s.host,
      });

      setIsLoading(false);
    };

    void updateServerDetail();
  }, [selectedServerId, servers]);

  // 참여자 목록 가져오기
  useEffect(() => {
    const fetchParticipants = async () => {
      if (!selectedServerId) return;

      setIsParticipantsLoading(true);

      const { data: members, error: membersError } = await supabase
        .from("server_members")
        .select("id, user_id, role, is_active")
        .eq("server_id", selectedServerId)
        .eq("is_active", true);

      if (membersError) {
        console.error(membersError);
        setParticipants([]);
        setIsParticipantsLoading(false);
        return;
      }

      // 참여자 프로필
      const userIds = members.map((m) => m.user_id);
      const { data: profile, error: profileError } = await supabase
        .from("profile")
        .select("id, nickname, email, accent_color")
        .in("id", userIds);

      if (profileError) console.error(profileError);

      const filtered = members
        .filter((m) => m.role !== "host")
        .map((m) => {
          const p = profile?.find((p) => p.id === m.user_id);
          return {
            id: m.id,
            user_id: m.user_id,
            nickname: p?.nickname ?? "",
            email: p?.email ?? "",
            accent_color: p?.accent_color ?? "#3b82f6",
          };
        });

      setParticipants(filtered);
      setIsParticipantsLoading(false);
    };

    void fetchParticipants();
  }, [selectedServerId]);

  return { serverDetail, participants, isLoading, isParticipantsLoading };
}
