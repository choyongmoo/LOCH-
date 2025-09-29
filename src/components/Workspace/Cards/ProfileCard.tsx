import type { Profile } from "@/types/workspace";
import { Link } from "react-router";

type ProfileCardProps = Pick<Profile, "name" | "bio">;

const SKELETON_NAME = "h-6 w-40 bg-white dark:bg-[#1a1d21] rounded-md";
const SKELETON_BIO = "h-4 w-48 bg-white dark:bg-[#1a1d21] rounded-md";

export default function ProfileCard({ name, bio }: ProfileCardProps) {
  return (
    <div className="pt-2">
      <article className="bg-white dark:bg-[#1a1d21] rounded-2xl shadow-xl p-6 mb-4 flex items-center justify-between">
        {/* 왼쪽: 프로필 + 이름 + 소개글 */}
        <figure className="flex items-center gap-6 m-0">
          {/* 프로필 이미지/이니셜 더미 */}
          <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-[#23242e]" />

          {/* 이름과 소개글 */}
          <figcaption>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {name}
              <div className={SKELETON_NAME} />
            </h2>
            <p className="text-sm text-gray-500">
              소개글:{" "}
              <span className="ml-1 block text-gray-800 dark:text-gray-200 mt-1">
                {bio}
                <div className={SKELETON_BIO} />
              </span>
            </p>
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
