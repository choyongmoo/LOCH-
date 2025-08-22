import React from "react";

const ManagerPage = () => {
  return (
    <div className="min-h-screen w-402 bg-gray-100 dark:bg-[#18191c] px-5 py-6">
      {/* 테이블 헤더 */}
      <div className="flex items-center px-2 py-2 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-[#23242e]">
        <div className="w-8"></div>
        <div className="flex-1">서버</div>
        <div className="w-32 text-center">생성일</div>
      </div>
      
    </div>
  );
};

export default ManagerPage;
