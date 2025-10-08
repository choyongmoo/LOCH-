import { useServers } from "@/store/useServersStore";
import { useSelectedServerStore } from "@/store/useSelectedServerStore";
import ParticipantsCard from "./ParticipantsCard";
import { useServerDetail } from "@/components/Workspace/hooks/useServerDetail";

const cardClass = "bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-6 flex flex-col";

export default function IntroCard() {
  const selectedServerId = useSelectedServerStore((state) => state.selectedServerId);
  const { servers } = useServers();
  const { serverDetail, participants, isLoading, isParticipantsLoading } = useServerDetail(selectedServerId, servers);

  return (
    <div className={`${cardClass} min-h-[160px]`}>
      {isLoading ? (
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-md bg-gray-300 dark:bg-gray-700" />
            <div className="flex flex-col gap-2 w-full">
              <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-3 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      ) : serverDetail ? (
        <>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-md flex items-center justify-center font-extrabold text-2xl text-gray-800 bg-gray-200 border-2 border-gray-400" >
              {serverDetail.room_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 dark:text-gray-500 uppercase mb-1">서버 이름</span>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">{serverDetail.room_name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                호스트: {serverDetail.host_nickname || serverDetail.host}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                참여자: {serverDetail.currentParticipants}명
              </p>
            </div>
          </div>

          <div className="mb-6">
            {serverDetail.description ? (
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed break-words p-3 bg-gray-50 dark:bg-[#1f2126] rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                {serverDetail.description}
              </p>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-[#1f2126]">
                <div className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-1">
                  서버 설명이 아직 없습니다.
                </div>
                <div className="text-gray-400 dark:text-gray-500 text-xs">
                  서버 관리자에게 요청하거나 나만의 소개를 추가해 보세요.
                </div>
              </div>
            )}
          </div>

          <ParticipantsCard participants={participants} isLoading={isParticipantsLoading} />
        </>
      ) : (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-md flex items-center justify-center bg-gray-400 text-white font-bold text-lg">
              S
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">서버 정보 없음</h1>
              <p className="text-sm text-gray-500 dark:text-gray-300">호스트: -</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">참여자: -명</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300 whitespace-pre-line">
            아직 참여 중인 서버가 없습니다.
            {"\n"}새 서버를 만들거나 초대를 받아 서버에 참여해보세요.
          </p>
        </div>
      )}
    </div>
  );
}
