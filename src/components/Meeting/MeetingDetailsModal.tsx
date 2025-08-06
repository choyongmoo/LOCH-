import React from "react";
import type { MeetingDetailsModalProps } from "@/pages/Meeting/types";

export const MeetingDetailsModal = ({
  visible,
  onClose,
  details,
  meetingInfo,
}: MeetingDetailsModalProps) => {
  if (!visible) return null;

  // 현재 시간
  const currentTime = new Date().toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  // 회의방 정보 (props로 받거나 기본값 사용)
  const roomInfo = meetingInfo || {
    roomName: "프로젝트 기획 회의",
    roomId: "MEET-2024-001",
    createdAt: "2024-01-15",
    host: "김팀장",
    status: "진행중",
    participants: 8,
    maxParticipants: 12,
    duration: "2시간 30분",
    description: "Q1 프로젝트 기획 및 일정 조율을 위한 회의입니다."
  };

  return (
    <div>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="
          fixed top-1/2 left-1/2 max-w-4xl w-full bg-[#2F3136] rounded-2xl shadow-xl
          transform -translate-x-1/2 -translate-y-1/2 z-50 text-white overflow-hidden
        "
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-[#4F545C]">
          <h2 className="text-2xl font-bold text-[#7289DA]">회의방 상세정보</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex">
          {/* 왼쪽 - 큰 이미지 영역 */}
          <div className="w-1/3 p-6 bg-gradient-to-br from-[#5865F2] to-[#7289DA] flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-6xl">🏢</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{roomInfo.roomName}</h3>
              <p className="text-sm opacity-80">회의방 ID: {roomInfo.roomId}</p>
            </div>
          </div>

          {/* 오른쪽 - 정보 영역 */}
          <div className="w-2/3 p-6">
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-[#7289DA] flex items-center">
                  📋 기본 정보
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#40444B] p-3 rounded-lg">
                    <p className="text-sm text-gray-400">회의명</p>
                    <p className="font-medium">{roomInfo.roomName}</p>
                  </div>
                  <div className="bg-[#40444B] p-3 rounded-lg">
                    <p className="text-sm text-gray-400">회의 ID</p>
                    <p className="font-medium">{roomInfo.roomId}</p>
                  </div>
                  <div className="bg-[#40444B] p-3 rounded-lg">
                    <p className="text-sm text-gray-400">생성일</p>
                    <p className="font-medium">{roomInfo.createdAt}</p>
                  </div>
                  <div className="bg-[#40444B] p-3 rounded-lg">
                    <p className="text-sm text-gray-400">호스트</p>
                    <p className="font-medium">{roomInfo.host}</p>
                  </div>
                </div>
              </div>

              {/* 현재 상태 */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-[#7289DA] flex items-center">
                  📊 현재 상태
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#40444B] p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-400">상태</p>
                    <p className="font-medium text-green-400">{roomInfo.status}</p>
                  </div>
                  <div className="bg-[#40444B] p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-400">참가자</p>
                    <p className="font-medium">{roomInfo.participants}/{roomInfo.maxParticipants}</p>
                  </div>
                  <div className="bg-[#40444B] p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-400">진행 시간</p>
                    <p className="font-medium">{roomInfo.duration}</p>
                  </div>
                </div>
              </div>

              {/* 설명 */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-[#7289DA] flex items-center">
                  📝 회의 설명
                </h4>
                <div className="bg-[#40444B] p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">{roomInfo.description}</p>
                </div>
              </div>

              {/* 현재 시간 */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-[#7289DA] flex items-center">
                  🕐 현재 시간
                </h4>
                <div className="bg-[#40444B] p-3 rounded-lg">
                  <p className="font-medium">{currentTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end p-6 border-t border-[#4F545C]">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#5865F2] rounded-lg hover:bg-[#4752c4] transition-colors font-medium"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
