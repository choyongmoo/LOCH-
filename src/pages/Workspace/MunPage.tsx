import React from "react";

const MunPage = () => {
  return (
    <div className="min-h-screen w-402 bg-gray-100 dark:bg-[#18191c] px-5 py-6">
      {/* 상단 버튼 */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <button className="flex items-center gap-2 border border-gray-200 dark:border-[#23242e] rounded-lg px-4 py-2 bg-white dark:bg-[#23242e] hover:bg-gray-50 dark:hover:bg-[#23242e]/80 text-gray-800 dark:text-gray-100 text-base font-medium">
           새 문서
        </button>
        <button className="flex items-center gap-2 border border-gray-200 dark:border-[#23242e] rounded-lg px-4 py-2 bg-white dark:bg-[#23242e] hover:bg-gray-50 dark:hover:bg-[#23242e]/80 text-gray-800 dark:text-gray-100 text-base font-medium">
           가져오기
        </button>
      </div>
      {/* 테이블 헤더 */}
      <div className="flex items-center px-2 py-2 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-[#23242e]">
        <div className="w-8"></div>
        <div className="flex-1">제목</div>
        <div className="w-32 text-center">작성자</div>
        <div className="w-32 text-center">작성일</div>
      </div>
      
    </div>
  );
};

export default MunPage;
