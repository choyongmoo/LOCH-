import { useEffect, useState } from "react";
import ChatWindow from "@/components/Workspace/Contact/ChatWindow";
import FriendSidebar from "@/components/Workspace/Contact/FriendSidebar";
import { useUserStore } from "@/store/useUserStore";
import { supabase } from "@/lib/supabase";
import type { Friend } from "@/types/workspace";
import FriendAddModal from "@/components/Workspace/Modals/FriendAddModal";
import { useModal } from "@/store/useModalStore";

export default function ContactPage() {
    const currentUser = useUserStore((state) => state.user);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const { currentModal, closeModal } = useModal();

    const fetchFriends = async () => {
        if (!currentUser?.id) return;

        try {
        const { data, error } = await supabase
            .from("friend_requests")
            .select(`
                id,
                status,
                requester_id,
                addressee_id,
                requester:requester_id(id, nickname, accent_color),
                addressee:addressee_id(id, nickname, accent_color)
            `)
            .or(
                `and(requester_id.eq.${currentUser.id},status.eq.accepted),and(addressee_id.eq.${currentUser.id},status.eq.accepted)`
            );

        if (error) throw error;

        const formatted: Friend[] = (data || []).map((req) => {
            const friendInfoArray = req.requester_id === currentUser.id ? req.addressee : req.requester;
            const friendInfo = Array.isArray(friendInfoArray) ? friendInfoArray[0] : friendInfoArray;

            return {
            id: friendInfo?.id || "",
            nickname: friendInfo?.nickname,
            name: friendInfo?.nickname || "",
            accent_color: friendInfo?.accent_color,
            };
        });

        setFriends(formatted);
        } catch (err) {
            console.error("친구 목록 불러오기 실패", err);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, [currentUser?.id]);

    return (
        <div className="flex h-screen">
        {/* 친구 사이드바 */}
        <FriendSidebar
            friends={friends}
            selectedFriend={selectedFriend?.id}
            onSelectFriend={(friend: Friend) => setSelectedFriend(friend)}
        />

        {/* 채팅창 또는 안내 문구 */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-[#313338] text-gray-400 dark:text-gray-500 text-lg font-medium">
            {selectedFriend ? (
            <ChatWindow currentUserId={currentUser?.id} selectedFriend={selectedFriend} />
            ) : (
            "친구를 선택하면 대화를 시작할 수 있습니다."
            )}
        </div>
        { currentModal === "addFriend" && <FriendAddModal close={closeModal} /> }
        </div>
    );
}
