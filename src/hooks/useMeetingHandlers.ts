import type { AppInstance } from '@/types/meeting';

export const useMeetingHandlers = (
  // 의존성들
  panels: any[],
  pendingDrop: any,
  isMuted: boolean,
  setIsMuted: (muted: boolean) => void,
  setShowOptions: (show: boolean) => void,
  setShowDetails: (show: boolean) => void,
  setSelectedUser: (user: string | null) => void,
  setPendingDrop: (drop: any) => void,
  setPanels: (panels: any) => void,
  
  // 함수들
  createInitialPanel: () => void,
  handleAppCreate: (app: string) => void,
  handleAppModalCreate: () => AppInstance | null,
  handleSelectInstance: (instance: AppInstance) => void,
  loadAudioDevices: () => void,
  addNotification: (message: string) => void
) => {
  const handleAppModalCreateWithPanel = () => {
    const newInstance = handleAppModalCreate();
    if (newInstance) {
      handleSelectInstance(newInstance);
    }
    if (panels.length === 0 && pendingDrop) {
      createInitialPanel();
    }
  };

  const handleFullscreen = (_panelId: number) => {
    // 이 함수는 실제로는 ResizableGridLayout에서 호출되므로
    // 여기서는 빈 함수로 두고, 실제 구현은 MeetingLayout에서 처리
  };

  const showNotification = (message: string) => {
    addNotification(message);
  };

  const handleEmptyDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedApp = e.dataTransfer.getData("app");
    const droppedInstance = e.dataTransfer.getData("instance");
    
    if (droppedInstance) {
      try {
        const instance = JSON.parse(droppedInstance);
        createInitialPanel();
        // 패널 생성 후 첫 번째 패널에 인스턴스 직접 적용
        setTimeout(() => {
          setPanels((prev: any[]) => prev.map((p: any, index: number) => 
            index === 0 ? { ...p, app: instance.type, title: instance.title } : p
          ));
        }, 50);
      } catch {}
      return;
    }
    
    if (droppedApp) {
      handleAppCreate(droppedApp);
      createInitialPanel();
      setPendingDrop({ type: droppedApp, targetNum: 1, mode: 'replace' });
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleOpenOptions = () => {
    setShowOptions(true);
    loadAudioDevices();
  };

  const handleOpenDetails = () => {
    setShowDetails(true);
  };

  const handleUserClick = (name: string) => {
    setSelectedUser(name);
  };

  return {
    handleAppModalCreateWithPanel,
    handleFullscreen,
    showNotification,
    handleEmptyDrop,
    handleToggleMute,
    handleOpenOptions,
    handleOpenDetails,
    handleUserClick
  };
}; 