import React from 'react';
import { CameraConfirmModal } from './CameraConfirmModal';
import { CameraActionModal } from './CameraActionModal';

interface MeetingModalsProps {
  showCameraConfirm: boolean;
  showShareModal: boolean;
  showStopShareConfirm: boolean;
  showSwitchToCameraConfirm: boolean;
  showCameraAction: boolean;
  selectedRemoteUser: any;
  onCameraConfirm: () => void;
  onCameraCancel: () => void;
  onCloseCameraAction: () => void;
  onSingleView: () => void;
  onSplitView: () => void;
  onReplaceView: () => void;
  onStopShareConfirm: () => void;
  onStopShareCancel: () => void;
  onSwitchToCameraConfirm: () => void;
  onSwitchToCameraCancel: () => void;
  onToggleScreenShare: () => void;
  onCameraToggleRequest: () => void;
  onShareModalClose: () => void;
  isSplitViewDisabled: boolean;
  isReplaceViewDisabled: boolean;
}

export const MeetingModals: React.FC<MeetingModalsProps> = ({
  showCameraConfirm,
  showShareModal,
  showStopShareConfirm,
  showSwitchToCameraConfirm,
  showCameraAction,
  selectedRemoteUser,
  onCameraConfirm,
  onCameraCancel,
  onCloseCameraAction,
  onSingleView,
  onSplitView,
  onReplaceView,
  onStopShareConfirm,
  onStopShareCancel,
  onSwitchToCameraConfirm,
  onSwitchToCameraCancel,
  onToggleScreenShare,
  onCameraToggleRequest,
  onShareModalClose,
  isSplitViewDisabled,
  isReplaceViewDisabled
}) => {
  return (
    <>
      {/* 카메라 확인 모달 */}
      <CameraConfirmModal
        isOpen={showCameraConfirm}
        onConfirm={onCameraConfirm}
        onCancel={onCameraCancel}
      />

      {/* 카메라 액션 모달 */}
      <CameraActionModal
        isOpen={showCameraAction}
        userName={selectedRemoteUser?.name || ''}
        isCameraOn={selectedRemoteUser?.isCameraOn}
        isScreenSharing={selectedRemoteUser?.isScreenSharing}
        onClose={onCloseCameraAction}
        onSingleView={onSingleView}
        onSplitView={onSplitView}
        onReplaceView={onReplaceView}
        isSplitViewDisabled={isSplitViewDisabled}
        isReplaceViewDisabled={isReplaceViewDisabled}
      />

      {/* 화면 공유/카메라 선택 모달 */}
      {showShareModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
          <div className="bg-[#36393F] p-6 rounded-lg shadow-xl text-white">
            <h3 className="text-lg font-bold mb-4">화면 공유 또는 카메라 선택</h3>
            <button
              onClick={() => {
                onShareModalClose();
                onToggleScreenShare(); // 화면 공유 시작
              }}
              className="w-full p-3 mb-3 bg-[#57F287] text-white rounded-md hover:bg-[#3ba55c] transition-colors"
            >
              화면 공유
            </button>
            <button
              onClick={() => {
                onShareModalClose();
                onCameraToggleRequest(); // 카메라 시작
              }}
              className="w-full p-3 mb-3 bg-[#5865F2] text-white rounded-md hover:bg-[#4752c4] transition-colors"
            >
              카메라
            </button>
            <button
              onClick={onShareModalClose}
              className="w-full p-3 bg-[#72767D] text-white rounded-md hover:bg-[#40444B] transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 화면 공유 중지 확인 모달 */}
      {showStopShareConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#36393F] p-6 rounded-lg shadow-xl text-white">
            <h3 className="text-lg font-bold mb-4">화면 공유 중지</h3>
            <p className="text-[#DCDDDE] mb-6">화면 공유를 중지하시겠습니까?</p>
            <div className="flex space-x-3">
              <button
                onClick={onStopShareConfirm}
                className="flex-1 p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                예
              </button>
              <button
                onClick={onStopShareCancel}
                className="flex-1 p-3 bg-[#72767D] text-white rounded-md hover:bg-[#40444B] transition-colors"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 카메라로 전환 확인 모달 */}
      {showSwitchToCameraConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
          <div className="bg-[#36393F] p-6 rounded-lg shadow-xl text-white">
            <h3 className="text-lg font-bold mb-4">카메라로 전환</h3>
            <p className="text-[#DCDDDE] mb-6">화면 공유를 중지하고 카메라를 시작하시겠습니까?</p>
            <div className="flex space-x-3">
              <button
                onClick={onSwitchToCameraConfirm}
                className="flex-1 p-3 bg-[#5865F2] text-white rounded-md hover:bg-[#4752c4] transition-colors"
              >
                예
              </button>
              <button
                onClick={onSwitchToCameraCancel}
                className="flex-1 p-3 bg-[#72767D] text-white rounded-md hover:bg-[#40444B] transition-colors"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
