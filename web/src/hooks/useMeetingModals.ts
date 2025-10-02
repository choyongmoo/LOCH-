import { useState } from 'react';

export const useMeetingModals = () => {
  const [showCameraConfirm, setShowCameraConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showStopShareConfirm, setShowStopShareConfirm] = useState(false);
  const [showSwitchToCameraConfirm, setShowSwitchToCameraConfirm] = useState(false);
  const [showCameraAction, setShowCameraAction] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedRemoteUser, setSelectedRemoteUser] = useState<any>(null);

  // 카메라 토글 요청 핸들러
  const handleCameraToggleRequest = () => {
    setShowCameraConfirm(true);
  };

  // 카메라 확인 모달 핸들러들
  const handleCameraConfirm = () => {
    setShowCameraConfirm(false);
    return true; // 카메라 시작을 위해 true 반환
  };

  const handleCameraCancel = () => {
    setShowCameraConfirm(false);
  };

  // 다른 사용자 카메라 클릭 핸들러
  const handleRemoteUserCameraClick = (userId: string, remoteUsers: any[]) => {
    const user = remoteUsers.find(u => u.id === userId);
    if (user) {
      setSelectedRemoteUser(user);
      setShowCameraAction(true);
    }
  };

  // 카메라 액션 모달 핸들러들
  const handleCloseCameraAction = () => {
    setShowCameraAction(false);
    setSelectedRemoteUser(null);
  };

  // 화면 공유 중지 확인 모달 핸들러들
  const handleStopShareConfirm = () => {
    setShowStopShareConfirm(false);
    return true; // 화면 공유 중지를 위해 true 반환
  };

  const handleStopShareCancel = () => {
    setShowStopShareConfirm(false);
  };

  const handleStopShareRequest = () => {
    setShowStopShareConfirm(true);
  };

  // 화면 공유에서 카메라로 전환하는 핸들러
  const handleSwitchToCamera = () => {
    setShowSwitchToCameraConfirm(true);
  };

  // 카메라로 전환 확인 모달 핸들러들
  const handleSwitchToCameraConfirm = () => {
    setShowSwitchToCameraConfirm(false);
    return true; // 카메라로 전환을 위해 true 반환
  };

  const handleSwitchToCameraCancel = () => {
    setShowSwitchToCameraConfirm(false);
  };

  // 설정 모달 핸들러들
  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  return {
    // 모달 상태
    showCameraConfirm,
    showShareModal,
    showStopShareConfirm,
    showSwitchToCameraConfirm,
    showCameraAction,
    selectedRemoteUser,
    
    // 모달 핸들러들
    handleCameraToggleRequest,
    handleCameraConfirm,
    handleCameraCancel,
    handleRemoteUserCameraClick,
    handleCloseCameraAction,
    handleStopShareConfirm,
    handleStopShareCancel,
    handleStopShareRequest,
    handleSwitchToCamera,
    handleSwitchToCameraConfirm,
    handleSwitchToCameraCancel,
    
    // 모달 상태 설정
    setShowShareModal,
    
    // 설정 모달
    showSettings,
    handleOpenSettings,
    handleCloseSettings
  };
};
