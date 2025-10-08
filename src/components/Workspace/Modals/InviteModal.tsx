import { useState, useEffect } from "react";
import { Button } from "@/components/common/ui/button";
import { ClipboardCopy } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Friend } from "@/types/workspace";
import { sendMessage } from "../hooks/sendMessage";

interface InviteModalProps {
  serverInviteLink: string;
  currentUserId: string;
  onClose: () => void;
}

export default function InviteModal({ serverInviteLink, currentUserId, onClose }: InviteModalProps) {
  const [copied, setCopied] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);

  // 친구 목록 불러오기
  useEffect(() => {
    const loadFriends = async () => {
      try {
        const { data: friendReqs, error: reqError } = await supabase
          .from("friend_requests")
          .select("requester_id, addressee_id")
          .or(`requester_id.eq.${currentUserId},addressee_id.eq.${currentUserId}`)
          .eq("status", "accepted");

        if (reqError || !friendReqs) {
          console.error(reqError);
          setFriends([]);
          return;
        }

        const friendIds = friendReqs.map(r =>
          r.requester_id === currentUserId ? r.addressee_id : r.requester_id
        );

        const { data: profiles, error: profileError } = await supabase
          .from("profile")
          .select("id, nickname, email")
          .in("id", friendIds);

        if (profileError || !profiles) {
          console.error(profileError);
          setFriends([]);
          return;
        }

        setFriends(profiles);
      } catch (err) {
        console.error(err);
        setFriends([]);
      }
    };

    loadFriends();
  }, [currentUserId]);

  // 서버 링크 복사
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(serverInviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  // 친구에게 1:1 DM으로 서버 링크 보내기
  const handleSendInvite = async (friend: Friend) => {
    try {
      // 클릭 가능한 링크로 보내기
      const messageContent = `서버 초대: ${serverInviteLink}`;
      await sendMessage(messageContent, currentUserId, friend, () => {});
      alert(`${friend.nickname}에게 초대 링크를 보냈습니다!`);
    } catch (err) {
      console.error("초대 전송 실패:", err);
      alert("초대 전송 실패");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#2f3136] w-[420px] max-h-[85vh] overflow-y-auto p-6 rounded-2xl shadow-2xl text-white">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">친구 초대</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* 서버 초대 링크 */}
        <div className="bg-[#202225] border border-gray-700 rounded-lg p-3 mb-4 flex items-center justify-between">
          <p className="text-sm truncate text-gray-300">{serverInviteLink}</p>
          <Button
            onClick={handleCopy}
            size="sm"
            className="ml-3 flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ClipboardCopy size={16} />
            {copied ? "복사됨!" : "복사"}
          </Button>
        </div>

        {/* 친구 목록 */}
        <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
          {friends.map(friend => (
            <div
              key={friend.id}
              className="flex items-center justify-between p-2 rounded-md bg-[#2b2d31] hover:bg-[#3a3c43] transition-colors duration-150"
              onMouseEnter={() => setHoveredId(friend.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div>
                <p className="text-sm font-medium">{friend.nickname}</p>
                {friend.email && <p className="text-xs text-gray-400">{friend.email}</p>}
              </div>
              {hoveredId === friend.id && (
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white transition-all"
                  onClick={() => handleSendInvite(friend)}
                >
                  초대
                </Button>
              )}
            </div>
          ))}

          {friends.length === 0 && (
            <p className="text-gray-400 text-center mt-4">
              친구 목록이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
