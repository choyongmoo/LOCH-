import React, { useState, useCallback, useEffect } from 'react';
import type { DynamicPanel } from '@/types/meeting';

export const useFullscreen = () => {
  const [fullscreenPanel, setFullscreenPanel] = useState<DynamicPanel | null>(null);
  const [originalPanels, setOriginalPanels] = useState<DynamicPanel[]>([]);
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);

  const enterFullscreen = useCallback(async (panelId: number, panels: DynamicPanel[]) => {
    const targetPanel = panels.find(p => p.id === panelId);
    if (!targetPanel) return;

    console.log('전체화면 진입:', panelId, targetPanel);

    try {
      // 원본 패널 상태 저장
      setOriginalPanels([...panels]);
      
      // 전체 화면 패널 설정
      setFullscreenPanel({
        ...targetPanel,
        row: 0,
        col: 0,
        rowSpan: 2,
        colSpan: 2
      });

      // 브라우저 전체화면 API 사용 (선택사항)
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsBrowserFullscreen(true);
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          await (document.documentElement as any).webkitRequestFullscreen();
          setIsBrowserFullscreen(true);
        } else if ((document.documentElement as any).mozRequestFullScreen) {
          await (document.documentElement as any).mozRequestFullScreen();
          setIsBrowserFullscreen(true);
        } else if ((document.documentElement as any).msRequestFullscreen) {
          await (document.documentElement as any).msRequestFullscreen();
          setIsBrowserFullscreen(true);
        }
      } catch (error) {
        console.log('브라우저 전체화면은 지원되지 않지만, 패널 전체화면은 활성화됩니다.');
      }
    } catch (error) {
      console.error('전체화면 진입 실패:', error);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    console.log('전체화면 종료');
    
    try {
      // 브라우저 전체화면 종료
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.error('브라우저 전체화면 종료 실패:', error);
    } finally {
      setIsBrowserFullscreen(false);
      setFullscreenPanel(null);
      setOriginalPanels([]);
    }
  }, []);

  // 전체화면 상태 변경 감지
  const handleFullscreenChange = useCallback(() => {
    const isFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );
    
    setIsBrowserFullscreen(isFullscreen);
    
    // 사용자가 ESC 키나 브라우저 UI로 전체화면을 종료한 경우
    if (!isFullscreen && fullscreenPanel) {
      console.log('브라우저 전체화면 종료 감지, 패널 전체화면도 종료');
      setFullscreenPanel(null);
      setOriginalPanels([]);
    }
  }, [fullscreenPanel]);

  // ESC 키 감지
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && fullscreenPanel) {
      console.log('ESC 키 감지, 전체화면 종료');
      exitFullscreen();
    }
  }, [fullscreenPanel, exitFullscreen]);

  // 이벤트 리스너 등록
  useEffect(() => {
    // 전체화면 변경 이벤트
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // ESC 키 이벤트
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleFullscreenChange, handleKeyDown]);

  const isFullscreen = fullscreenPanel !== null;

  return {
    fullscreenPanel,
    originalPanels,
    enterFullscreen,
    exitFullscreen,
    isFullscreen,
    isBrowserFullscreen,
  };
};