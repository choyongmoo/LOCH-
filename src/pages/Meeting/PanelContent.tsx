import { AppRenderer } from "./AppRenderer";
import type { PanelContentProps } from "@/types/meeting";

export const PanelContent = ({
  num,
  app,
  title,
  // openMenu,
  // onToggleMenu,
  onAdd,
  onCloseAll,
  onCloseOthers,
  onClose,
  onSplit,
  onAppDrop,
  maxPanelsReached = false,
  showSwap,
  showSwapHere,
  isSwapTarget,
  onSwapApp,
  onSwapHere,
  onCancelSwap,
  onFullscreen,
}: PanelContentProps & { maxPanelsReached?: boolean }) => {
  // 디버깅: onFullscreen prop 값 확인
  // 상태 없음, props로만 동작
  return (
    <div
      className="relative bg-gray-800 flex flex-col h-full overflow-hidden"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const droppedApp = e.dataTransfer.getData("app");
        const droppedInstance = e.dataTransfer.getData("instance");
        if (droppedInstance) {
          try {
            const instance = JSON.parse(droppedInstance);
            if (onAppDrop) onAppDrop(instance, num);
          } catch {}
          return;
        }
        if (droppedApp) {
          if (onAppDrop) onAppDrop(droppedApp, num);
          else onSplit(num, droppedApp);
        }
      }}
      title={title || undefined}
    >
      {/* 패널 옵션 버튼 (왼쪽 상단) */}
      <div className="absolute top-2 left-2 z-30 flex flex-row gap-1">
        {/* 앱 위치 바꾸기(⇄) 버튼 */}
        {showSwap && !showSwapHere && !isSwapTarget && (
          <button
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-700 text-white hover:bg-[#5865F2] transition text-xs shadow border border-gray-600"
            title="앱 위치 바꾸기"
            onClick={onSwapApp}
          >⇄</button>
        )}
        {/* '여기와 바꾸기' 버튼 */}
        {showSwapHere && (
          <button
            className="w-20 h-7 flex items-center justify-center rounded-full bg-[#5865F2] text-white hover:bg-[#4752c4] transition text-xs shadow border border-gray-600 px-2"
            title="이 패널과 앱 위치를 변경합니다"
            onClick={onSwapHere}
          >위치 변경</button>
        )}
        {/* 취소 버튼 (선택된 패널) */}
        {isSwapTarget && (
          <button
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-500 text-white hover:bg-gray-600 transition text-xs shadow border border-gray-600"
            title="취소"
            onClick={onCancelSwap}
          >✕</button>
        )}
        <button
          className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-700 text-white hover:bg-red-500 hover:text-white transition text-xs shadow border border-gray-600"
          title="이 화면 닫기"
          onClick={() => onClose(num)}
        >✕</button>
        <button
          className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-500 transition text-xs shadow border border-gray-600"
          title="다른 화면 닫기"
          onClick={() => onCloseOthers(num)}
        >≠</button>
        <button
          className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-500 transition text-xs shadow border border-gray-600"
          title="모든 화면 닫기"
          onClick={onCloseAll}
        >□</button>
        {/* 분할 버튼 - 4개 화면일 때 상태 개선 */}
        <button
          className={`w-7 h-7 flex items-center justify-center rounded-full transition text-xs shadow border ${
            maxPanelsReached 
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed border-gray-400' 
              : 'bg-[#5865F2] text-white hover:bg-[#4752c4] border-[#5865F2]'
          }`}
          title={maxPanelsReached ? "최대 4개 화면까지 분할 가능합니다" : "화면 추가(분할)"}
          onClick={() => !maxPanelsReached && onAdd(num)}
          disabled={maxPanelsReached}
        >+</button>
      </div>
      
      {/* 전체 화면 버튼 (우측 하단) - Discord 스타일 */}
      <div className="absolute bottom-4 right-2 z-[9999]">
        <button
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 text-sm shadow-2xl border-2 hover:scale-110 ${
            onFullscreen 
              ? 'bg-[#5865F2] text-white hover:bg-[#4752c4] border-[#5865F2] hover:border-[#4752c4]' 
              : 'bg-gray-600 text-gray-300 cursor-not-allowed border-gray-500'
          }`}
          title={onFullscreen ? "전체 화면으로 보기 (ESC로 종료)" : "전체화면 기능을 사용할 수 없습니다"}
          onClick={() => onFullscreen && onFullscreen(num)}
          disabled={!onFullscreen}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* 인스턴스 제목 표시 */}
      {title && (
        <div
          className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-white bg-[#23243a] rounded-full px-4 py-1 shadow-lg border border-[#5865F2] pointer-events-none select-none z-20 whitespace-nowrap max-w-[80%]"
          style={{
            minWidth: '40px',
            letterSpacing: '0.02em',
            textShadow: '0 2px 8px rgba(0,0,0,0.18)',
            boxShadow: '0 2px 12px 0 rgba(88,101,242,0.10)',
            borderWidth: '1.5px',
          }}
        >
          <span className="truncate block" style={{lineHeight:'1.2'}}>{title}</span>
        </div>
      )}
      
      {/* 앱 컨텐츠 영역 */}
      <div className="flex-grow flex items-center justify-center text-white text-xl select-none overflow-auto">
        {app ? <AppRenderer app={app} /> : <div className="text-gray-400">여기로 앱을 드래그하세요</div>}
      </div>
      
      {/* 4개 화면일 때 안내 메시지 */}
      {maxPanelsReached && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 bg-gray-800 rounded-full px-3 py-1 border border-gray-600">
          최대 분할 도달
        </div>
      )}
    </div>
  );
};
