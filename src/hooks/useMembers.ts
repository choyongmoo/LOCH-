import { useState } from 'react';
import { useNotification } from './useNotification';

export const useMembers = () => {
  const [members, setMembers] = useState<string[]>(["홍길동", "김개발", "이디자인"]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string>("홍길동");
  const { addNotification } = useNotification();

  const handleJoin = (name: string) => {
    addNotification(`${name}님이 접속했습니다.`);
    if (!members.includes(name)) {
      setMembers((prev) => [...prev, name]);
    }
  };

  const handleLeave = (name: string) => {
    addNotification(`${name}님이 나갔습니다.`);
    setMembers((prev) => prev.filter((m) => m !== name));
    if (currentUser === name) setCurrentUser("익명");
    if (selectedUser === name) setSelectedUser(null);
  };

  return {
    members,
    selectedUser,
    setSelectedUser,
    currentUser,
    setCurrentUser,
    handleJoin,
    handleLeave,
  };
};