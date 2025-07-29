// src/pages/Workspace/ProfilePage.tsx
const ProfilePage = () => {
  return (
    <div className="h-screen w-402 flex justify-start items-start bg-[#f8fafc] dark:bg-[#18191c] p-0 m-0">
      <div className="w-full max-w-400 p-8">
        {/* 상단 프로필 */}
        <div className="flex items-center gap-8 mb-8 w-full max-w-none">
          {/* 프로필 이니셜 */}
          <div className="w-24 h-24 rounded-2xl bg-purple-700 flex items-center justify-center text-white text-4xl font-bold shadow">
            택현
          </div>
          {/* 이름, 직함 */}
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">택현 오</div>
            <div className="text-gray-500 dark:text-gray-300">오택현</div>
          </div>
          <div className="ml-auto flex flex-col gap-2">
            <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">편집</button>
          </div>
        </div>

        {/* 구분선 */}
        <div className="h-3 bg-gray-100 dark:bg-[#23242e] rounded mb-8" />

        {/* 정보 테이블 */}
        <div className="w-full">
          <div className="text-gray-700 dark:text-gray-200 font-semibold mb-4">개인</div>
          <div className="bg-white dark:bg-[#23242e] rounded-r-xl shadow-xl p-6 w-full ml-0">
            <div className="grid grid-cols-7 gap-4 items-center border-b border-gray-100 dark:border-[#23242e] pb-4 mb-4">
              <div className="col-span-2 text-gray-500 dark:text-gray-300">전화</div>
              <div className="col-span-4 text-gray-900 dark:text-white">설정되지 않음</div>
              <div className="col-span-1 text-right"><button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">추가</button></div>
            </div>
            <div className="grid grid-cols-7 gap-4 items-center border-b border-gray-100 dark:border-[#23242e] pb-4 mb-4">
              <div className="col-span-2 text-gray-500 dark:text-gray-300">언어</div>
              <div className="col-span-4 text-gray-900 dark:text-white">한국어</div>
              <div className="col-span-1 text-right"><button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">편집</button></div>
            </div>
            <div className="grid grid-cols-7 gap-4 items-center border-b border-gray-100 dark:border-[#23242e] pb-4 mb-4">
              <div className="col-span-2 text-gray-500 dark:text-gray-300">표준 시간대</div>
              <div className="col-span-4 text-gray-900 dark:text-white">(GMT+9:00) 서울</div>
              <div className="col-span-1 text-right"><button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">편집</button></div>
            </div>
            <div className="grid grid-cols-7 gap-4 items-center border-b border-gray-100 dark:border-[#23242e] pb-4 mb-4">
              <div className="col-span-2 text-gray-500 dark:text-gray-300">날짜 형식</div>
              <div className="col-span-4 text-gray-900 dark:text-white">yyyy/mm/dd <span className="text-gray-400 dark:text-gray-500 ml-2">예시: 2025/07/29</span></div>
              <div className="col-span-1 text-right"><button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">편집</button></div>
            </div>
            <div className="grid grid-cols-7 gap-4 items-center">
              <div className="col-span-2 text-gray-500 dark:text-gray-300">시간 형식</div>
              <div className="col-span-4 text-gray-900 dark:text-white">12시간제 사용 <span className="text-gray-400 dark:text-gray-500 ml-2">(예: 오후 2:00)</span></div>
              <div className="col-span-1 text-right"><button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">편집</button></div>
            </div>
          </div>          
        </div>

        <br />
        {/* 구분선 */}
        <div className="h-3 bg-gray-100 dark:bg-[#23242e] rounded mb-8" />

        {/* 정보 테이블 */}
        <div className="w-full">
          <div className="text-gray-700 dark:text-gray-200 font-semibold mb-4">계정</div>
          <div className="bg-white dark:bg-[#23242e] rounded-r-xl shadow-xl p-6 w-full ml-0">
            <div className="grid grid-cols-7 gap-4 items-center border-b border-gray-100 dark:border-[#23242e] pb-4 mb-4">
              <div className="col-span-2 text-gray-500 dark:text-gray-300">아이디</div>
              <div className="col-span-4 text-gray-900 dark:text-white">설정되지 않음</div>
              <div className="col-span-1 text-right"><button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">변경</button></div>
            </div>
            <div className="grid grid-cols-7 gap-4 items-center border-b border-gray-100 dark:border-[#23242e] pb-4 mb-4">
              <div className="col-span-2 text-gray-500 dark:text-gray-300">비밀번호 변경</div>
              <div className="col-span-4 text-gray-900 dark:text-white">설정되지 않음</div>
              <div className="col-span-1 text-right"><button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">변경</button></div>
            </div>
            <div className="grid grid-cols-7 gap-4 items-center border-b border-gray-100 dark:border-[#23242e] pb-4 mb-4">
              <div className="col-span-2 text-gray-500 dark:text-gray-300">로그아웃</div>
              <div className="col-span-4 text-gray-900 dark:text-white">설정되지 않음</div>
              <div className="col-span-1 text-right"><button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">추가</button></div>
            </div>
            <div className="grid grid-cols-7 gap-4 items-center border-b border-gray-100 dark:border-[#23242e]">
              <div className="col-span-2 text-gray-500 dark:text-gray-300">탈퇴</div>
              <div className="col-span-4 text-gray-900 dark:text-white">설정되지 않음</div>
              <div className="col-span-1 text-right"><button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">추가</button></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
