import { Button } from "@/components/common/ui/button";
import InviteModal from "./InviteModal";
import type { Server } from "@/types/workspace";
import { useServerModal } from "../hooks/useServerModal";
import { useState, useEffect } from "react";
import { useServers } from "@/store/useServersStore";
import { supabase } from "@/lib/supabase";

interface Props {
  server: Server;
  currentUserId: string;
  onClose: () => void;
  onSave: (server: Server) => void;
  onDelete: (serverId: string) => void;
  onLeaveServer: (serverId: string, userId: string) => void;
}

interface Member {
  id: string;
  user_id: string;
  profile: { nickname: string };
}

export default function ServerModal({
  server,
  currentUserId,
  onClose,
  onSave,
  onDelete,
  onLeaveServer,
}: Props) {
  const isHost = currentUserId === server.host;

  const [members, setMembers] = useState<Member[]>([]);

  const {
    roomName,
    setRoomName,
    description,
    setDescription,
    maxParticipants,
    setMaxParticipants,
    isPrivate,
    setIsPrivate,
    password,
    setPassword,
    currentParticipants,
    showErrorModal,
    setShowErrorModal,
    handleSave,
  } = useServerModal(server);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const serverInviteLink = `${window.location.origin}/invite/${server.id}`;
  const { kickMember, transferHost } = useServers();

  // 호스트 전용: 멤버 추방
  const handleKick = (memberUserId: string) => {
    kickMember(server.id, memberUserId, currentUserId);
    setMembers((prev) => prev.filter((m) => m.user_id !== memberUserId));
  };

  // 호스트 전용: 호스트 변경
  const handleTransferHost = (memberId: string) => {
    transferHost(server.id, memberId, currentUserId);
  };

  // 멤버 목록 fetch
  useEffect(() => {
    const fetchMembers = async () => {
      // 1단계: server_members 테이블에서 활성 멤버 가져오기
      const { data: membersData, error: membersError } = await supabase
        .from("server_members")
        .select("id,user_id")
        .eq("server_id", server.id)
        .eq("is_active", true);

      if (membersError) {
        console.error("Failed to fetch members:", membersError);
        return;
      }

      if (!membersData) return;

      // 2단계: profile 테이블에서 멤버 프로필 가져오기
      const userIds = membersData.map((m) => m.user_id);
      const { data: profileData, error: profileError } = await supabase
        .from("profile")
        .select("id,nickname")
        .in("id", userIds);

      if (profileError) {
        console.error("Failed to fetch profile:", profileError);
      }

      const membersWithProfile: Member[] = membersData.map((m) => ({
        id: m.id,
        user_id: m.user_id,
        profile: profileData?.find((p) => p.id === m.user_id) ?? { nickname: "Unknown" },
      }));

      setMembers(membersWithProfile);
    };

    fetchMembers();
  }, [server.id]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#36393f] p-6 rounded-2xl shadow-2xl w-[450px] text-white max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-semibold">서버 설정</h3>
          <Button
            onClick={() => setIsInviteOpen(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            초대
          </Button>
        </div>

        {/* 서버 정보 */}
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          disabled={!isHost}
          className="w-full mb-4 p-2 rounded-md border border-gray-600 bg-[#202225] text-white focus:outline-none"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={!isHost}
          className="w-full mb-4 p-2 rounded-md border border-gray-600 bg-[#202225] text-white focus:outline-none h-24"
        />

        {/* 최대 참여자 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            최대 참여자 수 (현재: {currentParticipants})
          </label>
          <input
            type="number"
            value={maxParticipants}
            min={currentParticipants}
            max={10}
            disabled={!isHost}
            onChange={(e) => {
              let value = Number(e.target.value);
              if (value > 10) value = 10;
              if (value < currentParticipants) value = currentParticipants;
              setMaxParticipants(value);
            }}
            className="w-24 p-2 rounded-md border border-gray-600 bg-[#202225] text-white focus:outline-none"
          />
          <span className="ml-2 text-gray-400 text-sm">
            {currentParticipants}~10명
          </span>
        </div>

        {/* 공개/비공개 */}
        {isHost && (
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={!isPrivate}
              onChange={(e) => setIsPrivate(!e.target.checked)}
              className="w-4 h-4 accent-blue-500"
            />
            <label className="text-sm text-gray-300">공개 서버로 설정</label>
          </div>
        )}
        {isHost && isPrivate && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className="w-full mb-4 p-2 rounded-md border border-gray-600 bg-[#202225] text-white focus:outline-none"
          />
        )}

        {/* 호스트 전용: 멤버 관리 */}
        {isHost && members.length > 0 && (
          <div className="mb-4 mt-2">
            <h4 className="text-sm text-gray-300 mb-2">멤버 관리</h4>
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
              {members.map((m) =>
                m.user_id !== currentUserId && (
                  <div key={m.id} className="flex justify-between items-center p-2 bg-[#2f3136] rounded-md">
                    <span className="text-sm">{m.profile.nickname}</span>
                    <div className="flex gap-2">
                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1"
                        onClick={() => handleKick(m.user_id)}
                      >
                        추방
                      </Button>
                      <Button
                        className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-2 py-1"
                        onClick={() => handleTransferHost(m.user_id)}
                      >
                        호스트 변경
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* 버튼 */}
        <div className="flex justify-between gap-3 mt-6">
          {isHost ? (
            <>
              <button
                className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500"
                onClick={onClose}
              >
                취소
              </button>
              <div className="flex gap-2">
                <Button
                  onClick={() => onDelete(server.id)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  서버 삭제
                </Button>
                <Button
                  onClick={() => handleSave(onSave)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  저장
                </Button>
              </div>
            </>
          ) : (
            <div className="flex gap-2 ml-auto">
              <Button
                onClick={() => onLeaveServer(server.id, currentUserId)}
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                서버 나가기
              </Button>
              <Button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700"
              >
                닫기
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 오류 모달 */}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#202225] p-4 rounded-xl shadow-lg text-white w-[300px] text-center">
            <p>
              현재 참여자 수 {currentParticipants}명 보다 작은 값으로 설정할 수 없습니다.
            </p>
            <Button
              className="mt-4 bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowErrorModal(false)}
            >
              확인
            </Button>
          </div>
        </div>
      )}

      {/* InviteModal */}
      {isInviteOpen && (
        <InviteModal
          serverInviteLink={serverInviteLink}
          currentUserId={currentUserId}
          onClose={() => setIsInviteOpen(false)}
          serverId={server.id}
        />
      )}
    </div>
  );
}
