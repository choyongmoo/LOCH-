import RecordHeader from "@/components/Workspace/Record/RecordHeader";
import RecordTable from "@/components/Workspace/Record/RecordTable";
import { useSelectedServerStore } from "@/store/useSelectedServerStore";

export default function RecordPage() {
    const selectedServerId = useSelectedServerStore((state) => state.selectedServerId);

    return (
        <div className="h-screen w-full min-w-0 overflow-hidden bg-gray-100 dark:bg-[#18191c] px-4 md:px-5 py-6">
            <RecordHeader />

            {!selectedServerId ? (
                <div className="text-gray-500 dark:text-gray-400 text-center mt-20">
                서버를 선택해주세요.
                </div>
                ) : (
                    <RecordTable records={[]} />
            )}
        </div>
    );
}
