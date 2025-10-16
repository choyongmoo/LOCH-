import ManagerRow from "./ManagerRow";
import PlusRow from "./PlusRow";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import { useServers } from "@/store/useServersStore";
import { supabase } from "@/lib/supabase";
import type { Server } from "@/types/workspace";

interface ServerWithHostNickname extends Server {
  hostNickname: string;
}

export default function ManagerTable() {
  const { user } = useUserStore();
  const { servers, fetchAllUserServers } = useServers(); 
  const [serversWithHost, setServersWithHost] = useState<ServerWithHostNickname[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchAllUserServers(user.id);
    }
  }, [user?.id, fetchAllUserServers]);

  useEffect(() => {
    const fetchHostNicknames = async () => {
      if (!servers.length) return;
      setIsLoading(true);

      try {
        const hostIds = servers.map((s) => s.host);

        const { data: profiles, error } = await supabase
          .from("profile")
          .select("id, nickname")
          .in("id", hostIds);

        if (error) throw error;

        const updatedServers = servers.map((s) => {
          const hostProfile = profiles?.find((p) => p.id === s.host);
          return {
            ...s,
            hostNickname: hostProfile?.nickname || s.host,
          };
        });

        setServersWithHost(updatedServers);
      } catch (err) {
        console.error("호스트 닉네임 가져오기 실패:", err);
        setServersWithHost(
          servers.map((s) => ({ ...s, hostNickname: s.host }))
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchHostNicknames();
  }, [servers]);

  if (!servers.length) return null;

  return (
    <>
      {/* 테이블 헤더 */}
      <div className="flex items-center px-2 py-2 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-[#23242e]">
        <div className="w-8"></div>
        <div className="flex-1">서버</div>
        <div className="flex-2">소개</div>
        <div className="w-32 text-center">관리자</div>
        <div className="w-8 text-center">🔒</div>
        <div className="w-32 text-center">비밀번호</div>
      </div>

      {/* 서버 리스트 */}
      <div className="flex-1 overflow-y-auto">
        {serversWithHost.map((server) => (
          <ManagerRow
            key={server.id}
            server={server}
            hostNickname={server.hostNickname}
            isHostLoading={isLoading}
          />
        ))}
        <PlusRow />
      </div>
    </>
  );
}
