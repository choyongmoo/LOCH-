import type { Friend } from "@/types/workspace";

interface FriendSidebarProps {
    friends?: Friend[];
    selectedFriend?: string;
}

export default function FriendSidebar({ friends = [], selectedFriend }: FriendSidebarProps) {
    return (
        <aside className="w-[260px] h-screen flex flex-col border-r border-gray-200 dark:border-[#2c2f33] bg-gray-100 dark:bg-[#1E1F2B]">
            <div className="flex items-center px-4 py-4 gap-2">
                <span className="font-bold text-lg text-gray-900 dark:text-white">친구</span>
                <button className="ml-auto px-3 py-1 rounded text-sm font-medium bg-blue-100 dark:bg-[#111827] text-gray-900 dark:text-white">
                    +
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
                {friends.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-gray-500 dark:text-gray-400 text-sm px-2">
                    친구를 추가해주세요!
                </div>
                ) : (
                    friends.map(friend => (
                    <div
                    key={friend.id}
                    className={`flex items-center gap-2 px-2 py-2 rounded cursor-pointer ${
                        selectedFriend === friend.nickname ? "bg-gray-200 dark:bg-[#2A2B32]" : ""
                    }`}
                    >
                    <div
                        className="w-8 h-8 rounded flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: friend.accent_color || "#7e22ce" }}
                    >
                        {friend.name.charAt(0).toUpperCase()}
                    </div>
                        <span className="truncate text-gray-900 dark:text-gray-100">{friend.nickname || friend.name}</span>
                    </div>
                    ))
                )}
            </div>
        </aside>
    );
}
