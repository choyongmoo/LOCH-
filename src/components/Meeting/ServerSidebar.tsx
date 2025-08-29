import React, { useState } from 'react';
import { MyProfileModal } from './MyProfileModal';
import { useUserProfile } from '@/hooks/useUserProfile';

interface ServerSidebarProps {
  isMicMuted?: boolean;
  isHeadsetMuted?: boolean;
  onMicMuteToggle?: () => void;
  onHeadsetMuteToggle?: () => void;
  onToggleScreenShare?: () => void;
  onToggleCamera?: () => void;
  isScreenSharing?: boolean;
  onOpenOptions?: () => void;
  onLeave?: () => void;
  onOpenMyProfile?: () => void;
  remoteUsers?: any[];
  onRemoteUserCameraClick?: (userId: string) => void;
  onStopShareRequest?: () => void;
}

export const ServerSidebar: React.FC<ServerSidebarProps> = ({
  isMicMuted,
  isHeadsetMuted,
  onMicMuteToggle,
  onHeadsetMuteToggle,
  onToggleScreenShare,
  onToggleCamera,
  isScreenSharing,
  onOpenOptions,
  onLeave,
  onOpenMyProfile,
  remoteUsers = [],
  onRemoteUserCameraClick,
  onStopShareRequest
}) => {
  const { userProfile } = useUserProfile();
  const [showMyProfile, setShowMyProfile] = useState(false);

  // 상태에 따른 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "온라인": return "bg-green-500";
      case "자리비움": return "bg-yellow-500";
      case "오프라인": return "bg-gray-500";
      default: return "bg-green-500";
    }
  };

  // 랜덤 색상 생성
  const getRandomColor = (name: string) => {
    const colors = [
      '#5865F2', '#57F287', '#FEE75C', '#EB459E', 
      '#ED4245', '#FAA61A', '#747F8D', '#43B581'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-2 h-full">
        {/* 내 프로필 */}
        <div 
          className="relative w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity mt-1"
          onClick={onOpenMyProfile}
          title={`${userProfile.name} (나)`}
        >
          <span className="text-xs font-bold text-white">{userProfile.avatar}</span>
          <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#202225] ${getStatusColor(userProfile.status)}`}></div>
        </div>

        {/* 구분선 */}
        <div className="w-8 h-px bg-[#40444B]"></div>

        {/* 회의방 참가자들 화면 */}
        {remoteUsers.filter(user => !user.isLocal).map((user) => (
          <div
            key={user.id}
            className="relative w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-all duration-200 group"
            onClick={() => onRemoteUserCameraClick?.(user.id)}
            title={`${user.name}${user.isCameraOn || user.isScreenSharing ? `의 ${user.isScreenSharing ? '화면 공유' : '카메라'}` : ''}`}
            style={{ backgroundColor: getRandomColor(user.name) }}
          >
            <span className="text-xs font-bold text-white">{user.name.slice(0, 2)}</span>
            
            {/* 활성 표시 (화면 공유는 녹색, 카메라는 빨간색, 비활성은 회색) */}
            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#202225] ${
              user.isScreenSharing ? 'bg-green-500' : user.isCameraOn ? 'bg-red-500' : 'bg-gray-500'
            }`}></div>
          </div>
        ))}

        {/* 하단 컨트롤 버튼들 */}
        <div className="mt-auto flex flex-col items-center space-y-2">
          {/* 마이크 버튼 */}
          <button
            onClick={onMicMuteToggle}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
              isMicMuted 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-[#36393F] hover:bg-[#5865F2] text-[#B9BBBE] hover:text-white'
            }`}
            title={isMicMuted ? "마이크 켜기" : "마이크 끄기"}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4V8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8V4C10 2.9 10.9 2 12 2ZM18 10V8C18 4.69 15.31 2 12 2C8.69 2 6 4.69 6 8V10C6 13.31 8.69 16 12 16C15.31 16 18 13.31 18 10ZM12 18C8.69 18 6 20.69 6 24H18C18 20.69 15.31 18 12 18Z"/>
              {isMicMuted && <path d="M3 3L21 21" stroke="currentColor" strokeWidth="2" fill="none"/>}
            </svg>
          </button>

          {/* 헤드셋 버튼 */}
          <button
            onClick={onHeadsetMuteToggle}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
              isHeadsetMuted 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-[#36393F] hover:bg-[#5865F2] text-[#B9BBBE] hover:text-white'
            }`}
            title={isHeadsetMuted ? "헤드셋 켜기" : "헤드셋 끄기"}
          >
            {isHeadsetMuted ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3V10c0-4.97-4.03-9-9-9zM7.5 16.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5S9 14.17 9 15s-.67 1.5-1.5 1.5zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                <path d="M3.27 3L2 4.27l20 20L23.27 23 3.27 3z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3V10c0-4.97-4.03-9-9-9zM7.5 16.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5S9 14.17 9 15s-.67 1.5-1.5 1.5zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
            )}
          </button>

          {/* 화면 공유 버튼 */}
          {onToggleScreenShare && (
            <button
              onClick={() => {
                if (isScreenSharing) {
                  onStopShareRequest?.();
                } else {
                  onToggleScreenShare?.();
                }
              }}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                isScreenSharing 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-[#36393F] hover:bg-[#5865F2] text-[#B9BBBE] hover:text-white'
              }`}
              title={isScreenSharing ? "화면 공유 중지" : "화면 공유/카메라"}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 3H22C22.6 3 23 3.4 23 4V16C23 16.6 22.6 17 22 17H17L19 19V20H5V19L7 17H2C1.4 17 1 16.6 1 16V4C1 3.4 1.4 3 2 3ZM3 5V15H21V5H3ZM8 7H16V9H8V7ZM8 11H13V13H8V11Z"/>
              </svg>
            </button>
          )}

          {/* 설정 버튼 */}
          <button
            onClick={onOpenOptions}
            className="w-10 h-10 rounded-lg bg-[#36393F] hover:bg-[#5865F2] text-[#B9BBBE] hover:text-white flex items-center justify-center transition-all duration-200"
            title="설정"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33c-.22-.08-.47 0-.59.22L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48l2.03 1.58C4.84 11.36 4.82 11.69 4.82 12s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61L19.14 12.94z"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
            </svg>
          </button>

          {/* 회의방 나가기 버튼 */}
          <button
            onClick={onLeave}
            className="w-10 h-10 rounded-lg bg-[#ED4245] text-white hover:bg-[#F04747] flex items-center justify-center transition-colors"
            title="회의방 나가기"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 내 프로필 모달 */}
      <MyProfileModal
        visible={showMyProfile}
        onClose={() => setShowMyProfile(false)}
      />
    </>
  );
};
