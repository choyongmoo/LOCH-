interface EmptyMeetingViewProps {
  onDrop: (e: React.DragEvent) => void;
  onCreatePanel: () => void;
}

export const EmptyMeetingView = ({ onDrop, onCreatePanel }: EmptyMeetingViewProps) => {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      onDragOver={e => e.preventDefault()}
      onDrop={onDrop}
    >
      <div className="mb-6 text-gray-400 text-base text-center select-none">
        앱을 드래그하거나 <span className="font-bold text-[#5865F2]">+</span> 버튼을 눌러<br/>
        새로운 회의 화면을 시작하세요!
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center text-3xl rounded-full bg-[#5865F2] text-white shadow-lg hover:bg-[#4752c4] transition focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:ring-offset-2"
        onClick={onCreatePanel}
        aria-label="패널 추가"
      >
        <span style={{fontWeight:'bold', fontSize:'2rem', lineHeight:1}}>+</span>
      </button>
    </div>
  );
}; 