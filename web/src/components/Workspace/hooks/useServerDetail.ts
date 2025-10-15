// src/hooks/useServerDetail.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Participant, Server } from "@/types/workspace";

export interface ServerDetailWithCount extends Server {
  currentParticipants: number;
  host_nickname?: string;
}

export function useServerDetail(selectedServerId?: string | null, servers: Server[] = []) {
  const [serverDetail, setServerDetail] = useState<ServerDetailWithCount | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isParticipantsLoading, setIsParticipantsLoading] = useState(false);

  // 서버 상세 및 호스트 닉네임 가져오기
  useEffect(() => {
    let isMounted = true;

    const updateServerDetail = async () => {
      if (!selectedServerId) {
        if (!isMounted) return;
        setServerDetail(null);
        setParticipants([]);
        setIsLoading(false);
        return;
      }

      const s = servers.find((srv) => srv.id === selectedServerId);
      if (!s) {
        if (!isMounted) return;
        setServerDetail(null);
        setParticipants([]);
        return;
      }

      setIsLoading(true);

      try {
        // 참여자 수 가져오기
        const { count, error: countError } = await supabase
          .from("server_members")
          .select("*", { count: "exact" })
          .eq("server_id", s.id)
          .eq("is_active", true);

        if (countError) throw countError;

        // 호스트 닉네임 가져오기
        const { data: hostProfile, error: hostError } = await supabase
          .from("profile")
          .select("nickname")
          .eq("id", s.host)
          .maybeSingle();

        if (hostError) throw hostError;

        if (!isMounted) return;

        setServerDetail({
          ...s,
          currentParticipants: count ?? 0,
          host_nickname: hostProfile?.nickname ?? s.host,
        });
      } catch (err) {
        console.error("서버 상세 가져오기 실패:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void updateServerDetail();

    return () => {
      isMounted = false;
    };
  }, [selectedServerId, servers]);

  // 참여자 목록 가져오기
  useEffect(() => {
    let isMounted = true;

    const fetchParticipants = async () => {
      if (!selectedServerId) return;
      setIsParticipantsLoading(true);

      try {
        const { data: members, error: membersError } = await supabase
          .from("server_members")
          .select("id, user_id, role, is_active")
          .eq("server_id", selectedServerId)
          .eq("is_active", true);

        if (membersError) throw membersError;

        // 참여자 프로필 가져오기
        const userIds = members.map((m) => m.user_id);
        const { data: profiles, error: profileError } = await supabase
          .from("profile")
          .select("id, nickname, email, accent_color")
          .in("id", userIds);

        if (profileError) throw profileError;

        if (!isMounted) return;

        const filtered = members
          .filter((m) => m.role !== "host")
          .map((m) => {
            const p = profiles?.find((p) => p.id === m.user_id);
            return {
              id: m.id,
              user_id: m.user_id,
              nickname: p?.nickname ?? "",
              email: p?.email ?? "",
              accent_color: p?.accent_color ?? "#7e22ce",
            };
          });

        setParticipants(filtered);
      } catch (err) {
        console.error("참여자 가져오기 실패:", err);
        if (isMounted) setParticipants([]);
      } finally {
        if (isMounted) setIsParticipantsLoading(false);
      }
    };

    void fetchParticipants();

    return () => {
      isMounted = false;
    };
  }, [selectedServerId]);

  return { serverDetail, participants, isLoading, isParticipantsLoading };
}
