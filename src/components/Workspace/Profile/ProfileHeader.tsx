import type { Profile } from "@/types/workspace";

export default function ProfileHeader({name, bio, color, email}: Profile) {
    return (
        <div className="flex items-center gap-8 mb-8 w-full">
            {/* 프로필 이니셜 */}
            <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow"
                style={{ backgroundColor: color ?? "#7e22ce" }}
            >
                {(name ?? email).charAt(0).toUpperCase()}
            </div>
            {/* 이름, 소개글 */}
            <div className="flex flex-col gap-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{name ?? email}</div>
                <div className="text-gray-500 dark:text-gray-300">{bio?.trim() ? bio : "소개글을 작성해주세요!"}</div>
            </div>
        </div>
    )
}