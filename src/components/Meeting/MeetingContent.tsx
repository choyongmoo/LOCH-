import React, { useState } from 'react';
import { SlideNotification } from '@/components/Meeting/SlideNotification';
import { ServerSidebar } from '@/components/Meeting/ServerSidebar';
import { ChatBox } from '@/components/Meeting/ChatBox';
import { MainContentArea } from '@/components/Meeting/MainContentArea';
import { RightSidebar } from '@/components/Meeting/RightSidebar';
import { MeetingModals } from '@/components/Meeting/MeetingModals';
import { SettingsModal } from '@/components/Meeting/SettingsModal';

// 커스텀 훅들
import { useUserProfile } from '@/hooks/useUserProfile';
import { useCameraControls } from '@/hooks/useCameraControls';
import { useScreenShare } from '@/hooks/useScreenShare';
import { useMeetingModals } from '@/hooks/useMeetingModals';


interface MeetingContentProps {
  // 상태들
  isFullscreen: boolean;
  fullscreenPanel: any;
  panels: any[];
  colSizes: number[];
  rowSizesLeft: number[];
  rowSizesRight: number[];
  current: string | null;
  isChatOpen: boolean;
  chatMessages: any[];
  chatInput: string;
  remoteUsers?: any[];
  
  // 핸들러들
  onExitFullscreen: () => void;
  onPanelDrop: (panelId: number, data: any) => void;
  onPanelSplit: (panelId: number, direction: 'row' | 'col') => void;
  onPanelClose: (panelId: number) => void;
  onResize: (type: 'col' | 'rowLeft' | 'rowRight', values: number[]) => void;
  onFullscreen: (panelId: number) => void;
  onEmptyDrop: (e: React.DragEvent) => void;
  onCreatePanel: () => void;
  onOpenDetails: () => void;
  onUserClick: (name: string) => void;
  onMicMuteToggle: () => void;
  onHeadsetMuteToggle: () => void;
  // onOpenOptions: () => void; // 설정 모달로 대체됨
  onLeave: () => void;
  onOpenMyProfile: () => void;
  onToggleChat: () => void;
  onChatInputChange: (value: string) => void;
  onChatSend: () => void;
  onAppCreate?: (type: string) => void;
  onAppRemove?: (type: string) => void;
  onNotification?: (message: string) => void; // 알림 핸들러 추가
  
  // swap 관련
  swapTarget: number | null;
  onSwapApp: (panelId: number) => void;
  onSwapHere: (panelId: number) => void;
  onCancelSwap: () => void;
  
  // 오디오 상태
  isMicMuted?: boolean;
  isHeadsetMuted?: boolean;
}

export const MeetingContent: React.FC<MeetingContentProps> = ({
  isFullscreen,
  fullscreenPanel,
  panels,
  colSizes,
  rowSizesLeft,
  rowSizesRight,
  current,
  isChatOpen,
  chatMessages,
  chatInput,
  onExitFullscreen,
  onPanelDrop,
  onPanelSplit,
  onPanelClose,
  onResize,
  onFullscreen,

  onOpenDetails,
  onUserClick,
  onMicMuteToggle,
  onHeadsetMuteToggle,
  // onOpenOptions, // 설정 모달로 대체됨
  onLeave,
  onOpenMyProfile,
  onToggleChat,
  onChatInputChange,
  onChatSend,
  swapTarget,
  onSwapApp,
  onSwapHere,
  onCancelSwap,
  isMicMuted = false,
  isHeadsetMuted = false,
  remoteUsers = [],
  onAppCreate,
  onAppRemove,
  onNotification
}) => {
  // 커스텀 훅들 사용
  const { userProfile, getStatusColor } = useUserProfile();

  // 테스트용 원격 사용자 데이터 (실제로는 props로 받아야 함)
  const testRemoteUsers = [
    {
      id: 'user1',
      name: '김개발',
      isLocal: false,
      isCameraOn: true,
      isMicOn: true,
      isActive: true,
      isScreenSharing: false,
      screenShareStream: null,
      avatar: '김개발'.slice(0, 2).toUpperCase()
    },
    {
      id: 'user2',
      name: '이디자인',
      isLocal: false,
      isCameraOn: true,
      isMicOn: false,
      isActive: true,
      isScreenSharing: false,
      screenShareStream: null,
      avatar: '이디자인'.slice(0, 2).toUpperCase()
    },
    {
      id: 'user3',
      name: '박기획',
      isLocal: false,
      isCameraOn: false,
      isMicOn: true,
      isActive: true,
      isScreenSharing: false,
      screenShareStream: null,
      avatar: '박기획'.slice(0, 2).toUpperCase()
    }
  ];

  // 테스트용으로 항상 더미 데이터 사용 (실제 배포 시에는 remoteUsers.length > 0 ? remoteUsers : testRemoteUsers로 변경)
  const actualRemoteUsers = testRemoteUsers;

  const {
    isLocalCameraOn,
    cameraLayout,
    selectedCameraUser,
    userOrder,
    setCameraLayout,
    setSelectedCameraUser,
    handleCameraOff,
    handleCloseCamera,
    handleCameraStart,
    handleSingleView,
    handleSplitView,
    handleReplaceView,
    handleRemoveUserFromView
  } = useCameraControls({ onAppCreate, onAppRemove, remoteUsers: actualRemoteUsers });
  
  const {
    isLocalScreenSharing,
    screenShareStream,
    handleToggleScreenShare,
    handleStopScreenShare
  } = useScreenShare({ onAppCreate, onAppRemove, remoteUsers });
  
  const {
    showCameraConfirm,
    showShareModal,
    showStopShareConfirm,
    showSwitchToCameraConfirm,
    showCameraAction,
    showSettings,
    selectedRemoteUser,
    handleCameraToggleRequest,
    handleCameraConfirm,
    handleCameraCancel,
    handleRemoteUserCameraClick,
    handleCloseCameraAction,
    handleStopShareConfirm,
    handleStopShareCancel,
    handleStopShareRequest,
    handleSwitchToCamera,
    handleSwitchToCameraConfirm,
    handleSwitchToCameraCancel,
    handleOpenSettings,
    handleCloseSettings,
    setShowShareModal
  } = useMeetingModals();



  // 개인 메시지 관련 상태
  const [privateChatTabs, setPrivateChatTabs] = useState<string[]>([]); // 열린 개인 채팅 탭들
  const [activeTab, setActiveTab] = useState<string>('general'); // 'general' 또는 사용자 이름
  const [privateMessages, setPrivateMessages] = useState<{[key: string]: any[]}>({});
  const [unreadMessages, setUnreadMessages] = useState<{[key: string]: number}>({}); // 읽지 않은 메시지 수
  const [unreadGeneralMessages, setUnreadGeneralMessages] = useState<number>(1); // 전체 채팅 읽지 않은 메시지 수 (시스템 메시지로 시작)

  // 화면 분할 옵션 비활성화 여부 확인
  const isSplitViewDisabled = selectedRemoteUser && (
    // 현재 선택된 사용자가 이미 userOrder에 포함되어 있으면 분할 불가
    userOrder.includes(selectedRemoteUser.id) ||
    // 또는 현재 선택된 사용자가 이미 단일 화면으로 표시되고 있으면 분할 불가
    (selectedCameraUser === selectedRemoteUser.id && cameraLayout === 'single')
  );

  // 화면 교체 옵션 비활성화 여부 확인
  const isReplaceViewDisabled = selectedRemoteUser && selectedCameraUser && (
    // 선택된 화면 사용자와 교체하려는 사용자가 같으면 교체 불가
    selectedCameraUser === selectedRemoteUser.id
  );



  // 카메라 확인 모달 핸들러들
  const handleCameraConfirmWithStart = () => {
    if (handleCameraConfirm()) {
      handleCameraStart();
    }
  };

  // 화면 공유 중지 확인 모달 핸들러들
  const handleStopShareConfirmWithStop = () => {
    handleStopShareConfirm();
    handleStopScreenShare();
  };



  // 화면 공유 중지 요청 핸들러 (확인 모달 표시)
  const handleStopShareRequestDirect = () => {
    handleStopShareRequest();
  };

  // 카메라로 전환 확인 모달 핸들러들
  const handleSwitchToCameraConfirmWithSwitch = () => {
    if (handleSwitchToCameraConfirm()) {
      handleStopScreenShare();
      handleCameraStart();
    }
  };

  // 카메라 액션 핸들러들
  const handleSingleViewAction = () => {
    if (selectedRemoteUser) {
  
      handleSingleView(selectedRemoteUser);
      handleCloseCameraAction();
    }
  };

  const handleSplitViewAction = () => {
    if (selectedRemoteUser) {
  
      handleSplitView(selectedRemoteUser);
      handleCloseCameraAction();
    }
  };

  const handleReplaceViewAction = () => {
    if (selectedRemoteUser) {
  
      handleReplaceView(selectedRemoteUser);
      handleCloseCameraAction();
    }
  };

  // 다른 사용자 카메라 클릭 핸들러
  const handleRemoteUserCameraClickWithUsers = (userId: string) => {

    handleRemoteUserCameraClick(userId, actualRemoteUsers);
  };

  // 카메라 토글 핸들러 (화면 공유 중일 때는 카메라로 전환, 그렇지 않으면 일반 토글)
  const handleCameraToggle = () => {
    if (isLocalScreenSharing) {
      handleSwitchToCamera();
    } else if (isLocalCameraOn) {
      handleCameraOff();
    } else {
      handleCameraToggleRequest();
    }
  };

  // 화면 공유 토글 핸들러 (확인 모달 처리 포함)
  const handleScreenShareToggle = async () => {
    const result = await handleToggleScreenShare();
    if (result === true) {
      // 화면 공유가 성공적으로 시작되면 카메라를 끄기 (카메라가 켜져있는 경우에만)
      if (isLocalCameraOn) {
        handleCameraOff();
      }
    } else if (result === false && isLocalScreenSharing) {
      // 화면 공유 중지 확인 모달 표시
      handleStopShareRequestDirect();
    }
  };

  // 화면 공유 직접 시작 핸들러 (모달에서 사용)
  const handleScreenShareStart = async () => {
    const result = await handleToggleScreenShare();
    if (result === true) {
      // 화면 공유가 성공적으로 시작되면 카메라를 끄기
      if (isLocalCameraOn) {
        handleCameraOff();
      }
    }
  };

  // 로컬 사용자 객체 생성
  const localUser = {
    id: 'local',
    name: userProfile.name,
    isLocal: true,
    isCameraOn: isLocalCameraOn,
    isMicOn: !isMicMuted,
    isActive: true,
    isScreenSharing: isLocalScreenSharing,
    screenShareStream: screenShareStream
  };

  // 전체 참가자 목록 생성 (로컬 사용자 + 더미 사용자들) - 문자열 배열로 변환
  const allMembers = [
    userProfile.name,
    ...actualRemoteUsers.map(user => user.name)
  ];

  return (
    <>
      <div className="flex h-screen bg-[#36393F] text-white">
        {/* 왼쪽 서버 사이드바 - Discord 스타일 */}
        <div className="w-16 bg-[#202225] flex-shrink-0 flex flex-col items-center pt-0 pb-3">
          <ServerSidebar
            isMicMuted={isMicMuted}
            isHeadsetMuted={isHeadsetMuted}
            onMicMuteToggle={onMicMuteToggle}
            onHeadsetMuteToggle={onHeadsetMuteToggle}
            onToggleScreenShare={handleScreenShareToggle}
            onToggleCamera={handleCameraToggleRequest}
            isScreenSharing={isLocalScreenSharing}
            onOpenOptions={handleOpenSettings}
            onLeave={onLeave}
            onOpenMyProfile={onOpenMyProfile}
            remoteUsers={actualRemoteUsers}
            onRemoteUserCameraClick={handleRemoteUserCameraClickWithUsers}
            onStopShareRequest={handleStopShareRequestDirect}
          />
        </div>

        {/* 중앙 메인 영역 */}
        <div className="flex-1 flex flex-col">
          {/* 상단 알림 */}
          <SlideNotification
            message={current ?? ""}
            visible={current !== null}
            className="top-4 left-4 right-4"
          />
          
          {/* 메인 컨텐츠 영역 */}
          <MainContentArea
            isFullscreen={isFullscreen}
            fullscreenPanel={fullscreenPanel}
            panels={panels}
            colSizes={colSizes}
            rowSizesLeft={rowSizesLeft}
            rowSizesRight={rowSizesRight}
            swapTarget={swapTarget}
            onExitFullscreen={onExitFullscreen}
            onPanelDrop={onPanelDrop}
            onPanelSplit={onPanelSplit}
            onPanelClose={onPanelClose}
            onResize={onResize}
            onFullscreen={onFullscreen}
            onSwapApp={onSwapApp}
            onSwapHere={onSwapHere}
            onCancelSwap={onCancelSwap}
            localUser={localUser}
            remoteUsers={actualRemoteUsers}
            onToggleCamera={handleCameraToggle}
            onCameraStartRequest={handleCameraToggleRequest}
            onToggleMic={onMicMuteToggle}
            onToggleScreenShare={handleScreenShareToggle}
                          onUserClick={() => {}}
            selectedUserId={selectedCameraUser}
            onSelectedUserChange={setSelectedCameraUser}
            layout={cameraLayout}
            onLayoutChange={setCameraLayout}
            userOrder={userOrder}
            onClose={handleCloseCamera}
            onRemoveUserFromView={handleRemoveUserFromView}
          />
        </div>

        {/* 오른쪽 멤버 리스트 - Discord 스타일 */}
        <RightSidebar
          members={allMembers}
          userProfile={userProfile}
          getStatusColor={getStatusColor}
          onOpenDetails={onOpenDetails}
          onUserClick={onUserClick}
          onOpenMyProfile={onOpenMyProfile}
          onToggleChat={onToggleChat}
          onStartPrivateChat={(targetUser: string) => {
            // 채팅창이 열려있지 않으면 열기
            if (!isChatOpen) {
              onToggleChat();
            }
            // 개인 채팅 탭 추가 (중복 방지)
            if (!privateChatTabs.includes(targetUser)) {
              setPrivateChatTabs(prev => [...prev, targetUser]);
            }
            // 해당 탭으로 전환
            setActiveTab(targetUser);
            // 읽지 않은 메시지 초기화
            setUnreadMessages(prev => ({ ...prev, [targetUser]: 0 }));
          }}
          onToggleGeneralChat={() => {
            setActiveTab('general');
            setUnreadGeneralMessages(0); // 전체 채팅 읽지 않은 메시지 초기화
          }}
          unreadGeneralMessages={unreadGeneralMessages}
          unreadMessages={unreadMessages}
        />

        {/* 채팅 박스 - 오른쪽 하단에 고정 (사용자 컨트롤 영역 위로) */}
        {isChatOpen && (
          <div className="fixed bottom-20 right-4 z-50">
            <ChatBox
              messages={chatMessages}
              input={chatInput}
              setInput={onChatInputChange}
              onSend={onChatSend}
              privateChatTabs={privateChatTabs}
              activeTab={activeTab}
              onSetActiveTab={(tab: string) => {
                setActiveTab(tab);
                if (tab === 'general') {
                  setUnreadGeneralMessages(0); // 전체 탭 클릭 시 읽지 않은 메시지 초기화
                }
              }}
              onClosePrivateTab={(targetUser: string) => {
                setPrivateChatTabs(prev => prev.filter(tab => tab !== targetUser));
                if (activeTab === targetUser) {
                  setActiveTab('general');
                }
              }}
              privateMessages={privateMessages}
              onSetPrivateMessages={setPrivateMessages}
              unreadMessages={unreadMessages}
              onSetUnreadMessages={setUnreadMessages}
              unreadGeneralMessages={unreadGeneralMessages}
            />
          </div>
        )}
      </div>

      {/* 모든 모달들 */}
      <MeetingModals
        showCameraConfirm={showCameraConfirm}
        showShareModal={showShareModal}
        showStopShareConfirm={showStopShareConfirm}
        showSwitchToCameraConfirm={showSwitchToCameraConfirm}
        showCameraAction={showCameraAction}
        selectedRemoteUser={selectedRemoteUser}
        onCameraConfirm={handleCameraConfirmWithStart}
        onCameraCancel={handleCameraCancel}
        onCloseCameraAction={handleCloseCameraAction}
        onSingleView={handleSingleViewAction}
        onSplitView={handleSplitViewAction}
        onReplaceView={handleReplaceViewAction}
        onStopShareConfirm={handleStopShareConfirmWithStop}
        onStopShareCancel={handleStopShareCancel}
        onSwitchToCameraConfirm={handleSwitchToCameraConfirmWithSwitch}
        onSwitchToCameraCancel={handleSwitchToCameraCancel}
        onToggleScreenShare={handleScreenShareStart}
        onCameraToggleRequest={handleCameraToggleRequest}
        onShareModalClose={() => setShowShareModal(false)}
        isSplitViewDisabled={isSplitViewDisabled}
        isReplaceViewDisabled={isReplaceViewDisabled}
      />

      {/* 설정 모달 */}
      <SettingsModal
        isOpen={showSettings}
        onClose={handleCloseSettings}
        isMicMuted={isMicMuted}
        isHeadsetMuted={isHeadsetMuted}
        onMicMuteToggle={onMicMuteToggle}
        onHeadsetMuteToggle={onHeadsetMuteToggle}
        onSave={() => {
          // 설정 저장 시 알림 표시
          if (onNotification) {
            onNotification("설정이 저장되었습니다.");
          }
        }}
      />
    </>
  );
};