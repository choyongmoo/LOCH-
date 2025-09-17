import React, { useState } from 'react';
import { CameraView } from './CameraView';

interface CameraUser {
  id: string;
  name: string;
  isLocal: boolean;
  isCameraOn: boolean;
  isMicOn: boolean;
  isActive: boolean;
  isScreenSharing?: boolean;
  screenShareStream?: MediaStream | null;
  accentColor?: string; // 사용자 정의 색상
}

interface CameraLayoutProps {
  localUser: any;
  remoteUsers: any[];
  onToggleCamera: () => void;
  onCameraStartRequest: () => void;
  onToggleMic: () => void;
  onToggleScreenShare: () => void;
  onStopScreenShareRequest?: () => void; // 화면 공유 중지 요청 (확인 모달 열기)
  onUserClick: (userId: string) => void;
  selectedUserId: string | null;
  onSelectedUserChange: (userId: string | null) => void;
  layout: 'single' | 'grid' | 'side';
  onLayoutChange: (layout: 'single' | 'grid' | 'side') => void;
  userOrder: string[];
  onClose: () => void;
  onRemoveUserFromView?: (userId: string) => void; // 사용자 화면에서 제거 핸들러
  onFullscreen?: (userInfo: { userName: string; isLocal: boolean; isScreenSharing: boolean; screenShareStream?: MediaStream | null; cameraStream?: MediaStream | null }) => void; // 사용자 정보 전달
}

export const CameraLayout: React.FC<CameraLayoutProps> = ({
  localUser,
  remoteUsers,
  onToggleCamera,
  onCameraStartRequest,
  onToggleMic,
  onToggleScreenShare,
  onStopScreenShareRequest,
  // onUserClick, // 현재 사용하지 않음
  selectedUserId,
  onSelectedUserChange,
  layout: externalLayout,
  onLayoutChange,
  userOrder,
  onClose,
  onRemoveUserFromView,
  onFullscreen
}) => {
  const [internalLayout, setInternalLayout] = useState<'single' | 'grid' | 'side'>('single');
  const [internalSelectedUser, setInternalSelectedUser] = useState<string | null>(null);

  // 외부에서 제어하는 경우 외부 값을 사용, 그렇지 않으면 내부 상태 사용
  const layout = externalLayout !== undefined ? externalLayout : internalLayout;
  const selectedUser = selectedUserId !== undefined ? selectedUserId : internalSelectedUser;

  // 활성 카메라 사용자들만 필터링 (내 카메라가 꺼져있어도 다른 사용자들은 표시)
  // 더미 데이터 테스트를 위해 remoteUsers는 항상 포함
  // 로컬 사용자는 항상 포함 (카메라가 꺼져있어도 기본 화면으로 표시)
  const allActiveUsers = [localUser, ...remoteUsers.filter(user => !user.isLocal)];
  
  // userOrder가 제공되면 해당 순서로 정렬, 그렇지 않으면 로컬 사용자만 표시
  const activeUsers = userOrder && userOrder.length > 0
    ? userOrder
        .map(userId => {
          if (userId === 'local') {
            return localUser; // 로컬 사용자는 항상 반환 (카메라가 꺼져있어도 기본 화면으로 표시)
          }
          // 원격 사용자는 remoteUsers에서 찾기 (더미 데이터 테스트를 위해 isCameraOn 조건 제거)
          return remoteUsers.find(user => user.id === userId) || allActiveUsers.find(user => user.id === userId);
        })
        .filter(Boolean) as CameraUser[]
    : [localUser]; // userOrder가 비어있으면 로컬 사용자만 표시


  
  // userOrder가 설정되어 있거나 활성 카메라가 있으면 화면 표시 (더미 데이터 테스트용)
  const hasAnyActiveCamera = (userOrder && userOrder.length > 0) || activeUsers.length > 0 || localUser.isScreenSharing;

  // 화면 공유 중일 때는 로컬 사용자를 포함하되, userOrder 순서를 존중
  const displayUsers = localUser.isScreenSharing 
    ? activeUsers.length > 0 ? activeUsers : [localUser]
    : activeUsers;



  const handleUserClick = (userId: string) => {
    // 그리드 모드에서만 선택 상태 변경
    const newSelectedUser = selectedUser === userId ? null : userId;

    // 선택 상태만 변경
    if (onSelectedUserChange) {
      onSelectedUserChange(newSelectedUser);
    } else {
      setInternalSelectedUser(newSelectedUser);
    }
  };

  // 사이드 화면 모드 전용 클릭 핸들러 (선택만 하고 다른 액션 없음)
  const handleSideUserClick = (userId: string) => {
    // 사이드 화면 모드에서는 단순히 선택 상태만 변경
    const newSelectedUser = selectedUser === userId ? null : userId;
    
    if (onSelectedUserChange) {
      onSelectedUserChange(newSelectedUser);
    } else {
      setInternalSelectedUser(newSelectedUser);
    }
  };

  const handleLayoutChange = (newLayout: 'single' | 'grid' | 'side') => {
    if (onLayoutChange) {
      onLayoutChange(newLayout);
    } else {
      setInternalLayout(newLayout);
    }
  };

  // 화면 닫기 핸들러 - 선택된 화면에 따라 다른 동작
  const handleCloseView = () => {
    if (selectedUser) {
      if (selectedUser === 'local') {
        // 로컬 사용자가 선택된 경우: 카메라/화면공유 종료하고 기본 화면으로

        if (localUser.isScreenSharing) {
          // 화면 공유 중이면 화면 공유 종료
          onToggleScreenShare?.();
        } else if (localUser.isCameraOn) {
          // 카메라가 켜져있으면 카메라 종료
          onToggleCamera?.();
        }
      } else {
        // 원격 사용자가 선택된 경우: 해당 사용자를 화면에서 제거

        onRemoveUserFromView?.(selectedUser);
      }
    } else {
      // 선택된 사용자가 없으면 전체 화면 닫기

      onClose?.();
    }
  };

  const getLayoutClass = () => {
    const count = displayUsers.length;
    
    if (count === 1) return 'grid-cols-1 grid-rows-1';
    if (count === 2) return 'grid-cols-2 grid-rows-1';
    if (count === 3) return 'grid-cols-2 grid-rows-2';
    if (count === 4) return 'grid-cols-2 grid-rows-2';
    if (count === 5) return 'grid-cols-3 grid-rows-2';
    if (count === 6) return 'grid-cols-3 grid-rows-2';
    if (count === 7) return 'grid-cols-3 grid-rows-3';
    if (count === 8) return 'grid-cols-3 grid-rows-3';
    if (count === 9) return 'grid-cols-3 grid-rows-3';
    
    return 'grid-cols-4 grid-rows-3';
  };

  const getRandomColor = (name: string) => {
    const colors = [
      '#5865F2', '#57F287', '#FEE75C', '#EB459E', 
      '#ED4245', '#FAA61A', '#747F8D', '#43B581'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  const renderCameraGrid = () => {
    // userOrder가 설정되어 있거나 활성 카메라가 있을 때만 화면 표시
    if (!hasAnyActiveCamera) {
      return (
        <div 
          className="w-full h-full flex items-center justify-center rounded-lg"
          style={{ backgroundColor: getRandomColor(localUser.name) }}
        >
          <div className="text-center">
            <div className="text-white text-3xl font-bold mb-2">{getInitials(localUser.name)}</div>
            <div className="text-white text-lg">{localUser.name}</div>
            
            {/* 로컬 사용자만 카메라 켜기 버튼 표시 */}
            {localUser.isLocal && (
              <button
                onClick={onToggleCamera}
                className="mt-4 px-6 py-3 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                카메라 켜기
              </button>
            )}
          </div>
        </div>
      );
    }

    // userOrder가 설정되어 있지만 displayUsers가 비어있으면 로컬 사용자 기본 화면 표시
    if ((userOrder && userOrder.length > 0) && displayUsers.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <CameraView
              userName={localUser.name}
              isLocal={localUser.isLocal}
              isActive={localUser.isActive}
              onToggleCamera={onToggleCamera}
              onCameraStartRequest={onCameraStartRequest}
              onToggleMic={onToggleMic}
              onToggleScreenShare={onToggleScreenShare}
              onStopScreenShareRequest={onStopScreenShareRequest}
              isCameraOn={localUser.isCameraOn}
              isMicOn={localUser.isMicOn}
              isScreenSharing={localUser.isScreenSharing}
              screenShareStream={localUser.screenShareStream}
              accentColor={localUser.accentColor}
              onFullscreen={(userInfo) => onFullscreen?.(userInfo)}
            />
          </div>
        </div>
      );
    }

    // 단일 화면 모드일 때는 선택된 사용자 우선 표시
    if (layout === 'single') {
      let displayUser = localUser;
      
      if (displayUsers.length > 0) {
        // selectedUser가 설정되어 있으면 해당 사용자를 우선 표시
        if (selectedUser) {
          const selectedDisplayUser = displayUsers.find(u => u.id === selectedUser);
          if (selectedDisplayUser) {
            displayUser = selectedDisplayUser;
          } else {
            // 선택된 사용자가 displayUsers에 없으면 첫 번째 사용자 표시
            displayUser = displayUsers[0];
          }
        } else {
          // 선택된 사용자가 없으면 첫 번째 사용자 표시
          displayUser = displayUsers[0];
        }
      }
      
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <CameraView
              userName={displayUser.name}
              isLocal={displayUser.isLocal}
              isActive={displayUser.isActive}
              onToggleCamera={displayUser.isLocal ? onToggleCamera : undefined}
              onCameraStartRequest={displayUser.isLocal ? onCameraStartRequest : undefined}
              onToggleMic={displayUser.isLocal ? onToggleMic : undefined}
              onToggleScreenShare={displayUser.isLocal ? onToggleScreenShare : undefined}
              onStopScreenShareRequest={onStopScreenShareRequest}
              isCameraOn={displayUser.isCameraOn}
              isMicOn={displayUser.isMicOn}
              isScreenSharing={displayUser.isScreenSharing}
              screenShareStream={displayUser.screenShareStream}
              accentColor={displayUser.accentColor}
              onFullscreen={(userInfo) => onFullscreen?.(userInfo)}
            />
          </div>
        </div>
      );
    }

    // 그리드 모드일 때는 모든 활성 사용자 표시
    return (
      <div className={`grid gap-2 w-full h-full ${getLayoutClass()}`}>
        {displayUsers.map((user) => (
          <div
            key={user.id}
            className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
              selectedUser === user.id ? 'ring-2 ring-[#5865F2]' : 'hover:ring-1 hover:ring-[#72767D]'
            }`}
            onClick={() => handleUserClick(user.id)}
          >
            <CameraView
              userName={user.name}
              isLocal={user.isLocal}
              isActive={user.isActive}
              onToggleCamera={user.isLocal ? onToggleCamera : undefined}
              onCameraStartRequest={user.isLocal ? onCameraStartRequest : undefined}
              onToggleMic={user.isLocal ? onToggleMic : undefined}
              onToggleScreenShare={user.isLocal ? onToggleScreenShare : undefined}
              onStopScreenShareRequest={onStopScreenShareRequest}
              isCameraOn={user.isCameraOn}
              isMicOn={user.isMicOn}
              isScreenSharing={user.isScreenSharing}
              screenShareStream={user.screenShareStream}
              accentColor={user.accentColor}
              onFullscreen={(userInfo) => onFullscreen?.(userInfo)}
            />
            
            {/* 사용자 선택 표시 */}
            {selectedUser === user.id && (
              <div className="absolute top-2 left-2 bg-[#5865F2] text-white text-xs px-2 py-1 rounded">
                선택됨
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSideLayout = () => {
    // 사이드 화면 모드에서는 메인 사용자를 고정하고, selectedUser는 선택 표시용으로만 사용
    const mainUser = displayUsers.length > 0 ? displayUsers[0] : localUser;
    
    const sideUsers = displayUsers.filter(u => u.id !== mainUser.id);

    return (
      <div className="flex w-full h-full gap-2">
        {/* 메인 카메라 */}
        <div 
          className={`flex-1 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
            selectedUser === mainUser.id ? 'ring-2 ring-[#5865F2]' : 'hover:ring-1 hover:ring-[#72767D]'
          }`}
          onClick={() => handleSideUserClick(mainUser.id)}
        >
          <CameraView
            userName={mainUser.name}
            isLocal={mainUser.isLocal}
            isActive={mainUser.isActive}
            onToggleCamera={mainUser.isLocal ? onToggleCamera : undefined}
            onToggleMic={mainUser.isLocal ? onToggleMic : undefined}
            onToggleScreenShare={mainUser.isLocal ? onToggleScreenShare : undefined}
            onStopScreenShareRequest={onStopScreenShareRequest}
            isCameraOn={mainUser.isCameraOn}
            isMicOn={mainUser.isMicOn}
            isScreenSharing={mainUser.isScreenSharing}
            screenShareStream={mainUser.screenShareStream}
            accentColor={mainUser.accentColor}
            onFullscreen={(userInfo) => onFullscreen?.(userInfo)}
          />
        </div>
        
        {/* 사이드 카메라들 */}
        {sideUsers.length > 0 && (
          <div className="w-48 flex flex-col gap-2">
            {sideUsers.map((user) => (
              <div
                key={user.id}
                className={`flex-1 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                  selectedUser === user.id ? 'ring-2 ring-[#5865F2]' : 'hover:ring-1 hover:ring-[#72767D]'
                }`}
                onClick={() => handleSideUserClick(user.id)}
              >
                <CameraView
                  userName={user.name}
                  isLocal={user.isLocal}
                  isActive={user.isActive}
                  onToggleCamera={user.isLocal ? onToggleCamera : undefined}
                  onCameraStartRequest={user.isLocal ? onCameraStartRequest : undefined}
                  onToggleMic={user.isLocal ? onToggleMic : undefined}
                  onToggleScreenShare={user.isLocal ? onToggleScreenShare : undefined}
                  onStopScreenShareRequest={onStopScreenShareRequest}
                  isCameraOn={user.isCameraOn}
                  isMicOn={user.isMicOn}
                  isScreenSharing={user.isScreenSharing}
                  screenShareStream={user.screenShareStream}
                  accentColor={user.accentColor}
                  onFullscreen={(userInfo) => onFullscreen?.(userInfo)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* 레이아웃 컨트롤 */}
      <div className="flex items-center justify-between h-12 bg-[#292B2F] border-b border-[#202225] relative z-10 px-4">
        <div className="flex items-center space-x-2">
          <span className="text-[#DCDDDE] text-sm font-medium">화상 회의</span>
          <span className="text-[#72767D] text-xs">({1 + remoteUsers.length}명 참여)</span>
        </div>
        
        <div className="flex items-center space-x-1">
          {/* 레이아웃 버튼들 */}
          <button
            onClick={() => handleLayoutChange('single')}
            className={`p-2 rounded transition-colors ${
              layout === 'single' 
                ? 'bg-[#5865F2] text-white' 
                : 'text-[#72767D] hover:text-[#DCDDDE] hover:bg-[#40444B]'
            }`}
            title="단일 화면"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
            </svg>
          </button>
          
          <button
            onClick={() => handleLayoutChange('grid')}
            className={`p-2 rounded transition-colors ${
              layout === 'grid' 
                ? 'bg-[#5865F2] text-white' 
                : 'text-[#72767D] hover:text-[#DCDDDE] hover:bg-[#40444B]'
            }`}
            title="그리드 화면"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3v7h7V3H3zm0 11v7h7v-7H3zm11-11v7h7V3h-7zm0 11v7h7v-7h-7z"/>
            </svg>
          </button>
          
          <button
            onClick={() => handleLayoutChange('side')}
            className={`p-2 rounded transition-colors ${
              layout === 'side' 
                ? 'bg-[#5865F2] text-white' 
                : 'text-[#72767D] hover:text-[#DCDDDE] hover:bg-[#40444B]'
            }`}
            title="사이드 화면"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
          </button>

          {/* 닫기 버튼 */}
          <button
            onClick={handleCloseView}
            className="p-2 text-red-500 hover:text-red-400 hover:bg-[#40444B] rounded transition-colors"
            title={selectedUser ? (selectedUser === 'local' ? '카메라/화면공유 종료' : '선택된 화면 닫기') : '화면 닫기'}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* 카메라 영역 */}
      <div className="flex-1 p-3 relative z-0">
        {layout === 'side' ? renderSideLayout() : renderCameraGrid()}
      </div>
    </div>
  );
}; 