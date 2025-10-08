import { useState } from "react";
import type { Server, Participant } from "@/types/workspace";
import { Button } from "@/components/common/ui/button";
import InviteModal from "./InviteModal";

interface ServerModalProps {
  server: Server;
  members: Participant[];
  currentUserId: string;
  onClose: () => void;
  onSave: (server: Server) => void;
  onDelete: (serverId: string) => void;
  onKickMember: (serverId: string, userId: string) => void;
  onLeaveServer: (serverId: string, userId: string) => void;
}

export default function ServerModal({
  server,
  members,
  currentUserId,
  onClose,
  onSave,
  onDelete,
  onKickMember,
  onLeaveServer,
}: ServerModalProps) {
  const isHost = currentUserId === server.host;

  const [roomName, setRoomName] = useState(server.room_name);
  const [description, setDescription] = useState(server.description || "");
  const [maxParticipants, setMaxParticipants] = useState(server.max_participants || 10);
  const [isPrivate, setIsPrivate] = useState(server.is_private || false);
  const [password, setPassword] = useState(server.password || "");
  const [newHost, setNewHost] = useState(server.host);

  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const handleSave = () => {
    if (isPrivate && !password.trim()) {
      alert("비공개 서버를 설정하려면 비밀번호를 입력해야 합니다.");
      return;
    }

    onSave({
      ...server,
      room_name: roomName,
      description,
      max_participants: maxParticipants,
      is_private: isPrivate,
      password: isPrivate ? password : undefined,
      host: newHost,
      updated_at: new Date().toISOString(),
    });
  };

  // 서버 초대 링크
  const serverInviteLink = `${window.location.origin}/invite/${server.id}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#36393f] p-6 rounded-2xl shadow-2xl w-[400px] text-white max-h-[90vh] overflow-y-auto">
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

        {/* 서버 이름 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">서버 이름</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            disabled={!isHost}
            className={`w-full p-2 rounded-md border ${
              isHost ? "border-gray-600 focus:border-blue-500" : "border-gray-700 opacity-70"
            } bg-[#202225] text-white focus:outline-none`}
          />
        </div>

        {/* 서버 설명 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!isHost}
            className={`w-full p-2 rounded-md border ${
              isHost ? "border-gray-600 focus:border-blue-500" : "border-gray-700 opacity-70"
            } bg-[#202225] text-white focus:outline-none resize-none h-24`}
          />
        </div>

        {/* 최대 참여자 수 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">최대 참여자 수</label>
          <input
            type="number"
            value={maxParticipants}
            min={1}
            max={10}
            disabled={!isHost}
            onChange={(e) =>
              setMaxParticipants(Math.max(1, Math.min(10, Number(e.target.value))))
            }
            className={`w-24 p-2 rounded-md border ${
              isHost ? "border-gray-600 focus:border-blue-500" : "border-gray-700 opacity-70"
            } bg-[#202225] text-white focus:outline-none`}
          />
          <span className="ml-2 text-gray-400 text-sm">1~10명</span>
        </div>

        {/* 비공개 서버 설정 */}
        {isHost && (
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4 accent-blue-500"
            />
            <label className="text-sm text-gray-300">비공개 서버로 설정</label>
          </div>
        )}

        {/* 비밀번호 */}
        {isHost && isPrivate && (
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-600 bg-[#202225] text-white focus:outline-none focus:border-blue-500"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
        )}

        {/* 호스트 변경 */}
        {isHost && members.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">서버 호스트 변경</label>
            <select
              value={newHost}
              onChange={(e) => setNewHost(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-600 bg-[#202225] text-white focus:outline-none focus:border-blue-500"
            >
              {members.map((m) => (
                <option key={m.user_id} value={m.user_id}>
                  {m.nickname || m.user_id}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 멤버 추방 */}
        {isHost && members.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">서버 멤버 추방</label>
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto border border-gray-700 rounded-md p-2 bg-[#2f3136]">
              {members
                .filter((m) => m.user_id !== currentUserId)
                .map((m) => (
                  <div
                    key={m.user_id}
                    className="flex justify-between items-center bg-[#202225] p-2 rounded-md"
                  >
                    <span>{m.nickname || m.user_id}</span>
                    <Button
                      onClick={() => onKickMember(server.id, m.user_id)}
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      추방
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 버튼 섹션 */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500"
            onClick={onClose}
          >
            취소
          </button>

          {isHost ? (
            <Button
              onClick={() => onDelete(server.id)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              서버 삭제
            </Button>
          ) : (
            <Button
              onClick={() => onLeaveServer(server.id, currentUserId)}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              서버 나가기
            </Button>
          )}

          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            저장
          </Button>
        </div>
      </div>

      {/* InviteModal 표시 */}
      {isInviteOpen && (
        <InviteModal
          serverInviteLink={serverInviteLink}
          currentUserId={currentUserId}
          onClose={() => setIsInviteOpen(false)}
        />
      )}
    </div>
  );
}
