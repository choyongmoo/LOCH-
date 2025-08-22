import React, { useRef, useEffect, useState } from 'react';

interface CameraViewProps {
  userName: string;
  isLocal?: boolean;
  isActive?: boolean;
  onToggleCamera?: () => void;
  onCameraStartRequest?: () => void; // 카메라 시작 요청 (확인 모달 열기)
  onToggleMic?: () => void;
  onToggleScreenShare?: () => void;
  isCameraOn?: boolean;
  isMicOn?: boolean;
  isScreenSharing?: boolean;
  screenShareStream?: MediaStream | null;
}

export const CameraView: React.FC<CameraViewProps> = ({
  userName,
  isLocal = false,
  isActive = true,
  onToggleCamera,
  onCameraStartRequest,
  onToggleMic,
  onToggleScreenShare,
  isCameraOn = true,
  isMicOn = true,
  isScreenSharing = false,
  screenShareStream = null
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScreenShareLoading, setIsScreenShareLoading] = useState(false);
  const [, setForceUpdate] = useState(0);

  useEffect(() => {
    if (isLocal && isCameraOn && !isScreenSharing) {
      startLocalCamera();
    } else if (isLocal && isScreenSharing) {
      // 화면 공유 중에는 카메라 스트림 정리하고 로딩 상태 해제
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      // 화면 공유 시작 시 즉시 로딩 완료 처리
      setIsLoading(false);
      // 화면 공유 시작 시 에러 상태 초기화 (카메라 오류에서 화면 공유로 전환)
      setError(null);
      console.log('화면 공유 모드로 전환됨, 에러 상태 초기화');
    } else if (isLocal && !isCameraOn && !isScreenSharing) {
      // 카메라도 꺼져있고 화면 공유도 하지 않는 상태에서는 로딩 상태 해제
      setIsLoading(false);
    } else if (!isLocal) {
      // 원격 사용자의 경우 시뮬레이션 (실제로는 WebRTC로 구현)
      simulateRemoteCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isLocal, isCameraOn, isScreenSharing]);

  // 화면 공유 중일 때 로컬 사용자도 화면 공유 스트림을 볼 수 있도록 처리
  useEffect(() => {
    console.log('화면 공유 useEffect 실행:', { isLocal, isScreenSharing, hasStream: !!screenShareStream });
    
    if (isLocal && isScreenSharing && screenShareStream && videoRef.current) {
      console.log('화면 공유 스트림 설정 중:', screenShareStream);
      
      videoRef.current.srcObject = screenShareStream;
      // 화면 공유 스트림 설정 시 에러 상태 초기화
      setError(null);
      // 스트림이 설정되면 즉시 로딩 완료 처리
      setIsLoading(false);
      // 강제 리렌더링 트리거
      setForceUpdate(prev => prev + 1);
      
      const handleLoadedMetadata = () => {
        console.log('화면 공유 비디오 메타데이터 로드 완료');
        setIsLoading(false);
      };
      
      const handleCanPlay = () => {
        console.log('화면 공유 비디오 재생 준비 완료');
        setIsLoading(false);
      };
      
      const handleError = (e: Event) => {
        console.error('화면 공유 비디오 오류:', e);
        setIsLoading(false);
      };
      
      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoRef.current.addEventListener('canplay', handleCanPlay);
      videoRef.current.addEventListener('error', handleError);
      
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
          videoRef.current.removeEventListener('canplay', handleCanPlay);
          videoRef.current.removeEventListener('error', handleError);
        }
      };
    } else if (isLocal && isScreenSharing && !screenShareStream) {
      console.log('화면 공유 중이지만 스트림이 없음');
    }
  }, [screenShareStream, isLocal, isScreenSharing]);

  const startLocalCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('카메라 접근 실패:', err);
      setError('카메라에 접근할 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateRemoteCamera = () => {
    // 원격 사용자 시뮬레이션 (실제로는 WebRTC 구현 필요)
    setIsLoading(false);
    // 더미 데이터 테스트를 위해 즉시 로딩 완료

  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  const getRandomColor = (name: string) => {
    const colors = [
      '#5865F2', '#57F287', '#FEE75C', '#EB459E', 
      '#ED4245', '#FAA61A', '#747F8D', '#43B581'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // 화면 공유 버튼 클릭 핸들러
  const handleScreenShareClick = async () => {
    if (onToggleScreenShare) {
      setIsScreenShareLoading(true);
      // 화면 공유 시작 시 에러 상태 미리 초기화
      setError(null);
      try {
        await onToggleScreenShare();
      } catch (error) {
        console.error('화면 공유 오류:', error);
      } finally {
        setIsScreenShareLoading(false);
      }
    }
  };

  // 로컬 사용자의 경우에만 오류 화면 표시 (원격 사용자는 정상 렌더링)
  if (error && isLocal) {
    return (
      <div className="relative w-full h-full bg-[#2F3136] rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">📹</div>
          <div className="text-[#DCDDDE] text-sm mb-1">카메라 오류</div>
          <div className="text-[#72767D] text-xs mb-4">{error}</div>
          {isLocal && (
            <div className="space-y-2">
              <button
                onClick={startLocalCamera}
                className="w-full px-6 py-3 bg-[#5865F2] text-white rounded-lg text-sm font-medium hover:bg-[#4752c4] transition-colors"
              >
                카메라 다시 시도
              </button>
              <button
                onClick={handleScreenShareClick}
                disabled={isScreenShareLoading}
                className={`w-full px-6 py-3 text-white rounded-lg text-sm font-medium transition-colors ${
                  isScreenShareLoading 
                    ? 'bg-[#72767D] cursor-not-allowed' 
                    : 'bg-[#57F287] hover:bg-[#3ba55c]'
                }`}
              >
                {isScreenShareLoading ? '화면 공유 준비 중...' : '화면 공유 시작'}
              </button>
              <button
                onClick={() => {
                  // 카메라 끄기
                  if (onToggleCamera) {
                    onToggleCamera();
                  }
                  // 화면 공유 중지
                  if (onToggleScreenShare && isScreenSharing) {
                    onToggleScreenShare();
                  }
                  // 에러 상태 초기화
                  setError(null);
                }}
                className="w-full px-6 py-3 bg-[#72767D] text-white rounded-lg text-sm font-medium hover:bg-[#5f6b7a] transition-colors"
              >
                기본 화면으로 돌아가기
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isLoading && (isLocal ? isCameraOn : true)) {
    return (
      <div className="relative w-full h-full bg-[#2F3136] rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5865F2] mx-auto mb-2"></div>
          <div className="text-[#72767D] text-xs">
            {isScreenSharing ? '화면 공유 연결 중...' : '카메라 연결 중...'}
          </div>
        </div>
      </div>
    );
  }

  if (!isCameraOn && !isScreenSharing && isLocal) {
    return (
      <div 
        className="relative w-full h-full rounded-lg flex items-center justify-center"
        style={{ backgroundColor: getRandomColor(userName) }}
      >
        <div className="text-center">
          <div className="text-white text-3xl font-bold mb-2">{getInitials(userName)}</div>
          <div className="text-white text-lg">{userName}</div>
          
          {/* 로컬 사용자인 경우 화면 공유/카메라 시작 버튼 */}
          {isLocal && (
            <div className="mt-4 space-y-2">
              <button
                onClick={onCameraStartRequest}
                className="w-full px-6 py-3 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                카메라 시작
              </button>
              <button
                onClick={handleScreenShareClick}
                disabled={isScreenShareLoading}
                className={`w-full px-6 py-3 text-white rounded-lg text-sm font-medium transition-colors backdrop-blur-sm ${
                  isScreenShareLoading 
                    ? 'bg-white/10 cursor-not-allowed' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {isScreenShareLoading ? '화면 공유 준비 중...' : '화면 공유 시작'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#2F3136] rounded-lg overflow-hidden">
      {/* 비디오 요소 */}
      {isLocal && stream && !isScreenSharing ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : isLocal && isScreenSharing ? (
        <>
          {screenShareStream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={isLocal}
              className="w-full h-full object-contain bg-gray-900"
              onLoadedMetadata={() => {
                console.log('화면 공유 비디오 메타데이터 로드됨');
                setIsLoading(false);
              }}
              onCanPlay={() => {
                console.log('화면 공유 비디오 재생 가능');
                setIsLoading(false);
              }}
              onError={(e) => {
                console.error('화면 공유 비디오 오류:', e);
                setIsLoading(false);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <div className="text-4xl mb-2">📺</div>
                <div className="text-[#DCDDDE] text-sm mb-1">화면 공유 준비 중</div>
                <div className="text-[#72767D] text-xs">잠시만 기다려주세요...</div>
                <div className="text-[#72767D] text-xs mt-2">
                  스트림: {screenShareStream ? '있음' : '없음'}
                </div>
              </div>
            </div>
          )}
        </>
      ) : !isLocal ? (
        // 원격 사용자 시뮬레이션 (더미 데이터 테스트용)
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: getRandomColor(userName) }}
        >
          <div className="text-center">
            <div className="text-white text-2xl font-bold mb-2">{getInitials(userName)}</div>
            <div className="text-white text-sm">{userName}</div>
            <div className="text-white text-xs mt-1 opacity-75">
              {isCameraOn ? '카메라 켜짐' : '카메라 꺼짐'}
            </div>
          </div>
        </div>
      ) : null}

      {/* 디버깅 정보 (개발 중에만 표시) */}
      {isLocal && isScreenSharing && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs p-2 rounded">
          화면 공유 스트림: {screenShareStream ? '있음' : '없음'}
          <br />
          비디오 트랙: {screenShareStream?.getVideoTracks().length || 0}개
          <br />
          로딩 상태: {isLoading ? '로딩 중' : '완료'}
          <br />
          비디오 요소: {videoRef.current ? '있음' : '없음'}
          <br />
          스트림 활성: {screenShareStream?.active ? '예' : '아니오'}
        </div>
      )}

      {/* 사용자 정보 오버레이 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-white text-sm font-medium">{userName}</span>
            {isLocal && <span className="text-[#72767D] text-xs">(나)</span>}
            {isLocal && isScreenSharing && (
              <span className="text-[#72767D] text-xs">화면 공유 중</span>
            )}
          </div>
          
          {/* 컨트롤 버튼들 */}
          {isLocal && (
            <div className="flex items-center space-x-1">
              <button
                onClick={onToggleMic}
                className={`p-1.5 rounded transition-colors ${
                  isMicOn 
                    ? 'bg-[#36393F] text-[#DCDDDE] hover:bg-[#40444B]' 
                    : 'bg-red-500 text-white'
                }`}
                title={isMicOn ? "마이크 끄기" : "마이크 켜기"}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4V8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8V4C10 2.9 10.9 2 12 2ZM18 10V8C18 4.69 15.31 2 12 2C8.69 2 6 4.69 6 8V10C6 13.31 8.69 16 12 16C15.31 16 18 13.31 18 10ZM12 18C8.69 18 6 20.69 6 24H18C18 20.69 15.31 18 12 18Z"/>
                </svg>
              </button>
              
              <button
                onClick={onToggleCamera}
                className={`p-1.5 rounded transition-colors ${
                  isCameraOn 
                    ? 'bg-[#36393F] text-[#DCDDDE] hover:bg-[#40444B]' 
                    : 'bg-red-500 text-white'
                }`}
                title={isScreenSharing ? "카메라로 전환" : (isCameraOn ? "카메라 끄기" : "카메라 켜기")}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
              </button>

              <button
                onClick={onToggleScreenShare}
                className={`p-1.5 rounded transition-colors ${
                  isScreenSharing
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-[#36393F] text-[#DCDDDE] hover:bg-[#40444B]'
                }`}
                title={isScreenSharing ? "화면 공유 중지" : "화면 공유"}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5l-1 1v2h8v-2l-1-1h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H3V5h18v10z"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>



      {/* 활성 상태 표시 */}
      {isActive && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2F3136]"></div>
      )}
    </div>
  );
}; 