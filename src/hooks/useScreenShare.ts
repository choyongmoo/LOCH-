import { useState } from 'react';

interface UseScreenShareProps {
  onAppCreate?: (type: string) => void;
  onAppRemove?: (type: string) => void;
  remoteUsers?: any[];
}

export const useScreenShare = ({ onAppCreate, onAppRemove, remoteUsers = [] }: UseScreenShareProps) => {
  const [isLocalScreenSharing, setIsLocalScreenSharing] = useState(false);
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null);

  // 화면 공유 토글 핸들러
  const handleToggleScreenShare = async () => {
    if (isLocalScreenSharing) {
      // 화면 공유 중지
      if (screenShareStream) {
        screenShareStream.getTracks().forEach(track => track.stop());
        setScreenShareStream(null);
      }
      setIsLocalScreenSharing(false);
      
      // 다른 사용자의 카메라가 활성화되어 있지 않으면 카메라 인스턴스 제거
      const hasOtherActiveCameras = remoteUsers.some(user => user.isCameraOn);
      if (!hasOtherActiveCameras && onAppRemove) {
        onAppRemove('C');
      }
      
      return false; // 중지됨을 나타냄
    } else {
      // 화면 공유 시작
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false
        });
        
        setScreenShareStream(stream);
        setIsLocalScreenSharing(true);
        
        // 화면 공유가 시작되면 카메라 인스턴스 생성
        if (onAppCreate) {
          onAppCreate('C');
        }
        
        // 화면 공유가 중지될 때 처리
        stream.getVideoTracks()[0].onended = () => {
          setScreenShareStream(null);
          setIsLocalScreenSharing(false);
          
          // 다른 사용자의 카메라가 활성화되어 있지 않으면 카메라 인스턴스 제거
          const hasOtherActiveCameras = remoteUsers.some(user => user.isCameraOn);
          if (!hasOtherActiveCameras && onAppRemove) {
            onAppRemove('C');
          }
        };
        
        return true; // 성공적으로 시작됨을 나타냄
      } catch (err) {
        console.error('화면 공유 실패:', err);
        // 사용자가 화면 공유를 취소한 경우는 알림을 표시하지 않음
        if (err instanceof Error && err.name === 'NotAllowedError') {
          console.log('사용자가 화면 공유를 취소했습니다.');
        } else {
          alert('화면 공유를 시작할 수 없습니다. 브라우저 권한을 확인해주세요.');
        }
        return false; // 실패를 나타냄
      }
    }
  };

  // 화면 공유 중지 핸들러
  const handleStopScreenShare = () => {
    if (screenShareStream) {
      screenShareStream.getTracks().forEach(track => track.stop());
      setScreenShareStream(null);
    }
    setIsLocalScreenSharing(false);
    
    // 다른 사용자의 카메라가 활성화되어 있지 않으면 카메라 인스턴스 제거
    const hasOtherActiveCameras = remoteUsers.some(user => user.isCameraOn);
    if (!hasOtherActiveCameras && onAppRemove) {
      onAppRemove('C');
    }
  };

  return {
    isLocalScreenSharing,
    screenShareStream,
    handleToggleScreenShare,
    handleStopScreenShare
  };
};
