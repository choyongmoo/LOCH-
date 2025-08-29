import React from 'react';
import { ResizableGridLayout } from '@/pages/Meeting/ResizableGridLayout';
import { FullscreenView } from '@/components/Meeting/FullscreenView';
import { CameraLayout } from '@/components/Meeting/CameraLayout';
import { UserFullscreenView } from '@/components/Meeting/UserFullscreenView';
import { useEffect, useState } from 'react';

interface MainContentAreaProps {
  isFullscreen: boolean;
  fullscreenPanel: any;
  panels: any[];
  colSizes: number[];
  rowSizesLeft: number[];
  rowSizesRight: number[];
  swapTarget: number | null;
  onExitFullscreen: () => void;
  onPanelDrop: (panelId: number, data: any) => void;
  onPanelSplit: (panelId: number, direction: 'row' | 'col') => void;
  onPanelClose: (panelId: number) => void;
  onResize: (type: 'col' | 'rowLeft' | 'rowRight', values: number[]) => void;
  onFullscreen: (panelId: number) => void;
  onSwapApp: (panelId: number) => void;
  onSwapHere: (panelId: number) => void;
  onCancelSwap: () => void;
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
  onRemoveUserFromView?: (userId: string) => void;
  onUserFullscreen?: (userInfo: { userName: string; isLocal: boolean; isScreenSharing: boolean; screenShareStream?: MediaStream | null; cameraStream?: MediaStream | null }) => void; // 사용자 전체화면 핸들러 추가
  onUserFullscreenStateChange?: (isActive: boolean, userInfo?: { userName: string; isLocal: boolean; isScreenSharing: boolean; screenShareStream?: MediaStream | null; cameraStream?: MediaStream | null }) => void; // 사용자 전체화면 상태 변화 알림
}

export const MainContentArea: React.FC<MainContentAreaProps> = ({
  isFullscreen,
  fullscreenPanel,
  panels,
  colSizes,
  rowSizesLeft,
  rowSizesRight,
  swapTarget,
  onExitFullscreen,
  onPanelDrop,
  onPanelSplit,
  onPanelClose,
  onResize,
  onFullscreen,
  onSwapApp,
  onSwapHere,
  onCancelSwap,
  localUser,
  remoteUsers,
  onToggleCamera,
  onCameraStartRequest,
  onToggleMic,
  onToggleScreenShare,
  onStopScreenShareRequest,
  onUserClick,
  selectedUserId,
  onSelectedUserChange,
  layout,
  onLayoutChange,
  userOrder,
  onClose,
  onRemoveUserFromView,
  onUserFullscreen,
  onUserFullscreenStateChange
}) => {

  return (
    <div className="flex-1 relative">
      {isFullscreen ? (
        <FullscreenView
          fullscreenPanel={fullscreenPanel}
          onExitFullscreen={onExitFullscreen}
        />
      ) : panels.length > 0 ? (
        <ResizableGridLayout
          panels={panels}
          colSizes={colSizes}
          rowSizesLeft={rowSizesLeft}
          rowSizesRight={rowSizesRight}
          onPanelDrop={onPanelDrop}
          onPanelSplit={onPanelSplit}
          onPanelClose={onPanelClose}
          onResize={onResize}
          swapTarget={swapTarget}
          onSwapApp={onSwapApp}
          onSwapHere={onSwapHere}
          onCancelSwap={onCancelSwap}
          onFullscreen={(userInfo: any) => {
            // userInfo가 객체인 경우 (CameraLayout에서 온 경우)
            if (typeof userInfo === 'object' && userInfo.userName) {
              // 사용자 전체화면 모드로 전환
              onUserFullscreen?.(userInfo);
              onUserFullscreenStateChange?.(true, userInfo); // 사용자 전체화면 상태 변화 알림
            } else {
              // userInfo가 숫자인 경우 (ResizableGridLayout에서 온 경우)
              onFullscreen(userInfo as number);
            }
          }}
        />
      ) : (
        // 기본적으로 카메라 레이아웃 표시 (사용자들이 카메라를 켜지 않았어도 기본 화면 제공)
        <CameraLayout
          localUser={localUser}
          remoteUsers={remoteUsers}
          onToggleCamera={onToggleCamera}
          onCameraStartRequest={onCameraStartRequest}
          onToggleMic={onToggleMic}
          onToggleScreenShare={onToggleScreenShare}
          onStopScreenShareRequest={onStopScreenShareRequest}
          onUserClick={onUserClick}
          selectedUserId={selectedUserId}
          onSelectedUserChange={onSelectedUserChange}
          layout={layout}
          onLayoutChange={onLayoutChange}
          userOrder={userOrder}
          onClose={onClose}
          onRemoveUserFromView={onRemoveUserFromView}
          onFullscreen={(userInfo) => {
            // 사용자 전체화면 모드로 전환
            onUserFullscreen?.(userInfo);
            onUserFullscreenStateChange?.(true, userInfo); // 사용자 전체화면 상태 변화 알림
            
            // 상태 변화 즉시 확인
            setTimeout(() => {
              onUserFullscreenStateChange?.(true, userInfo);
            }, 0);
          }}
        />
      )}
    </div>
  );
};
