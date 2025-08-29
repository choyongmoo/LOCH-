import { useState } from "react";
import { useUserProfile } from '@/hooks/useUserProfile';

interface Member {
  id: string;
  name: string;
  isLocal: boolean;
  isCameraOn: boolean;
  isMicOn: boolean;
  isActive: boolean;
  isScreenSharing: boolean;
  avatar?: string;
  status?: string; // 상태 필드 추가
}

interface MembersBarProps {
  members: Member[];
  onOpenDetails: () => void;
  onUserClick?: (name: string) => void;
  onStartPrivateChat?: (targetUser: string) => void;
}

export const MembersBar = ({ members, onOpenDetails, onUserClick, onStartPrivateChat }: MembersBarProps) => {
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const { userProfile } = useUserProfile();

  // 상태에 따른 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "온라인": return "bg-green-500";
      case "자리비움": return "bg-yellow-500";
      case "오프라인": return "bg-gray-500";
      default: return "bg-green-500";
    }
  };

  // 상태에 따른 텍스트 색상
  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "온라인": return "text-green-400";
      case "자리비움": return "text-yellow-400";
      case "오프라인": return "text-gray-400";
      default: return "text-green-400";
    }
  };

  // 멤버 목록 필터링 (비활성 사용자 제외)
  const displayMembers = members.filter(member => member.isActive);

  return (
    <div className="flex flex-col h-full">
      {/* 멤버 목록 */}
      <div className="flex-1 overflow-y-auto">
        {displayMembers.map((member, i) => {
          return (
            <div
              key={member.id}
              className="flex items-center px-3 py-2 hover:bg-[#40444B] transition-colors cursor-pointer group"
              onMouseEnter={() => setHoveredMember(member.name)}
              onMouseLeave={() => setHoveredMember(null)}
              onClick={() => onUserClick?.(member.name)}
            >
              {/* 멤버 아바타 */}
              <div className="relative mr-3">
                <div className="w-8 h-8 rounded-full bg-[#5865F2] text-white flex items-center justify-center text-sm font-semibold">
                  {member.avatar || member.name.slice(0, 2).toUpperCase()}
                </div>
                                 {/* 온라인 상태 표시 */}
                 <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#2F3136] ${getStatusColor(member.isLocal ? userProfile.status : (member.status || "온라인"))}`}></div>
               </div>
               
               {/* 멤버 정보 */}
               <div className="flex-1 min-w-0">
                 <div className="text-sm font-medium text-[#DCDDDE] truncate">
                   {member.name}
                   {member.isLocal && <span className="ml-1 text-xs text-[#72767D]">(나)</span>}
                 </div>
                 <div className={`text-xs ${getStatusTextColor(member.isLocal ? userProfile.status : (member.status || "온라인"))}`}>
                   {member.isLocal ? userProfile.status : (member.status || "온라인")}
                 </div>
              </div>
              
              {/* 호버 시 표시되는 액션 버튼 - 자기 자신이 아닌 경우에만 */}
              {hoveredMember === member.name && !member.isLocal && (
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 text-[#72767D] hover:text-[#DCDDDE] hover:bg-[#4F545C] rounded">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C13.1 2 14 2.9 14 4V8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8V4C10 2.9 10.9 2 12 2ZM18 10V8C18 4.69 15.31 2 12 2C8.69 2 6 4.69 6 8V10C6 13.31 8.69 16 12 16C15.31 16 18 13.31 18 10ZM12 18C8.69 18 6 20.69 6 24H18C18 20.69 15.31 18 12 18Z"/>
                    </svg>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartPrivateChat?.(member.name);
                    }}
                    className="p-1 text-[#72767D] hover:text-[#DCDDDE] hover:bg-[#4F545C] rounded"
                    title={`${member.name}에게 개인 메시지 보내기`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}
        
        {/* 멤버가 없을 때 표시 */}
        {displayMembers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-2xl mb-2">👥</div>
            <div className="text-[#72767D] text-sm">참가자가 없습니다</div>
            <div className="text-xs text-[#72767D] mt-1">다른 사용자가 참가할 때까지 기다려주세요</div>
          </div>
        )}
      </div>
      
      {/* 회의방 상세정보 버튼 */}
      <div className="p-3 border-t border-[#202225]">
        <button
          onClick={onOpenDetails}
          className="w-full px-3 py-2 bg-[#40444B] text-[#DCDDDE] rounded hover:bg-[#4F545C] transition-colors text-sm font-medium"
        >
          회의방 상세정보
        </button>
      </div>
    </div>
  );
};
