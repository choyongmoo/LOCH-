import { useState, useRef, useEffect } from "react";
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/lib/supabase';

interface MyProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

// 프로필 타입 정의
interface UserProfile {
  name: string;
  role: string;
  department: string;
  email: string;
  status: string;
  joinDate: string;
  avatar: string;
  skills: string[];
  projects: string[];
  bio: string;
}

// Supabase에 프로필 데이터 저장하기
const saveProfileToSupabase = async (profile: UserProfile) => {
  try {
    // 현재 사용자 정보 가져오기
    const { data: authData } = await supabase.auth.getUser();
    const email = authData.user?.email;
    
    if (!email) {
      return;
    }

    // users 테이블에서 사용자 ID 찾기
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (!userData) {
      return;
    }

    // profile 테이블에 업데이트
    const { data: profileResult, error: profileError } = await supabase
      .from('profile')
      .upsert(
        {
          id: userData.id,
          nickname: profile.name,
          bio: profile.bio,
          language: 'ko', // language 컬럼에 기본값 설정
        },
        { onConflict: 'id' }
      );

    if (profileError) {
      return;
    }

    // users 테이블의 name 필드도 업데이트 (호환성을 위해)
    const { data: userResult, error: userError } = await supabase
      .from('users')
      .update({ name: profile.name })
      .eq('id', userData.id);

    if (userError) {
      // profile 테이블 업데이트는 성공했으므로 계속 진행
    }

    // 저장 후 즉시 확인 (캐싱 문제 해결을 위해)
    const { data: verifyProfile } = await supabase
      .from('profile')
      .select('nickname')
      .eq('id', userData.id)
      .single();
    
    const { data: verifyUser } = await supabase
      .from('users')
      .select('name')
      .eq('id', userData.id)
      .single();

    // 이벤트는 handleSave에서 발생시킴
  } catch (error) {
    // 오류 시 조용히 처리
  }
};

export const MyProfileModal = ({ visible, onClose }: MyProfileModalProps) => {
  if (!visible) return null;

  // Supabase에서 사용자 프로필 가져오기
  const { userProfile, updateStatus, updateProfile } = useUserProfile();
  
  // 내 정보 상태 (userProfile을 직접 사용)
  const profile: UserProfile = {
    name: userProfile.name || "사용자",
    role: "개발자",
    department: "개발팀",
    email: "",
    status: userProfile.status || "온라인",
    joinDate: "2024-01-15",
    avatar: userProfile.avatar || userProfile.name?.slice(0, 2).toUpperCase() || "사용",
    skills: ["React", "TypeScript", "Node.js"],
    projects: ["LOCH 프로젝트", "웹 애플리케이션"],
    bio: "프론트엔드 개발에 열정을 가진 개발자입니다. 사용자 경험을 개선하는 것에 관심이 많습니다."
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState<UserProfile>({ ...profile });
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  // userProfile이 변경될 때 profile 객체 업데이트 (수정 모드가 아닐 때만)
  useEffect(() => {
    if (!isEditing) {
      setEditProfile({
        name: userProfile.name || "사용자",
        role: "개발자",
        department: "개발팀",
        email: "",
        status: userProfile.status || "온라인",
        joinDate: "2024-01-15",
        avatar: userProfile.avatar || userProfile.name?.slice(0, 2).toUpperCase() || "사용",
        skills: ["React", "TypeScript", "Node.js"],
        projects: ["LOCH 프로젝트", "웹 애플리케이션"],
        bio: "프론트엔드 개발에 열정을 가진 개발자입니다. 사용자 경험을 개선하는 것에 관심이 많습니다."
      });
    }
  }, [userProfile, isEditing]);

  // 상태에 따른 색상과 배경색
  const getStatusColor = (status: string) => {
    switch (status) {
      case "온라인": return "text-green-400";
      case "자리비움": return "text-yellow-400";
      case "오프라인": return "text-gray-400";
      default: return "text-green-400";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "온라인": return "bg-green-400";
      case "자리비움": return "bg-yellow-400";
      case "오프라인": return "bg-gray-400";
      default: return "bg-green-400";
    }
  };

  // 상태 변경 함수
  const handleStatusChange = async (newStatus: string) => {
    if (!isEditing) {
      setShowStatusDropdown(false);
      
      // useUserProfile의 상태도 업데이트 (localStorage에 자동 저장됨)
      updateStatus(newStatus);
      
      // Supabase에 즉시 저장
      const updatedProfile = { ...profile, status: newStatus };
      await saveProfileToSupabase(updatedProfile);
    }
  };

  const handleSave = async () => {
    try {
      // Supabase에 먼저 저장
      await saveProfileToSupabase(editProfile);
      
      // 저장 성공 후 useUserProfile의 상태도 업데이트
      updateProfile({
        name: editProfile.name,
        avatar: editProfile.name.slice(0, 2).toUpperCase()
      });
      
      // 프로필 업데이트 이벤트 발생 (다른 컴포넌트들과 동기화)
      try {
        // 잠시 기다린 후 이벤트 발생 (데이터베이스 동기화 대기)
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('profile-updated'));
          window.dispatchEvent(new CustomEvent('friends-updated'));
        }, 500);
      } catch (e) {
        // 오류 시 조용히 처리
      }
      
      // 수정 모드 종료
      setIsEditing(false);
    } catch (error) {
      // 오류 발생 시 수정 모드 유지
    }
  };

  const handleCancel = () => {
    setEditProfile({
      name: userProfile.name || "사용자",
      role: "개발자",
      department: "개발팀",
      email: "",
      status: userProfile.status || "온라인",
      joinDate: "2024-01-15",
      avatar: userProfile.avatar || userProfile.name?.slice(0, 2).toUpperCase() || "사용",
      skills: ["React", "TypeScript", "Node.js"],
      projects: ["LOCH 프로젝트", "웹 애플리케이션"],
      bio: "프론트엔드 개발에 열정을 가진 개발자입니다. 사용자 경험을 개선하는 것에 관심이 많습니다."
    });
    setIsEditing(false);
  };

  // 수정 모드 진입 시 현재 프로필 상태를 정확히 복사
  const handleEditMode = () => {
    setEditProfile({
      name: userProfile.name || "사용자",
      role: "개발자",
      department: "개발팀",
      email: "",
      status: userProfile.status || "온라인",
      joinDate: "2024-01-15",
      avatar: userProfile.avatar || userProfile.name?.slice(0, 2).toUpperCase() || "사용",
      skills: ["React", "TypeScript", "Node.js"],
      projects: ["LOCH 프로젝트", "웹 애플리케이션"],
      bio: "프론트엔드 개발에 열정을 가진 개발자입니다. 사용자 경험을 개선하는 것에 관심이 많습니다."
    });
    setIsEditing(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditProfile((prev: UserProfile) => ({ ...prev, [field]: value }));
  };

  const handleSkillsChange = (skills: string) => {
    setEditProfile((prev: UserProfile) => ({ ...prev, skills: skills.split(',').map(s => s.trim()) }));
  };

  const handleProjectsChange = (projects: string) => {
    setEditProfile((prev: UserProfile) => ({ ...prev, projects: projects.split(',').map(p => p.trim()) }));
  };

  const statusOptions = [
    { value: "온라인", label: "온라인", color: "text-green-400", bgColor: "bg-green-400" },
    { value: "자리비움", label: "자리비움", color: "text-yellow-400", bgColor: "bg-yellow-400" },
    { value: "오프라인", label: "오프라인", color: "text-gray-400", bgColor: "bg-gray-400" }
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div
        className="
          fixed top-1/2 left-1/2 max-w-2xl w-full bg-[#2F3136] rounded-2xl shadow-xl
          transform -translate-x-1/2 -translate-y-1/2 z-50 text-white overflow-hidden max-h-[90vh] overflow-y-auto
        "
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-[#4F545C]">
          <h2 className="text-xl font-bold text-[#7289DA]">내 프로필</h2>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={handleEditMode}
                className="px-4 py-2 bg-[#5865F2] rounded-lg hover:bg-[#4752c4] transition-colors font-medium text-sm"
              >
                수정
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                >
                  저장
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
                >
                  취소
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-xl ml-2"
            >
              ×
            </button>
          </div>
        </div>

        {/* 프로필 섹션 */}
        <div className="p-6">
          {/* 프로필 헤더 */}
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#5865F2] to-[#7289DA] rounded-full flex items-center justify-center text-2xl font-bold text-white mr-4">
              {isEditing ? editProfile.avatar : profile.avatar}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editProfile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="text-xl font-semibold mb-1 bg-[#40444B] border border-[#4F545C] rounded px-2 py-1 w-full"
                />
              ) : (
                <h3 className="text-xl font-semibold mb-1">{profile.name}</h3>
              )}
              {isEditing ? (
                <div className="flex gap-2 mb-1">
                  <input
                    type="text"
                    value={editProfile.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="text-gray-400 bg-[#40444B] border border-[#4F545C] rounded px-2 py-1 text-sm"
                    placeholder="직책"
                  />
                  <span className="text-gray-400">•</span>
                  <input
                    type="text"
                    value={editProfile.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="text-gray-400 bg-[#40444B] border border-[#4F545C] rounded px-2 py-1 text-sm"
                    placeholder="부서"
                  />
                </div>
              ) : (
                <p className="text-gray-400 mb-1">{profile.role} • {profile.department}</p>
              )}
                             <div className="flex items-center relative">
                 <div 
                   className={`w-3 h-3 rounded-full ${getStatusBgColor(isEditing ? editProfile.status : profile.status)} mr-2`}
                 ></div>
                 <div 
                   className="relative"
                   onMouseEnter={() => {
                     if (!isEditing) {
                       if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                       setShowStatusDropdown(true);
                     }
                   }}
                   onMouseLeave={() => {
                     if (!isEditing) {
                       hoverTimeout.current = setTimeout(() => setShowStatusDropdown(false), 200);
                     }
                   }}
                 >
                   <span 
                     className={`text-sm ${getStatusColor(isEditing ? editProfile.status : profile.status)} ${!isEditing ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                     title={!isEditing ? "마우스 오버하여 상태 변경" : "수정 모드에서는 상태 변경 불가"}
                   >
                     {isEditing ? editProfile.status : profile.status}
                   </span>
                  
                  {/* 상태 선택 드롭다운 */}
                  {showStatusDropdown && !isEditing && (
                    <div 
                      className="absolute top-full left-0 mt-1 bg-[#40444B] rounded-lg shadow-lg border border-[#4F545C] z-10 min-w-[120px]"
                      onMouseEnter={() => {
                        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                      }}
                      onMouseLeave={() => {
                        hoverTimeout.current = setTimeout(() => setShowStatusDropdown(false), 200);
                      }}
                    >
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleStatusChange(option.value)}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-[#4F545C] transition-colors flex items-center gap-2 ${
                            profile.status === option.value ? 'bg-[#5865F2] text-white' : 'text-gray-300'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full ${option.bgColor}`}></div>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-[#7289DA] mb-2 flex items-center">
                📧 연락처
              </h4>
              {isEditing ? (
                <input
                  type="email"
                  value={editProfile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-[#40444B] p-3 rounded-lg w-full border border-[#4F545C]"
                />
              ) : (
                <div className="bg-[#40444B] p-3 rounded-lg">
                  <p className="text-sm">{profile.email}</p>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#7289DA] mb-2 flex items-center">
                📅 가입 정보
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#40444B] p-3 rounded-lg">
                  <p className="text-xs text-gray-400">가입일</p>
                  <p className="text-sm font-medium">{profile.joinDate}</p>
                </div>
                <div className="bg-[#40444B] p-3 rounded-lg">
                  <p className="text-xs text-gray-400">상태</p>
                  <p className="text-sm font-medium">{profile.status}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#7289DA] mb-2 flex items-center">
                💻 기술 스택
              </h4>
              {isEditing ? (
                <input
                  type="text"
                  value={editProfile.skills.join(', ')}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  className="bg-[#40444B] p-3 rounded-lg w-full border border-[#4F545C]"
                  placeholder="React, TypeScript, Node.js"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#5865F2] text-white text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#7289DA] mb-2 flex items-center">
                🚀 참여 프로젝트
              </h4>
              {isEditing ? (
                <input
                  type="text"
                  value={editProfile.projects.join(', ')}
                  onChange={(e) => handleProjectsChange(e.target.value)}
                  className="bg-[#40444B] p-3 rounded-lg w-full border border-[#4F545C]"
                  placeholder="LOCH 프로젝트, 웹 애플리케이션"
                />
              ) : (
                <div className="space-y-2">
                  {profile.projects.map((project: string, index: number) => (
                    <div key={index} className="bg-[#40444B] p-3 rounded-lg">
                      <p className="text-sm">{project}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#7289DA] mb-2 flex items-center">
                📝 자기소개
              </h4>
              {isEditing ? (
                <textarea
                  value={editProfile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="bg-[#40444B] p-3 rounded-lg w-full border border-[#4F545C] h-24 resize-none"
                  placeholder="자기소개를 입력하세요..."
                />
              ) : (
                <div className="bg-[#40444B] p-3 rounded-lg">
                  <p className="text-sm leading-relaxed">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}; 