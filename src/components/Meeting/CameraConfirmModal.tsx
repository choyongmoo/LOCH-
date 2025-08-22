import React from 'react';

interface CameraConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CameraConfirmModal: React.FC<CameraConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#2F3136] rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          {/* 카메라 아이콘 */}
          <div className="text-4xl mb-4">📹</div>
          
          {/* 제목 */}
          <h3 className="text-[#DCDDDE] text-lg font-semibold mb-2">
            카메라를 켜시겠습니까?
          </h3>
          
          {/* 설명 */}
          <p className="text-[#72767D] text-sm mb-6">
            카메라를 켜면 다른 참가자들이 당신의 화면을 볼 수 있습니다.
          </p>
          
          {/* 버튼들 */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-[#40444B] text-[#DCDDDE] rounded hover:bg-[#4F545C] transition-colors"
            >
              아니오
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-[#5865F2] text-white rounded hover:bg-[#4752c4] transition-colors"
            >
              예
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 