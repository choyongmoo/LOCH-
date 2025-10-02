import React from 'react';
import type { AppInstance, DynamicPanel, PendingDrop, ReplaceOrSplit } from '@/types/meeting';

export const usePanelDrop = (
  panels: DynamicPanel[],
  setPanels: React.Dispatch<React.SetStateAction<DynamicPanel[]>>,
  replaceOrSplit: ReplaceOrSplit | null,
  setReplaceOrSplit: (value: ReplaceOrSplit | null) => void,
  setAppType: (type: string | null) => void,
  setShowAppModal: (show: boolean) => void,
  pendingDrop: PendingDrop | null,
  setPendingDrop: (drop: PendingDrop | null) => void,
  setModalMode: (mode: 'select' | 'create') => void,
  handlePanelSplit: (panelId: number, direction: 'row' | 'col') => void
) => {
  const handlePanelDrop = (panelId: number, data: any) => {
    const target = panels.find(p => p.id === panelId);
    if (!target) return;
    
    // 빈 패널이면 바로 적용
    if (!target.app) {
      // 인스턴스면 바로 적용, 앱이면 모달
      if (typeof data === 'object' && data.id && data.type) {
        setPanels(prev => prev.map(p => p.id === panelId ? { ...p, app: data.type, title: data.title } : p));
      } else {
        setReplaceOrSplit({ 
          instance: { id: Date.now().toString(), type: data, title: "" }, 
          targetNum: panelId, 
          sourceType: 'app' 
        });
      }
      return;
    }
    
    // 이미 앱이 있으면 분할/교체/취소 모달
    if (typeof data === 'object' && data.id && data.type) {
      // 인스턴스 드롭: 간단한 교체/취소 창
      setReplaceOrSplit({ instance: data, targetNum: panelId, sourceType: 'instance' });
    } else {
      // 앱 드롭: 기존대로 인스턴스 선택/생성 모달 띄움
      setReplaceOrSplit({ 
        instance: { id: Date.now().toString(), type: data, title: "" }, 
        targetNum: panelId, 
        sourceType: 'app' 
      });
    }
  };

  const handleReplaceOrSplit = (mode: 'replace' | 'split' | 'cancel') => {
    if (!replaceOrSplit) return;
    
    if (mode === 'cancel') {
      setReplaceOrSplit(null);
      return;
    }
    
    // 인스턴스 드롭일 때만 바로 실행
    if (replaceOrSplit.sourceType === 'instance' && replaceOrSplit.instance && replaceOrSplit.instance.id && replaceOrSplit.instance.type) {
      if (mode === 'replace') {
        setPanels(prev => prev.map(p => p.id === replaceOrSplit.targetNum ? { ...p, app: replaceOrSplit.instance.type, title: replaceOrSplit.instance.title } : p));
      } else if (mode === 'split') {
        // 분할 후 새 패널에 인스턴스 적용
        if (panels.length >= 4) return;
        handlePanelSplit(replaceOrSplit.targetNum, 'col');
        setTimeout(() => {
          setPanels(prev => prev.map(p => !p.app ? { ...p, app: replaceOrSplit.instance.type, title: replaceOrSplit.instance.title } : p));
        }, 0);
      }
      setReplaceOrSplit(null);
      setPendingDrop(null);
      setModalMode("select");
      return;
    }
    
    // 앱 타입 드롭이면 기존대로 인스턴스 선택/생성 모달 띄움
    if (replaceOrSplit.instance && replaceOrSplit.instance.type) {
      setAppType(replaceOrSplit.instance.type);
      setShowAppModal(true);
      setPendingDrop({ type: replaceOrSplit.instance.type, targetNum: replaceOrSplit.targetNum, mode });
      setModalMode("select");
      setReplaceOrSplit(null);
    }
  };

  const handleSelectInstance = (instance: AppInstance) => {
    setShowAppModal(false);
    setAppType(null);
    if (pendingDrop && pendingDrop.targetNum !== undefined) {
      if (pendingDrop.mode === 'replace') {
        setPanels(prev => prev.map(p => p.id === pendingDrop.targetNum ? { ...p, app: instance.type, title: instance.title } : p));
      } else if (pendingDrop.mode === 'split') {
        handlePanelSplit(pendingDrop.targetNum, 'col');
        setTimeout(() => {
          setPanels(prev => prev.map(p => !p.app ? { ...p, app: instance.type, title: instance.title } : p));
        }, 0);
      } else {
        setPanels(prev => prev.map(p => p.id === pendingDrop.targetNum ? { ...p, app: instance.type, title: instance.title } : p));
      }
    }
    setPendingDrop(null);
    setModalMode("select");
  };

  return {
    handlePanelDrop,
    handleReplaceOrSplit,
    handleSelectInstance,
  };
};