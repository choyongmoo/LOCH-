import React from "react";
import { AppRenderer } from "@/pages/Meeting/AppRenderer";
import type { DynamicPanel } from "@/types/meeting";

interface FullscreenViewProps {
  fullscreenPanel: DynamicPanel;
  onExitFullscreen: () => void;
}

export const FullscreenView: React.FC<FullscreenViewProps> = ({
  fullscreenPanel,
  onExitFullscreen
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#36393F] w-screen h-screen">
      <div className="w-full h-full flex flex-col" style={{ background: '#2F3136' }}>
        {/* 전체 화면 종료 버튼 */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-3">
          {/* ESC 키 안내 */}
          <div className="text-sm text-gray-400 bg-gray-800 rounded-full px-3 py-1 border border-gray-600">
            ESC 키로 종료
          </div>
          {/* 종료 버튼 */}
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-white hover:bg-red-500 transition text-lg shadow border border-gray-600"
            title="전체 화면 종료 (ESC)"
            onClick={onExitFullscreen}
          >×</button>
        </div>
        
        {/* 전체 화면 패널 제목 */}
        {fullscreenPanel?.title && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-white bg-[#23243a] rounded-full px-4 py-2 shadow-lg border border-[#5865F2] pointer-events-none select-none z-20 whitespace-nowrap max-w-[80%]"
            style={{
              minWidth: '40px',
              letterSpacing: '0.02em',
              textShadow: '0 2px 8px rgba(0,0,0,0.18)',
              boxShadow: '0 2px 12px 0 rgba(88,101,242,0.10)',
              borderWidth: '1.5px',
            }}>
            <span className="truncate block" style={{lineHeight:'1.2'}}>{fullscreenPanel.title}</span>
          </div>
        )}
        
        {/* 전체 화면 패널 내용 */}
        <div className="flex-grow flex items-center justify-center text-white text-xl select-none">
          {fullscreenPanel?.app ? (
            <div className="w-full h-full flex items-center justify-center">
              <AppRenderer app={fullscreenPanel.app} />
            </div>
          ) : (
            <div className="text-gray-400">앱이 로드되지 않았습니다</div>
          )}
        </div>
        
        {/* 하단 안내 메시지 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-400 bg-gray-800 rounded-full px-4 py-2 border border-gray-600">
          전체화면 모드 - ESC 키로 종료
        </div>
      </div>
    </div>
  );
};