import { CameraLayout } from '@/components/Meeting/CameraLayout';

export const AppRenderer = ({ app }: { app: string }) => {
  // 시뮬레이션된 사용자 데이터
  const localUser = {
    id: 'local',
    name: '홍길동',
    isLocal: true,
    isCameraOn: true,
    isMicOn: true,
    isActive: true
  };

  const remoteUsers = [
    { id: 'user1', name: '김철수', isLocal: false, isCameraOn: true, isMicOn: true, isActive: true },
    { id: 'user2', name: '이영희', isLocal: false, isCameraOn: false, isMicOn: true, isActive: true },
    { id: 'user3', name: '박민수', isLocal: false, isCameraOn: true, isMicOn: true, isActive: true }
  ];

  switch (app) {
    case "C":
      return (
        <CameraLayout
          localUser={localUser}
          remoteUsers={remoteUsers}
                  onToggleCamera={() => {}}
        onToggleMic={() => {}}
        onUserClick={() => {}}
        />
      );
    default:
      return <div>알 수 없는 앱</div>;
  }
};
