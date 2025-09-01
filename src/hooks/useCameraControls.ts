import { useState } from 'react';

interface UseCameraControlsProps {
  onAppCreate?: (type: string) => void;
  onAppRemove?: (type: string) => void;
  remoteUsers?: any[];
}

export const useCameraControls = ({ onAppCreate, onAppRemove, remoteUsers = [] }: UseCameraControlsProps) => {
  const [isLocalCameraOn, setIsLocalCameraOn] = useState(false);
  const [cameraLayout, setCameraLayout] = useState<'single' | 'grid' | 'side'>('single');
  const [selectedCameraUser, setSelectedCameraUser] = useState<string | null>(null);
  const [userOrder, setUserOrder] = useState<string[]>([]);

  // 카메라 인스턴스 확인 - 로컬 사용자의 카메라/화면 공유 또는 원격 사용자가 있을 때 표시
  const hasCameraInstance = isLocalCameraOn || remoteUsers.some(user => user.isCameraOn || user.isScreenSharing);

  // 카메라 끄기 핸들러 (내 카메라만 끄기)
  const handleCameraOff = () => {
    setIsLocalCameraOn(false);
    
    // 다른 사용자의 카메라가 활성화되어 있지 않으면 카메라 인스턴스 제거
    const hasOtherActiveCameras = remoteUsers.some(user => user.isCameraOn);
    if (!hasOtherActiveCameras && onAppRemove) {
      onAppRemove('C');
    }
  };

  // 카메라 화면 닫기 핸들러
  const handleCloseCamera = () => {
    // 모든 카메라 상태 초기화
    setIsLocalCameraOn(false);
    setSelectedCameraUser(null);
    setCameraLayout('single');
    setUserOrder([]);
    
    // 카메라 인스턴스 제거
    if (onAppRemove) {
      onAppRemove('C');
    }
  };

  // 카메라 시작 핸들러
  const handleCameraStart = () => {
    setIsLocalCameraOn(true);
    // 카메라 인스턴스 생성
    if (onAppCreate) {
      onAppCreate('C');
    }
  };

  // 다른 사용자 카메라 관련 핸들러들
  const handleSingleView = (selectedRemoteUser: any) => {
    // 단일 화면으로 해당 사용자 카메라 표시
    setSelectedCameraUser(selectedRemoteUser.id);
    setCameraLayout('single');
    // 선택된 사용자를 첫 번째에, 로컬 사용자를 두 번째에 배치하여 선택된 사용자가 우선 표시되도록 함
    setUserOrder([selectedRemoteUser.id, 'local']);
    
    // 카메라 인스턴스 생성 (다른 사용자 화면을 표시하므로 항상 필요)
    if (onAppCreate) {
      onAppCreate('C');
    }
  };

  const handleSplitView = (selectedRemoteUser: any) => {
    // 화면 분할로 해당 사용자 카메라 추가 (그리드 모드)
    setSelectedCameraUser(null); // 선택 해제하여 모든 사용자 표시
    setCameraLayout('grid');
    
    // 현재 userOrder에 있는 사용자들을 유지하고 새 사용자를 마지막에 추가
    let currentOrder = userOrder.length > 0 ? userOrder : [];
    
    // 로컬 사용자가 순서에 없으면 로컬 사용자를 먼저 추가 (카메라가 꺼져있어도 기본 화면으로 표시)
    if (!currentOrder.includes('local')) {
      currentOrder = ['local', ...currentOrder];
    }
    
    const newOrder = [...currentOrder];
    
    // 새로 추가되는 사용자가 이미 순서에 있으면 제거
    const filteredOrder = newOrder.filter(id => id !== selectedRemoteUser.id);
    
    // 새 사용자를 마지막에 추가
    const finalOrder = [...filteredOrder, selectedRemoteUser.id];
    setUserOrder(finalOrder);
    
    // 카메라 인스턴스 생성 (다른 사용자 화면을 표시하므로 항상 필요)
    if (onAppCreate) {
      onAppCreate('C');
    }
  };

  const handleReplaceView = (selectedRemoteUser: any) => {
    // 화면 개수와 상관없이 일관된 로직 적용
    if (userOrder.length > 0) {
      // 현재 선택된 사용자가 있는 경우 (사이드 화면 버튼 눌린 상태)
      if (selectedCameraUser) {
        // 교체하려는 사용자가 이미 userOrder에 있는지 확인
        const targetUserIndex = userOrder.findIndex(userId => userId === selectedRemoteUser.id);
        const selectedUserIndex = userOrder.findIndex(userId => userId === selectedCameraUser);
        
        if (targetUserIndex !== -1 && selectedUserIndex !== -1) {
          // 이미 표시중인 사용자의 경우 위치 교환 (화면 개수와 상관없이)
          const newUserOrder = [...userOrder];
          // 두 사용자의 위치를 교환
          newUserOrder[selectedUserIndex] = selectedRemoteUser.id;
          newUserOrder[targetUserIndex] = selectedCameraUser;
          
          setUserOrder(newUserOrder);
          setSelectedCameraUser(selectedRemoteUser.id);
        } else {
          // 새로운 사용자의 경우 선택된 위치에 교체 (화면 개수와 상관없이)
          const newUserOrder = userOrder.map(userId => 
            userId === selectedCameraUser ? selectedRemoteUser.id : userId
          );
          
          setUserOrder(newUserOrder);
          setSelectedCameraUser(selectedRemoteUser.id);
        }
      } else {
        // 선택된 사용자가 없는 경우, 첫 번째 원격 사용자 위치에 교체
        // (로컬 사용자가 아닌 첫 번째 원격 사용자를 찾아서 교체)
        const firstRemoteUserIndex = userOrder.findIndex(userId => userId !== 'local');
        
        if (firstRemoteUserIndex !== -1) {
          const newUserOrder = [...userOrder];
          newUserOrder[firstRemoteUserIndex] = selectedRemoteUser.id;
          
          setUserOrder(newUserOrder);
          setSelectedCameraUser(selectedRemoteUser.id);
        } else {
          // 모든 화면이 로컬 사용자인 경우 (일반적이지 않은 상황)
          const newUserOrder = [...userOrder, selectedRemoteUser.id];
          setUserOrder(newUserOrder);
          setSelectedCameraUser(selectedRemoteUser.id);
        }
      }
      
      // 현재 레이아웃 모드 유지 (화면 개수와 상관없이)
      setCameraLayout(cameraLayout);
    } else {
      // userOrder가 비어있는 경우 새 사용자로 단일 화면 시작
      setSelectedCameraUser(selectedRemoteUser.id);
      setCameraLayout('single');
      setUserOrder(['local', selectedRemoteUser.id]);
    }
    
    // 카메라 인스턴스 생성 (다른 사용자 화면을 표시하므로 항상 필요)
    if (onAppCreate) {
      onAppCreate('C');
    }
  };

  // 사용자를 화면에서 제거하는 핸들러
  const handleRemoveUserFromView = (userId: string) => {
    // userOrder에서 해당 사용자 제거
    const newUserOrder = userOrder.filter(id => id !== userId);
    setUserOrder(newUserOrder);
    
    // 선택된 사용자가 제거되는 사용자라면 선택 해제
    if (selectedCameraUser === userId) {
      setSelectedCameraUser(null);
    }
    
    // userOrder가 비어있거나 로컬 사용자만 남으면 단일 뷰로 변경
    if (newUserOrder.length === 0 || (newUserOrder.length === 1 && newUserOrder[0] === 'local')) {
      setCameraLayout('single');
      setSelectedCameraUser(null);
    }
    
    };

  return {
    isLocalCameraOn,
    cameraLayout,
    selectedCameraUser,
    userOrder,
    hasCameraInstance,
    setCameraLayout,
    setSelectedCameraUser,
    setUserOrder,
    handleCameraOff,
    handleCloseCamera,
    handleCameraStart,
    handleSingleView,
    handleSplitView,
    handleReplaceView,
    handleRemoveUserFromView
  };
};
