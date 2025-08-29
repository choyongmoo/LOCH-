import React, { useEffect, useRef } from 'react';

interface UserFullscreenViewProps {
  userInfo: {
    userName: string;
    isLocal: boolean;
    isScreenSharing: boolean;
    screenShareStream?: MediaStream | null;
    cameraStream?: MediaStream | null;
  };
  localUser: any;
  remoteUsers: any[];
  onToggleCamera: () => void;
  onCameraStartRequest: () => void;
  onToggleMic: () => void;
  onToggleScreenShare: () => void;
  onExitFullscreen: () => void;
}

export const UserFullscreenView: React.FC<UserFullscreenViewProps> = ({
  userInfo,
  localUser,
  remoteUsers,
  onToggleCamera,
  onCameraStartRequest,
  onToggleMic,
  onToggleScreenShare,
  onExitFullscreen
}) => {
  const hasEnteredFullscreen = useRef(false);



  // 브라우저 전체화면 진입
  useEffect(() => {
    const enterFullscreen = async () => {
      // 이미 전체화면에 진입했으면 중복 실행 방지
      if (hasEnteredFullscreen.current) {
        return;
      }

      try {
        // 브라우저 전체화면 권한 확인
        if (document.fullscreenEnabled === false) {

          hasEnteredFullscreen.current = true;
          return;
        }

        // 브라우저 전체화면 시도
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          await (document.documentElement as any).webkitRequestFullscreen();
        } else if ((document.documentElement as any).mozRequestFullScreen) {
          await (document.documentElement as any).mozRequestFullScreen();
        } else if ((document.documentElement as any).msRequestFullscreen) {
          await (document.documentElement as any).msRequestFullscreen();
        }
        
        hasEnteredFullscreen.current = true;
      } catch (error) {
        // 전체화면 실패 시에도 대체 모드로 진행
        hasEnteredFullscreen.current = true;
        
        // 전체화면 진입 실패 시 원래 화면으로 돌아가지 않고 대체 모드 유지
        // onExitFullscreen(); // 이 줄을 주석 처리
      }
    };

    enterFullscreen();

    // 컴포넌트 언마운트 시 전체화면 종료 (안전하게 처리)
    return () => {
      // 전체화면에 진입했을 때만 종료 시도
      if (hasEnteredFullscreen.current) {
        try {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if ((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen();
          } else if ((document as any).mozCancelFullScreen) {
            (document as any).mozCancelFullScreen();
          } else if ((document as any).msExitFullscreen) {
            (document as any).msExitFullscreen();
          }
        } catch (error) {
          // 전체화면 종료 중 오류 (정상적인 상황)
        }
      }
    };
  }, [userInfo.userName, userInfo.isScreenSharing]);

  // ESC 키 이벤트 리스너
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onExitFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onExitFullscreen]);

  // 해당 사용자 찾기
  const targetUser = userInfo.isLocal 
    ? localUser 
    : remoteUsers.find(user => user.name === userInfo.userName);

  if (!targetUser) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-4xl mb-2">❌</div>
          <div className="text-lg mb-2">사용자를 찾을 수 없습니다</div>
          <button
            onClick={onExitFullscreen}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            전체화면 종료
          </button>
        </div>
      </div>
    );
  }

  // 화면 공유 중인 경우 실제 스트림 표시
  if (userInfo.isScreenSharing && userInfo.screenShareStream) {
    return (
      <div className="w-full h-full bg-black relative">
        {/* 화면 공유 비디오 */}
        <video
          ref={(videoElement) => {
            if (videoElement && userInfo.screenShareStream) {
              videoElement.srcObject = userInfo.screenShareStream;
              videoElement.play().catch(console.error);
            }
          }}
          className="w-full h-full object-contain"
          autoPlay
          muted
          playsInline
        />
        
        {/* 상단 우측 - 온라인 상태 표시 */}
        <div className="absolute top-4 right-4">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>

        {/* 하단 좌측 - 사용자 이름 */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-white text-lg">{userInfo.userName}</span>
        </div>

        {/* 하단 우측 - 모든 버튼들을 하나의 그룹으로 */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-2">
          <button className="px-3 py-1 bg-white/20 text-white text-sm rounded hover:bg-white/30 transition-colors">
            화면 공유 중
          </button>
          
          {/* ESC 키로 종료 버튼 추가 */}
          <button 
            onClick={onExitFullscreen}
            className="px-3 py-1 bg-red-500/20 text-white text-sm rounded hover:bg-red-500/30 transition-colors"
          >
            ESC로 종료
          </button>
        </div>

        {/* ESC 키 안내 */}
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
          ESC 키로 종료
        </div>
      </div>
    );
  }

  // 카메라가 켜져있는 경우 카메라 스트림 표시
  if (userInfo.cameraStream) {
    return (
      <div className="w-full h-full bg-black relative">
        {/* 카메라 비디오 */}
        <video
          ref={(videoElement) => {
            if (videoElement && userInfo.cameraStream) {
              videoElement.srcObject = userInfo.cameraStream;
              videoElement.play().catch(console.error);
            }
          }}
          className="w-full h-full object-contain"
          autoPlay
          muted
          playsInline
        />
        
        {/* 상단 우측 - 온라인 상태 표시 */}
        <div className="absolute top-4 right-4">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>

        {/* 하단 좌측 - 사용자 이름 */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-white text-lg">{userInfo.userName}</span>
        </div>

        {/* 하단 우측 - 모든 버튼들을 하나의 그룹으로 */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-2">
          <button className="px-3 py-1 bg-white/20 text-white text-sm rounded hover:bg-white/30 transition-colors">
            카메라 켜짐
          </button>
          
          {/* ESC 키로 종료 버튼 추가 */}
          <button 
            onClick={onExitFullscreen}
            className="px-3 py-1 bg-red-500/20 text-white text-sm rounded hover:bg-red-500/30 transition-colors"
          >
            ESC로 종료
          </button>
        </div>

        {/* ESC 키 안내 */}
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
          ESC 키로 종료
        </div>
      </div>
    );
  }

  // 사용자별 색상 생성
  const getRandomColor = (name: string) => {
    const colors = [
      '#5865F2', '#57F287', '#FEE75C', '#EB459E', 
      '#ED4245', '#FAA61A', '#747F8D', '#43B581'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div 
      className="w-full h-full flex items-center justify-center relative"
      style={{ backgroundColor: getRandomColor(targetUser.name) }}
    >
      {/* 상단 우측 - 온라인 상태 표시 */}
      <div className="absolute top-4 right-4">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      </div>

      {/* 중앙 - 사용자 정보 */}
      <div className="text-center text-white">
        <div className="text-4xl font-bold mb-2">{getInitials(targetUser.name)}</div>
        <div className="text-2xl mb-1">{targetUser.name}</div>
        <div className="text-lg opacity-75">
          {targetUser.isCameraOn ? '카메라 켜짐' : '카메라 꺼짐'}
        </div>
      </div>

      {/* 하단 좌측 - 사용자 이름 */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-white text-lg">{targetUser.name}</span>
      </div>

      {/* 하단 우측 - 모든 버튼들을 하나의 그룹으로 */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2">
        <button className="px-3 py-1 bg-white/20 text-white text-sm rounded hover:bg-white/30 transition-colors">
          {targetUser.isCameraOn ? '켜짐' : '꺼짐'}
        </button>
        
        {/* ESC 키로 종료 버튼 추가 */}
        <button 
          onClick={onExitFullscreen}
          className="px-3 py-1 bg-red-500/20 text-white text-sm rounded hover:bg-red-500/30 transition-colors"
        >
          ESC로 종료
        </button>
      </div>

      {/* ESC 키 안내 (잠시 후 사라짐) */}
      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
        ESC 키로 종료
      </div>
    </div>
  );
};
