import type { Manager } from "@/types/workspace";
import ManagerRow from "./ManagerRow";
import PlusRow from "./PlusRow";

export default function ManagerTable() {
    const rows: Manager[] = [];

    return (
        <>
            {/* 테이블 헤더 */}
            <div className="flex items-center px-2 py-2 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-[#23242e]">
                <div className="w-8"></div>
                <div className="flex-1">서버</div>
                <div className="flex-3">소개</div>
                <div className="w-32 text-center">관리자</div>
                <div className="w-8 text-right"></div>
            </div>

            {/* 서버 리스트 */}
            <div className="flex-1 overflow-y-auto">
                {rows.length > 0 ? (
                rows.map((server) => <ManagerRow key={server.id} server={server} />)
                ) : (
                <div className="text-gray-400 dark:text-gray-500">
                    <PlusRow />
                </div>
                )}
            </div>
        </>
    );
}