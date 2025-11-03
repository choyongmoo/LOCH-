import type { Participant } from "@/types/workspace";
import { ScrollArea } from "@/components/common/ui/scroll-area";
import { useUserProfileModal } from "@/store/useUserProfileModalStore";

const cardClass =
  "bg-white dark:bg-[#1a1d21] rounded-2xl shadow-xl p-6 flex flex-col";

interface ParticipantsCardProps {
  participants: Participant[];
  isLoading: boolean;
}

function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function ParticipantsCard({
  participants,
  isLoading,
}: ParticipantsCardProps) {
  const { openUserProfile } = useUserProfileModal();

  const handleParticipantClick = (p: Participant) => {
    openUserProfile(p.user_id);
  };

  return (
    <div className={`${cardClass} min-h-[160px] space-y-4`}>
      {/* 헤더 */}
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
        참여자 목록
      </h2>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-gray-300 dark:bg-gray-700" />
              <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ) : participants.length > 0 ? (
        <ScrollArea className="max-h-[220px]">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 auto-rows-fr">
            {participants.map((p) => {
              const initials = getInitials(p.nickname || p.user_id);
              return (
                <button
                  key={p.id}
                  onClick={() => handleParticipantClick(p)}
                  className="flex items-center gap-3 bg-gray-50 dark:bg-[#1f2126] p-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-[#2a2d31] transition"
                >
                  <div
                    className="w-10 h-10 rounded-[10px] text-white flex items-center justify-center font-semibold text-sm uppercase shrink-0"
                    style={{ backgroundColor: p.accent_color || "#7e22ce" }}
                  >
                    {initials}
                  </div>
                  <span className="text-gray-800 dark:text-white truncate">
                    {p.nickname || `참여자 ${p.user_id.slice(0, 6)}`}
                  </span>
                </button>
              );
            })}
          </ul>
        </ScrollArea>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
          현재 참여 중인 멤버가 없습니다.
        </p>
      )}
    </div>
  );
}
