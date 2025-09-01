import React, { useState, useEffect, useMemo } from 'react';
import { SlideNotification } from '@/components/Meeting/SlideNotification';
import { ServerSidebar } from '@/components/Meeting/ServerSidebar';
import { ChatBox } from '@/components/Meeting/ChatBox';
import { MainContentArea } from '@/components/Meeting/MainContentArea';
import { RightSidebar } from '@/components/Meeting/RightSidebar';
import { MeetingModals } from '@/components/Meeting/MeetingModals';
import { SettingsModal } from '@/components/Meeting/SettingsModal';
import { UserFullscreenView } from '@/components/Meeting/UserFullscreenView';

// 커스텀 훅들
import { useUserProfile } from '@/hooks/useUserProfile';
import { useCameraControls } from '@/hooks/useCameraControls';
import { useScreenShare } from '@/hooks/useScreenShare';
import { useMeetingModals } from '@/hooks/useMeetingModals';

// Member 타입 정의
interface Member {
  id: string;
  name: string;
  isLocal: boolean;
  isCameraOn: boolean;
  isMicOn: boolean;
  isActive: boolean;
  isScreenSharing: boolean;
  avatar?: string;
  status?: string;
  accentColor?: string; // 사용자 정의 색상
}


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
  onNotification
}) => {
  // 커스텀 훅들 사용
  const { userProfile, getStatusColor } = useUserProfile();

  // 실제 원격 사용자 데이터 사용 (props로 받은 remoteUsers) - 현재 사용자 제외
  const actualRemoteUsers = remoteUsers.length > 0 
    ? remoteUsers.filter(user => !user.isLocal) 
    : [];

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
  } = useCameraControls({ remoteUsers: actualRemoteUsers });
  
  const {
    isLocalScreenSharing,
    screenShareStream,
    handleToggleScreenShare,
    handleStopScreenShare
  } = useScreenShare({ remoteUsers });
  
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
  const [unreadGeneralMessages, setUnreadGeneralMessages] = useState<number>(0); // 전체 채팅 읽지 않은 메시지 수 (시스템 메시지는 카운트하지 않음)
  const [lastMessageCount, setLastMessageCount] = useState<number>(0); // 마지막으로 확인한 메시지 수

  // 새로운 메시지가 추가될 때 읽지 않은 메시지 카운트 증가
  useEffect(() => {
    if (chatMessages.length > lastMessageCount) {
      // 새로 추가된 메시지들 확인
      const newMessages = chatMessages.slice(lastMessageCount);
      const nonSystemMessages = newMessages.filter(msg => msg.user !== '시스템');
      
      // 현재 사용자가 보낸 메시지는 제외 (내가 보낸 메시지는 즉시 읽은 것으로 처리)
      const currentUserName = userProfile?.name || '나';
      const otherUserMessages = nonSystemMessages.filter(msg => msg.user !== currentUserName);
      
      if (otherUserMessages.length > 0 && activeTab === 'general') {
        setUnreadGeneralMessages(prev => prev + otherUserMessages.length);
      }
      
      setLastMessageCount(chatMessages.length);
    }
  }, [chatMessages, lastMessageCount, activeTab, userProfile]);

  // 초기 메시지 수 설정
  useEffect(() => {
    setLastMessageCount(chatMessages.length);
  }, []);

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
    screenShareStream: screenShareStream,
    accentColor: userProfile.accentColor
  };

  // 전체 참가자 목록 생성 (로컬 사용자 + 원격 사용자들) - 객체 배열로 변환
  const [allMembers, setAllMembers] = useState<Member[]>([
    {
      id: 'local',
      name: userProfile.name,
      isLocal: true,
      isCameraOn: false,
      isMicOn: !isMicMuted,
      isActive: true,
      isScreenSharing: isLocalScreenSharing,
      avatar: userProfile.avatar,
      status: userProfile.status,
      accentColor: userProfile.accentColor
    },
    ...actualRemoteUsers.map(user => ({
      id: user.id,
      name: user.name,
      isLocal: false,
      isCameraOn: user.isCameraOn || false,
      isMicOn: user.isMicOn || true,
      isActive: user.isActive || true,
      isScreenSharing: user.isScreenSharing || false,
      avatar: user.name.slice(0, 2).toUpperCase(),
      status: "온라인"
    }))
  ]);
  
  // userProfile 상태 변경 시 allMembers 업데이트
  useEffect(() => {
    setAllMembers([
      {
        id: 'local',
        name: userProfile.name,
        isLocal: true,
        isCameraOn: false,
        isMicOn: !isMicMuted,
        isActive: true,
        isScreenSharing: isLocalScreenSharing,
        avatar: userProfile.avatar,
        status: userProfile.status,
        accentColor: userProfile.accentColor
      },
      ...actualRemoteUsers.map(user => ({
        id: user.id,
        name: user.name,
        isLocal: false,
        isCameraOn: user.isCameraOn || false,
        isMicOn: user.isMicOn || true,
        isActive: user.isActive || true,
        isScreenSharing: user.isScreenSharing || false,
        avatar: user.name.slice(0, 2).toUpperCase(),
        status: "온라인"
      }))
    ]);
  }, [userProfile.status, userProfile.name, userProfile.avatar, userProfile.accentColor, isMicMuted, isLocalScreenSharing]);

  // actualRemoteUsers 변경 시 allMembers 업데이트 (메모이제이션으로 무한 렌더링 방지)
  const memoizedRemoteUsers = useMemo(() => actualRemoteUsers, [actualRemoteUsers.length, actualRemoteUsers.map(u => u.id).join(',')]);
  
  useEffect(() => {
    setAllMembers(prev => {
      const localMember = prev.find(member => member.isLocal);
      if (!localMember) return prev;
      
      return [
        localMember,
        ...memoizedRemoteUsers.map(user => ({
          id: user.id,
          name: user.name,
          isLocal: false,
          isCameraOn: user.isCameraOn || false,
          isMicOn: user.isMicOn || true,
          isActive: user.isActive || true,
          isScreenSharing: user.isScreenSharing || false,
          avatar: user.name.slice(0, 2).toUpperCase(),
          status: "온라인"
        }))
      ];
    });
  }, [memoizedRemoteUsers]);

  // 사용자 전체화면 상태 관리
  const [isUserFullscreenActive, setIsUserFullscreenActive] = useState(false);
  const [userFullscreenInfo, setUserFullscreenInfo] = useState<{
    userName: string;
    isLocal: boolean;
    isScreenSharing: boolean;
    screenShareStream?: MediaStream | null;
    cameraStream?: MediaStream | null;
  } | null>(null);

  // 브라우저 전체화면 상태 확인
  const isBrowserFullscreen = !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );

  // UI 숨김 조건: 사용자 전체화면이 활성화되었거나 브라우저 전체화면이 활성화된 경우
  const shouldHideUI = isUserFullscreenActive || isBrowserFullscreen;

  // 사용자 전체화면 종료 핸들러
  const handleExitUserFullscreen = () => {
    // 브라우저 전체화면 종료 (안전하게 처리)
    try {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    } catch (error) {
      // 전체화면 종료 중 오류 (정상적인 상황)
    }
    
    // 사용자 전체화면 상태 초기화
    setUserFullscreenInfo(null);
    setIsUserFullscreenActive(false);
  };

  // 브라우저 전체화면 상태 감지 및 ESC 키 이벤트 처리
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isBrowserFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      
      // 브라우저 전체화면이 종료되면 사용자 전체화면 모드도 종료
      if (!isBrowserFullscreen && userFullscreenInfo) {
        setUserFullscreenInfo(null);
        setIsUserFullscreenActive(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // 사용자 전체화면이 활성화되어 있으면 먼저 종료
        if (userFullscreenInfo) {
  
          handleExitUserFullscreen();
          return;
        }

        // 브라우저 전체화면이 활성화되어 있으면 종료
        const isBrowserFullscreen = !!(
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement
        );
        
        if (isBrowserFullscreen) {
          handleExitUserFullscreen();
        }
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userFullscreenInfo]);

  return (
    <>
      {shouldHideUI ? (
        // 사용자 전체화면 모드일 때는 UserFullscreenView만 표시
        userFullscreenInfo ? (
          <UserFullscreenView
            userInfo={userFullscreenInfo}
            localUser={localUser}
            remoteUsers={actualRemoteUsers}
            onToggleCamera={handleCameraToggle}
            onCameraStartRequest={handleCameraToggleRequest}
            onToggleMic={onMicMuteToggle}
            onToggleScreenShare={handleScreenShareToggle}
            onExitFullscreen={handleExitUserFullscreen}
          />
        ) : (
          <div className="w-full h-screen bg-black flex items-center justify-center">
            <div className="text-white text-lg">전체화면 모드</div>
          </div>
        )
      ) : (
        // 일반 모드일 때는 모든 UI 표시
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
              onStopScreenShareRequest={handleStopShareRequestDirect}
              onUserClick={() => {}}
              selectedUserId={selectedCameraUser}
              onSelectedUserChange={setSelectedCameraUser}
              layout={cameraLayout}
              onLayoutChange={setCameraLayout}
              userOrder={userOrder}
              onClose={handleCloseCamera}
              onRemoveUserFromView={handleRemoveUserFromView}
              onUserFullscreenStateChange={(isActive: boolean, userInfo?: any) => {
                // 상태 즉시 업데이트
                setIsUserFullscreenActive(isActive);
                
                if (userInfo) {
                  setUserFullscreenInfo(userInfo);
                }
                
                // 상태 변화 즉시 확인 및 강제 업데이트
                setTimeout(() => {
                  // 강제로 상태 재설정
                  setIsUserFullscreenActive(isActive);
                  if (userInfo) {
                    setUserFullscreenInfo(userInfo);
                  }
                }, 0);
              }}
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

          {/* 채팅 박스 - 오른쪽 하단에 고정 */}
          {isChatOpen && (
            <div className="fixed right-4 z-50" style={{ top: '400px', position: 'fixed' }}>
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
      )}

      {/* 모든 모달들 (사용자 전체화면 모드에서는 숨김) */}
      {!shouldHideUI && (
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
      )}

      {/* 설정 모달 (사용자 전체화면 모드에서는 숨김) */}
      {!shouldHideUI && (
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
      )}
    </>
  );
};