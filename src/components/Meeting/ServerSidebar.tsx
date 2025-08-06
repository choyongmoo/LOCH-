import React, { useRef } from "react";
import type { AppInstance } from "@/types/meeting";

interface ServerSidebarProps {
  onAppCreate: (type: string) => void;
  instances: AppInstance[];
  hoveredType: string | null;
  setHoveredType: (type: string | null) => void;
  isMicMuted?: boolean;
  isHeadsetMuted?: boolean;
  onMicMuteToggle?: () => void;
  onHeadsetMuteToggle?: () => void;
  onOpenOptions?: () => void;
  onInstanceEdit?: (instance: AppInstance) => void;
  onLeave?: () => void;
  onOpenMyProfile?: () => void;
}

export function ServerSidebar({ 
  onAppCreate, 
  instances = [], 
  hoveredType, 
  setHoveredType,
  isMicMuted = false,
  isHeadsetMuted = false,
  onMicMuteToggle,
  onHeadsetMuteToggle,
  onOpenOptions,
  onInstanceEdit,
  onLeave,
  onOpenMyProfile
}: ServerSidebarProps) {
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  return (
    <div className="flex flex-col items-center p-2 w-full h-full relative">
      <div className="flex flex-col gap-3">
        <div
          onClick={onOpenMyProfile}
          className="w-12 h-12 rounded-full bg-[#5865F2] hover:bg-[#4752c4] text-white flex items-center justify-center cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 mt-2"
          title="내 프로필"
        >
          <span className="text-xs font-bold">홍길동</span>
        </div>

        <div className="h-px bg-[#4F545C] w-10 my-1 rounded mx-auto" />

        {["P", "S", "N", "C"].map((server) => (
          <div key={server} className="relative">
            <div
              className="w-12 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("app", server)}
              onClick={() => onAppCreate?.(server)}
              onMouseEnter={() => {
                if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                setHoveredType?.(server);
              }}
              onMouseLeave={() => {
                hoverTimeout.current = setTimeout(() => setHoveredType?.(null), 200);
              }}
            >
              <span className="text-lg font-semibold">{server}</span>
            </div>
            {/* 인스턴스 목록 슬라이드 */}
            {hoveredType === server && (
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50"
                onMouseEnter={() => {
                  if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                  setHoveredType?.(server);
                }}
                onMouseLeave={() => {
                  hoverTimeout.current = setTimeout(() => setHoveredType?.(null), 200);
                }}
              >
                <div
                  className="bg-[#2F3136] text-white rounded-lg shadow-lg px-4 py-2 min-w-[160px] animate-slide-in flex flex-row items-center gap-2 border border-[#4F545C]"
                  style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.25)' }}
                >
                  {instances.filter(i => i.type === server).length === 0 ? (
                    <div className="text-gray-400 text-sm">생성된 인스턴스 없음</div>
                  ) : (
                    <div className="flex flex-row gap-2">
                      {instances.filter(i => i.type === server).map(i => (
                        <div
                          key={i.id}
                          className="truncate text-sm text-white bg-[#40444B] px-3 py-1 rounded hover:bg-[#5865F2] transition-colors cursor-pointer max-w-[120px] border border-[#4F545C]"
                          draggable
                          onDragStart={e => {
                            e.dataTransfer.setData("instance", JSON.stringify(i));
                          }}
                          onClick={() => onInstanceEdit?.(i)}
                        >
                          {i.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-2">
        {/* 마이크 음소거 버튼 */}
        <div
          className={`w-12 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 relative ${
            isMicMuted 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-400' 
              : 'bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white'
          }`}
          onClick={onMicMuteToggle}
          title={isMicMuted ? "마이크 음소거 해제" : "마이크 음소거"}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C13.1 2 14 2.9 14 4V8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8V4C10 2.9 10.9 2 12 2ZM18 10V8C18 4.69 15.31 2 12 2C8.69 2 6 4.69 6 8V10C6 13.31 8.69 16 12 16C15.31 16 18 13.31 18 10ZM12 18C8.69 18 6 20.69 6 24H18C18 20.69 15.31 18 12 18Z"/>
          </svg>
          {isMicMuted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-0.5 bg-red-500 transform -rotate-45"></div>
            </div>
          )}
        </div>

        {/* 헤드셋 음소거 버튼 */}
        <div
          className={`w-12 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 relative ${
            isHeadsetMuted 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-400' 
              : 'bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white'
          }`}
          onClick={onHeadsetMuteToggle}
          title={isHeadsetMuted ? "헤드셋 음소거 해제" : "헤드셋 음소거"}
        >
          <span className="text-lg">🎧</span>
          {isHeadsetMuted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-0.5 bg-red-500 transform -rotate-45"></div>
            </div>
          )}
        </div>

        {/* 옵션 버튼 */}
        <div
          className="w-12 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer transition-all duration-200"
          onClick={onOpenOptions}
          title="오디오/알림 설정"
        >
          <span className="text-lg">⚙️</span>
        </div>

        {/* OUT 버튼 */}
        <div
          className="w-12 h-10 rounded-lg bg-red-900 hover:bg-red-800 text-red-300 hover:text-red-200 flex items-center justify-center cursor-pointer transition-all duration-200"
          onClick={onLeave}
          title="회의방 나가기"
        >
          <span className="text-xs font-bold">OUT</span>
        </div>
      </div>
      {/* 애니메이션 스타일 */}
      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-24px) scale(0.98); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        .animate-slide-in {
          animation: slide-in 0.25s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}
