import type { Manager } from "@/types/workspace";

interface Props {
    server: Manager;
}

export default function ManagerRow({ server }: Props) {
    return (
        <div className="flex items-center px-2 py-3 border-b border-gray-200 dark:border-[#23242e] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2A2B32]">
            <div className="w-8" />
            <div className="flex-1 flex items-center gap-3 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {server.room_name}
                </div>
            </div>
            <div className="flex-3 text-sm text-gray-700 dark:text-gray-300 pr-4 truncate">
                {server.description || "-"}
            </div>
            <div className="w-32 text-sm text-gray-800 dark:text-gray-200 truncate flex items-center justify-center gap-1">
                {server.host || "-"}
            </div>
            <div className="w-8" />
        </div>
    );
}