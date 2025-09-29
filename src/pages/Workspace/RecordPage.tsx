import RecordHeader from "@/components/Workspace/Record/RecordHeader";
import RecordTable from "@/components/Workspace/Record/RecordTable";

export default function RecordPage() {
    const records: { id: string; title: string; author: string; createdAt: string }[] = [];

    return (
        <div className="h-screen w-full min-w-0 overflow-hidden bg-gray-100 dark:bg-[#18191c] px-4 md:px-5 py-6">
            <RecordHeader />
            <RecordTable records={records} />
        </div>
    );
}