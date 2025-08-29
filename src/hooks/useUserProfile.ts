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
      };
    }

    const { data: userData } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('email', email)
      .single();

    if (userData) {
      return {
        name: userData.name || "사용자",
        status: "온라인",
        avatar: (userData.name || "사용자").slice(0, 2).toUpperCase(),
      };
    }
  } catch (error) {
    console.error('Supabase 프로필 데이터 로드 실패:', error);
  }
  
  // 기본 프로필 데이터
  return {
    name: "사용자",
    status: "온라인",
    avatar: "사용자".slice(0, 2).toUpperCase(),
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
        };
      }
    } catch (error) {
      console.error('저장된 프로필 로드 실패:', error);
    }
    return {
      name: "사용자",
      status: "온라인",
      avatar: "사용자".slice(0, 2).toUpperCase(),
    };
  };

  const [userProfile, setUserProfile] = useState(getSavedProfile);

  // Supabase에서 프로필 데이터 로드 (한 번만 로드)
  useEffect(() => {
    const loadProfile = async () => {
      const profile = await loadProfileFromSupabase();
      setUserProfile(prev => ({
        ...prev,
        ...profile,
        // 상태는 기존 상태를 유지 (초기화 방지)
        status: prev.status !== "사용자" ? prev.status : profile.status
      }));
    };

    loadProfile();
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
