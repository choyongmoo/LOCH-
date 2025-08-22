
import { MeetingContent } from '@/components/Meeting/MeetingContent';
import { LeaveConfirmModal } from '@/components/Meeting/LeaveConfirmModal';
import { MyProfileModal } from '@/components/Meeting/MyProfileModal';

// 커스텀 훅들
import { useNotification } from '@/hooks/useNotification';
import { useMembers } from '@/hooks/useMembers';
import { usePanels } from '@/hooks/usePanels';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useChat } from '@/hooks/useChat';

import { useMeetingState } from '@/hooks/useMeetingState';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export const MeetingLayout = () => {
  const navigate = useNavigate();
  
  // 나가기 확인 모달 상태
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  
  // 내 프로필 모달 상태
  const [showMyProfile, setShowMyProfile] = useState(false);
  
  // 기본 상태들
  const {
    showOptions,
    setShowOptions,
    showDetails,
    setShowDetails,

  } = useMeetingState();

  // 마이크/헤드셋 음소거 상태 분리
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isHeadsetMuted, setIsHeadsetMuted] = useState(false);
  const [micFirst, setMicFirst] = useState(false); // 마이크를 먼저 눌렀는지 추적


  // 마이크 음소거 토글 (마이크만)
  const handleMicMuteToggle = () => {
    setIsMicMuted((prev) => {
      if (!prev) {
        // 마이크를 먼저 음소거하는 경우
        setMicFirst(true);
        return true;
      } else {
        // 마이크 해제
        if (micFirst) {
          // 마이크를 먼저 눌렀던 경우, 마이크만 해제
          return false;
        } else {
          // 헤드셋을 먼저 눌렀던 경우, 둘 다 해제
          setIsHeadsetMuted(false);
          setMicFirst(false);
          return false;
        }
      }
    });
  };

  // 헤드셋 음소거 토글
  const handleHeadsetMuteToggle = () => {
    setIsHeadsetMuted((prev) => {
      if (!prev) {
        // 헤드셋을 먼저 음소거하는 경우
        if (!isMicMuted) {
          setMicFirst(false);
        }
        setIsMicMuted(true);
        return true;
      } else {
        // 헤드셋 해제
        if (micFirst) {
          // 마이크를 먼저 눌렀던 경우, 헤드셋만 해제
          return false;
        } else {
          // 헤드셋을 먼저 눌렀던 경우, 둘 다 해제
          setIsMicMuted(false);
          setMicFirst(false);
          return false;
        }
      }
    });
  };

  // 커스텀 훅들 사용
  const { 
    members, 
    selectedUser, 
    setSelectedUser, 
 
    handleLeave,

  } = useMembers();

  // 나가기 핸들러들
  const handleLeaveClick = () => {
    setShowLeaveConfirm(true);
  };

  const handleLeaveConfirm = () => {
    setShowLeaveConfirm(false);
    // 현재 사용자를 멤버에서 제거
    handleLeave("홍길동"); // 실제로는 현재 사용자 이름을 사용해야 함
    // Workspace로 이동
    navigate('/workspace');
  };

  const handleLeaveCancel = () => {
    setShowLeaveConfirm(false);
  };

  const {
    chatOpen,
    messages,
    input,
    setInput,
    sendMessage,
    toggleChat
  } = useChat();

  const {
    panels,

    colSizes,
    rowSizesLeft,
    rowSizesRight,
    swapTarget,
    handlePanelSplit,
    handlePanelClose,
    handleResize,
    createInitialPanel,
    handleSwapApp,
    handleSwapHere,
    handleCancelSwap
  } = usePanels();

  const {
    fullscreenPanel,
    enterFullscreen,
    exitFullscreen,
    isFullscreen
  } = useFullscreen();

  const { current, addNotification } = useNotification();

  // 간단한 핸들러들
      const handlePanelDrop = () => {
      
    };

      const handleEmptyDrop = () => {
      
    };

  // const handleOpenOptions = () => {
  //   setShowOptions(true);
  // }; // 설정 모달로 대체됨

  const handleOpenDetails = () => {
    setShowDetails(true);
  };

  const handleUserClick = (name: string) => {
    setSelectedUser(name);
  };

  const handleFullscreen = (panelId: number) => {
    enterFullscreen(panelId, panels);
  };

  // 앱 생성 핸들러 (카메라만)
  const handleAppCreate = (type: string) => {
    if (type === 'C') {

    }
  };

  // 앱 제거 핸들러 (카메라만)
  const handleAppRemove = (type: string) => {
    if (type === 'C') {

    }
  };

  // 시뮬레이션된 원격 사용자 데이터 (카메라 상태 포함)
  const simulatedRemoteUsers = members.map(member => ({
    id: member.id,
    name: member.name,
    isLocal: false,
    isCameraOn: member.isCameraOn,
    isMicOn: true,
    isActive: true,
    isScreenSharing: member.isScreenSharing
  }));

  return (
    <div className="h-screen bg-[#36393F]">
      {/* Discord 스타일 레이아웃 - MeetingContent에서 전체 레이아웃 관리 */}
      <MeetingContent
        isFullscreen={isFullscreen}
        fullscreenPanel={fullscreenPanel}
        panels={panels}
        colSizes={colSizes}
        rowSizesLeft={rowSizesLeft}
        rowSizesRight={rowSizesRight}
        current={current}
        isChatOpen={chatOpen}
        chatMessages={messages}
        chatInput={input}
        onExitFullscreen={exitFullscreen}
        onPanelDrop={handlePanelDrop}
        onPanelSplit={handlePanelSplit}
        onPanelClose={handlePanelClose}
        onResize={handleResize}
        onFullscreen={handleFullscreen}
        onEmptyDrop={handleEmptyDrop}
        onCreatePanel={createInitialPanel}
        onOpenDetails={handleOpenDetails}
        onUserClick={handleUserClick}
        onMicMuteToggle={handleMicMuteToggle}
        onHeadsetMuteToggle={handleHeadsetMuteToggle}
        // onOpenOptions={handleOpenOptions} // 설정 모달로 대체됨
        onLeave={handleLeaveClick}
        onOpenMyProfile={() => setShowMyProfile(true)}
        onToggleChat={toggleChat}
        onChatInputChange={setInput}
        onChatSend={sendMessage}
        swapTarget={swapTarget}
        onSwapApp={handleSwapApp}
        onSwapHere={handleSwapHere}
        onCancelSwap={handleCancelSwap}
        isMicMuted={isMicMuted}
        isHeadsetMuted={isHeadsetMuted}
        remoteUsers={simulatedRemoteUsers}
        onAppCreate={handleAppCreate}
        onAppRemove={handleAppRemove}
        onNotification={addNotification}
      />

      {/* 회의방 상세 모달 */}
      {showDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#2F3136] rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-[#DCDDDE] text-lg font-semibold mb-4">회의방 정보</h3>
            <p className="text-[#72767D] text-sm">회의방 상세 정보가 여기에 표시됩니다.</p>
            <button
              onClick={() => setShowDetails(false)}
              className="mt-4 px-4 py-2 bg-[#5865F2] text-white rounded hover:bg-[#4752c4] transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 유저 상세 모달 */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#2F3136] rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-[#DCDDDE] text-lg font-semibold mb-4">사용자 정보</h3>
            <p className="text-[#72767D] text-sm">{selectedUser}의 상세 정보가 여기에 표시됩니다.</p>
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-4 px-4 py-2 bg-[#5865F2] text-white rounded hover:bg-[#4752c4] transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 옵션 모달 */}
      {showOptions && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#2F3136] rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-[#DCDDDE] text-lg font-semibold mb-4">오디오 설정</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[#DCDDDE] text-sm block mb-2">마이크</label>
                <button
                  onClick={handleMicMuteToggle}
                  className={`px-3 py-2 rounded text-sm ${
                    isMicMuted ? 'bg-red-500 text-white' : 'bg-[#40444B] text-[#DCDDDE]'
                  }`}
                >
                  {isMicMuted ? '음소거 해제' : '음소거'}
                </button>
              </div>
              <div>
                <label className="text-[#DCDDDE] text-sm block mb-2">헤드셋</label>
                <button
                  onClick={handleHeadsetMuteToggle}
                  className={`px-3 py-2 rounded text-sm ${
                    isHeadsetMuted ? 'bg-red-500 text-white' : 'bg-[#40444B] text-[#DCDDDE]'
                  }`}
                >
                  {isHeadsetMuted ? '음소거 해제' : '음소거'}
                </button>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowOptions(false)}
                className="px-4 py-2 bg-[#40444B] text-[#DCDDDE] rounded hover:bg-[#4F545C] transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setShowOptions(false);
                  addNotification("설정이 변경되었습니다.");
                }}
                className="px-4 py-2 bg-[#5865F2] text-white rounded hover:bg-[#4752c4] transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 나가기 확인 모달 */}
      <LeaveConfirmModal
        isOpen={showLeaveConfirm}
        onConfirm={handleLeaveConfirm}
        onCancel={handleLeaveCancel}
      />

      {/* 내 프로필 모달 */}
      <MyProfileModal
        visible={showMyProfile}
        onClose={() => setShowMyProfile(false)}
      />
    </div>
  );
};
