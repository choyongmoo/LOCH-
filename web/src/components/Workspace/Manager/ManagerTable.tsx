import ManagerRow from "./ManagerRow";
import PlusRow from "./PlusRow";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";
import { useServers } from "@/store/useServersStore";

export default function ManagerTable() {
    const { user } = useUserStore();
    const { servers, fetchAllUserServers } = useServers(); 

    useEffect(() => {
        if (user?.id) {
            fetchAllUserServers(user.id); 
        }
    }, [user?.id, fetchAllUserServers]);

    return (
        <>
            {/* 테이블 헤더 */}
            <div className="flex items-center px-2 py-2 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-[#23242e]">
                <div className="w-8"></div>
                <div className="flex-1">서버</div>
                <div className="flex-2">소개</div>
                <div className="w-32 text-center">관리자</div>
                <div className="w-8 text-center">🔒</div>
                <div className="w-32 text-center">비밀번호</div>
            </div>

            {/* 서버 리스트 */}
            <div className="flex-1 overflow-y-auto">
                {servers.map((server) => (
                    <ManagerRow key={server.id} server={server} />
                ))}
                <PlusRow />
            </div>
        </>
    );
}
