import React from 'react';

interface MeetingControlsProps {
  onToggleMute: () => void;
  onOpenOptions: () => void;
  onLeave: () => void;
}

export const MeetingControls: React.FC<MeetingControlsProps> = ({
  onToggleMute,
  onOpenOptions,
  onLeave
}) => {
  return (
    <div className="flex flex-col gap-2">
      {/* 음소거 버튼 */}
      <button
        onClick={onToggleMute}
        className="w-12 h-12 rounded-lg bg-[#4F545C] text-white shadow-lg flex items-center justify-center hover:bg-[#5D6268] transition"
        title="음소거"
      >
        🔇
      </button>
      
      {/* 옵션 버튼 */}
      <button
        onClick={onOpenOptions}
        className="w-12 h-12 rounded-lg bg-[#4F545C] text-white shadow-lg flex items-center justify-center hover:bg-[#5D6268] transition"
        title="설정"
      >
        ⚙️
      </button>
      
      {/* 회의방 나가기 버튼 */}
      <button
        onClick={onLeave}
        className="w-12 h-12 rounded-lg bg-[#ED4245] text-white shadow-lg flex items-center justify-center hover:bg-[#F04747] transition"
        title="회의방 나가기"
      >
        OUT
      </button>
    </div>
  );
}; 