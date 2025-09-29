import { Mic } from "lucide-react";

export default function MicrophoneTestCard() {
  return (
    <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-6 flex flex-col relative h-40 md:h-48">
      {/* 상단 컨트롤 바 */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
        <button className="inline-flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-1 text-xs hover:bg-gray-100 dark:hover:bg-[#23242e] transition">
          장치 변경
        </button>
        <button className="inline-flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-1 text-xs hover:bg-gray-100 dark:hover:bg-[#23242e] transition">
          마이크 테스트
        </button>
      </div>

      {/* 마이크 레벨 표시 영역 */}
      <div className="absolute left-4 right-4 bottom-4 top-14 rounded-xl border border-blue-200 dark:border-blue-900 bg-white dark:bg-[#111827] p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Mic className="text-gray-500 dark:text-gray-300" size={18} />
          <div className="flex-1 h-6 md:h-7 rounded-full bg-blue-100 dark:bg-blue-950/50 overflow-hidden">
            {/* 캔버스 자리만 표시 */}
            <div className="w-full h-full block bg-blue-200/30 dark:bg-blue-900/20" />
          </div>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-300 truncate">
          장치: 기본 마이크
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          마이크를 테스트 해보세요!
        </div>
      </div>
    </div>
  );
}
