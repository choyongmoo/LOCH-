import React from 'react';

interface LeaveConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const LeaveConfirmModal: React.FC<LeaveConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw] shadow-xl">
        {/* 아이콘 */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🚪</span>
          </div>
        </div>
        
        {/* 제목 */}
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
          회의방을 나가시겠습니까?
        </h3>
        
        {/* 설명 */}
        <p className="text-gray-600 text-center mb-6">
          현재 회의방에서 나가면 Workspace로 이동합니다.
        </p>
        
        {/* 버튼들 */}
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            예
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}; 