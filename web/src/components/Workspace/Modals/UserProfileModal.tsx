import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogPortal, DialogTitle } from "@/components/common/ui/dialog";
import { useUserProfileModal } from "@/store/useUserProfileModalStore";
import { useUserProfile } from "../hooks/useUserProfile";
import { useUserStore } from "@/store/useUserStore";

export default function UserProfileModal() {
  const { selectedUserId, closeUserProfile } = useUserProfileModal();
  const { user } = useUserStore();
  const { profile, friendStatus, confirmDeleteOpen, setConfirmDeleteOpen, handleFriendAction, deleteFriend, loading } = useUserProfile(selectedUserId);

  if (!profile) return null;

  const isSelf = profile.id === user?.id;

  const getInitials = (nickname?: string) => {
    if (!nickname) return "?";
    const parts = nickname.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const formatBirth = (p: typeof profile) =>
    p.birth_year && p.birth_month && p.birth_day
      ? `${p.birth_year}년 ${p.birth_month}월 ${p.birth_day}일`
      : "미등록";

  const formatCreatedAt = (p: typeof profile) =>
    p.created_at
      ? new Date(p.created_at).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "-";

  return (
    <>
      {/* 메인 프로필 모달 */}
      <Dialog
        open={!!selectedUserId}
        onOpenChange={(open) => {
          if (!open) closeUserProfile();
        }}
      >
        <DialogPortal>
          <DialogContent className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[420px] max-w-[90vw] rounded-xl p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl text-white z-50">
            {/* 헤더 */}
            <DialogHeader className="flex flex-col items-center gap-2 mb-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white"
                style={{ backgroundColor: profile.accent_color || "#7e22ce" }}
              >
                {getInitials(profile.nickname)}
              </div>
              <DialogTitle className="text-2xl font-bold">{profile.nickname || "별명이 없습니다."}</DialogTitle>
              <span className="text-gray-400 text-sm">{profile.email || "-"}</span>
            </DialogHeader>

            {/* 자기소개 */}
            <DialogDescription className="mb-4 block text-gray-300">
              {profile.bio || "자기소개가 없습니다."}
            </DialogDescription>

            {/* 정보 섹션 */}
            <div className="grid grid-cols-2 gap-3 text-gray-400 text-sm mb-4">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-200">생년월일</span>
                <span>{formatBirth(profile)}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-200">가입일</span>
                <span>{formatCreatedAt(profile)}</span>
              </div>
            </div>

            {/* 친구 버튼 */}
            <button
              onClick={handleFriendAction}
              disabled={loading || isSelf}
              className={`w-full py-2 rounded-lg font-semibold transition
                ${isSelf
                  ? "bg-gray-400 cursor-not-allowed"
                  : friendStatus === "accepted"
                  ? "bg-red-500 hover:bg-red-600"
                  : friendStatus === "pending_sent"
                  ? "bg-gray-600 cursor-not-allowed"
                  : friendStatus === "pending_received"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600"
                }
                ${loading ? "opacity-50 cursor-wait" : ""}
              `}
            >
              {isSelf
                ? "친구 추가 불가 (본인)"
                : loading
                ? "불러오는 중..."
                : friendStatus === "accepted"
                ? "친구 삭제"
                : friendStatus === "pending_sent"
                ? "요청 중"
                : friendStatus === "pending_received"
                ? "수락하기"
                : "친구 추가"}
            </button>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* 삭제 확인 모달 */}
      <Dialog open={confirmDeleteOpen} onOpenChange={(open) => setConfirmDeleteOpen(open)}>
        <DialogPortal>
          <DialogContent className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] max-w-[90vw] rounded-xl p-6 bg-gray-800 shadow-2xl text-white z-50">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-lg font-bold text-center">친구 삭제</DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-center mb-6">
              정말 친구를 삭제하시겠습니까?
            </DialogDescription>
            <div className="flex justify-around gap-4">
              <button
                onClick={() => deleteFriend(closeUserProfile)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold"
              >
                삭제
              </button>
              <button
                onClick={() => setConfirmDeleteOpen(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg font-semibold"
              >
                취소
              </button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}
