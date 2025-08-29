
import { MeetingContent } from '@/components/Meeting/MeetingContent';
import { LeaveConfirmModal } from '@/components/Meeting/LeaveConfirmModal';
import { MyProfileModal } from '@/components/Meeting/MyProfileModal';

// 커스텀 훅들
import { useNotification } from '@/hooks/useNotification';
import { usePanels } from '@/hooks/usePanels';
import { useFullscreen } from '@/hooks/useFullscreen';

import { useMeetingState } from '@/hooks/useMeetingState';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { MeetingDetailsModal } from '@/components/Meeting/MeetingDetailsModal';
import { UserDetailsModal } from '@/components/Meeting/UserDetailsModal';
import { useMeetingData } from '@/hooks/useMeetingData';

export const MeetingLayout = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams<{ meetingId: string }>();
  
  // 모든 Hook을 먼저 호출 (조건부 반환 전에)
  const {
    meeting,
    participants,
    messages: meetingMessages,
    loading: meetingLoading,
    error: meetingError,
    currentUserId,
    joinMeeting,
    leaveMeeting,
    sendMessage: sendMeetingMessage
  } = useMeetingData(meetingId || '');
  
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showMyProfile, setShowMyProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isHeadsetMuted, setIsHeadsetMuted] = useState(false);
  const [micFirst, setMicFirst] = useState(false);

  const {
    showOptions,
    setShowOptions,
    showDetails,
    setShowDetails,
    isMuted,
    setIsMuted
  } = useMeetingState();

  // Supabase 참가자 데이터를 사용 (더미데이터 대신) - 중복 제거
  const supabaseMembers = participants
    .filter((p: any, index: number, self: any[]) => 
      self.findIndex(member => member.id === p.id) === index
    )
    .map((p: any) => ({
      id: p.id.toString(),
      name: p.name,
      isCameraOn: p.is_camera_on || false,
      isScreenSharing: p.is_screen_sharing || false
    }));

  // 채팅 상태 관리
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');

  // Supabase 메시지 데이터를 사용 (더미데이터 대신)
  const supabaseMessages = meetingMessages.map((msg: any) => ({
    user: msg.users?.name || 'Unknown',
    text: msg.content,
    timestamp: msg.created_at
  }));

  // 채팅 토글 함수
  const toggleChat = () => {
    setChatOpen(prev => !prev);
  };

  // 메시지 전송 함수
  const sendChatMessage = () => {
    if (chatInput.trim() && sendMeetingMessage) {
      sendMeetingMessage(chatInput.trim());
      setChatInput('');
    }
  };

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

  // 회의방 참가 (컴포넌트 마운트 시)
  useEffect(() => {
    if (meetingId && joinMeeting) {
      joinMeeting();
    }
  }, [meetingId, joinMeeting]);

  // 채팅창 외부 클릭 시 닫기 이벤트 처리
  useEffect(() => {
    const handleCloseChatBox = () => {
      setChatOpen(false);
    };

    window.addEventListener('closeChatBox', handleCloseChatBox);
    return () => {
      window.removeEventListener('closeChatBox', handleCloseChatBox);
    };
  }, []);

  // 디버깅: 실제 데이터 확인
  useEffect(() => {
    console.log('🔍 MeetingLayout 디버깅:');
    console.log('meetingId:', meetingId);
    console.log('meeting:', meeting);
    console.log('participants:', participants);
    console.log('meetingMessages:', meetingMessages);
    console.log('currentUserId:', currentUserId);
    console.log('supabaseMembers:', supabaseMembers);
    console.log('supabaseMessages:', supabaseMessages);
  }, [meetingId, meeting, participants, meetingMessages, currentUserId, supabaseMembers, supabaseMessages]);

  // 이제 조건부 반환 처리
  if (!meetingId) {
    return (
      <div className="h-screen bg-[#36393F] flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl font-bold mb-4">회의방</div>
          <div className="text-gray-400 mb-6">회의방을 선택하거나 생성해주세요</div>
          <button
            onClick={() => navigate('/workspace/manager')}
            className="px-6 py-3 bg-[#5865F2] text-white rounded-lg hover:bg-[#4752c4] transition-colors"
          >
            회의방 관리로 이동
          </button>
        </div>
      </div>
    );
  }

  if (meetingLoading) {
    return (
      <div className="h-screen bg-[#36393F] flex items-center justify-center">
        <div className="text-white text-lg">회의방 로딩 중...</div>
      </div>
    );
  }

  if (meetingError) {
    return (
      <div className="h-screen bg-[#36393F] flex items-center justify-center">
        <div className="text-red-400 text-lg">회의방 로드 실패: {meetingError}</div>
      </div>
    );
  }

  // 핸들러 함수들
  const handleMicMuteToggle = () => {
    setIsMicMuted((prev) => {
      if (!prev) {
        setMicFirst(true);
        return true;
      } else {
        if (micFirst) {
          return false;
        } else {
          setIsHeadsetMuted(false);
          setMicFirst(false);
          return false;
        }
      }
    });
  };

  const handleHeadsetMuteToggle = () => {
    setIsHeadsetMuted((prev) => {
      if (!prev) {
        if (!isMicMuted) {
          setMicFirst(false);
        }
        setIsMicMuted(true);
        return true;
      } else {
        if (micFirst) {
          return false;
        } else {
          setIsMicMuted(false);
          setMicFirst(false);
          return false;
        }
      }
    });
  };

  const handleLeaveClick = () => {
    setShowLeaveConfirm(true);
  };

  const handleLeaveConfirm = async () => {
    setShowLeaveConfirm(false);
    if (leaveMeeting) {
      await leaveMeeting();
    }
    navigate('/workspace');
  };

  const handleLeaveCancel = () => {
    setShowLeaveConfirm(false);
  };

  const handleOpenDetails = () => {
    setShowDetails(true);
  };

  const handleUserClick = (name: string) => {
    setSelectedUser(name);
  };

  const handleFullscreen = (panelId: number) => {
    enterFullscreen(panelId, panels);
  };

  const handlePanelDrop = () => {};
  const handleEmptyDrop = () => {};

  const supabaseParticipants = participants.map((p: any) => ({
    id: p.id.toString(),
    name: p.name,
    isLocal: p.is_local,
    isCameraOn: p.is_camera_on,
    isMicOn: p.is_mic_on,
    isActive: p.is_active,
    isScreenSharing: p.is_screen_sharing
  }));

  const simulatedRemoteUsers = supabaseMembers
    .filter((member: any) => member.id !== currentUserId?.toString()) // 현재 사용자 제외
    .map((member: any) => ({
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
      <MeetingContent
        isFullscreen={isFullscreen}
        fullscreenPanel={fullscreenPanel}
        panels={panels}
        colSizes={colSizes}
        rowSizesLeft={rowSizesLeft}
        rowSizesRight={rowSizesRight}
        current={current}
        isChatOpen={chatOpen}
        chatMessages={supabaseMessages}
        chatInput={chatInput}
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
        onLeave={handleLeaveClick}
        onOpenMyProfile={() => setShowMyProfile(true)}
        onToggleChat={toggleChat}
        onChatInputChange={setChatInput}
        onChatSend={sendChatMessage}
        swapTarget={swapTarget}
        onSwapApp={handleSwapApp}
        onSwapHere={handleSwapHere}
        onCancelSwap={handleCancelSwap}
        isMicMuted={isMicMuted}
        isHeadsetMuted={isHeadsetMuted}
        remoteUsers={simulatedRemoteUsers}
        onNotification={addNotification}
      />

      <MeetingDetailsModal
        visible={showDetails}
        onClose={() => setShowDetails(false)}
        details="회의방 상세 정보"
        meetingInfo={{
          roomName: meeting?.name || "회의방",
          roomId: meeting?.id || "MEET-001",
          createdAt: meeting?.created_at ? new Date(meeting.created_at).toLocaleDateString('ko-KR') : "2024-01-15",
          host: "호스트", // 향후 host_id를 사용하여 실제 호스트 이름을 가져올 예정
          status: meeting?.status === 'active' ? "진행중" : "종료됨",
          participants: participants.length,
          maxParticipants: meeting?.max_participants || 10,
          duration: meeting?.created_at ? 
            `${Math.floor((Date.now() - new Date(meeting.created_at).getTime()) / (1000 * 60 * 60))}시간 ${Math.floor(((Date.now() - new Date(meeting.created_at).getTime()) % (1000 * 60 * 60)) / (1000 * 60))}분` : 
            "진행 중",
          description: meeting?.description || "회의방입니다."
        }}
      />

      <UserDetailsModal
        visible={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
        userInfo={selectedUser ? {
          name: selectedUser,
          role: "개발자",
          department: "개발팀",
          email: `${selectedUser.toLowerCase().replace(/\s+/g, '')}@company.com`,
          status: "온라인",
          joinDate: "2024-01-15",
          lastSeen: "방금 전",
          avatar: selectedUser.slice(0, 2).toUpperCase(),
          skills: ["React", "TypeScript", "Node.js"],
          projects: ["LOCH 프로젝트", "웹 애플리케이션"],
          bio: "프론트엔드 개발에 열정을 가진 개발자입니다. 사용자 경험을 개선하는 것에 관심이 많습니다."
        } : undefined}
      />

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

      <LeaveConfirmModal
        isOpen={showLeaveConfirm}
        onConfirm={handleLeaveConfirm}
        onCancel={handleLeaveCancel}
      />

      <MyProfileModal
        visible={showMyProfile}
        onClose={() => setShowMyProfile(false)}
      />
    </div>
  );
};
