import type { Participant } from "@/types/workspace";

const cardClass = "bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-6 flex flex-col";

interface ParticipantsCardProps {
  participants: Participant[];
  isLoading: boolean;
}

export default function ParticipantsCard({ participants, isLoading }: ParticipantsCardProps) {
  return (
    <div className={`${cardClass} min-h-[160px]`}>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">참여자 목록</h2>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
              <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : participants.length > 0 ? (
        <ul className="space-y-2">
          {participants.map((p) => (
            <li key={p.id} className="flex items-center gap-3 bg-gray-50 dark:bg-[#1f2126] p-2 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-[#2a2d31] transition">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                {p.nickname ? p.nickname.charAt(0).toUpperCase() : p.user_id.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {p.nickname || `참여자 ${p.user_id.slice(0, 6)}`}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
          현재 참여 중인 멤버가 없습니다.
        </p>
      )}
    </div>
  );
}
