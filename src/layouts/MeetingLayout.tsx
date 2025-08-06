import { ServerSidebar } from '@/components/Meeting/ServerSidebar';
import { MeetingContent } from '@/components/Meeting/MeetingContent';
import { MeetingModals } from '@/components/Meeting/MeetingModals';
import { LeaveConfirmModal } from '@/components/Meeting/LeaveConfirmModal';
import { MyProfileModal } from '@/components/Meeting/MyProfileModal';

// 커스텀 훅들
import { useNotification } from '@/hooks/useNotification';
import { useMembers } from '@/hooks/useMembers';
import { useAppInstances } from '@/hooks/useAppInstances';
import { usePanels } from '@/hooks/usePanels';
import { usePanelDrop } from '@/hooks/usePanelDrop';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useChat } from '@/hooks/useChat';
import { useAudioDevices } from '@/hooks/useAudioDevices';
import { useInstanceManagement } from '@/hooks/useInstanceManagement';
import { useMeetingState } from '@/hooks/useMeetingState';
import { useMeetingHandlers } from '@/hooks/useMeetingHandlers';
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
    isMuted,
    setIsMuted
  } = useMeetingState();

  // 마이크/헤드셋 음소거 상태 분리
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isHeadsetMuted, setIsHeadsetMuted] = useState(false);
  const [micFirst, setMicFirst] = useState(false); // 마이크를 먼저 눌렀는지 추적
  const [inputVolume, setInputVolume] = useState(100);
  const [outputVolume, setOutputVolume] = useState(100);

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
    handleJoin, 
    handleLeave 
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
    audioInputDevices,
    audioOutputDevices,
    selectedInputDevice,
    selectedOutputDevice,
    setSelectedInputDevice,
    setSelectedOutputDevice,
    loadAudioDevices
  } = useAudioDevices();

  const {
    instances,
    setInstances,
    showAppModal,
    setShowAppModal,
    appType,
    setAppType,
    appTitle,
    setAppTitle,
    modalMode,
    setModalMode,
    pendingDrop,
    setPendingDrop,
    replaceOrSplit,
    setReplaceOrSplit,
    hoveredType,
    setHoveredType,
    handleAppCreate,
    handleAppModalClose,
    handleAppModalCreate,
    handleNewInstance,
  } = useAppInstances();

  const {
    panels,
    setPanels,
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
    showInstanceModal,
    selectedInstance,
    editingTitle,
    setShowInstanceModal,

    setEditingTitle,
    handleInstanceEdit,
    handleInstanceDelete,
    handleInstanceTitleChange,
    showDeleteConfirm,
    setShowDeleteConfirm,
    confirmDelete,
    showSuccessModal,
    setShowSuccessModal,
    successMessage,
    showOpenInstanceWarning,
    setShowOpenInstanceWarning
  } = useInstanceManagement(setInstances, panels, setPanels, instances);

  const {
    handlePanelDrop,
    handleReplaceOrSplit,
    handleSelectInstance
  } = usePanelDrop(
    panels,
    setPanels,
    replaceOrSplit,
    setReplaceOrSplit,
    setAppType,
    setShowAppModal,
    pendingDrop,
    setPendingDrop,
    setModalMode,
    handlePanelSplit,
  );

  const {
    fullscreenPanel,
    enterFullscreen,
    exitFullscreen,
    isFullscreen
  } = useFullscreen();

  const { current, addNotification } = useNotification();

  // 이벤트 핸들러들
  const {
    handleAppModalCreateWithPanel,
    handleEmptyDrop,
    handleOpenOptions,
    handleOpenDetails,
    handleUserClick
  } = useMeetingHandlers(
    panels,
    pendingDrop,
    isMuted,
    setIsMuted,
    setShowOptions,
    setShowDetails,
    setSelectedUser,
    setPendingDrop,
    setPanels,
    createInitialPanel,
    handleAppCreate,
    handleAppModalCreate,
    handleSelectInstance,
    loadAudioDevices,
    addNotification
  );

  const handleFullscreen = (panelId: number) => {
    enterFullscreen(panelId, panels);
  };

  return (
    <div className="flex h-screen bg-[#36393F]">
      {/* 왼쪽 사이드바 */}
      <div className="w-20 bg-[#2F3136] flex flex-col">
        <ServerSidebar
          instances={instances}
          hoveredType={hoveredType}
          setHoveredType={setHoveredType}
          isMicMuted={isMicMuted}
          isHeadsetMuted={isHeadsetMuted}
          onMicMuteToggle={handleMicMuteToggle}
          onHeadsetMuteToggle={handleHeadsetMuteToggle}
          onOpenOptions={handleOpenOptions}
          onInstanceEdit={handleInstanceEdit}
          onAppCreate={handleAppCreate}
          onLeave={handleLeaveClick}
          onOpenMyProfile={() => setShowMyProfile(true)}
        />
      </div>

      {/* 메인 콘텐츠 영역 */}
      <MeetingContent
        isFullscreen={isFullscreen}
        fullscreenPanel={fullscreenPanel}
        panels={panels}
        colSizes={colSizes}
        rowSizesLeft={rowSizesLeft}
        rowSizesRight={rowSizesRight}
        current={current}
        members={members}
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
        swapTarget={swapTarget}
        onSwapApp={handleSwapApp}
        onSwapHere={handleSwapHere}
        onCancelSwap={handleCancelSwap}
      />

      {/* 테스트 버튼들 */}
      
      {/* 채팅 버튼 */}
      <button
        onClick={toggleChat}
        className="fixed bottom-14 right-5 z-60 w-12 h-12 rounded-full bg-[#5865F2] text-white shadow-lg flex items-center justify-center hover:bg-[#4752c4] transition"
        aria-label="Toggle Chat"
      >
        💬
      </button>
      
      {/* 모든 모달들 */}
      <MeetingModals
        // 채팅 관련
        chatOpen={chatOpen}
        messages={messages}
        input={input}
        setInput={setInput}
        onSendMessage={sendMessage}
        
        // 앱 모달 관련
        showAppModal={showAppModal}
        appType={appType}
        appTitle={appTitle}
        modalMode={modalMode}
        instances={instances}
        onAppModalClose={handleAppModalClose}
        onAppTitleChange={setAppTitle}
        onAppModalCreate={handleAppModalCreateWithPanel}
        onSelectInstance={handleSelectInstance}
        onNewInstance={handleNewInstance}
        
        // 교체/분할 모달 관련
        replaceOrSplit={replaceOrSplit}
        panelsLength={panels.length}
        onReplaceOrSplit={handleReplaceOrSplit}
        
        // 인스턴스 관리 모달 관련
        showInstanceModal={showInstanceModal}
        selectedInstance={selectedInstance}
        editingTitle={editingTitle}
        onInstanceModalClose={() => setShowInstanceModal(false)}
        onInstanceTitleChange={setEditingTitle}
        onInstanceSave={handleInstanceTitleChange}
        onInstanceDelete={handleInstanceDelete}
        showDeleteConfirm={showDeleteConfirm}
        onDeleteConfirm={confirmDelete}
        onDeleteCancel={() => setShowDeleteConfirm(false)}
        showSuccessModal={showSuccessModal}
        onSuccessClose={() => setShowSuccessModal(false)}
        successMessage={successMessage}
        showOpenInstanceWarning={showOpenInstanceWarning}
        onOpenInstanceWarningClose={() => setShowOpenInstanceWarning(false)}
        
        // 회의방 상세 모달 관련
        showDetails={showDetails}
        onDetailsClose={() => setShowDetails(false)}
        
        // 유저 상세 모달 관련
        selectedUser={selectedUser}
        onUserClose={() => setSelectedUser(null)}
        
        // 옵션 모달 관련
        showOptions={showOptions}
        audioInputDevices={audioInputDevices}
        audioOutputDevices={audioOutputDevices}
        selectedInputDevice={selectedInputDevice}
        selectedOutputDevice={selectedOutputDevice}
        isMicMuted={isMicMuted}
        isHeadsetMuted={isHeadsetMuted}
        inputVolume={inputVolume}
        outputVolume={outputVolume}
        onOptionsClose={() => setShowOptions(false)}
        onOptionsSave={() => {
          setShowOptions(false);
          addNotification("설정이 변경되었습니다.");
        }}
        onMicMuteToggle={handleMicMuteToggle}
        onHeadsetMuteToggle={handleHeadsetMuteToggle}
        onInputDeviceChange={setSelectedInputDevice}
        onOutputDeviceChange={setSelectedOutputDevice}
        onInputVolumeChange={setInputVolume}
        onOutputVolumeChange={setOutputVolume}
      />

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
