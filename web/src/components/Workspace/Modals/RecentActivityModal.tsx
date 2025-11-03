import { Link } from "react-router-dom";
import type { RecentPage } from "../utils/recentPage";

interface RecentModalProps {
  recentPages: RecentPage[];
  showAllModal: boolean;
  setShowAllModal: (v: boolean) => void;
}

export default function RecentActivityModal({ recentPages, showAllModal, setShowAllModal }: RecentModalProps) {
  const MAX_STORE = 10;
  if (!showAllModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 백드롭 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setShowAllModal(false)}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-white dark:bg-[#1a1d21] w-full max-w-lg rounded-xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            전체 최근 활동
          </h3>
          <button
            onClick={() => setShowAllModal(false)}
            className="text-sm text-gray-500 hover:underline"
          >
            닫기
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {recentPages.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-6">
              최근 활동이 없습니다.
            </div>
          )}

          {recentPages.slice(0, MAX_STORE).map((item) => (
            <Link
              to={item.path}
              key={`${item.path}-${item.ts}`}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-[#23242e] transition"
              onClick={() => setShowAllModal(false)}
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
          ))}
        </div>
      </div>
    </div>
  );
}
