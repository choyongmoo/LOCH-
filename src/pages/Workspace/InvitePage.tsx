import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useJoinServer, useServers } from "@/store/useServersStore";
import type { Server } from "@/types/workspace";

export default function InvitePage() {
  const { serverId } = useParams<{ serverId: string }>();
  const navigate = useNavigate();
  const [server, setServer] = useState<Server | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { joinServer } = useJoinServer();
  const fetchUserServers = useServers((state) => state.fetchUserServers);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        setError("로그인이 필요합니다.");
        return;
      }
      setUserId(authData.user.id);
    };
    void fetchUser();
  }, []);

  useEffect(() => {
    if (!serverId) return;

    const fetchServer = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("servers")
        .select("*")
        .eq("id", serverId)
        .maybeSingle();

      if (error || !data) {
        setError("서버를 찾을 수 없습니다.");
        setServer(null);
      } else {
        setServer(data);
      }
      setLoading(false);
    };

    void fetchServer();
  }, [serverId]);

  const handleAccept = async () => {
    if (!userId || !server) return;
    try {
      await joinServer(server.id, userId);
      await fetchUserServers(userId);
      alert(`${server.room_name} 서버에 참여했습니다!`);
      navigate("/workspace/home");
    } catch (err) {
      console.error(err);
      alert("서버 참여에 실패했습니다.");
    }
  };

  const handleDecline = () => {
    alert("서버 초대를 거절했습니다.");
    navigate("/workspace/home");
  };

  if (loading) return <div className="p-6">로딩 중...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!server) return <div className="p-6">서버 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#313338] p-6">
      <div className="bg-white dark:bg-[#23272a] rounded-xl shadow-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">{server.room_name} 서버에 초대되었습니다!</h2>
        {server.description && <p className="mb-6 text-gray-600 dark:text-gray-300">{server.description}</p>}
        <div className="flex gap-4 justify-center">
          <button
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-semibold"
            onClick={handleAccept}
          >
            수락
          </button>
          <button
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-semibold"
            onClick={handleDecline}
          >
            거절
          </button>
        </div>
      </div>
    </div>
  );
}
