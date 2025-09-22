import React from "react";

const SettingPage = () => {
  return (
    <div className="h-screen w-full min-w-0 overflow-hidden bg-gray-100 dark:bg-[#18191c] px-4 md:px-5 py-6">
      {/* 테이블 헤더 */}
      <div className="flex items-center px-2 py-2 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-[#23242e]">
        <div className="w-8"></div>
        <div className="flex-1">프로필 설정</div>
      </div>
      

      <div className="flex items-center px-2 py-2 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-[#23242e]">
        <div className="w-8"></div>
        <div className="flex-1">서버 설정</div>
      </div>
    </div>
  );
};

export default SettingPage;
