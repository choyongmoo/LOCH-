import { Link } from "react-router";

const MAX_RECENT = 5;

export default function RecentActivityCard() {
    const recentPages: any[] = [];

    return (
        <div className="w-full">
            <div className="bg-white dark:bg-[#1a1d21] rounded-2xl shadow-xl p-8 mt-4">
                {/* 상단: 제목 + 버튼 */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">최근 활동</h2>
                    <button className="inline-flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-1 text-sm font-bold hover:bg-gray-100 dark:hover:bg-[#23242e] transition">
                        ...
                    </button>
                </div>
                <div className="space-y-4">
                    {recentPages.length === 0 ? (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                        최근 활동이 없습니다.
                        </div>
                    ) : (
                        recentPages.slice(0, MAX_RECENT).map((item) => (
                        <Link
                            to={item.path}
                            key={`${item.path}-${item.ts}`}
                            className="flex items-center gap-4 p-4 border rounded-xl hover:bg-gray-50 dark:hover:bg-[#23242e] transition"
                        >
                            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-blue-700 hover:underline">{item.name}</div>
                                <div className="text-xs text-gray-500">방문: {item.ts}</div>
                            </div>
                        </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
