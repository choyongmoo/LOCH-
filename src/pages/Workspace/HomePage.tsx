export default function HomePage() {
  return (
    <div className="space-y-6 px-6 pt-6">
      <div className="w-full px-1 pt-3">
        <div className="bg-white rounded-xl p-6 shadow w-full">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                오택현님 환영합니다!
            </h1>
            <p className="text-sm text-gray-500">
                <br />
                <br />
                <br />
            </p>
        </div>
      </div>
      
      {/* 2단 가로 카드 레이아웃 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 왼쪽 카드 */}
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Loch
          </h1>
          <p className="text-sm text-gray-500">
            Save up to 21% when you upgrade to Zoom Workplace Pro annual.
            Experience meetings up to 30 hours, AI Companion, 10GB of cloud
            storage, and more.
            <br />
            <br />
            <br />
          </p>
        </div>

        {/* 오른쪽 카드 */}
        <div className="bg-white rounded-xl shadow p-6"></div>
      </div>

      <div className="w-full px-1 pt-1">
        <div className="bg-white rounded-xl p-6 shadow w-full">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                입체감? 디자인, 다크모드 정상화, 블록 내용 추가, 예쁘게 꾸미기(zoom처럼)  
            </h1>
            <p className="text-sm text-gray-500">
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
            </p>
        </div>
      </div>
    </div>
  );
}
