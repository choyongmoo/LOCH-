import React from 'react';

interface CameraActionModalProps {
  isOpen: boolean;
  userName: string;
  isCameraOn?: boolean;
  isScreenSharing?: boolean;
  onClose: () => void;
  onSingleView: () => void;
  onSplitView: () => void;
  onReplaceView: () => void;
  isSplitViewDisabled?: boolean;
  isReplaceViewDisabled?: boolean;
}

export const CameraActionModal: React.FC<CameraActionModalProps> = ({
  isOpen,
  userName,
  isCameraOn = false,
  isScreenSharing = false,
  onClose,
  onSingleView,
  onSplitView,
  onReplaceView,
  isSplitViewDisabled = false,
  isReplaceViewDisabled = false
}) => {
  if (!isOpen) return null;

  const getDisplayText = () => {
    if (isScreenSharing) return `${userName}의 화면 공유`;
    if (isCameraOn) return `${userName}의 카메라`;
    return `${userName}의 프로필`;
  };

  const getDescription = () => {
    if (isScreenSharing) return "화면 공유를 어떻게 표시하시겠습니까?";
    if (isCameraOn) return "카메라를 어떻게 표시하시겠습니까?";
    return "프로필을 어떻게 표시하시겠습니까?";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#2F3136] rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="text-3xl mb-3">
            {isScreenSharing ? '🖥️' : isCameraOn ? '📹' : '👤'}
          </div>
          <h3 className="text-[#DCDDDE] text-lg font-semibold mb-2">
            {getDisplayText()}
          </h3>
          <p className="text-[#72767D] text-sm">
            {getDescription()}
          </p>
        </div>
        
        <div className="space-y-3">
          {/* 단일 화면 */}
          <button
            onClick={onSingleView}
            className="w-full flex items-center justify-between p-4 bg-[#40444B] hover:bg-[#4F545C] rounded-lg transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#5865F2] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-[#DCDDDE] font-medium">단일 화면</div>
                <div className="text-[#72767D] text-xs">전체 화면으로 표시</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-[#72767D] group-hover:text-[#DCDDDE] transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </button>

          {/* 화면 분할 */}
          <button
            onClick={onSplitView}
            disabled={isSplitViewDisabled}
            className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors group ${
              isSplitViewDisabled 
                ? 'bg-[#2F3136] cursor-not-allowed opacity-50' 
                : 'bg-[#40444B] hover:bg-[#4F545C]'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isSplitViewDisabled ? 'bg-[#72767D]' : 'bg-[#5865F2]'
              }`}>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3v7h7V3H3zm0 11v7h7v-7H3zm11-11v7h7V3h-7zm0 11v7h7v-7h-7z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className={`font-medium ${
                  isSplitViewDisabled ? 'text-[#72767D]' : 'text-[#DCDDDE]'
                }`}>
                  화면 분할
                  {isSplitViewDisabled && <span className="ml-2 text-xs">(사용 불가)</span>}
                </div>
                <div className="text-[#72767D] text-xs">
                  {isSplitViewDisabled ? '다른 사용자와 함께 표시' : '기존 화면과 함께 표시'}
                </div>
              </div>
            </div>
            <svg className={`w-5 h-5 transition-colors ${
              isSplitViewDisabled 
                ? 'text-[#72767D]' 
                : 'text-[#72767D] group-hover:text-[#DCDDDE]'
            }`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </button>

          {/* 화면 교체 */}
          <button
            onClick={onReplaceView}
            disabled={isReplaceViewDisabled}
            className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors group ${
              isReplaceViewDisabled 
                ? 'bg-[#2F3136] cursor-not-allowed opacity-50' 
                : 'bg-[#40444B] hover:bg-[#4F545C]'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isReplaceViewDisabled ? 'bg-[#72767D]' : 'bg-[#5865F2]'
              }`}>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className={`font-medium ${
                  isReplaceViewDisabled ? 'text-[#72767D]' : 'text-[#DCDDDE]'
                }`}>
                  화면 교체
                  {isReplaceViewDisabled && <span className="ml-2 text-xs">(사용 불가)</span>}
                </div>
                <div className="text-[#72767D] text-xs">
                  {isReplaceViewDisabled ? '동일한 사용자입니다' : '기존 화면을 대체'}
                </div>
              </div>
            </div>
            <svg className={`w-5 h-5 transition-colors ${
              isReplaceViewDisabled 
                ? 'text-[#72767D]' 
                : 'text-[#72767D] group-hover:text-[#DCDDDE]'
            }`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </button>
        </div>

        {/* 취소 버튼 */}
        <div className="mt-6 pt-4 border-t border-[#40444B]">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-[#40444B] text-[#DCDDDE] rounded hover:bg-[#4F545C] transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}; 