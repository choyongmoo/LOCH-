import { Link } from "react-router";

export default function ServerManagementCard() {
    return (
        <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-6 flex flex-col items-center text-center ml-4">
            {/* 서버 블록 더미 */}
            <div className="flex gap-4 mb-4 min-h-[72px]">
                {Array.from({ length: 3 }).map((_, i) => (
                <div key={`server-placeholder-${i}`} className="flex flex-col items-center w-16 flex-none">
                    <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-[#23242e] mb-2" />
                    <div className="h-3 w-12 rounded bg-gray-100 dark:bg-[#23242e]" />
                </div>
                ))}
            </div>

            {/* 서버 관리 링크 */}
            <Link
                to="/workspace/manager"
                className="text-xs text-gray-500 dark:text-gray-300 mb-1 hover:underline cursor-pointer"
            >
                서버 관리
            </Link>

            {/* 설명 텍스트 */}
            <div className="text-lg font-bold text-gray-800 dark:text-white mb-2 tracking-widest">
                서버를 관리해 보세요!
            </div>
        </div>
    );
}
