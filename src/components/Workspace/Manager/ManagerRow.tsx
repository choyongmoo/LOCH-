import type { Server } from "@/types/workspace";
import { useUserStore } from "@/store/useUserStore";
import { useModal } from "@/store/useModalStore";

interface Props {
    server: Server;
}

export default function ManagerRow({ server }: Props) {
    const { user } = useUserStore();
    const isHost = user?.id === server.host;
    const { openModal } = useModal();
    
    return (
        <div onClick={() => openModal("serverModal", server)} className="flex items-center px-2 py-3 border-b border-gray-200 dark:border-[#23242e] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2A2B32]">
            <div className="w-8" />

            {/* 방 이름 + 비공개 표시 */}
            <div className="flex-1 flex items-center gap-3 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {server.room_name}
                </div>
            </div>

            {/* 방 소개 */}
            <div className="flex-2 text-sm text-gray-700 dark:text-gray-300 pr-4 truncate">
                {server.description || "-"}
            </div>

            {/* 관리자 닉네임 */}
            <div className="w-32 text-sm text-gray-800 dark:text-gray-200 truncate flex items-center justify-center gap-1">
                {server.host_nickname || "-"}
            </div>

            <div className="w-8 text-center">
                {server.is_private && <span>✔️</span>}
            </div>

            {/* 비밀번호: 호스트일 때만 표시 */}
            <div className="w-32 text-sm text-gray-800 dark:text-gray-200 truncate flex items-center justify-center gap-1">
                {isHost && server.is_private ? server.password || "-" : ""}
            </div>
        </div>
    );
}