import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useModal } from "@/store/useModalStore";
import RecentActivityModal from "../Modals/RecentActivityModal";

const MAX_RECENT = 3;
const RECENT_STORAGE_KEY = "recentPages";

export interface RecentPage {
  path: string;
  name: string;
  ts: number;
}

export default function RecentActivityCard() {
  const location = useLocation();
  const [recentPages, setRecentPages] = useState<RecentPage[]>([]);
  const { openModal, currentModal } = useModal();

  const getDisplayName = (path: string) =>
    path.split("/").filter(Boolean).pop() || "홈";

  // 초기 로컬스토리지에서 불러오기
  useEffect(() => {
    const stored: RecentPage[] = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) || "[]");
    setRecentPages(stored.slice(0, MAX_RECENT));
  }, []);

  // location이 바뀌면 최근 페이지 업데이트
  useEffect(() => {
    if (!location.pathname) return;

    const stored: RecentPage[] = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) || "[]");
    const newPage: RecentPage = {
      path: location.pathname,
      name: getDisplayName(location.pathname),
      ts: Date.now(),
    };

    // 전체 기록 업데이트
    const fullUpdatedPages = [newPage, ...stored.filter((p) => p.path !== location.pathname)];
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(fullUpdatedPages));

    // 카드에는 MAX_RECENT만 보여줌
    setRecentPages(fullUpdatedPages.slice(0, MAX_RECENT));
  }, [location.pathname]);

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-[#1a1d21] rounded-2xl shadow-xl p-8 mt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            최근 활동
          </h2>
          <button 
            onClick={() => openModal("RecentActivityModal")}
            className="inline-flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-1 text-sm font-bold hover:bg-gray-100 dark:hover:bg-[#23242e] transition">
            ...
          </button>
        </div>

        <div className="space-y-4">
          {recentPages.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              최근 활동이 없습니다.
            </div>
          ) : (
            recentPages.map((item) => (
              <Link
                to={item.path}
                key={`${item.path}-${item.ts}`}
                className="flex items-center gap-4 p-4 border rounded-xl hover:bg-gray-50 dark:hover:bg-[#23242e] transition"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg" />
                <div className="flex-1">
                  <div className="font-bold text-blue-700 hover:underline">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    방문: {new Date(item.ts).toLocaleString()}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* 모달 */}
      {currentModal === "RecentActivityModal" && (
        <RecentActivityModal
          recentPages={JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) || "[]")}
          showAllModal={true}
          setShowAllModal={() => openModal(null)}
        />
      )}
    </div>
  );
}
