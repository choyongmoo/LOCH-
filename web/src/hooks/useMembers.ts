import { useState } from 'react';
import { useNotification } from './useNotification';

interface Member {
  id: string;
  name: string;
  isCameraOn: boolean;
  isScreenSharing: boolean;
}

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([
    { id: 'user1', name: '김개발', isCameraOn: false, isScreenSharing: false },
    { id: 'user2', name: '이디자인', isCameraOn: false, isScreenSharing: false }
  ]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string>("홍길동");
  const { addNotification } = useNotification();

  const handleJoin = (name: string) => {
    addNotification(`${name}님이 접속했습니다.`);
    if (!members.find(m => m.name === name)) {
      setMembers((prev) => [...prev, { id: `user${prev.length + 1}`, name, isCameraOn: false, isScreenSharing: false }]);
    }
  };

  const handleLeave = (name: string) => {
    addNotification(`${name}님이 나갔습니다.`);
    setMembers((prev) => prev.filter((m) => m.name !== name));
    if (currentUser === name) setCurrentUser("익명");
    if (selectedUser === name) setSelectedUser(null);
  };

  const toggleMemberCamera = (memberId: string) => {
    setMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, isCameraOn: !member.isCameraOn }
        : member
    ));
  };

  const toggleMemberScreenShare = (memberId: string) => {
    setMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, isScreenSharing: !member.isScreenSharing }
        : member
    ));
  };

  return {
    members,
    selectedUser,
    setSelectedUser,
    currentUser,
    setCurrentUser,
    handleJoin,
    handleLeave,
    toggleMemberCamera,
    toggleMemberScreenShare,
  };
};