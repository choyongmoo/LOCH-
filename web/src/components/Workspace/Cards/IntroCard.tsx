import { useServers } from "@/store/useServersStore";
import { useSelectedServerStore } from "@/store/useSelectedServerStore";
import ParticipantsCard from "./ParticipantsCard";
import { useServerDetail } from "@/components/Workspace/hooks/useServerDetail";

export default function IntroCard() {
  const selectedServerId = useSelectedServerStore((state) => state.selectedServerId);
  const { servers } = useServers();
  const { serverDetail, participants, isLoading, isParticipantsLoading } = useServerDetail(selectedServerId, servers);

  return (
    <div className="bg-white dark:bg-[#1a1d21] rounded-2xl shadow-xl p-6 flex flex-col min-h-[160px] space-y-6">
      {isLoading ? (
        <div className="animate-pulse flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-gray-300 dark:bg-gray-700" />
            <div className="flex flex-col gap-2 w-full">
              <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-3 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      ) : serverDetail ? (
        <>
          {/* 서버 헤더 */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gray-900 text-gray-100 flex items-center justify-center text-lg font-bold">
              {serverDetail.room_name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 dark:text-gray-500 uppercase">서버 이름</span>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{serverDetail.room_name}</h1>
              <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-300">
                <span>호스트: {serverDetail.host_nickname || serverDetail.host}</span>
                <span>참여자: {serverDetail.currentParticipants}명</span>
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <hr className="border-gray-200 dark:border-gray-700" />

          {/* 서버 소개 */}
          <div className="flex flex-col gap-2">
            <h3 className="text-gray-800 dark:text-gray-100 font-semibold text-lg sm:text-xl">
              소개
            </h3>
            {serverDetail.description ? (
              <p className="text-gray-700 dark:text-gray-300 sm:text-base leading-relaxed break-words">
                {serverDetail.description}
              </p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                서버 설명이 아직 없습니다. 서버 관리자에게 요청하거나 나만의 소개를 추가해 보세요.
              </p>
            )}
          </div>

          {/* 구분선 */}
          <hr className="border-gray-200 dark:border-gray-700" />

          {/* 참여자 카드 */}
          <ParticipantsCard participants={participants} isLoading={isParticipantsLoading} />
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gray-400 text-white font-bold text-lg">S</div>
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">서버 정보 없음</h1>
              <div className="text-sm text-gray-500 dark:text-gray-300 flex gap-4">
                <span>호스트: -</span>
                <span>참여자: -명</span>
              </div>
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
