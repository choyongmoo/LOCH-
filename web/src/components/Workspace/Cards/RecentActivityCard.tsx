import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useModal } from "@/store/useModalStore";
import RecentActivityModal from "../Modals/RecentActivityModal";
import { useUserStore } from "@/store/useUserStore";
import { getStorageKey, type RecentPage } from "../utils/recentPage";

const MAX_RECENT = 3;

export default function RecentActivityCard() {
  const [recentPages, setRecentPages] = useState<RecentPage[]>([]);
  const { openModal, currentModal } = useModal();
  const user = useUserStore((state) => state.user);

  const storageKey = getStorageKey(user?.id);

  useEffect(() => {
    const stored: RecentPage[] = JSON.parse(localStorage.getItem(storageKey) || "[]");
    setRecentPages(stored.slice(0, MAX_RECENT));
  }, [storageKey]);

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
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-[#23242e] transition"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded">
                  <svg width="20" height="20" fill="none">
                    <rect x="3" y="3" width="14" height="14" rx="3" fill="#2563eb" />
                    <rect x="6" y="7" width="8" height="2" rx="1" fill="white" />
                    <rect x="6" y="11" width="8" height="2" rx="1" fill="white" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-blue-700">{item.name}</div>
                  <div className="text-xs text-gray-500">방문: {new Date(item.ts).toLocaleString()}</div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* 모달 */}
      {currentModal === "RecentActivityModal" && (
        <RecentActivityModal
          recentPages={JSON.parse(localStorage.getItem(storageKey) || "[]")}
          showAllModal={true}
          setShowAllModal={() => openModal(null)}
        />
      )}
    </div>
  );
}
