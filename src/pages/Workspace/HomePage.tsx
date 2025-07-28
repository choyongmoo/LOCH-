export default function HomePage() {
  return (
    <div className="bg-gray-50 dark:bg-[#18191c] min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
      {/* 왼쪽: 기존 메인 콘텐츠 */}
      <div>
        {/* 기존 상단 카드, 2단 카드, 활동 등 기존 코드 전체 */}
        <div className="ml-2 lg:ml-4 mt-2 lg:mt-4">
          <div className="bg-white dark:bg-[#1a1d21] rounded-2xl shadow-xl p-6 mb-6 flex items-center justify-between">
            {/* 왼쪽: 프로필, 이름, 요금제, 직함 */}
            <div className="flex items-center gap-6">
              {/* 프로필(이니셜) */}
              <div className="w-16 h-16 rounded-xl bg-purple-700 flex items-center justify-center text-white text-3xl font-bold shadow">
                택현
              </div>
              {/* 이름, 요금제, 직함 */}
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">오택현</div>
                <div className="text-sm text-gray-500 mt-1">
                  요금제: <span className="font-medium text-gray-800 dark:text-gray-200">Workplace 기본</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  직함: <span className="text-blue-600 cursor-pointer hover:underline">추가</span>
                </div>
              </div>
            </div>
            {/* 오른쪽: 버튼/링크 */}
            <div className="flex flex-col items-end gap-2">
              <button className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-1 text-sm font-medium hover:bg-gray-100 dark:hover:bg-[#23242e] transition">
                요금제 관리
              </button>
              <a href="#" className="text-xs text-blue-600 hover:underline mt-1">요금제 세부 정보 보기</a>
            </div>
          </div>
        </div>
        
        {/* 2단 가로 카드 레이아웃 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch w-full ml-2 lg:ml-4 mt-2 lg:mt-4">
          {/* 왼쪽 카드: Loch 설명 */}
          <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-8 flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Loch
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
              Save up to 21% when you upgrade to Zoom Workplace Pro annual.<br />
              Experience meetings up to 30 hours, AI Companion, 10GB of cloud storage, and more.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-5 py-2 w-fit">
              프로로 업그레이드
            </button>
          </div>

          {/* 오른쪽 카드: Zoom 다운로드 */}
          <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-8 flex flex-col items-center justify-center text-center relative
                w-full max-w-135 mx-auto">
            {/* Zoom 아이콘 */}
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              {/* SVG Zoom 아이콘 */}
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="18" fill="#2563eb"/>
                <path d="M24.5 17.13V14.5C24.5 13.12 23.38 12 22 12H14C12.62 12 11.5 13.12 11.5 14.5V21.5C11.5 22.88 12.62 24 14 24H22C23.38 24 24.5 22.88 24.5 21.5V18.87L27.03 20.7C27.36 20.93 27.81 20.7 27.81 20.3V15.7C27.81 15.3 27.36 15.07 27.03 15.3L24.5 17.13Z" fill="white"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Zoom 다운로드</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
              Zoom 데스크톱 클라이언트에서 바로 미팅을 시작, 참여 및 예약하세요.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-5 py-2 mb-2">
              Zoom 다운로드
            </button>
            <a href="#" className="text-xs text-blue-600 hover:underline">다시 표시 안 함</a>
          </div>
        </div>

        <div className="w-full px-1 pt-1">
          <div className="bg-white dark:bg-[#1a1d21] rounded-2xl shadow-xl p-6 ml-2 lg:ml-4 mt-2 lg:mt-4">
            {/* 상단: 제목 + 버튼 */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">활동(최근 활동 한거 띄우게 만들거임)</h2>
              <div className="flex gap-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-1 text-sm">+ 새로운 기능</button>
                <button className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-1 text-sm font-medium hover:bg-gray-100 dark:hover:bg-[#23242e] transition">최근</button>
              </div>
            </div>
            {/* 기능 안내 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-2">
                  {/* 화이트보드 아이콘 */}
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="12" fill="#2563eb"/><rect x="7" y="9" width="10" height="6" rx="2" fill="white"/></svg>
                  </div>
                  <span className="font-bold text-lg text-gray-800 dark:text-white">화이트보드</span>
                </div>
                <div className="text-sm text-gray-500 mb-3">이제 걸작을 만들 시간입니다.</div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-1 text-sm w-fit">화이트보드 만들기</button>
              </div>
              <div className="border rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="12" fill="#2563eb"/><path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <span className="font-bold text-lg text-gray-800 dark:text-white">클립</span>
                </div>
                <div className="text-sm text-gray-500 mb-3">내 모습과 화면을 녹화하여 클립을 만드세요. 다른 사람과 클립을 공유할 수 있습니다.</div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-1 text-sm w-fit">클립 만들기</button>
              </div>
            </div>
            {/* 리스트 */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-xl">
                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                  <svg width="24" height="24" fill="none"><rect x="4" y="4" width="16" height="16" rx="4" fill="#2563eb"/><rect x="8" y="8" width="8" height="2" rx="1" fill="white"/><rect x="8" y="12" width="8" height="2" rx="1" fill="white"/></svg>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-blue-700 cursor-pointer hover:underline">제목 없음</div>
                  <div className="text-xs text-gray-500">작성자: 오택현<br/>마지막 조회: 1주 전</div>
                </div>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">Docs</span>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-xl">
                <div className="w-10 h-10 flex items-center justify-center bg-yellow-100 rounded-lg">
                  <span className="text-2xl">👋</span>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-blue-700 cursor-pointer hover:underline">Welcome to Zoom Docs, 오택현!</div>
                  <div className="text-xs text-gray-500">작성자: 오택현<br/>마지막 조회: 1주 전</div>
                </div>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">Docs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 오른쪽: Zoom 스타일 블록 */}
      <div className="flex flex-col gap-6 pr-4">
        {/* Zoom 다운로드 블록 */}
        <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-6 flex flex-col items-center text-center max-w-200 ml-2 lg:ml-4 mt-2 lg:mt-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="18" fill="#2563eb"/>
              <path d="M24.5 17.13V14.5C24.5 13.12 23.38 12 22 12H14C12.62 12 11.5 13.12 11.5 14.5V21.5C11.5 22.88 12.62 24 14 24H22C23.38 24 24.5 22.88 24.5 21.5V18.87L27.03 20.7C27.36 20.93 27.81 20.7 27.81 20.3V15.7C27.81 15.3 27.36 15.07 27.03 15.3L24.5 17.13Z" fill="white"/>
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Zoom 다운로드</h2>
          <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
            Zoom 데스크톱 클라이언트에서 바로 미팅을 시작, 참여 및 예약하세요.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-5 py-2 mb-2">
            Zoom 다운로드
          </button>
          <a href="#" className="text-xs text-blue-600 hover:underline">다시 표시 안 함</a>
        </div>
        {/* 미팅 정보 블록 */}
        <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-6 flex flex-col items-center text-center">
          <div className="flex gap-4 mb-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                <svg width='24' height='24' fill='none'><rect x='4' y='4' width='16' height='16' rx='8' fill='#2563eb'/><path d='M12 8v8M8 12h8' stroke='white' strokeWidth='2' strokeLinecap='round'/></svg>
              </div>
              <span className="text-xs text-gray-700 dark:text-gray-200">예약</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                <svg width='24' height='24' fill='none'><rect x='4' y='4' width='16' height='16' rx='8' fill='#2563eb'/><path d='M12 8v8' stroke='white' strokeWidth='2' strokeLinecap='round'/></svg>
              </div>
              <span className="text-xs text-gray-700 dark:text-gray-200">참여하기</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-1">
                <svg width='24' height='24' fill='none'><rect x='4' y='4' width='16' height='16' rx='8' fill='#fb923c'/><path d='M8 12h8' stroke='white' strokeWidth='2' strokeLinecap='round'/></svg>
              </div>
              <span className="text-xs text-gray-700 dark:text-gray-200">주최자</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">개인 미팅 ID</div>
          <div className="text-lg font-bold text-gray-800 dark:text-white mb-2 tracking-widest">517 579 9787 <button className="ml-1 text-xs text-gray-400">📋</button></div>
        </div>
        {/* 회의 정보 블록 */}
        <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-gray-800 dark:text-white">회의</span>
            <a href="#" className="text-xs text-blue-600 hover:underline">미팅 방문하기</a>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">예정된 회의 없음</div>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg px-4 py-2 text-xs w-fit">오디오 및 비디오 테스트</button>
        </div>
        {/* 회의 정보 블록 */}
        <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-19 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-gray-800 dark:text-white">회의</span>
            <a href="#" className="text-xs text-blue-600 hover:underline">미팅 방문하기</a>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">예정된 회의 없음</div>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg px-4 py-2 text-xs w-fit">오디오 및 비디오 테스트</button>
        </div>
      </div>
    </div>
  );
}
