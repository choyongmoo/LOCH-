import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useFriendStore } from "@/store/useFriendStore";
import { useUserStore } from "@/store/useUserStore";
import type { Profile as ProfileType } from "@/types/workspace";

export type FriendStatus = "none" | "pending_sent" | "pending_received" | "accepted";

export function useUserProfile(selectedUserId: string | null) {
  const { user } = useUserStore();
  const { addFriendRequest } = useFriendStore();

  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [friendStatus, setFriendStatus] = useState<FriendStatus>("none");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ 로딩 상태 추가

  useEffect(() => {
    if (!selectedUserId || !user?.id) return;

    setLoading(true); // 상태 불러오기 시작

    const fetchProfileAndFriendStatus = async () => {
      const { data: profileData, error: profileError } = await supabase
        .from("profile")
        .select("*")
        .eq("id", selectedUserId)
        .maybeSingle();

      if (profileError || !profileData) {
        console.error("프로필 조회 에러:", profileError);
        setProfile(null);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      const { data: request1 } = await supabase
        .from("friend_requests")
        .select("*")
        .eq("requester_id", user.id)
        .eq("addressee_id", profileData.id)
        .maybeSingle();

      const { data: request2 } = await supabase
        .from("friend_requests")
        .select("*")
        .eq("requester_id", profileData.id)
        .eq("addressee_id", user.id)
        .maybeSingle();

      const requestData = request1 || request2;

      if (!requestData) setFriendStatus("none");
      else if (requestData.status === "accepted") setFriendStatus("accepted");
      else if (requestData.status === "pending") {
        setFriendStatus(
          requestData.addressee_id === user.id ? "pending_received" : "pending_sent"
        );
      } else setFriendStatus("none");

      setLoading(false); // ✅ 상태 불러오기 완료
    };

    fetchProfileAndFriendStatus();
  }, [selectedUserId, user]);

  const handleFriendAction = async () => {
    if (!profile || !user?.id) return;

    if (friendStatus === "accepted") {
      setConfirmDeleteOpen(true);
    } else if (friendStatus === "none") {
      await addFriendRequest(profile.id!);
      setFriendStatus("pending_sent");
    } else if (friendStatus === "pending_received") {
      setFriendStatus("accepted");
    }
  };

  const deleteFriend = async (onClose?: () => void) => {
    if (!profile || !user?.id) return;

    try {
      await supabase
        .from("friend_requests")
        .delete()
        .eq("requester_id", user.id)
        .eq("addressee_id", profile.id);

      await supabase
        .from("friend_requests")
        .delete()
        .eq("requester_id", profile.id)
        .eq("addressee_id", user.id);

      setFriendStatus("none");
      setConfirmDeleteOpen(false);
      onClose?.();
      window.location.reload();
    } catch (error) {
      console.error("친구 삭제 에러:", error);
    }
  };

  return {
    profile,
    friendStatus,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    handleFriendAction,
    deleteFriend,
    loading, // ✅ 로딩 상태 반환
  };
}
