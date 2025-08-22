import { useState, useEffect } from 'react';

// localStorage에서 프로필 데이터 불러오기
const loadProfileFromStorage = () => {
  try {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('프로필 데이터 로드 실패:', error);
  }
  
  // 기본 프로필 데이터
  return {
    name: "홍길동",
    status: "온라인",
    avatar: "홍길동".slice(0, 2).toUpperCase(),
  };
};

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState(loadProfileFromStorage);

  // localStorage 변경 감지
  useEffect(() => {
    const handleStorageChange = () => {
      setUserProfile(loadProfileFromStorage());
    };

    // storage 이벤트 리스너 (다른 탭에서 변경된 경우)
    window.addEventListener('storage', handleStorageChange);
    
    // 커스텀 이벤트 리스너 (같은 탭에서 변경된 경우)
    window.addEventListener('profileUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleStorageChange);
    };
  }, []);

  // 상태에 따른 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "온라인": return "bg-green-500";
      case "자리비움": return "bg-yellow-500";
      case "오프라인": return "bg-gray-500";
      default: return "bg-green-500";
    }
  };

  return {
    userProfile,
    getStatusColor
  };
};
