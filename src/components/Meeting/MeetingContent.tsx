import React from 'react';
import { ResizableGridLayout } from '@/pages/Meeting/ResizableGridLayout';
import { EmptyMeetingView } from '@/components/Meeting/EmptyMeetingView';
import { SlideNotification } from '@/components/Meeting/SlideNotification';
import { MembersBar } from '@/components/Meeting/MembersBar';
import { FullscreenView } from '@/components/Meeting/FullscreenView';

interface MeetingContentProps {
  // 상태들
  isFullscreen: boolean;
  fullscreenPanel: any;
  panels: any[];
  colSizes: number[];
  rowSizesLeft: number[];
  rowSizesRight: number[];
  current: string | null;
  members: any[];
  
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
  
  // swap 관련
  swapTarget: number | null;
  onSwapApp: (panelId: number) => void;
  onSwapHere: (panelId: number) => void;
  onCancelSwap: () => void;
}

export const MeetingContent: React.FC<MeetingContentProps> = ({
  isFullscreen,
  fullscreenPanel,
  panels,
  colSizes,
  rowSizesLeft,
  rowSizesRight,
  current,
  members,
  onExitFullscreen,
  onPanelDrop,
  onPanelSplit,
  onPanelClose,
  onResize,
  onFullscreen,
  onEmptyDrop,
  onCreatePanel,
  onOpenDetails,
  onUserClick,
  swapTarget,
  onSwapApp,
  onSwapHere,
  onCancelSwap
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 상단 알림 */}
      <SlideNotification
        message={current ?? ""}
        visible={current !== null}
        className="top-[80px]"
      />
      
      {/* 오른쪽 상단 멤버바 */}
      <div className="absolute top-4 right-4 z-50">
        <MembersBar
          members={members}
          onOpenDetails={onOpenDetails}
          onUserClick={onUserClick}
        />
      </div>

      {/* 회의 화면 */}
      <div className="flex-1 relative">
        {isFullscreen ? (
          <FullscreenView
            fullscreenPanel={fullscreenPanel}
            onExitFullscreen={onExitFullscreen}
          />
        ) : panels.length === 0 ? (
          <EmptyMeetingView
            onDrop={onEmptyDrop}
            onCreatePanel={onCreatePanel}
          />
        ) : (
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
            onFullscreen={onFullscreen}
          />
        )}
      </div>
    </div>
  );
};