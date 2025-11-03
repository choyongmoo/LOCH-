import { useUserStore } from "@/store/useUserStore";
import { Link } from "react-router";

export default function ProfileCard() {
  const user = useUserStore((state) => state.user);
  const isLoading = !user;

  const displayName = isLoading ? "" : user.nickname || user.email || "사용자";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="pt-2">
      <article className="bg-white dark:bg-[#1a1d21] rounded-2xl shadow-xl p-6 mb-4 flex items-center justify-between">
        {/* 왼쪽: 프로필 + 이름 + 소개글 */}
        <figure className="flex items-center gap-6 m-0">
          {/* 프로필 이미지/이니셜 */}
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow"
            style={{ backgroundColor: isLoading ? "#3e3e3e" : user.accent_color ?? "#7e22ce" }}
          >
            {isLoading ? null : initial}
          </div>

          {/* 이름과 소개글 */}
          <figcaption className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {isLoading ? (
                <div className="h-6 w-40 bg-white dark:bg-[#1a1d21] rounded-md" />
              ) : (
                displayName
              )}
            </h2>

            {/* 소개글: 레이블 + 내용 한 줄 */}
            <div className="flex items-center text-sm text-gray-500 gap-2">
              <span className="font-medium">소개글:</span>
              {isLoading ? (
                <div className="h-4 w-48 bg-white dark:bg-[#1a1d21] rounded-md" />
              ) : (
                <span className="text-gray-800 dark:text-gray-200">
                  {user.bio || "소개글이 없습니다."}
                </span>
              )}
            </div>
          </figcaption>
        </figure>

        {/* 오른쪽: 편집 버튼 */}
        <div className="flex items-center">
          <Link
            to="/workspace/profile"
            className="text-sm text-blue-600 hover:underline"
          >
            편집
          </Link>
        </div>
      </article>
    </div>
  );
}
