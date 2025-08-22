import React from 'react';
import { MembersBar } from '@/components/Meeting/MembersBar';

interface RightSidebarProps {
  members: any[];
  userProfile: any;
  getStatusColor: (status: string) => string;
  onOpenDetails: () => void;
  onUserClick: (name: string) => void;
  onOpenMyProfile: () => void;
  onToggleChat: () => void;
  onStartPrivateChat?: (targetUser: string) => void;
  onToggleGeneralChat?: () => void;
  unreadGeneralMessages?: number;
  unreadMessages?: {[key: string]: number};
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  members,
  userProfile,
  getStatusColor,
  onOpenDetails,
  onUserClick,
  onOpenMyProfile,
  onToggleChat,
  onStartPrivateChat,
  onToggleGeneralChat,
  unreadGeneralMessages,
  unreadMessages
}) => {
  return (
    <div className="w-60 bg-[#2F3136] flex-shrink-0 flex flex-col">
      {/* 멤버 리스트 헤더 */}
      <div className="h-12 bg-[#2F3136] border-b border-[#202225] flex items-center px-4">
        <h3 className="text-sm font-semibold text-[#DCDDDE]">참가자</h3>
        <span className="ml-2 text-xs text-[#72767D]">({members.length})</span>
      </div>
      
      {/* 멤버 목록 */}
      <div className="flex-1 overflow-y-auto">
        <MembersBar
          members={members}
          onOpenDetails={onOpenDetails}
          onUserClick={onUserClick}
          onStartPrivateChat={onStartPrivateChat}
        />
      </div>
      
      {/* 하단 사용자 컨트롤 영역 */}
      <div className="h-16 bg-[#292B2F] border-t border-[#202225] flex items-center px-3">
        <div className="flex items-center space-x-3 w-full">
          {/* 사용자 아바타 */}
          <div 
            className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center cursor-pointer hover:opacity-80 relative"
            onClick={onOpenMyProfile}
          >
            <span className="text-xs font-bold text-white">{userProfile.avatar}</span>
            {/* 온라인 상태 표시 - 동적으로 변경 */}
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#292B2F] ${getStatusColor(userProfile.status)}`}></div>
          </div>
          
          {/* 사용자 정보 */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-[#DCDDDE] truncate">{userProfile.name}</div>
            <div className="text-xs text-[#72767D]">{userProfile.status}</div>
          </div>
          
          {/* 채팅 토글 버튼 */}
          <button
            onClick={() => {
              if (!onToggleChat) return;
              onToggleChat();
              // 채팅창이 열리면 전체 채팅으로 전환
              if (onToggleGeneralChat) {
                onToggleGeneralChat();
              }
            }}
            className="p-2 text-[#72767D] hover:text-[#DCDDDE] hover:bg-[#40444B] rounded transition-colors relative"
            aria-label="Toggle Chat"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
            {/* 읽지 않은 메시지 배지 */}
            {(() => {
              const totalUnread = (unreadGeneralMessages || 0) + 
                Object.values(unreadMessages || {}).reduce((sum, count) => sum + count, 0);
              return totalUnread > 0 ? (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {totalUnread > 99 ? '99+' : totalUnread}
                </span>
              ) : null;
            })()}
          </button>
        </div>
      </div>
    </div>
  );
};
