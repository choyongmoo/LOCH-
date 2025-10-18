import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/workspace";
import { ScrollArea } from "@/components/common/ui/scroll-area";
import { useUserProfileModal } from "@/store/useUserProfileModalStore";

export default function FriendsCard() {
  const [friends, setFriends] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { openUserProfile } = useUserProfileModal();

  useEffect(() => {
    const loadFriends = async () => {
      setLoading(true);

      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      if (!userId) return setLoading(false);

      const { data: friendReqs, error: reqError } = await supabase
        .from("friend_requests")
        .select("requester_id, addressee_id")
        .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
        .eq("status", "accepted");

      if (reqError || !friendReqs) {
        console.error(reqError);
        return setLoading(false);
      }

      const friendIds = friendReqs.map(r =>
        r.requester_id === userId ? r.addressee_id : r.requester_id
      );

      const { data: profile, error: profileError } = await supabase
        .from("profile")
        .select("id, nickname, accent_color")
        .in("id", friendIds);

      if (profileError || !profile) {
        console.error(profileError);
        return setLoading(false);
      }

      setFriends(profile);
      setLoading(false);
    };

    loadFriends();
  }, []);

  const getInitials = (nickname?: string) => {
    if (!nickname) return "?";
    const names = nickname.trim().split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  };

  const handleFriendClick = (friend: Profile) => {
    if (!friend.id) return;
    openUserProfile(friend.id);
  };

  return (
    <div className="bg-white dark:bg-[#1a1d21] rounded-2xl shadow-xl p-6 flex flex-col space-y-4">
      {/* 헤더 */}
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        친구 목록
      </h3>

      {/* 스크롤 영역 */}
      <ScrollArea className="h-[240px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 w-full rounded-xl p-2 animate-pulse bg-gray-50 dark:bg-[#1f2126]"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-300 dark:bg-gray-700" />
                  <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded-md" />
                </div>
              ))
            : friends.length > 0
            ? friends.map(friend => (
                <button
                  key={friend.id}
                  onClick={() => handleFriendClick(friend)}
                  className="flex items-center gap-3 w-full text-left rounded-xl p-2 bg-gray-50 dark:bg-[#1f2126] border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-[#2a2d31] transition"
                >
                  <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: friend.accent_color || "#7e22ce" }}
                  >
                    {getInitials(friend.nickname)}
                  </div>
                  <div className="text-gray-800 dark:text-white truncate">
                    {friend.nickname || "닉네임 없음"}
                  </div>
                </button>
              ))
            : (
              <div className="flex flex-col items-center justify-center col-span-1 text-center py-8">
                <div className="text-4xl mb-2">👋</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                  아직 친구가 없어요.
                </div>
                <div className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  친구를 추가해 보세요! 새로운 사람과 연결될 수 있어요.
                </div>
              </div>
            )}
        </div>
      </ScrollArea>
    </div>
  );
}
