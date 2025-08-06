import React from "react";
import type { UserDetailsModalProps } from "@/pages/Meeting/types";

export const UserDetailsModal = ({ visible, onClose, user, userInfo: propUserInfo }: UserDetailsModalProps) => {
  if (!visible || !user) return null;

  // 사용자 정보 (props로 받거나 기본값 사용)
  const userInfo = propUserInfo || {
    name: user,
    role: "개발자",
    department: "개발팀",
    email: `${user.toLowerCase().replace(/\s+/g, '')}@company.com`,
    status: "온라인",
    joinDate: "2024-01-15",
    lastSeen: "방금 전",
    avatar: user.slice(0, 2).toUpperCase(),
    skills: ["React", "TypeScript", "Node.js"],
    projects: ["LOCH 프로젝트", "웹 애플리케이션"],
    bio: "프론트엔드 개발에 열정을 가진 개발자입니다. 사용자 경험을 개선하는 것에 관심이 많습니다."
  };

  // 상태에 따른 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "온라인": return "text-green-400";
      case "자리비움": return "text-yellow-400";
      case "오프라인": return "text-gray-400";
      default: return "text-green-400";
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div
        className="
          fixed top-1/2 left-1/2 max-w-md w-full bg-[#2F3136] rounded-2xl shadow-xl
          transform -translate-x-1/2 -translate-y-1/2 z-50 text-white overflow-hidden
        "
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-[#4F545C]">
          <h2 className="text-xl font-bold text-[#7289DA]">사용자 프로필</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl"
          >
            ×
          </button>
        </div>

        {/* 프로필 섹션 */}
        <div className="p-6">
          {/* 프로필 헤더 */}
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#5865F2] to-[#7289DA] rounded-full flex items-center justify-center text-2xl font-bold text-white mr-4">
              {userInfo.avatar}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1">{userInfo.name}</h3>
              <p className="text-gray-400 mb-1">{userInfo.role} • {userInfo.department}</p>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full bg-green-400 mr-2`}></div>
                <span className={`text-sm ${getStatusColor(userInfo.status)}`}>
                  {userInfo.status}
                </span>
              </div>
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-[#7289DA] mb-2 flex items-center">
                📧 연락처
              </h4>
              <div className="bg-[#40444B] p-3 rounded-lg">
                <p className="text-sm">{userInfo.email}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#7289DA] mb-2 flex items-center">
                📅 가입 정보
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#40444B] p-3 rounded-lg">
                  <p className="text-xs text-gray-400">가입일</p>
                  <p className="text-sm font-medium">{userInfo.joinDate}</p>
                </div>
                <div className="bg-[#40444B] p-3 rounded-lg">
                  <p className="text-xs text-gray-400">마지막 접속</p>
                  <p className="text-sm font-medium">{userInfo.lastSeen}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#7289DA] mb-2 flex items-center">
                💻 기술 스택
              </h4>
              <div className="flex flex-wrap gap-2">
                {userInfo.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#5865F2] text-white text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#7289DA] mb-2 flex items-center">
                🚀 참여 프로젝트
              </h4>
              <div className="space-y-2">
                {userInfo.projects.map((project, index) => (
                  <div key={index} className="bg-[#40444B] p-3 rounded-lg">
                    <p className="text-sm">{project}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#7289DA] mb-2 flex items-center">
                📝 자기소개
              </h4>
              <div className="bg-[#40444B] p-3 rounded-lg">
                <p className="text-sm leading-relaxed">{userInfo.bio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end p-6 border-t border-[#4F545C]">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#5865F2] rounded-lg hover:bg-[#4752c4] transition-colors font-medium"
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
};
