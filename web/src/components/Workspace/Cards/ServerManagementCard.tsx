import { Link, useNavigate } from "react-router";
import { useEffect } from "react";
import { useServers } from "@/store/useServersStore";
import { useUserStore } from "@/store/useUserStore";
import type { Server } from "@/types/workspace";
import { ScrollArea } from "@/components/common/ui/scroll-area";
import { supabase } from "@/lib/supabase";

export default function ServerManagementCard() {
  const { servers, fetchAllUserServers } = useServers();
  const userId = useUserStore((state) => state.user?.id);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) fetchAllUserServers(userId);
  }, [userId, fetchAllUserServers]);

  const handleServerClick = async (serverId: string) => {
    try {
      const { data: room } = await supabase
        .from("rooms")
        .select("id, is_active, user_count")
        .eq("server_id", serverId)
        .single();

      let roomId = room?.id;

      if (!roomId) {
        const { data: newRoom } = await supabase
          .from("rooms")
          .insert([{ server_id: serverId }])
          .select()
          .single();

        roomId = newRoom?.id;
      }

      if (roomId) navigate(`/room/${roomId}`);
    } catch (err) {
      console.error("서버 클릭 처리 중 오류:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-6 flex flex-col items-center text-center ml-4 w-full max-w-md">
      {/* 서버 블록 */}
      <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
        빠른 회의 시작
      </h3>
      <ScrollArea className="w-full h-40">
        <div className="flex flex-wrap gap-2 p-2 justify-center">
          {servers.length > 0
            ? servers.map((server: Server) => (
                <div
                  key={server.id}
                  className="flex flex-col items-center w-20 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2c33] cursor-pointer transition-colors mb-2"
                  title={server.room_name}
                  onClick={() => handleServerClick(server.id)}
                >
                  <div className="w-10 h-10 rounded-[10px] bg-gray-900 text-gray-100 flex items-center justify-center text-lg font-bold mb-2">
                    {server.room_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate w-full text-center">
                    {server.room_name}
                  </div>
                </div>
              ))
            : Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`server-placeholder-${i}`}
                  className="flex flex-col items-center w-20 p-2 rounded-lg bg-gray-100 dark:bg-[#23242e] animate-pulse mb-2"
                >
                  <div className="w-10 h-10 rounded-[5px] bg-gray-300 dark:bg-[#3a3b42] mb-2" />
                  <div className="h-3 w-12 rounded bg-gray-300 dark:bg-[#3a3b42]" />
                  <div className="h-3 w-10 rounded bg-gray-300 dark:bg-[#3a3b42] mt-1" />
                </div>
              ))}
        </div>
      </ScrollArea>

      {/* 서버 관리 링크 */}
      <Link
        to="/workspace/manager"
        className="text-xs text-gray-500 dark:text-gray-300 mb-1 hover:underline cursor-pointer mt-2"
      >
        서버 관리
      </Link>

      {/* 설명 텍스트 */}
      <div className="text-lg font-bold text-gray-800 dark:text-white mb-2 tracking-widest">
        서버를 관리해 보세요!
      </div>
    </div>
  );
}
