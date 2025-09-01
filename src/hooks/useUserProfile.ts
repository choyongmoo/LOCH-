import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Supabase에서 사용자 프로필 데이터 불러오기
const loadProfileFromSupabase = async () => {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const email = authData.user?.email;
    
    if (!email) {
      return {
        name: "사용자",
        status: "온라인",
        avatar: "사용자".slice(0, 2).toUpperCase(),
        accentColor: "#7e22ce",
      };
    }

    // users 테이블에서 기본 정보 가져오기
    const { data: userData } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('email', email)
      .single();

    if (userData) {
      // profile 테이블에서 nickname과 accent_color 확인
      const { data: profileData } = await supabase
        .from('profile')
        .select('nickname, accent_color')
        .eq('id', userData.id)
        .single();

      const displayName = profileData?.nickname || userData.name || "사용자";
      const accentColor = profileData?.accent_color || "#7e22ce";
      
      return {
        name: displayName,
        status: "온라인",
        avatar: displayName.slice(0, 2).toUpperCase(),
        accentColor: accentColor,
      };
    }
  } catch (error) {
    // 오류 시 조용히 처리
  }
  
  // 기본 프로필 데이터
  return {
    name: "사용자",
    status: "온라인",
    avatar: "사용자".slice(0, 2).toUpperCase(),
    accentColor: "#7e22ce",
  };
};

export const useUserProfile = () => {
  // localStorage에서 저장된 상태 불러오기
  const getSavedProfile = () => {
    try {
      const saved = localStorage.getItem('userProfile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name || "사용자",
          status: parsed.status || "온라인",
          avatar: parsed.avatar || "사용자".slice(0, 2).toUpperCase(),
          accentColor: parsed.accentColor || "#7e22ce",
        };
      }
    } catch (error) {
      // 오류 시 조용히 처리
    }
    return {
      name: "사용자",
      status: "온라인",
      avatar: "사용자".slice(0, 2).toUpperCase(),
      accentColor: "#7e22ce",
    };
  };

  const [userProfile, setUserProfile] = useState(getSavedProfile);

  // Supabase에서 프로필 데이터 로드 (한 번만 로드)
  useEffect(() => {
    const loadProfile = async () => {
      const profile = await loadProfileFromSupabase();
      setUserProfile(prev => {
        const newProfile = {
          ...prev,
          ...profile,
          // 상태는 기존 상태를 유지 (초기화 방지)
          status: prev.status !== "사용자" ? prev.status : profile.status
        };
        return newProfile;
      });
    };

    loadProfile();

    // 프로필 업데이트 이벤트 리스너 추가
    const handleProfileUpdate = () => {
      loadProfile();
    };

    // 커스텀 이벤트 리스너 등록
    window.addEventListener('profile-updated', handleProfileUpdate);
    window.addEventListener('friends-updated', handleProfileUpdate); // 기존 이벤트도 포함

    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
      window.removeEventListener('friends-updated', handleProfileUpdate);
    };
  }, []);

  // 프로필 업데이트 함수
  const updateProfile = (updates: Partial<typeof userProfile>) => {
    setUserProfile(prev => {
      const newProfile = { ...prev, ...updates };
      // localStorage에 저장
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      return newProfile;
    });
  };

  // 상태 업데이트 함수
  const updateStatus = (newStatus: string) => {
    setUserProfile(prev => {
      const newProfile = { ...prev, status: newStatus };
      // localStorage에 저장
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      return newProfile;
    });
  };

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
    updateProfile,
    updateStatus,
    getStatusColor
  };
};
